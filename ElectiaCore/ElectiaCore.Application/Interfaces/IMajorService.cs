using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Interfaces
{
    public interface IMajorService
    {
        Task<Major> GetMajorAsync(int id);
        Task<IEnumerable<Major>> GetAllMajorsAsync();
        Task AddMajorAsync(Major major);
        Task UpdateMajorAsync(Major major);
        Task DeleteMajorAsync(int id);
    }
}