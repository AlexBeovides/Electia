using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using ElectiaCore.Application.Helpers;

namespace ElectiaCore.Application.Services
{    
    public class ProfessorService : IProfessorService
    {
        private readonly IProfessorRepository _professorRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly ICourseInstanceRepository _courseInstanceRepository;
        private readonly ICourseGradeRepository _courseGradeRepository;

        public ProfessorService(IProfessorRepository professorRepository, ICourseRepository courseRepository, 
            ICourseInstanceRepository courseInstanceRepository, ICourseGradeRepository courseGradeRepository)
        {
            _professorRepository = professorRepository;
            _courseRepository = courseRepository;
            _courseInstanceRepository = courseInstanceRepository;
            _courseGradeRepository = courseGradeRepository;
        }

        public async Task<Professor> GetProfessorAsync(string id)
        {
            return await _professorRepository.GetProfessorAsync(id);
        }

        public async Task<IEnumerable<Professor>> GetProfessorForFormAsync(string professorId)
        {
            var professors = await _professorRepository.GetAllProfessorsAsync();
            return professors.Where(p => p.UserId != professorId.ToString()).ToList();
        }

        public async Task<IEnumerable<Professor>> GetAllProfessorsAsync()
        {
            return await _professorRepository.GetAllProfessorsAsync();
        }

        public async Task<IEnumerable<ProfessorDto>> GetAllProfessorsForCatalogAsync()
        {
            var professors = await _professorRepository.GetAllProfessorsAsync();
             
            var professorDtos = professors
                .Select(p => new ProfessorDto
                {
                    UserId = p.UserId,
                    FullName = p.FullName,
                    PrimaryEmail = p.PrimaryEmail,
                    TeacherCategoryName = EnumHelper.GetEnumDisplayName(p.TeacherCategory),
                    AcademicDegreeName = EnumHelper.GetEnumDisplayName(p.AcademicDegree),
                    Landline = p.Landline,
                    PhoneNumber = p.PhoneNumber,
                    SecondaryEmail = p.SecondaryEmail
                })
                .ToList();

            return professorDtos;
        }

        public async Task AddProfessorAsync(Professor professor)
        {
            await _professorRepository.AddProfessorAsync(professor);
        }

        public async Task UpdateProfessorAsync(Professor professor)
        {
            await _professorRepository.UpdateProfessorAsync(professor);
        }        public async Task DeleteProfessorAsync(string id)
        {
            await _professorRepository.DeleteProfessorAsync(id);
        }

        public async Task<ProfessorStatsDto> GetProfessorStatsAsync(string professorId)
        {
            var today = DateTime.Now;

            // 1. Cantidad de cursos creados por el profesor (donde es MainProfessor)
            var allCourses = await _courseRepository.GetAllCoursesAsync();
            var coursesCreated = allCourses.Count(c => c.MainProfessorId == professorId);

            // 2. Cantidad de cursos activos (CourseInstances donde el curso del professor está activo)
            var allCourseInstances = await _courseInstanceRepository.GetAllCourseInstancesAsync();
            var activeCourses = allCourseInstances.Count(ci => 
                ci.Course.MainProfessorId == professorId && 
                ci.StartDate <= today && 
                ci.EndDate >= today);

            // 3. Cantidad de estudiantes matriculados en cursos activos del profesor
            var allCourseGrades = await _courseGradeRepository.GetAllCourseGradesAsync();
            
            // Obtener los IDs de CourseInstances activos del profesor
            var activeCourseInstanceIds = allCourseInstances
                .Where(ci => ci.Course.MainProfessorId == professorId && 
                           ci.StartDate <= today && 
                           ci.EndDate >= today)
                .Select(ci => ci.Id)
                .ToList();

            // Contar estudiantes únicos matriculados en esos cursos activos
            var enrolledStudents = allCourseGrades
                .Where(cg => activeCourseInstanceIds.Contains(cg.CourseId))
                .Select(cg => cg.StudentId)
                .Distinct()
                .Count();

            return new ProfessorStatsDto
            {
                CoursesCreated = coursesCreated,
                ActiveCourses = activeCourses,
                EnrolledStudents = enrolledStudents
            };
        }
    }
}