using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using ElectiaCore.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Services
{
    public class CourseApplicationService : ICourseApplicationService
    {
        private readonly ICourseApplicationRepository _courseApplicationRepository;
        private readonly IStudentRepository _studentRepository;

        public CourseApplicationService(ICourseApplicationRepository courseApplicationRepository, IStudentRepository studentRepository)
        {
            _courseApplicationRepository = courseApplicationRepository;
            _studentRepository = studentRepository;
        }

        public async Task<CourseApplication> GetCourseApplicationAsync(int id)
        {
            return await _courseApplicationRepository.GetCourseApplicationAsync(id);
        }

        public async Task<IEnumerable<CourseApplication>> GetAllCourseApplicationsAsync()
        {
            return await _courseApplicationRepository.GetAllCourseApplicationsAsync();
        }

        public async Task<IEnumerable<StudentDto>> GetAllCourseApplicationsByCourseIdAsync(int courseId)
        {
            var courses = await _courseApplicationRepository.GetAllCourseApplicationsAsync();

            var students = courses
                .Where(a => a.CourseId == courseId && a.Status != ApplicationStatus.Accepted)          // check duplicate students??
                .Select(a => new StudentDto
                    {
                        UserId = a.StudentId,
                        FullName = a.Student.FullName,
                })
                .ToList();

            return students;
        }

        public async Task AddCourseApplicationAsync(CourseApplication courseApplication)
        {
            await _courseApplicationRepository.AddCourseApplicationAsync(courseApplication);
        }

        public async Task UpdateCourseApplicationAsync(CourseApplication courseApplication)
        {
            await _courseApplicationRepository.UpdateCourseApplicationAsync(courseApplication);
        }

        public async Task DeleteCourseApplicationAsync(int id)
        {
            await _courseApplicationRepository.DeleteCourseApplicationAsync(id);
        }

        public async Task ApplyToCourseAsync(string studentId, CourseApplicationDto courseApplicationDto)
        {
            var courseApplications = await _courseApplicationRepository.GetAllCourseApplicationsAsync();

            if (courseApplications.Any(c => c.StudentId == studentId && c.CourseId == courseApplicationDto.CourseId && !c.IsDeleted))
            {
                throw new InvalidOperationException("Student already enrolled in this course");
            }

            var courseApplication = new CourseApplication
            {
                StudentId = studentId,
                CourseId = courseApplicationDto.CourseId,
                MotivationLetter = courseApplicationDto.MotivationLetter,
                Status = ApplicationStatus.Pending,
                AppliedAt = DateTime.Now
            };

            var student = await _studentRepository.GetStudentAsync(studentId);
            student.AcademicYear = (AcademicYear)courseApplicationDto.AcademicYearId;
            await _studentRepository.UpdateStudentAsync(student);

            await _courseApplicationRepository.AddCourseApplicationAsync(courseApplication);
        }

        public async Task WithdrawFromCourseAsync(string studentId, int courseId)
        {
            var courseApplications = await _courseApplicationRepository.GetAllCourseApplicationsAsync();

            var courseApplication = courseApplications.FirstOrDefault(ca =>
                ca.StudentId == studentId &&
                ca.CourseId == courseId);

            if (courseApplication == null)
            {
                throw new InvalidOperationException("Student is not enrolled in this course");
            }

            // Use the repository's delete method to remove the course application
            await _courseApplicationRepository.DeleteCourseApplicationAsync(courseApplication.Id);
        }

        public async Task<int> IsStudentApplicant(int courseId, string studentId)
        {
            var applications = await _courseApplicationRepository.GetAllCourseApplicationsAsync();
            var application = applications.FirstOrDefault(ca =>
                ca.CourseId == courseId &&
                ca.StudentId == studentId &&
                !ca.IsDeleted);

            if (application == null)
                return -1; // No application found

            return (int)application.Status; // 0=Pending, 1=Accepted, 2=Rejected
        }
    }
}

 