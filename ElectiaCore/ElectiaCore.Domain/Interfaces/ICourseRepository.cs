using ElectiaCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Interfaces
{
    public interface ICourseRepository
    {
        Task<Course> GetCourseAsync(int id);
        Task<IEnumerable<Course>> GetAllCoursesAsync();
        Task AddCourseAsync(Course course);
        Task UpdateCourseAsync(Course course);
        Task DeleteCourseAsync(int id);
    }
}
