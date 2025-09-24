using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities;

namespace ElectiaCore.Application.Interfaces
{
    public interface IProfessorService
    {
        Task<Professor> GetProfessorAsync(string id);
        Task<IEnumerable<Professor>> GetAllProfessorsAsync();
        Task AddProfessorAsync(Professor professor);
        Task UpdateProfessorAsync(Professor professor);
        Task DeleteProfessorAsync(string id);        
        Task<IEnumerable<Professor>> GetProfessorForFormAsync(string professorId);
        Task<IEnumerable<ProfessorDto>> GetAllProfessorsForCatalogAsync();
        Task<ProfessorStatsDto> GetProfessorStatsAsync(string professorId);
    }
}
