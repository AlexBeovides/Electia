using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class CourseApplicationRepository : ICourseApplicationRepository
    {
        private readonly ElectiaDbContext _context;

        public CourseApplicationRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<CourseApplication> GetCourseApplicationAsync(int id)
        {
            var courseApplication = await _context.CourseApplications.FirstOrDefaultAsync(p => p.Id == id);

            if (courseApplication == null)
            {
                throw new KeyNotFoundException("CourseApplication not found");
            }
            return courseApplication;
        }

        public async Task<IEnumerable<CourseApplication>> GetAllCourseApplicationsAsync()
        {
            return await _context.Set<CourseApplication>()
                .Where(c => !c.IsDeleted)
                .Include(a => a.Student)
                .ToListAsync();
        }

        public async Task AddCourseApplicationAsync(CourseApplication courseApplication)
        {
            await _context.Set<CourseApplication>().AddAsync(courseApplication);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCourseApplicationAsync(CourseApplication courseApplication)
        {
            _context.Set<CourseApplication>().Update(courseApplication);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCourseApplicationAsync(int id)
        {
            var courseApplication = await GetCourseApplicationAsync(id);
            courseApplication.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}