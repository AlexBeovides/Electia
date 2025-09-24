using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Interfaces
{
    public interface ICenterService
    {
        Task<Center> GetCenterAsync(int id);
        Task<IEnumerable<Center>> GetAllCentersAsync();
        Task AddCenterAsync(Center center);
        Task UpdateCenterAsync(Center center);
        Task DeleteCenterAsync(int id);
    }
}