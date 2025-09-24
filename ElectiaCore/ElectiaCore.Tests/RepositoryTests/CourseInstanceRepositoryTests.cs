using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class CourseInstanceRepositoryTests
    {
        [Fact]
        public async Task AddCourseInstanceAsync_ShouldAddCourseInstance_WhenValidCourseInstance()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseInstanceRepository(context);
            var courseInstance = new CourseInstance
            {
                CourseId = 1,
                StartDate = DateTime.Now.AddDays(60),
                EndDate = DateTime.Now.AddDays(120),
                IsDeleted = false
            };

            // Act
            await repository.AddCourseInstanceAsync(courseInstance);

            // Assert
            var savedInstance = await context.CourseInstances.FirstOrDefaultAsync(ci => ci.CourseId == 1 && ci.StartDate == courseInstance.StartDate);
            Assert.NotNull(savedInstance);
            Assert.Equal(1, savedInstance.CourseId);
            Assert.False(savedInstance.IsDeleted);
        }

        [Fact]
        public async Task GetCourseInstanceAsync_ShouldReturnCourseInstance_WhenCourseInstanceExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseInstanceRepository(context);

            // Act (using seeded data)
            var result = await repository.GetCourseInstanceAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.CourseId);
            Assert.True(result.StartDate < result.EndDate);
            Assert.False(result.IsDeleted);
        }

        [Fact]
        public async Task UpdateCourseInstanceAsync_ShouldUpdateCourseInstance_WhenValidCourseInstance()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseInstanceRepository(context);
            var courseInstance = await context.CourseInstances.FindAsync(1);
            var originalEndDate = courseInstance.EndDate;

            // Act
            courseInstance.EndDate = DateTime.Now.AddDays(200);
            await repository.UpdateCourseInstanceAsync(courseInstance);

            // Assert
            var updatedInstance = await context.CourseInstances.FindAsync(1);
            Assert.NotEqual(originalEndDate, updatedInstance.EndDate);
            Assert.Equal(DateTime.Now.AddDays(200).Date, updatedInstance.EndDate.Date);
        }

        [Fact]
        public async Task DeleteCourseInstanceAsync_ShouldMarkAsDeleted_WhenCourseInstanceExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseInstanceRepository(context);

            // Act
            await repository.DeleteCourseInstanceAsync(1);

            // Assert
            var deletedInstance = await context.CourseInstances.FindAsync(1);
            Assert.True(deletedInstance.IsDeleted);
        }

        [Fact]
        public async Task GetAllCourseInstancesAsync_ShouldReturnOnlyNonDeletedCourseInstances()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseInstanceRepository(context);

            // Mark one instance as deleted
            var instanceToDelete = await context.CourseInstances.FindAsync(2);
            instanceToDelete.IsDeleted = true;
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllCourseInstancesAsync();

            // Assert
            Assert.Single(result);
            Assert.All(result, instance => Assert.False(instance.IsDeleted));
        }        [Fact]
        public async Task GetCourseInstanceWithCourseAsync_ShouldIncludeCourse_WhenCourseInstanceExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseInstanceRepository(context);

            // Act
            var result = await repository.GetCourseInstanceAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.CourseId);
            Assert.NotNull(result.Course);
            Assert.Equal("Test Course", result.Course.Title);
        }

        [Fact]
        public async Task GetCourseInstanceAsync_ShouldThrowException_WhenCourseInstanceNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseInstanceRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetCourseInstanceAsync(999));
        }

        [Fact]
        public async Task ValidateDateRange_ShouldCreateValidCourseInstance()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseInstanceRepository(context);
            var courseInstance = new CourseInstance
            {
                CourseId = 1,
                StartDate = DateTime.Now.AddDays(30),
                EndDate = DateTime.Now.AddDays(90),
                IsDeleted = false
            };

            // Act
            await repository.AddCourseInstanceAsync(courseInstance);

            // Assert
            var savedInstance = await context.CourseInstances.FirstOrDefaultAsync(ci => ci.CourseId == 1 && ci.StartDate == courseInstance.StartDate);
            Assert.NotNull(savedInstance);
            Assert.True(savedInstance.StartDate < savedInstance.EndDate);
        }
    }
}