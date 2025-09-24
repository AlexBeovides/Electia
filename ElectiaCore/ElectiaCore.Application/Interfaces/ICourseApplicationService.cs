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
    public interface ICourseApplicationService
    {
        Task<CourseApplication> GetCourseApplicationAsync(int id);
        Task<IEnumerable<CourseApplication>> GetAllCourseApplicationsAsync();
        Task UpdateCourseApplicationAsync(CourseApplication courseApplication);
        Task AddCourseApplicationAsync(CourseApplication courseApplication);
        Task DeleteCourseApplicationAsync(int id);

        Task<IEnumerable<StudentDto>> GetAllCourseApplicationsByCourseIdAsync(int courseId);
        Task ApplyToCourseAsync(string studentId, CourseApplicationDto courseApplicationDto);
        Task WithdrawFromCourseAsync(string studentId, int courseId);
        Task<int> IsStudentApplicant(int courseId, string studentId);
    }
}






