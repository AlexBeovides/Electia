using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class CourseRepositoryTests
    {
        [Fact]
        public async Task AddCourseAsync_ShouldAddCourse_WhenValidCourse()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseRepository(context);
            var course = CreateTestCourse();

            // Act
            await repository.AddCourseAsync(course);

            // Assert
            var savedCourse = await context.Courses.FirstOrDefaultAsync(c => c.Title == "Test Course");
            Assert.NotNull(savedCourse);
            Assert.Equal("Test Course", savedCourse.Title);
            Assert.False(savedCourse.IsDeleted);
        }        [Fact]
        public async Task GetCourseAsync_ShouldReturnCourse_WhenCourseExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseRepository(context);

            // Act (using seeded data with Id=1)
            var result = await repository.GetCourseAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Course", result.Title);
            Assert.NotNull(result.Center);
            Assert.NotNull(result.MainProfessor);
        }[Fact]
        public async Task UpdateCourseAsync_ShouldUpdateCourse_WhenValidCourse()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseRepository(context);
            
            // Get the seeded course
            var course = await context.Courses.FindAsync(1);

            // Act
            course.Title = "Updated Title";
            await repository.UpdateCourseAsync(course);

            // Assert
            var updatedCourse = await context.Courses.FindAsync(1);
            Assert.Equal("Updated Title", updatedCourse.Title);
        }[Fact]
        public async Task DeleteCourseAsync_ShouldMarkAsDeleted_WhenCourseExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseRepository(context);

            // Act (using seeded course with Id=1)
            await repository.DeleteCourseAsync(1);

            // Assert
            var deletedCourse = await context.Courses.FindAsync(1);
            Assert.True(deletedCourse.IsDeleted);
        }        [Fact]
        public async Task GetAllCoursesAsync_ShouldReturnOnlyNonDeletedCourses()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseRepository(context);

            // Add one more course and mark it as deleted
            var deletedCourse = CreateTestCourse(title: "Deleted Course", centerId: 2, professorId: "test-prof-id-2");
            deletedCourse.IsDeleted = true;
            context.Courses.Add(deletedCourse);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllCoursesAsync();

            // Assert
            Assert.Single(result); // Should only return the active course from helper (not the deleted one)
            Assert.Equal("Test Course", result.First().Title); // The seeded course
            Assert.All(result, course => Assert.False(course.IsDeleted));
        }

        [Fact]
        public async Task GetCourseAsync_ShouldThrowException_WhenCourseNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetCourseAsync(999));
        }        [Fact]
        public async Task GetAllCoursesAsync_ShouldIncludeRelatedEntities()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CourseRepository(context);

            // Act (using seeded course from helper)
            var result = await repository.GetAllCoursesAsync();

            // Assert
            Assert.Single(result); // Should return the seeded course
            var retrievedCourse = result.First();
            Assert.NotNull(retrievedCourse.Center);
            Assert.NotNull(retrievedCourse.MainProfessor);
            Assert.Equal("Test Center 1", retrievedCourse.Center.Name);
            Assert.Equal("Test Professor", retrievedCourse.MainProfessor.FullName);
        }

        private static Course CreateTestCourse(int? id = null, string title = "Test Course", int centerId = 1, string professorId = "test-prof-id")
        {
            var course = new Course
            {
                Title = title,
                CourseJustification = "Test Justification",
                GeneralObjective = "Test Objective",
                SpecificObjectives = "Test Specific",
                CourseSyllabus = "Test Syllabus",
                BasicBibliography = "Test Bibliography",
                ComplementaryBibliography = "Test Complementary",
                EvaluationSystem = "Test Evaluation",
                ModalityJustification = "Test Modality",
                BasicRequirements = "Test Requirements",
                MeetingPlace = "Test Place",
                EnrollmentCapacity = 30,
                CenterId = centerId,
                MainProfessorId = professorId,
                Modality = CourseModality.Virtual,
                StrategicAxes = StrategicAxis.HumanPotential,
                StrategicSectors = StrategicSector.Telecommunications,
                ImgUrl = "test-img-url",
                IsDeleted = false
            };

            if (id.HasValue)
            {
                course.Id = id.Value;
            }

            return course;
        }
    }
}