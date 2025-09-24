using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

using ElectiaCore.Domain.Entities;

namespace ElectiaCore.Domain.Interfaces
{
    public interface IMajorRepository
    {
        Task<Major> GetMajorAsync(int id);
        Task<IEnumerable<Major>> GetAllMajorsAsync();
        Task AddMajorAsync(Major major);
        Task UpdateMajorAsync(Major major);
        Task DeleteMajorAsync(int id);
    }
}