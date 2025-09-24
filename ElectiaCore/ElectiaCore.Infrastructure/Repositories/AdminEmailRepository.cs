using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class AdminEmailRepository : IAdminEmailRepository
    {
        private readonly ElectiaDbContext _context;

        public AdminEmailRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<AdminEmail> GetAdminEmailAsync(int id)
        {
            var adminEmail = await _context.AdminEmails.FirstOrDefaultAsync(p => p.Id == id);

            if (adminEmail == null)
            {
                throw new KeyNotFoundException("Admin email not found");
            }
            return adminEmail;
        }

        public async Task<IEnumerable<AdminEmail>> GetAllAdminEmailsAsync()
        {
            return await _context.Set<AdminEmail>()
                .Where(ae => !ae.IsDeleted)
                .ToListAsync();
        }

        public async Task AddAdminEmailAsync(AdminEmail adminEmail)
        {
            await _context.Set<AdminEmail>().AddAsync(adminEmail);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAdminEmailAsync(AdminEmail adminEmail)
        {
            _context.Set<AdminEmail>().Update(adminEmail);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAdminEmailAsync(int id)
        {
            var adminEmail = await GetAdminEmailAsync(id);
            adminEmail.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}
