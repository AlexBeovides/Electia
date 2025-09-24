using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Interfaces
{
    public interface IAdminEmailService
    {
        Task<AdminEmail> GetAdminEmailAsync(int id);
        Task<IEnumerable<AdminEmail>> GetAllAdminEmailsAsync();
        Task AddAdminEmailAsync(AdminEmail adminEmail);
        Task UpdateAdminEmailAsync(AdminEmail adminEmail);
        Task DeleteAdminEmailAsync(int id);
    }
}
