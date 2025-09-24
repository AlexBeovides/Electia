using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class CenterRepositoryTests
    {
        [Fact]
        public async Task AddCenterAsync_ShouldAddCenter_WhenValidCenter()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CenterRepository(context);
            var center = new Center
            {
                Name = "New Test Center",
                IsDeleted = false
            };

            // Act
            await repository.AddCenterAsync(center);

            // Assert
            var savedCenter = await context.Centers.FirstOrDefaultAsync(c => c.Name == "New Test Center");
            Assert.NotNull(savedCenter);
            Assert.Equal("New Test Center", savedCenter.Name);
            Assert.False(savedCenter.IsDeleted);
        }

        [Fact]
        public async Task GetCenterAsync_ShouldReturnCenter_WhenCenterExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CenterRepository(context);

            // Act (using seeded data)
            var result = await repository.GetCenterAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Center 1", result.Name);
            Assert.False(result.IsDeleted);
        }

        [Fact]
        public async Task UpdateCenterAsync_ShouldUpdateCenter_WhenValidCenter()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CenterRepository(context);
            var center = await context.Centers.FindAsync(1);

            // Act
            center.Name = "Updated Center Name";
            await repository.UpdateCenterAsync(center);

            // Assert
            var updatedCenter = await context.Centers.FindAsync(1);
            Assert.Equal("Updated Center Name", updatedCenter.Name);
        }

        [Fact]
        public async Task DeleteCenterAsync_ShouldMarkAsDeleted_WhenCenterExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CenterRepository(context);

            // Act
            await repository.DeleteCenterAsync(1);

            // Assert
            var deletedCenter = await context.Centers.FindAsync(1);
            Assert.True(deletedCenter.IsDeleted);
        }

        [Fact]
        public async Task GetAllCentersAsync_ShouldReturnOnlyNonDeletedCenters()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CenterRepository(context);

            // Mark one center as deleted
            var centerToDelete = await context.Centers.FindAsync(2);
            centerToDelete.IsDeleted = true;
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllCentersAsync();

            // Assert
            Assert.Single(result);
            Assert.All(result, center => Assert.False(center.IsDeleted));
        }

        [Fact]
        public async Task GetCenterAsync_ShouldThrowException_WhenCenterNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new CenterRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetCenterAsync(999));
        }
    }
}
