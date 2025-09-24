using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class CourseApplicationRepositoryTests
    {
        [Fact]
        public async Task AddCourseApplicationAsync_ShouldAddCourseApplication_WhenValidCourseApplication()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseApplicationRepository(context);
            var courseApplication = new CourseApplication
            {
                StudentId = "test-student-id",
                CourseId = 1,
                MotivationLetter = "I am very interested in this course",
                Status = ApplicationStatus.Pending,
                AppliedAt = DateTime.Now,
                IsDeleted = false
            };

            // Act
            await repository.AddCourseApplicationAsync(courseApplication);

            // Assert
            var savedApplication = await context.CourseApplications.FirstOrDefaultAsync(ca => ca.StudentId == "test-student-id" && ca.CourseId == 1);
            Assert.NotNull(savedApplication);
            Assert.Equal("test-student-id", savedApplication.StudentId);
            Assert.Equal(1, savedApplication.CourseId);
            Assert.Equal(ApplicationStatus.Pending, savedApplication.Status);
            Assert.False(savedApplication.IsDeleted);
        }

        [Fact]
        public async Task GetCourseApplicationAsync_ShouldReturnCourseApplication_WhenCourseApplicationExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseApplicationRepository(context);
            var courseApplication = new CourseApplication
            {
                Id = 1,
                StudentId = "test-student-id",
                CourseId = 1,
                MotivationLetter = "Test motivation",
                Status = ApplicationStatus.Pending,
                AppliedAt = DateTime.Now,
                IsDeleted = false
            };
            context.CourseApplications.Add(courseApplication);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetCourseApplicationAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-student-id", result.StudentId);
            Assert.Equal(1, result.CourseId);
            Assert.Equal(ApplicationStatus.Pending, result.Status);
            Assert.Equal("Test motivation", result.MotivationLetter);
        }

        [Fact]
        public async Task UpdateCourseApplicationAsync_ShouldUpdateCourseApplication_WhenValidCourseApplication()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseApplicationRepository(context);
            var courseApplication = new CourseApplication
            {
                Id = 1,
                StudentId = "test-student-id",
                CourseId = 1,
                MotivationLetter = "Original motivation",
                Status = ApplicationStatus.Pending,
                AppliedAt = DateTime.Now,
                IsDeleted = false
            };
            context.CourseApplications.Add(courseApplication);
            await context.SaveChangesAsync();

            // Act
            courseApplication.Status = ApplicationStatus.Accepted;
            courseApplication.MotivationLetter = "Updated motivation";
            await repository.UpdateCourseApplicationAsync(courseApplication);

            // Assert
            var updatedApplication = await context.CourseApplications.FindAsync(1);
            Assert.Equal(ApplicationStatus.Accepted, updatedApplication.Status);
            Assert.Equal("Updated motivation", updatedApplication.MotivationLetter);
        }

        [Fact]
        public async Task DeleteCourseApplicationAsync_ShouldMarkAsDeleted_WhenCourseApplicationExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseApplicationRepository(context);
            var courseApplication = new CourseApplication
            {
                Id = 1,
                StudentId = "test-student-id",
                CourseId = 1,
                MotivationLetter = "Test motivation",
                Status = ApplicationStatus.Pending,
                AppliedAt = DateTime.Now,
                IsDeleted = false
            };
            context.CourseApplications.Add(courseApplication);
            await context.SaveChangesAsync();

            // Act
            await repository.DeleteCourseApplicationAsync(1);

            // Assert
            var deletedApplication = await context.CourseApplications.FindAsync(1);
            Assert.True(deletedApplication.IsDeleted);
        }

        [Fact]
        public async Task GetAllCourseApplicationsAsync_ShouldReturnOnlyNonDeletedCourseApplications()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseApplicationRepository(context);

            var application1 = new CourseApplication
            {
                StudentId = "test-student-id",
                CourseId = 1,
                MotivationLetter = "Active application",
                Status = ApplicationStatus.Pending,
                AppliedAt = DateTime.Now,
                IsDeleted = false
            };

            var application2 = new CourseApplication
            {
                StudentId = "test-student-id-2",
                CourseId = 1,
                MotivationLetter = "Deleted application",
                Status = ApplicationStatus.Rejected,
                AppliedAt = DateTime.Now,
                IsDeleted = true
            };

            context.CourseApplications.AddRange(application1, application2);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllCourseApplicationsAsync();

            // Assert
            Assert.Single(result);
            Assert.All(result, app => Assert.False(app.IsDeleted));
        }        [Fact]
        public async Task GetCourseApplicationWithRelationsAsync_ShouldIncludeStudentAndCourse()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseApplicationRepository(context);
            var courseApplication = new CourseApplication
            {
                Id = 1,
                StudentId = "test-student-id",
                CourseId = 1,
                MotivationLetter = "Test motivation",
                Status = ApplicationStatus.Pending,
                AppliedAt = DateTime.Now,
                IsDeleted = false
            };
            context.CourseApplications.Add(courseApplication);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetCourseApplicationAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-student-id", result.StudentId);
            Assert.Equal(1, result.CourseId);
            Assert.Equal("Test motivation", result.MotivationLetter);
            Assert.Equal(ApplicationStatus.Pending, result.Status);
        }

        [Fact]
        public async Task GetCourseApplicationAsync_ShouldThrowException_WhenCourseApplicationNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseApplicationRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetCourseApplicationAsync(999));
        }
    }
}
