using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Services
{
    public class MajorService : IMajorService
    {
        private readonly IMajorRepository _majorRepository;

        public MajorService(IMajorRepository majorRepository)
        {
            _majorRepository = majorRepository;
        }

        public async Task<Major> GetMajorAsync(int id)
        {
            return await _majorRepository.GetMajorAsync(id);
        }

        public async Task<IEnumerable<Major>> GetAllMajorsAsync()
        {
            return await _majorRepository.GetAllMajorsAsync();
        }

        public async Task AddMajorAsync(Major major)
        {
            await _majorRepository.AddMajorAsync(major);
        }

        public async Task UpdateMajorAsync(Major major)
        {
            await _majorRepository.UpdateMajorAsync(major);
        }

        public async Task DeleteMajorAsync(int id)
        {
            await _majorRepository.DeleteMajorAsync(id);
        }
    }
}