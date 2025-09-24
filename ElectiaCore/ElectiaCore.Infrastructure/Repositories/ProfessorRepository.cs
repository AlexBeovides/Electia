using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class ProfessorRepository : IProfessorRepository
    {
        private readonly ElectiaDbContext _context;

        public ProfessorRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<Professor> GetProfessorAsync(string id)
        {
            var professor = await _context.Professors.FirstOrDefaultAsync(p => p.UserId == id);

            if (professor == null)
            {
                throw new KeyNotFoundException("Professor not found");
            }
            return professor;
        }

        public async Task<IEnumerable<Professor>> GetAllProfessorsAsync()
        {
            return await _context.Set<Professor>().ToListAsync();
        }

        public async Task AddProfessorAsync(Professor professor)
        {
            await _context.Set<Professor>().AddAsync(professor);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProfessorAsync(Professor professor)
        {
            _context.Set<Professor>().Update(professor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProfessorAsync(string id)
        {
            var professor = await GetProfessorAsync(id);
            professor.IsDeleted = true; 
            await _context.SaveChangesAsync(); 
        }
    }
}