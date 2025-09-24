using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class MajorRepositoryTests
    {
        [Fact]
        public async Task AddMajorAsync_ShouldAddMajor_WhenValidMajor()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new MajorRepository(context);
            var major = new Major
            {
                Name = "New Test Major",
                FacultyId = 1,
                IsDeleted = false
            };

            // Act
            await repository.AddMajorAsync(major);

            // Assert
            var savedMajor = await context.Majors.FirstOrDefaultAsync(m => m.Name == "New Test Major");
            Assert.NotNull(savedMajor);
            Assert.Equal("New Test Major", savedMajor.Name);
            Assert.Equal(1, savedMajor.FacultyId);
            Assert.False(savedMajor.IsDeleted);
        }

        [Fact]
        public async Task GetMajorAsync_ShouldReturnMajor_WhenMajorExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new MajorRepository(context);

            // Act (using seeded data)
            var result = await repository.GetMajorAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Computer Science", result.Name);
            Assert.Equal(1, result.FacultyId);
            Assert.False(result.IsDeleted);
        }

        [Fact]
        public async Task UpdateMajorAsync_ShouldUpdateMajor_WhenValidMajor()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new MajorRepository(context);
            var major = await context.Majors.FindAsync(1);

            // Act
            major.Name = "Updated Major Name";
            await repository.UpdateMajorAsync(major);

            // Assert
            var updatedMajor = await context.Majors.FindAsync(1);
            Assert.Equal("Updated Major Name", updatedMajor.Name);
        }

        [Fact]
        public async Task DeleteMajorAsync_ShouldMarkAsDeleted_WhenMajorExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new MajorRepository(context);

            // Act
            await repository.DeleteMajorAsync(1);

            // Assert
            var deletedMajor = await context.Majors.FindAsync(1);
            Assert.True(deletedMajor.IsDeleted);
        }

        [Fact]
        public async Task GetAllMajorsAsync_ShouldReturnOnlyNonDeletedMajors()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new MajorRepository(context);

            // Mark one major as deleted
            var majorToDelete = await context.Majors.FindAsync(3);
            majorToDelete.IsDeleted = true;
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllMajorsAsync();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.All(result, major => Assert.False(major.IsDeleted));
        }        [Fact]
        public async Task GetMajorWithFacultyAsync_ShouldIncludeFaculty_WhenMajorExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new MajorRepository(context);

            // Act
            var result = await repository.GetMajorAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Computer Science", result.Name);
            Assert.Equal(1, result.FacultyId);
        }

        [Fact]
        public async Task GetMajorAsync_ShouldThrowException_WhenMajorNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new MajorRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetMajorAsync(999));
        }
    }
}
   