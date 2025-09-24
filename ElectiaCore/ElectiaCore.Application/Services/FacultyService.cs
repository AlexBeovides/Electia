using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Services
{
    public class FacultyService : IFacultyService
    {
        private readonly IFacultyRepository _facultyRepository;

        public FacultyService(IFacultyRepository facultyRepository)
        {
            _facultyRepository = facultyRepository;
        }

        public async Task<Faculty> GetFacultyAsync(int id)
        {
            return await _facultyRepository.GetFacultyAsync(id);
        }

        public async Task<IEnumerable<Faculty>> GetAllFacultiesAsync()
        {
            return await _facultyRepository.GetAllFacultiesAsync();
        }

        public async Task AddFacultyAsync(Faculty faculty)
        {
            await _facultyRepository.AddFacultyAsync(faculty);
        }

        public async Task UpdateFacultyAsync(Faculty faculty)
        {
            await _facultyRepository.UpdateFacultyAsync(faculty);
        }

        public async Task DeleteFacultyAsync(int id)
        {
            await _facultyRepository.DeleteFacultyAsync(id);
        }
    }
}