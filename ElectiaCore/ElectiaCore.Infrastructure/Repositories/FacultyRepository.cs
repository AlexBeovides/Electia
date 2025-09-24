using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class FacultyRepository : IFacultyRepository
    {
        private readonly ElectiaDbContext _context;

        public FacultyRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<Faculty> GetFacultyAsync(int id)
        {
            var faculty = await _context.Faculties.FirstOrDefaultAsync(p => p.Id == id);

            if (faculty == null)
            {
                throw new KeyNotFoundException("Faculty not found");
            }
            return faculty;
        }

        public async Task<IEnumerable<Faculty>> GetAllFacultiesAsync()
        {
            return await _context.Set<Faculty>()
                .Where(f => !f.IsDeleted)
                .ToListAsync();
        }

        public async Task AddFacultyAsync(Faculty faculty)
        {
            await _context.Set<Faculty>().AddAsync(faculty);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateFacultyAsync(Faculty faculty)
        {
            _context.Set<Faculty>().Update(faculty);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFacultyAsync(int id)
        {
            var faculty = await GetFacultyAsync(id);
            faculty.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}