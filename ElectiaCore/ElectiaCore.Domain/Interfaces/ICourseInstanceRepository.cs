using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Interfaces
{
    public interface ICourseInstanceRepository
    {
        Task<CourseInstance> GetCourseInstanceAsync(int id);
        Task<IEnumerable<CourseInstance>> GetAllCourseInstancesAsync();
        Task AddCourseInstanceAsync(CourseInstance courseInstance);
        Task UpdateCourseInstanceAsync(CourseInstance courseInstance);
        Task DeleteCourseInstanceAsync(int id);
    }
}