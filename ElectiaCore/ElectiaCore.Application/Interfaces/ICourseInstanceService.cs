using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Interfaces
{
    public interface ICourseInstanceService
    {
        Task<CourseInstance> GetCourseInstanceAsync(int id);
        Task<IEnumerable<CourseInstance>> GetAllCourseInstancesAsync();
        Task UpdateCourseInstanceAsync(CourseInstance courseInstance);
        Task AddCourseInstanceAsync(CourseInstance courseInstance);
        Task DeleteCourseInstanceAsync(int id);

        Task<IEnumerable<CoursesCatalogDto>> GetAllCourseInstancesForCatalogAsync();
        Task<IEnumerable<CoursesCatalogDto>> GetAllCourseInstancesForCatalogFromStudentAsync();
        Task<IEnumerable<CoursesCatalogDto>> GetAllCourseInstancesForCatalogFromProfessorAsync(string professorId);
        Task<IEnumerable<CoursesCatalogDto>> GetAllCourseInstancesEnrolledForCatalogAsync(string studentId);
        Task<CoursesCatalogDto> GetCourseInstanceForCatalogAsync(int id);
    }
}
 