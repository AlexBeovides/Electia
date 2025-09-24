using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Helpers;
using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using ElectiaCore.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Services
{
    public class CourseInstanceService : ICourseInstanceService
    {
        private readonly ICourseInstanceRepository _courseInstanceRepository;
        private readonly ICourseGradeRepository _courseGradeRepository;

        public CourseInstanceService(ICourseInstanceRepository courseInstanceRepository, ICourseGradeRepository courseGradeRepository)
        {
            _courseInstanceRepository = courseInstanceRepository; 
            _courseGradeRepository = courseGradeRepository;
        }

        public async Task<CourseInstance> GetCourseInstanceAsync(int id)
        {
            return await _courseInstanceRepository.GetCourseInstanceAsync(id);
        }

        public async Task<CoursesCatalogDto> GetCourseInstanceForCatalogAsync(int id)
        {
            // Get the course by ID from the repository
            var course = await _courseInstanceRepository.GetCourseInstanceAsync(id);

            // Check if the course exists and meets the criteria
            if (course == null || course.IsDeleted)
            {
                return null; // Return null if the course is not found or doesn't meet the criteria
            }

            // Map the course to the CoursesCatalogDto
            var courseDto = new CoursesCatalogDto
            {
                Id = course.Course.Id,
                Title = course.Course.Title,
                CenterName = course.Course.Center.Name, // Ensure Center is loaded
                ModalityName = EnumHelper.GetEnumDisplayName(course.Course.Modality), // Convert Modality enum to string
                EnrollmentCapacity = course.Course.EnrollmentCapacity,
                MainProfessorName = course.Course.MainProfessor.FullName, // Ensure MainProfessor is loaded
                CollaboratingProfessors = course.Course.CollaboratingProfessors,
                CourseJustification = course.Course.CourseJustification,
                GeneralObjective = course.Course.GeneralObjective,
                SpecificObjectives = course.Course.SpecificObjectives,
                CourseSyllabus = course.Course.CourseSyllabus,
                BasicBibliography = course.Course.BasicBibliography,
                ComplementaryBibliography = course.Course.ComplementaryBibliography,
                EvaluationSystem = course.Course.EvaluationSystem,
                ModalityJustification = course.Course.ModalityJustification,
                BasicRequirements = course.Course.BasicRequirements,
                MeetingPlace = course.Course.MeetingPlace,
                StrategicAxesName = EnumHelper.GetEnumDisplayName(course.Course.StrategicAxes), // Convert StrategicAxes enum to string
                StrategicSectorsName = EnumHelper.GetEnumDisplayName(course.Course.StrategicSectors), // Convert StrategicSectors enum to string
                ImgUrl = course.Course.ImgUrl,

                StartDate = course.StartDate,
                EndDate = course.EndDate
            };

            return courseDto;
        }

        public async Task<IEnumerable<CourseInstance>> GetAllCourseInstancesAsync()
        {
            return await _courseInstanceRepository.GetAllCourseInstancesAsync();
        }

        public async Task<IEnumerable<CoursesCatalogDto>> GetAllCourseInstancesForCatalogAsync()
        {
            // Obtener todos los cursos desde el repositorio
            var courseInstances = await _courseInstanceRepository.GetAllCourseInstancesAsync();

            // Filtrar cursos aprobados y no eliminados
            var filteredCourses = courseInstances
                .Select(c => new CoursesCatalogDto
                {
                    Id = c.Id,
                    Title = c.Course.Title,
                    CenterName = c.Course.Center.Name,
                    ModalityName = EnumHelper.GetEnumDisplayName(c.Course.Modality),
                    EnrollmentCapacity = c.Course.EnrollmentCapacity,
                    MainProfessorName = c.Course.MainProfessor.FullName,
                    CourseJustification = c.Course.CourseJustification,
                    ImgUrl = c.Course.ImgUrl,

                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .ToList();

            return filteredCourses;
        }

        public async Task<IEnumerable<CoursesCatalogDto>> GetAllCourseInstancesForCatalogFromStudentAsync()
        {
            // Obtener todos los cursos desde el repositorio
            var courseInstances = await _courseInstanceRepository.GetAllCourseInstancesAsync();

            // Filtrar cursos aprobados y no eliminados
            var filteredCourses = courseInstances
                .Where(c => c.EndDate > DateTime.Now)
                .Select(c => new CoursesCatalogDto
                {
                    Id = c.Id,
                    Title = c.Course.Title,
                    CenterName = c.Course.Center.Name,
                    ModalityName = EnumHelper.GetEnumDisplayName(c.Course.Modality),
                    EnrollmentCapacity = c.Course.EnrollmentCapacity,
                    MainProfessorName = c.Course.MainProfessor.FullName,
                    CourseJustification = c.Course.CourseJustification,
                    ImgUrl = c.Course.ImgUrl,

                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .ToList();

            return filteredCourses;
        }

        public async Task<IEnumerable<CoursesCatalogDto>> GetAllCourseInstancesEnrolledForCatalogAsync(string studentId)
        {
            var allCourseGrades = await _courseGradeRepository.GetAllCourseGradesAsync();
            var courseIds = allCourseGrades
                .Where(cg => cg.StudentId == studentId)
                .Select(cg => cg.CourseId)
                .ToList();

            // Obtener todos los cursos desde el repositorio
            var courseInstances = await _courseInstanceRepository.GetAllCourseInstancesAsync();

            // Filtrar cursos aprobados y no eliminados
            var filteredCourses = courseInstances
                .Where(c => c.EndDate > DateTime.Now && courseIds.Contains(c.Id))
                .Select(c => new CoursesCatalogDto
                {
                    Id = c.Id,
                    Title = c.Course.Title,
                    CenterName = c.Course.Center.Name,
                    ModalityName = EnumHelper.GetEnumDisplayName(c.Course.Modality),
                    EnrollmentCapacity = c.Course.EnrollmentCapacity,
                    MainProfessorName = c.Course.MainProfessor.FullName,
                    CourseJustification = c.Course.CourseJustification,
                    ImgUrl = c.Course.ImgUrl,

                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .ToList();

            return filteredCourses;
        }

        public async Task<IEnumerable<CoursesCatalogDto>> GetAllCourseInstancesForCatalogFromProfessorAsync(string professorId)
        {
            // Obtener todos los cursos desde el repositorio
            var courseInstances = await _courseInstanceRepository.GetAllCourseInstancesAsync();

            // Filtrar cursos aprobados y no eliminados
            var filteredCourses = courseInstances
                .Where(c => c.EndDate > DateTime.Now && c.Course.MainProfessorId==professorId && !c.IsDeleted)
                .Select(c => new CoursesCatalogDto
                {
                    Id = c.Id,
                    Title = c.Course.Title,
                    CenterName = c.Course.Center.Name,
                    ModalityName = EnumHelper.GetEnumDisplayName(c.Course.Modality),
                    EnrollmentCapacity = c.Course.EnrollmentCapacity,
                    MainProfessorName = c.Course.MainProfessor.FullName,
                    CourseJustification = c.Course.CourseJustification,
                    ImgUrl = c.Course.ImgUrl,

                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .ToList();

            return filteredCourses;
        }


        public async Task AddCourseInstanceAsync(CourseInstance courseInstance)
        {
            await _courseInstanceRepository.AddCourseInstanceAsync(courseInstance);
        }

        public async Task UpdateCourseInstanceAsync(CourseInstance courseInstance)
        {
            await _courseInstanceRepository.UpdateCourseInstanceAsync(courseInstance);
        }

        public async Task DeleteCourseInstanceAsync(int id)
        {
            await _courseInstanceRepository.DeleteCourseInstanceAsync(id);
        }
    }
}
