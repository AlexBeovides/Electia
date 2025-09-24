using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class CourseInstanceRepository : ICourseInstanceRepository
    {
        private readonly ElectiaDbContext _context;

        public CourseInstanceRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<CourseInstance> GetCourseInstanceAsync(int id)
        {
            var courseInstance = await _context.CourseInstances
                .Include(c => c.Course)
                    .ThenInclude(course => course.MainProfessor)
                .Include(c => c.Course.Center) 
                .FirstOrDefaultAsync(p => p.Id == id);

            if (courseInstance == null)
            {
                throw new KeyNotFoundException("CourseInstance not found");
            }
            return courseInstance;
        }

        public async Task<IEnumerable<CourseInstance>> GetAllCourseInstancesAsync()
        {
            return await _context.Set<CourseInstance>()
                .Where(c => !c.IsDeleted)
                .Include(c => c.Course)
                    .ThenInclude(course => course.MainProfessor)
                .Include(c => c.Course.Center) 
                .ToListAsync();
        }

        public async Task AddCourseInstanceAsync(CourseInstance courseInstance)
        {
            await _context.Set<CourseInstance>().AddAsync(courseInstance);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCourseInstanceAsync(CourseInstance courseInstance)
        {
            _context.Set<CourseInstance>().Update(courseInstance);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCourseInstanceAsync(int id)
        {
            var courseInstance = await GetCourseInstanceAsync(id);
            courseInstance.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}