using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Services
{
    public class CenterService : ICenterService
    {
        private readonly ICenterRepository _centerRepository;

        public CenterService(ICenterRepository centerRepository)
        {
            _centerRepository = centerRepository;
        }

        public async Task<Center> GetCenterAsync(int id)
        {
            return await _centerRepository.GetCenterAsync(id);
        }

        public async Task<IEnumerable<Center>> GetAllCentersAsync()
        {
            return await _centerRepository.GetAllCentersAsync();
        }

        public async Task AddCenterAsync(Center center)
        {
            await _centerRepository.AddCenterAsync(center);
        }

        public async Task UpdateCenterAsync(Center center)
        {
            await _centerRepository.UpdateCenterAsync(center);
        }

        public async Task DeleteCenterAsync(int id)
        {
            await _centerRepository.DeleteCenterAsync(id);
        }
    }
}