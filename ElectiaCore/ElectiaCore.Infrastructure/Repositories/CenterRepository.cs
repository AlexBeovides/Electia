using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class CenterRepository : ICenterRepository
    {
        private readonly ElectiaDbContext _context;

        public CenterRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<Center> GetCenterAsync(int id)
        {
            var center = await _context.Centers.FirstOrDefaultAsync(p => p.Id == id);

            if (center == null)
            {
                throw new KeyNotFoundException("Center not found");
            }
            return center;
        }

        public async Task<IEnumerable<Center>> GetAllCentersAsync()
        {
            return await _context.Set<Center>()
                .Where(c => !c.IsDeleted)
                .ToListAsync();
        }

        public async Task AddCenterAsync(Center center)
        {
            await _context.Set<Center>().AddAsync(center);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCenterAsync(Center center)
        {
            _context.Set<Center>().Update(center);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCenterAsync(int id)
        {
            var center = await GetCenterAsync(id);
            center.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}