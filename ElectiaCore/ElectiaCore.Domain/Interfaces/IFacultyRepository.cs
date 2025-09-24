using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Interfaces
{
    public interface IFacultyRepository
    {
        Task<Faculty> GetFacultyAsync(int id);
        Task<IEnumerable<Faculty>> GetAllFacultiesAsync();
        Task AddFacultyAsync(Faculty faculty);
        Task UpdateFacultyAsync(Faculty faculty);
        Task DeleteFacultyAsync(int id);
    }
}