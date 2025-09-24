using Xunit;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Tests.RepositoryTests
{
    public class RuleRepositoryTests
    {
        [Fact]
        public async Task AddRuleAsync_ShouldAddRule_WhenValidRule()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new RuleRepository(context);
            var rule = new Rule
            {
                CourseInstanceId = 1,
                MajorId = 1,
                AcademicYear = AcademicYear.Third,
                Priority = 1,
                IsDeleted = false
            };

            // Act
            await repository.AddRuleAsync(rule);

            // Assert
            var savedRule = await context.Rules.FirstOrDefaultAsync(r => r.CourseInstanceId == 1 && r.MajorId == 1);
            Assert.NotNull(savedRule);
            Assert.Equal(1, savedRule.CourseInstanceId);
            Assert.Equal(1, savedRule.MajorId);
            Assert.Equal(AcademicYear.Third, savedRule.AcademicYear);
            Assert.Equal(1, savedRule.Priority);
            Assert.False(savedRule.IsDeleted);
        }

        [Fact]
        public async Task GetRuleAsync_ShouldReturnRule_WhenRuleExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new RuleRepository(context);
            var rule = new Rule
            {
                Id = 1,
                CourseInstanceId = 1,
                MajorId = 1,
                AcademicYear = AcademicYear.Second,
                Priority = 2,
                IsDeleted = false
            };
            context.Rules.Add(rule);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetRuleAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.CourseInstanceId);
            Assert.Equal(1, result.MajorId);
            Assert.Equal(AcademicYear.Second, result.AcademicYear);
            Assert.Equal(2, result.Priority);
        }

        [Fact]
        public async Task UpdateRuleAsync_ShouldUpdateRule_WhenValidRule()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new RuleRepository(context);
            var rule = new Rule
            {
                Id = 1,
                CourseInstanceId = 1,
                MajorId = 1,
                AcademicYear = AcademicYear.First,
                Priority = 1,
                IsDeleted = false
            };
            context.Rules.Add(rule);
            await context.SaveChangesAsync();

            // Act
            rule.AcademicYear = AcademicYear.Fourth;
            rule.Priority = 5;
            await repository.UpdateRuleAsync(rule);

            // Assert
            var updatedRule = await context.Rules.FindAsync(1);
            Assert.Equal(AcademicYear.Fourth, updatedRule.AcademicYear);
            Assert.Equal(5, updatedRule.Priority);
        }

        [Fact]
        public async Task DeleteRuleAsync_ShouldMarkAsDeleted_WhenRuleExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new RuleRepository(context);
            var rule = new Rule
            {
                Id = 1,
                CourseInstanceId = 1,
                MajorId = 1,
                AcademicYear = AcademicYear.Third,
                Priority = 1,
                IsDeleted = false
            };
            context.Rules.Add(rule);
            await context.SaveChangesAsync();

            // Act
            await repository.DeleteRuleAsync(1);

            // Assert
            var deletedRule = await context.Rules.FindAsync(1);
            Assert.True(deletedRule.IsDeleted);
        }

        [Fact]
        public async Task GetAllRulesAsync_ShouldReturnOnlyNonDeletedRules()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new RuleRepository(context);
            
            var rule1 = new Rule
            {
                CourseInstanceId = 1,
                MajorId = 1,
                AcademicYear = AcademicYear.First,
                Priority = 1,
                IsDeleted = false
            };
            
            var rule2 = new Rule
            {
                CourseInstanceId = 2,
                MajorId = 2,
                AcademicYear = AcademicYear.Second,
                Priority = 2,
                IsDeleted = true
            };

            context.Rules.AddRange(rule1, rule2);
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetAllRulesAsync();

            // Assert
            Assert.Single(result);
            Assert.All(result, rule => Assert.False(rule.IsDeleted));
        }        [Fact]
        public async Task GetRuleAsync_ShouldThrowException_WhenRuleNotExists()
        {
            // Arrange
            using var context = TestDbContextHelper.CreateInMemoryContext();
            var repository = new RuleRepository(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.GetRuleAsync(999));
        }
    }
}
    
