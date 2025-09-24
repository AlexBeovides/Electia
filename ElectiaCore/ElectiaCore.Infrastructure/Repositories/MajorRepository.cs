using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class MajorRepository : IMajorRepository
    {
        private readonly ElectiaDbContext _context;

        public MajorRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<Major> GetMajorAsync(int id)
        {
            var major = await _context.Majors.FirstOrDefaultAsync(p => p.Id == id);

            if (major == null)
            {
                throw new KeyNotFoundException("Major not found");
            }
            return major;
        }

        public async Task<IEnumerable<Major>> GetAllMajorsAsync()
        {
            return await _context.Set<Major>()
                .Where(c => !c.IsDeleted)
                .ToListAsync();
        }

        public async Task AddMajorAsync(Major major)
        {
            await _context.Set<Major>().AddAsync(major);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateMajorAsync(Major major)
        {
            _context.Set<Major>().Update(major);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMajorAsync(int id)
        {
            var major = await GetMajorAsync(id);
            major.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}