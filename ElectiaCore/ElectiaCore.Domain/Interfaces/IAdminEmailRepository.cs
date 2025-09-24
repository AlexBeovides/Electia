using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Interfaces
{
    public interface IAdminEmailRepository
    {
        Task<AdminEmail> GetAdminEmailAsync(int id);
        Task<IEnumerable<AdminEmail>> GetAllAdminEmailsAsync();
        Task AddAdminEmailAsync(AdminEmail adminEmail);
        Task UpdateAdminEmailAsync(AdminEmail adminEmail);
        Task DeleteAdminEmailAsync(int id);
    }
}
