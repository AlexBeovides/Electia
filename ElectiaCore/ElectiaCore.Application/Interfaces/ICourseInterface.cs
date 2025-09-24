using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Interfaces
{
    public interface ICourseService
    {
        Task<Course> GetCourseAsync(int id);
        Task<CoursesCatalogDto> GetCourseForCatalogAsync(int id);
        Task<IEnumerable<Course>> GetAllCoursesAsync();
        Task<IEnumerable<CoursesCatalogDto>> GetAllCoursesForCatalogAsync();
        Task<Course> AddCourseAsync(CreateCourseDto courseDto);
        Task UpdateCourseAsync(Course course);
        Task UpdateCourseByProfessorAsync(EditCourseDto course);
        Task DeleteCourseAsync(int id);
        Task ApproveCourseAsync(int id);
        Task RejectCourseAsync(int id);

        Task<IEnumerable<CoursesCatalogDto>> GetAllCoursesFromProfessorAsync(string professorId);
    }
}

