using ElectiaCore.Domain.Entities;

namespace ElectiaCore.Domain.Interfaces
{
    public interface IProfessorRepository
    {
        Task<Professor> GetProfessorAsync(string id);
        Task<IEnumerable<Professor>> GetAllProfessorsAsync();
        Task AddProfessorAsync(Professor professor);
        Task UpdateProfessorAsync(Professor professor);
        Task DeleteProfessorAsync(string id);
    }
}