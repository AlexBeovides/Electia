using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Helpers;
using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Services
{
    public class CourseGradeService : ICourseGradeService
    {
        private readonly ICourseGradeRepository _courseGradeRepository;
        private readonly ICourseApplicationRepository _courseApplicationRepository;

        private readonly ICourseInstanceRepository _courseInstanceRepository;
        private readonly IRuleRepository _ruleRepository;

        public CourseGradeService(
            ICourseGradeRepository courseGradeRepository, 
            ICourseApplicationRepository courseApplicationRepository,
            ICourseInstanceRepository courseInstanceRepository,
            IRuleRepository ruleRepository)
        {
            _courseGradeRepository = courseGradeRepository;
            _courseApplicationRepository = courseApplicationRepository;
            _courseInstanceRepository = courseInstanceRepository;
            _ruleRepository = ruleRepository;
        }

        public async Task<CourseGrade> GetCourseGradeAsync(int courseGradeId)
        {
            return await _courseGradeRepository.GetCourseGradeAsync(courseGradeId);
        }

        public async Task<IEnumerable<CourseGrade>> GetAllCourseGradesAsync()
        {
            return await _courseGradeRepository.GetAllCourseGradesAsync();
        }

        public async Task<IEnumerable<CourseRosterDto>> GetAllCourseGradesByCourseIdAsync(int courseId)
        {
            var courseGrades = await _courseGradeRepository
                .GetAllCourseGradesAsync();

            var filteredGrades = courseGrades
                .Where(g => g.CourseId == courseId)
                .ToList();

            var courseRosters = new List<CourseRosterDto>();

            foreach (var grade in filteredGrades)
            {
                var student = grade.Student;

                if (student == null)
                    continue; // optionally handle null student

                courseRosters.Add(new CourseRosterDto
                {
                    Id = grade.Id,
                    StudentName = student.FullName,
                    FacultyName = student.Faculty?.Name,
                    MajorName = student.Major?.Name,
                    AcademicYearName = EnumHelper.GetEnumDisplayName(student.AcademicYear),
                    PrimaryEmail = student.PrimaryEmail,
                    SecondaryEmail = student.SecondaryEmail,
                    PhoneNumber = student.PhoneNumber,
                    Grade1 = grade.Grade1,
                    Grade2 = grade.Grade2,
                    Grade3 = grade.Grade3,
                    Comment = grade.Comment
                });
            }

            return courseRosters;
        }

        public async Task AddCourseGradeAsync(CourseGrade courseGrade)
        {
            await _courseGradeRepository.AddCourseGradeAsync(courseGrade);
        }

        public async Task UpdateCourseGradeAsync(CourseGrade courseGrade)
        {
            await _courseGradeRepository.UpdateCourseGradeAsync(courseGrade);
        }

        public async Task UpdateCourseGradeByProfessorAsync(EditGradeDto courseGradeDto)
        {
            var courseGrade = await _courseGradeRepository.GetCourseGradeAsync(courseGradeDto.Id);

            if (courseGrade == null)
            {
                // Consider logging this or throwing an exception indicating the course wasn't found
                return;
            }

            courseGrade.Grade1 = courseGradeDto.Grade1;
            courseGrade.Grade2 = courseGradeDto.Grade2;
            courseGrade.Grade3 = courseGradeDto.Grade3;
            courseGrade.Comment = courseGradeDto.Comment;

            await _courseGradeRepository.UpdateCourseGradeAsync(courseGrade);
        }

        public async Task DeleteCourseGradeAsync(int courseGradeId)
        {
            // Obtener la calificación antes de eliminarla para acceder al StudentId y CourseId
            var courseGrade = await _courseGradeRepository.GetCourseGradeAsync(courseGradeId);

            if (courseGrade != null)
            {
                // Buscar todas las aplicaciones y filtrar por StudentId y CourseId
                var allApplications = await _courseApplicationRepository.GetAllCourseApplicationsAsync();
                var application = allApplications
                    .FirstOrDefault(a => a.StudentId == courseGrade.StudentId &&
                                         a.CourseId == courseGrade.CourseId &&
                                        !a.IsDeleted);

                if (application != null)
                {
                    // Cambiar el estado a Rejected
                    application.Status = ApplicationStatus.Rejected;
                    await _courseApplicationRepository.UpdateCourseApplicationAsync(application);
                }

                // Eliminar la calificación
                await _courseGradeRepository.DeleteCourseGradeAsync(courseGradeId);
            }
        }

        public async Task EnrollStudentAsync(int courseId, string studentId)
        {
            // Buscar la aplicación del estudiante para este curso
            var courseApplications = await _courseApplicationRepository.GetAllCourseApplicationsAsync();
            var studentApplication = courseApplications
                .FirstOrDefault(ca => ca.CourseId == courseId &&
                                     ca.StudentId == studentId &&
                                     !ca.IsDeleted);

            if (studentApplication == null)
            {
                throw new ArgumentException($"No application found for student {studentId} in course {courseId}");
            }

            // Cambiar el estado de la aplicación a Accepted
            studentApplication.Status = ApplicationStatus.Accepted;
            await _courseApplicationRepository.UpdateCourseApplicationAsync(studentApplication);

            // Crear el CourseGrade
            var courseGrade = new CourseGrade
            {
                CourseId = courseId,
                StudentId = studentId
            };

            await _courseGradeRepository.AddCourseGradeAsync(courseGrade);
        }

        public async Task GenerateEnrollmentAsync(int courseInstanceId)
        {
            // Obtener el courseInstance y verificar que existe
            var courseInstance = await _courseInstanceRepository.GetCourseInstanceAsync(courseInstanceId);
            if (courseInstance == null)
            {
                throw new ArgumentException($"CourseInstance with ID {courseInstanceId} not found.");
            }

            // Obtener la capacidad de matrícula del curso
            var enrollmentCapacity = courseInstance.Course.EnrollmentCapacity;

            // Obtener todas las aplicaciones para este courseInstance con status Accepted
            var courseApplications = await _courseApplicationRepository.GetAllCourseApplicationsAsync();
            var applicationsForCourse = courseApplications
                .Where(ca => ca.CourseId == courseInstanceId &&
                             !ca.IsDeleted)
                .ToList();

            if (!applicationsForCourse.Any())
            {
                throw new ArgumentException("No accepted applications found for this course instance.");
            }

            // Obtener las reglas para este courseInstance ordenadas por prioridad
            var allRules = await _ruleRepository.GetAllRulesAsync();
            var rulesForCourse = allRules
                .Where(r => r.CourseInstanceId == courseInstanceId &&
                            r.Priority.HasValue &&
                            !r.IsDeleted)
                .OrderBy(r => r.Priority.Value)
                .ToList();

            // Lista para almacenar los estudiantes seleccionados
            var selectedStudents = new List<CourseApplication>();
            var remainingCapacity = enrollmentCapacity;

            // Procesar reglas por orden de prioridad
            foreach (var rule in rulesForCourse)
            {
                if (remainingCapacity <= 0) break;

                // Filtrar estudiantes que no han sido seleccionados aún y que cumplen los criterios de la regla
                var eligibleStudents = applicationsForCourse
                    .Where(ca => !selectedStudents.Contains(ca))
                    .Where(ca => {
                        var student = ca.Student;

                        // Si la regla tiene MajorId, verificar que coincida
                        if (rule.MajorId.HasValue && student.MajorId != rule.MajorId.Value)
                            return false;

                        // Si la regla tiene AcademicYear, verificar que coincida
                        if (rule.AcademicYear.HasValue && student.AcademicYear != rule.AcademicYear.Value)
                            return false;

                        return true;
                    })
                    .ToList();

                // Seleccionar estudiantes según la capacidad restante
                var studentsToSelect = eligibleStudents
                    .OrderBy(x => Guid.NewGuid())
                    .Take(remainingCapacity)
                    .ToList();

                selectedStudents.AddRange(studentsToSelect);
                remainingCapacity -= studentsToSelect.Count;
            }

            // Si aún hay capacidad, agregar estudiantes restantes de forma arbitraria
            if (remainingCapacity > 0)
            {
                var remainingStudents = applicationsForCourse
                    .Where(ca => !selectedStudents.Contains(ca))
                    .OrderBy(x => Guid.NewGuid())
                    .Take(remainingCapacity)
                    .ToList();

                selectedStudents.AddRange(remainingStudents);
            }

            // Crear CourseGrade para cada estudiante seleccionado
            foreach (var application in selectedStudents)
            {
                var courseGrade = new CourseGrade
                {
                    CourseId = courseInstanceId,
                    StudentId = application.StudentId,
                    Grade1 = null,
                    Grade2 = null,
                    Grade3 = null,
                    Comment = null,
                    IsDeleted = false
                };

                await _courseGradeRepository.AddCourseGradeAsync(courseGrade);
            }

            // Actualizar el status de las aplicaciones
            foreach (var application in applicationsForCourse)
            {
                if (selectedStudents.Contains(application))
                {
                    // Estudiante seleccionado - marcar como Accepted
                    application.Status = ApplicationStatus.Accepted;
                }
                else
                {
                    // Estudiante no seleccionado - marcar como Rejected
                    application.Status = ApplicationStatus.Rejected;
                }

                // Actualizar la aplicación en el repositorio
                await _courseApplicationRepository.UpdateCourseApplicationAsync(application);
            }
        }
    }

   

    
}