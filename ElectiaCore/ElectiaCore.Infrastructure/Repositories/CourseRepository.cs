using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly ElectiaDbContext _context;

        public CourseRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<Course> GetCourseAsync(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Center)
                .Include(c => c.MainProfessor)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (course == null)
            {
                throw new KeyNotFoundException("Course not found");
            }
            return course;
        }

        public async Task<IEnumerable<Course>> GetAllCoursesAsync()
        {
            return await _context.Courses
                .Where(c => !c.IsDeleted)
                .Include(c => c.Center)
                .Include(c => c.MainProfessor)
                .ToListAsync();
        }
  
        public async Task AddCourseAsync(Course course)
        {
            await _context.Set<Course>().AddAsync(course);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCourseAsync(Course course)
        {
            _context.Set<Course>().Update(course);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCourseAsync(int id)
        {
            var course = await GetCourseAsync(id);
            course.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}