using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Interfaces
{
    public interface ICenterRepository
    {
        Task<Center> GetCenterAsync(int id);
        Task<IEnumerable<Center>> GetAllCentersAsync();
        Task AddCenterAsync(Center center);
        Task UpdateCenterAsync(Center center);
        Task DeleteCenterAsync(int id);
    }
}