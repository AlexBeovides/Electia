using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class CourseGradeRepository : ICourseGradeRepository
    {
        private readonly ElectiaDbContext _context;

        public CourseGradeRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<CourseGrade> GetCourseGradeAsync(int courseGradeId)
        { 
            var courseGrade = await _context.CourseGrades.FirstOrDefaultAsync(cg => cg.Id == courseGradeId);

            if (courseGrade == null)
            {
                throw new KeyNotFoundException("Course Grade not found");
    }
            return courseGrade;
        }
         
        public async Task<IEnumerable<CourseGrade>> GetAllCourseGradesAsync()
        {
            return await _context.CourseGrades
                .Where(c => !c.IsDeleted)
                .Include(g => g.Student)
                    .ThenInclude(s => s.Faculty)
                .Include(g => g.Student)
                    .ThenInclude(s => s.Major)
                .ToListAsync();
        }

        public async Task AddCourseGradeAsync(CourseGrade courseGrade)
        {
            await _context.CourseGrades.AddAsync(courseGrade);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCourseGradeAsync(CourseGrade courseGrade)
        {
            _context.CourseGrades.Update(courseGrade);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCourseGradeAsync(int courseGradeId)
        {
            var courseGrade = await GetCourseGradeAsync(courseGradeId);
            if (courseGrade != null)
            {
                courseGrade.IsDeleted = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}