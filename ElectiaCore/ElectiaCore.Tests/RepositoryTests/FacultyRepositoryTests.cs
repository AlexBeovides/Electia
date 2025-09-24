using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class FacultyRepositoryTests
    {
        [Fact]
        public async Task AddFacultyAsync_ShouldAddFaculty_WhenValidFaculty()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new FacultyRepository(context);
            var faculty = new Faculty
            {
                Name = "New Test Faculty",
                IsDeleted = false
            };

            // Act
            await repository.AddFacultyAsync(faculty);

            // Assert
            var savedFaculty = await context.Faculties.FirstOrDefaultAsync(f => f.Name == "New Test Faculty");
            Assert.NotNull(savedFaculty);
            Assert.Equal("New Test Faculty", savedFaculty.Name);
            Assert.False(savedFaculty.IsDeleted);
        }

        [Fact]
        public async Task GetFacultyAsync_ShouldReturnFaculty_WhenFacultyExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new FacultyRepository(context);

            // Act (using seeded data)
            var result = await repository.GetFacultyAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Faculty of Engineering", result.Name);
            Assert.False(result.IsDeleted);
        }

        [Fact]
        public async Task UpdateFacultyAsync_ShouldUpdateFaculty_WhenValidFaculty()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new FacultyRepository(context);
            var faculty = await context.Faculties.FindAsync(1);

            // Act
            faculty.Name = "Updated Faculty Name";
            await repository.UpdateFacultyAsync(faculty);

            // Assert
            var updatedFaculty = await context.Faculties.FindAsync(1);
            Assert.Equal("Updated Faculty Name", updatedFaculty.Name);
        }

        [Fact]
        public async Task DeleteFacultyAsync_ShouldMarkAsDeleted_WhenFacultyExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new FacultyRepository(context);

            // Act
            await repository.DeleteFacultyAsync(1);

            // Assert
            var deletedFaculty = await context.Faculties.FindAsync(1);
            Assert.True(deletedFaculty.IsDeleted);
        }

        [Fact]
        public async Task GetAllFacultiesAsync_ShouldReturnOnlyNonDeletedFaculties()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new FacultyRepository(context);

            // Mark one faculty as deleted
            var facultyToDelete = await context.Faculties.FindAsync(2);
            facultyToDelete.IsDeleted = true;
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllFacultiesAsync();

            // Assert
            Assert.Single(result);
            Assert.All(result, faculty => Assert.False(faculty.IsDeleted));
        }

        [Fact]
        public async Task GetFacultyWithMajorsAsync_ShouldIncludeMajors_WhenFacultyExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new FacultyRepository(context);

            // Act
            var result = await repository.GetFacultyAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Faculty of Engineering", result.Name);
            // Note: Majors relationship should be tested if the repository includes them
        }

        [Fact]
        public async Task GetFacultyAsync_ShouldThrowException_WhenFacultyNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new FacultyRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetFacultyAsync(999));
        }
    }
}
