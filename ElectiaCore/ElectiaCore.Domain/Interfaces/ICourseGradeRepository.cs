using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Interfaces
{
    public interface ICourseGradeRepository
    {
        Task<CourseGrade> GetCourseGradeAsync(int courseGradeId);
        Task<IEnumerable<CourseGrade>> GetAllCourseGradesAsync();
        Task AddCourseGradeAsync(CourseGrade courseGrade);
        Task UpdateCourseGradeAsync(CourseGrade courseGrade);
        Task DeleteCourseGradeAsync(int courseGradeId);
    }
}