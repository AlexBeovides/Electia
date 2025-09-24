using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Interfaces
{
    public interface ICourseApplicationRepository
    {
        Task<CourseApplication> GetCourseApplicationAsync(int id);
        Task<IEnumerable<CourseApplication>> GetAllCourseApplicationsAsync();
        Task AddCourseApplicationAsync(CourseApplication courseApplication);
        Task UpdateCourseApplicationAsync(CourseApplication courseApplication);
        Task DeleteCourseApplicationAsync(int id);
    }
}


//GetAllCourseApplicationsByCourseIdAsync