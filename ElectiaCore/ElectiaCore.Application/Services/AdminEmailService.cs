using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Services
{
    public class AdminEmailService : IAdminEmailService
    {
        private readonly IAdminEmailRepository _adminEmailRepository;

        public AdminEmailService(IAdminEmailRepository adminEmailRepository)
        {
            _adminEmailRepository = adminEmailRepository;
        }

        public async Task<AdminEmail> GetAdminEmailAsync(int id)
        {
            return await _adminEmailRepository.GetAdminEmailAsync(id);
        }

        public async Task<IEnumerable<AdminEmail>> GetAllAdminEmailsAsync()
        {
            return await _adminEmailRepository.GetAllAdminEmailsAsync();
        }

        public async Task AddAdminEmailAsync(AdminEmail adminEmail)
        {
            await _adminEmailRepository.AddAdminEmailAsync(adminEmail);
        }

        public async Task UpdateAdminEmailAsync(AdminEmail adminEmail)
        {
            await _adminEmailRepository.UpdateAdminEmailAsync(adminEmail);
        }

        public async Task DeleteAdminEmailAsync(int id)
        {
            await _adminEmailRepository.DeleteAdminEmailAsync(id);
        }
    }
}
