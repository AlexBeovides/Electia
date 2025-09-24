using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ElectiaCore.Application.DTOs;
using System.Text.Json;
using ElectiaCore.Application.Helpers;

namespace ElectiaCore.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;
        private readonly IProfessorRepository _professorRepository;
        private readonly IFileStorageService _fileStorageService;

        public CourseService(ICourseRepository courseRepository, IProfessorRepository professorRepository, IFileStorageService fileStorageService)
        {
            _courseRepository = courseRepository;
            _professorRepository = professorRepository;
            _fileStorageService = fileStorageService;
        }

        public async Task<Course> GetCourseAsync(int id)
        {
            return await _courseRepository.GetCourseAsync(id);
        }

        public async Task<CoursesCatalogDto> GetCourseForCatalogAsync(int id)
        {
            // Get the course by ID from the repository
            var course = await _courseRepository.GetCourseAsync(id);

            // Check if the course exists and meets the criteria
            if (course == null || course.IsDeleted)
            {
                return null; // Return null if the course is not found or doesn't meet the criteria
            }

            // Map the course to the CoursesCatalogDto
            var courseDto = new CoursesCatalogDto
            {
                Id = course.Id,
                Title = course.Title,
                CenterName = course.Center.Name, // Ensure Center is loaded
                ModalityName = EnumHelper.GetEnumDisplayName(course.Modality), // Convert Modality enum to string
                EnrollmentCapacity = course.EnrollmentCapacity,
                MainProfessorName = course.MainProfessor.FullName, // Ensure MainProfessor is loaded
                CollaboratingProfessors = course.CollaboratingProfessors,
                CourseJustification = course.CourseJustification,
                GeneralObjective = course.GeneralObjective,
                SpecificObjectives = course.SpecificObjectives,
                CourseSyllabus = course.CourseSyllabus,
                BasicBibliography = course.BasicBibliography,
                ComplementaryBibliography = course.ComplementaryBibliography,
                EvaluationSystem = course.EvaluationSystem,
                ModalityJustification = course.ModalityJustification,
                BasicRequirements = course.BasicRequirements,
                MeetingPlace = course.MeetingPlace,

                StrategicAxesId = (int)course.StrategicAxes,
                StrategicAxesName = EnumHelper.GetEnumDisplayName(course.StrategicAxes), // Convert StrategicAxes enum to string
                StrategicSectorsId = (int)course.StrategicSectors,
                StrategicSectorsName = EnumHelper.GetEnumDisplayName(course.StrategicSectors), // Convert StrategicSectors enum to string

                AuthorizationLetterDataBase64 = course.AuthorizationLetterData is { Length: > 0 }
                    ? Convert.ToBase64String(course.AuthorizationLetterData)
                    : string.Empty,

                ImgUrl = course.ImgUrl,
                Status = course.Status
            };

            return courseDto;
        }

        public async Task<IEnumerable<Course>> GetAllCoursesAsync()
        {
            return await _courseRepository.GetAllCoursesAsync();
        }

        //GetAllCoursesFromProfessorAsync(string professorId)

        public async Task<IEnumerable<CoursesCatalogDto>> GetAllCoursesFromProfessorAsync(string professorId)
        {
            // Obtener todos los cursos desde el repositorio
            var courses = await _courseRepository.GetAllCoursesAsync();

            // Filtrar cursos aprobados y no eliminados
            var filteredCourses = courses
                .Where(c => c.MainProfessorId==professorId && !c.IsDeleted)
                .Select(c => new CoursesCatalogDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    CenterName = c.Center.Name,
                    ModalityName = EnumHelper.GetEnumDisplayName(c.Modality),
                    EnrollmentCapacity = c.EnrollmentCapacity,
                    MainProfessorName = c.MainProfessor.FullName,
                    CourseJustification = c.CourseJustification,
                    ImgUrl = c.ImgUrl,
                    Status = c.Status
                })
                .ToList();

            return filteredCourses;
        }

        public async Task<IEnumerable<CoursesCatalogDto>> GetAllCoursesForCatalogAsync()
        {   
            // Obtener todos los cursos desde el repositorio
            var courses = await _courseRepository.GetAllCoursesAsync();

            // Filtrar cursos aprobados y no eliminados
            var filteredCourses = courses
                .Where(c => !c.IsDeleted)
                .Select(c => new CoursesCatalogDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    CenterName = c.Center.Name, 
                    ModalityName = EnumHelper.GetEnumDisplayName(c.Modality), 
                    EnrollmentCapacity = c.EnrollmentCapacity,
                    MainProfessorName = c.MainProfessor.FullName, 
                    CourseJustification = c.CourseJustification,
                    ImgUrl = c.ImgUrl
                })
                .ToList();

            return filteredCourses;
        }

        public async Task<Course> AddCourseAsync(CreateCourseDto courseDto)
        {
            if (!string.IsNullOrWhiteSpace(courseDto.CourseJustification))
            {
                var wordCount = courseDto.CourseJustification.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;
                if (wordCount > 500)
                {
                    throw new ArgumentException("CourseJustification must have less than 500 words.");
                }
            }

            if (courseDto.ImgUrl == null)
            {
                courseDto.ImgUrl = "https://res.cloudinary.com/dp9wcmorr/image/upload/v1745422136/electia/otqynhfxtauemrvmwojj.jpg";
            }

            if (courseDto.AuthorizationLetterDataBase64 != null)
            {

            }
        
            // Map CreateCourseDto to Course
            var course = new Course
            {
                Title = courseDto.Title,
                CenterId = courseDto.CenterId,
                Modality = courseDto.ModalityId,
                EnrollmentCapacity = courseDto.EnrollmentCapacity,
                MainProfessorId = courseDto.MainProfessorId,
                CollaboratingProfessors = courseDto.CollaboratingProfessors,

                CourseJustification = courseDto.CourseJustification,
                GeneralObjective = courseDto.GeneralObjective,
                SpecificObjectives = courseDto.SpecificObjectives,
                CourseSyllabus = courseDto.CourseSyllabus,
                BasicBibliography = courseDto.BasicBibliography,
                ComplementaryBibliography = courseDto.ComplementaryBibliography,
                EvaluationSystem = courseDto.EvaluationSystem,
                ModalityJustification = courseDto.ModalityJustification,
                BasicRequirements = courseDto.BasicRequirements,
                MeetingPlace = courseDto.MeetingPlace,

                StrategicAxes = courseDto.StrategicAxesId,
                StrategicSectors = courseDto.StrategicSectorsId,

                AuthorizationLetterData = string.IsNullOrEmpty(courseDto.AuthorizationLetterDataBase64)
                    ? null
                    : Convert.FromBase64String(courseDto.AuthorizationLetterDataBase64),

                ImgUrl = courseDto.ImgUrl,
                Status = CourseStatus.Pending,
                CreatedAt = DateTime.Now
            };

            // Save the course to the repository
            await _courseRepository.AddCourseAsync(course);

            return course;
        }

        public async Task UpdateCourseAsync(Course course)
        {
            await _courseRepository.UpdateCourseAsync(course);
        }

        public async Task UpdateCourseByProfessorAsync(EditCourseDto courseDto)
        {
            var course = await _courseRepository.GetCourseAsync(courseDto.Id);

            if (course == null)
            {
                // Consider logging this or throwing an exception indicating the course wasn't found
                return;
            }

            course.Title = courseDto.Title; 
            course.EnrollmentCapacity = courseDto.EnrollmentCapacity;
            course.CollaboratingProfessors = courseDto.CollaboratingProfessors;
            course.CourseJustification = courseDto.CourseJustification;
            course.GeneralObjective = courseDto.GeneralObjective;
            course.SpecificObjectives = courseDto.SpecificObjectives;
            course.CourseSyllabus = courseDto.CourseSyllabus;
            course.BasicBibliography = courseDto.BasicBibliography;
            course.ComplementaryBibliography = courseDto.ComplementaryBibliography;
            course.EvaluationSystem = courseDto.EvaluationSystem;
            course.ModalityJustification = courseDto.ModalityJustification;
            course.BasicRequirements = courseDto.BasicRequirements;
            course.MeetingPlace = courseDto.MeetingPlace;
            course.StrategicAxes = courseDto.StrategicAxesId;
            course.StrategicSectors = courseDto.StrategicSectorsId;

            course.AuthorizationLetterData = string.IsNullOrEmpty(courseDto.AuthorizationLetterDataBase64)
                ? null
                : Convert.FromBase64String(courseDto.AuthorizationLetterDataBase64);

            course.ImgUrl = courseDto.ImgUrl;
            course.Status = CourseStatus.Pending;

            await _courseRepository.UpdateCourseAsync(course);
        }

        public async Task DeleteCourseAsync(int id)
        {
            await _courseRepository.DeleteCourseAsync(id);
        }

        public async Task ApproveCourseAsync(int id)
        {
            var course = await _courseRepository.GetCourseAsync(id); 
            if (course == null || course.IsDeleted)
            {
                throw new ArgumentException("Course not found.");
            }
            if (course.Status == CourseStatus.Approved)
            {
                throw new InvalidOperationException("Course is already approved.");
            }
            if (course.Status == CourseStatus.Rejected)
            {
                throw new InvalidOperationException("Course is already rejected.");
            }

            course.Status = CourseStatus.Approved; // Set the course as approved
            await _courseRepository.UpdateCourseAsync(course);
        }

        public async Task RejectCourseAsync(int id)
        {
            var course = await _courseRepository.GetCourseAsync(id);
            if (course == null || course.IsDeleted)
            {
                throw new ArgumentException("Course not found.");
            }

            if (course.Status == CourseStatus.Approved)
            {
                throw new InvalidOperationException("Course is already approved.");
            }
            if (course.Status == CourseStatus.Rejected)
            {
                throw new InvalidOperationException("Course is already rejected.");
            }

            course.Status = CourseStatus.Rejected; // Set the course as approved
            await _courseRepository.UpdateCourseAsync(course);
        }
    }
}
