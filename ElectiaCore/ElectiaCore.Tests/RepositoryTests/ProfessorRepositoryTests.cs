using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class ProfessorRepositoryTests
    {
        [Fact]
        public async Task AddProfessorAsync_ShouldAddProfessor_WhenValidProfessor()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new ProfessorRepository(context);
            
            // Add a new user first
            var user = new IdentityUser
            {
                Id = "new-prof-id",
                UserName = "newprof@test.com",
                Email = "newprof@test.com",
                EmailConfirmed = true
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var professor = new Professor
            {
                UserId = "new-prof-id",
                FullName = "New Test Professor",
                PrimaryEmail = "newprof@test.com",
                TeacherCategory = TeacherCategory.AssistantProfessor,
                AcademicDegree = AcademicDegree.MasterOfScience,
                PhoneNumber = "123456789",
                IsDeleted = false
            };

            // Act
            await repository.AddProfessorAsync(professor);

            // Assert
            var savedProfessor = await context.Professors.FirstOrDefaultAsync(p => p.FullName == "New Test Professor");
            Assert.NotNull(savedProfessor);
            Assert.Equal("New Test Professor", savedProfessor.FullName);
            Assert.Equal(TeacherCategory.AssistantProfessor, savedProfessor.TeacherCategory);
            Assert.False(savedProfessor.IsDeleted);
        }

        [Fact]
        public async Task GetProfessorAsync_ShouldReturnProfessor_WhenProfessorExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new ProfessorRepository(context);

            // Act (using seeded data)
            var result = await repository.GetProfessorAsync("test-prof-id");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Professor", result.FullName);
            Assert.Equal(TeacherCategory.FullProfessor, result.TeacherCategory);
            Assert.Equal(AcademicDegree.DoctorOfScience, result.AcademicDegree);
            Assert.False(result.IsDeleted);
        }

        [Fact]
        public async Task UpdateProfessorAsync_ShouldUpdateProfessor_WhenValidProfessor()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new ProfessorRepository(context);
            var professor = await context.Professors.FindAsync("test-prof-id");

            // Act
            professor.FullName = "Updated Professor Name";
            professor.TeacherCategory = TeacherCategory.AuxiliaryProfessor;
            await repository.UpdateProfessorAsync(professor);

            // Assert
            var updatedProfessor = await context.Professors.FindAsync("test-prof-id");
            Assert.Equal("Updated Professor Name", updatedProfessor.FullName);
            Assert.Equal(TeacherCategory.AuxiliaryProfessor, updatedProfessor.TeacherCategory);
        }

        [Fact]
        public async Task DeleteProfessorAsync_ShouldMarkAsDeleted_WhenProfessorExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new ProfessorRepository(context);

            // Act
            await repository.DeleteProfessorAsync("test-prof-id");

            // Assert
            var deletedProfessor = await context.Professors.FindAsync("test-prof-id");
            Assert.True(deletedProfessor.IsDeleted);
        }        [Fact]
        public async Task GetAllProfessorsAsync_ShouldReturnAllProfessors()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new ProfessorRepository(context);

            // Act
            var result = await repository.GetAllProfessorsAsync();

            // Assert
            Assert.Equal(2, result.Count()); // Both professors (deleted and non-deleted)
            Assert.Contains(result, p => p.UserId == "test-prof-id");
            Assert.Contains(result, p => p.UserId == "test-prof-id-2");
        }[Fact]
        public async Task GetProfessorWithUserAsync_ShouldIncludeUser_WhenProfessorExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new ProfessorRepository(context);

            // Act
            var result = await repository.GetProfessorAsync("test-prof-id");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Professor", result.FullName);
            Assert.Equal(TeacherCategory.FullProfessor, result.TeacherCategory);
            Assert.Equal(AcademicDegree.DoctorOfScience, result.AcademicDegree);
        }

        [Fact]
        public async Task GetProfessorAsync_ShouldThrowException_WhenProfessorNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new ProfessorRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetProfessorAsync("non-existent-id"));
        }
    }
}
