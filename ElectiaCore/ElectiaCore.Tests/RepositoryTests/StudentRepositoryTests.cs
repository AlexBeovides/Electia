using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class StudentRepositoryTests
    {
        [Fact]
        public async Task AddStudentAsync_ShouldAddStudent_WhenValidStudent()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new StudentRepository(context);
            
            // Add a new user first
            var user = new IdentityUser
            {
                Id = "new-student-id",
                UserName = "newstudent@test.com",
                Email = "newstudent@test.com",
                EmailConfirmed = true
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var student = new Student
            {
                UserId = "new-student-id",
                FullName = "New Test Student",
                IDNumber = "11111111111",
                PrimaryEmail = "newstudent@test.com",
                EveaUsername = "newstudent",
                PhoneNumber = "555555555",
                FacultyId = 1,
                MajorId = 1,
                AcademicYear = AcademicYear.First,
                IsDeleted = false
            };

            // Act
            await repository.AddStudentAsync(student);

            // Assert
            var savedStudent = await context.Students.FirstOrDefaultAsync(s => s.FullName == "New Test Student");
            Assert.NotNull(savedStudent);
            Assert.Equal("New Test Student", savedStudent.FullName);
            Assert.Equal("11111111111", savedStudent.IDNumber);
            Assert.Equal(AcademicYear.First, savedStudent.AcademicYear);
            Assert.False(savedStudent.IsDeleted);
        }

        [Fact]
        public async Task GetStudentAsync_ShouldReturnStudent_WhenStudentExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new StudentRepository(context);

            // Act (using seeded data)
            var result = await repository.GetStudentAsync("test-student-id");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Student", result.FullName);
            Assert.Equal("12345678901", result.IDNumber);
            Assert.Equal(AcademicYear.Third, result.AcademicYear);
            Assert.Equal(1, result.FacultyId);
            Assert.Equal(1, result.MajorId);
            Assert.False(result.IsDeleted);
        }

        [Fact]
        public async Task UpdateStudentAsync_ShouldUpdateStudent_WhenValidStudent()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new StudentRepository(context);
            var student = await context.Students.FindAsync("test-student-id");

            // Act
            student.FullName = "Updated Student Name";
            student.AcademicYear = AcademicYear.Fourth;
            await repository.UpdateStudentAsync(student);

            // Assert
            var updatedStudent = await context.Students.FindAsync("test-student-id");
            Assert.Equal("Updated Student Name", updatedStudent.FullName);
            Assert.Equal(AcademicYear.Fourth, updatedStudent.AcademicYear);
        }

        [Fact]
        public async Task DeleteStudentAsync_ShouldMarkAsDeleted_WhenStudentExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new StudentRepository(context);

            // Act
            await repository.DeleteStudentAsync("test-student-id");

            // Assert
            var deletedStudent = await context.Students.FindAsync("test-student-id");
            Assert.True(deletedStudent.IsDeleted);
        }

        [Fact]
        public async Task GetAllStudentsAsync_ShouldReturnOnlyNonDeletedStudents()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new StudentRepository(context);

            // Mark one student as deleted
            var studentToDelete = await context.Students.FindAsync("test-student-id-2");
            studentToDelete.IsDeleted = true;
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllStudentsAsync();

            // Assert
            Assert.Single(result);
            Assert.All(result, student => Assert.False(student.IsDeleted));
        }        [Fact]
        public async Task GetStudentWithRelationsAsync_ShouldIncludeFacultyAndMajor_WhenStudentExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new StudentRepository(context);

            // Act
            var result = await repository.GetStudentAsync("test-student-id");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Student", result.FullName);
            Assert.NotNull(result.Faculty);
            Assert.NotNull(result.Major);
            Assert.Equal("Faculty of Engineering", result.Faculty.Name);
            Assert.Equal("Computer Science", result.Major.Name);
        }

        [Fact]
        public async Task GetStudentAsync_ShouldThrowException_WhenStudentNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new StudentRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetStudentAsync("non-existent-id"));
        }
    }
}

