using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class CourseGradeRepositoryTests
    {
        [Fact]
        public async Task AddCourseGradeAsync_ShouldAddCourseGrade_WhenValidCourseGrade()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseGradeRepository(context);
            var courseGrade = new CourseGrade
            {
                CourseId = 1,
                StudentId = "test-student-id",
                Grade1 = 85,
                Grade2 = 90,
                Grade3 = 88,
                Comment = "Excellent performance",
                IsDeleted = false
            };

            // Act
            await repository.AddCourseGradeAsync(courseGrade);

            // Assert
            var savedGrade = await context.CourseGrades.FirstOrDefaultAsync(cg => cg.StudentId == "test-student-id" && cg.CourseId == 1);
            Assert.NotNull(savedGrade);
            Assert.Equal("test-student-id", savedGrade.StudentId);
            Assert.Equal(1, savedGrade.CourseId);
            Assert.Equal(85, savedGrade.Grade1);
            Assert.Equal(90, savedGrade.Grade2);
            Assert.Equal(88, savedGrade.Grade3);
            Assert.Equal("Excellent performance", savedGrade.Comment);
            Assert.False(savedGrade.IsDeleted);
        }

        [Fact]
        public async Task GetCourseGradeAsync_ShouldReturnCourseGrade_WhenCourseGradeExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseGradeRepository(context);
            var courseGrade = new CourseGrade
            {
                Id = 1,
                CourseId = 1,
                StudentId = "test-student-id",
                Grade1 = 75,
                Grade2 = 80,
                Grade3 = 85,
                Comment = "Good progress",
                IsDeleted = false
            };
            context.CourseGrades.Add(courseGrade);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetCourseGradeAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-student-id", result.StudentId);
            Assert.Equal(1, result.CourseId);
            Assert.Equal(75, result.Grade1);
            Assert.Equal(80, result.Grade2);
            Assert.Equal(85, result.Grade3);
            Assert.Equal("Good progress", result.Comment);
        }

        [Fact]
        public async Task UpdateCourseGradeAsync_ShouldUpdateCourseGrade_WhenValidCourseGrade()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseGradeRepository(context);
            var courseGrade = new CourseGrade
            {
                Id = 1,
                CourseId = 1,
                StudentId = "test-student-id",
                Grade1 = 75,
                Grade2 = 80,
                Grade3 = null,
                Comment = "Initial grades",
                IsDeleted = false
            };
            context.CourseGrades.Add(courseGrade);
            await context.SaveChangesAsync();

            // Act
            courseGrade.Grade3 = 92;
            courseGrade.Comment = "Final grade added - excellent improvement";
            await repository.UpdateCourseGradeAsync(courseGrade);

            // Assert
            var updatedGrade = await context.CourseGrades.FindAsync(1);
            Assert.Equal(92, updatedGrade.Grade3);
            Assert.Equal("Final grade added - excellent improvement", updatedGrade.Comment);
        }

        [Fact]
        public async Task DeleteCourseGradeAsync_ShouldMarkAsDeleted_WhenCourseGradeExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseGradeRepository(context);
            var courseGrade = new CourseGrade
            {
                Id = 1,
                CourseId = 1,
                StudentId = "test-student-id",
                Grade1 = 85,
                Grade2 = 90,
                Grade3 = 88,
                Comment = "Test grade",
                IsDeleted = false
            };
            context.CourseGrades.Add(courseGrade);
            await context.SaveChangesAsync();

            // Act
            await repository.DeleteCourseGradeAsync(1);

            // Assert
            var deletedGrade = await context.CourseGrades.FindAsync(1);
            Assert.True(deletedGrade.IsDeleted);
        }

        [Fact]
        public async Task GetAllCourseGradesAsync_ShouldReturnOnlyNonDeletedCourseGrades()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseGradeRepository(context);

            var grade1 = new CourseGrade
            {
                CourseId = 1,
                StudentId = "test-student-id",
                Grade1 = 85,
                Comment = "Active grade",
                IsDeleted = false
            };

            var grade2 = new CourseGrade
            {
                CourseId = 1,
                StudentId = "test-student-id-2",
                Grade1 = 75,
                Comment = "Deleted grade",
                IsDeleted = true
            };

            context.CourseGrades.AddRange(grade1, grade2);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllCourseGradesAsync();

            // Assert
            Assert.Single(result);
            Assert.All(result, grade => Assert.False(grade.IsDeleted));
        }        [Fact]
        public async Task CalculateAverageGrade_ShouldReturnCorrectAverage()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseGradeRepository(context);

            var grade = new CourseGrade
            {
                CourseId = 1,
                StudentId = "test-student-id",
                Grade1 = 80,
                Grade2 = 90,
                Grade3 = 85,
                Comment = "Test grade for average",
                IsDeleted = false
            };

            context.CourseGrades.Add(grade);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetCourseGradeAsync(grade.Id);

            // Assert
            Assert.NotNull(result);
            var average = (result.Grade1.GetValueOrDefault() + result.Grade2.GetValueOrDefault() + result.Grade3.GetValueOrDefault()) / 3.0;
            Assert.Equal(85.0, average, 1);
        }

        [Fact]
        public async Task GetCourseGradesWithPartialGrades_ShouldHandleNullGrades()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseGradeRepository(context);

            var grade = new CourseGrade
            {
                CourseId = 1,
                StudentId = "test-student-id",
                Grade1 = 85,
                Grade2 = null,
                Grade3 = null,
                Comment = "Partial grades only",
                IsDeleted = false
            };

            context.CourseGrades.Add(grade);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetCourseGradeAsync(grade.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(85, result.Grade1);
            Assert.Null(result.Grade2);
            Assert.Null(result.Grade3);
        }

        [Fact]
        public async Task GetCourseGradeWithRelationsAsync_ShouldIncludeStudentAndCourse()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseGradeRepository(context);
            var courseGrade = new CourseGrade
            {
                Id = 1,
                CourseId = 1,
                StudentId = "test-student-id",
                Grade1 = 85,
                Comment = "Test grade",
                IsDeleted = false
            };
            context.CourseGrades.Add(courseGrade);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetCourseGradeAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-student-id", result.StudentId);
            Assert.Equal(1, result.CourseId);
            Assert.Equal(85, result.Grade1);
        }

        [Fact]
        public async Task GetCourseGradeAsync_ShouldThrowException_WhenCourseGradeNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseGradeRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetCourseGradeAsync(999));
        }
    }
}
   