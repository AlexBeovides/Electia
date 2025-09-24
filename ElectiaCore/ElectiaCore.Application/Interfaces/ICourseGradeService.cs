using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Interfaces
{
    public interface ICourseGradeService
    {
        Task<CourseGrade> GetCourseGradeAsync(int courseGradeId);
        Task<IEnumerable<CourseGrade>> GetAllCourseGradesAsync();
        Task AddCourseGradeAsync(CourseGrade courseGrade);
        Task UpdateCourseGradeAsync(CourseGrade courseGrade);
        Task DeleteCourseGradeAsync(int courseGradeId);

        Task<IEnumerable<CourseRosterDto>> GetAllCourseGradesByCourseIdAsync(int courseId);
        Task EnrollStudentAsync(int courseId, string studentId);
        Task UpdateCourseGradeByProfessorAsync(EditGradeDto courseGradeDto);
    
        Task GenerateEnrollmentAsync(int courseInstanceId);

    }
} 