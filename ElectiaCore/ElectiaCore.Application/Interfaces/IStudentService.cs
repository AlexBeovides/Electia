using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities;

namespace ElectiaCore.Application.Interfaces
{
    public interface IStudentService
    {
        Task<Student> GetStudentAsync(string id);
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        Task AddStudentAsync(Student student);
        Task UpdateStudentAsync(Student student);
        Task DeleteStudentAsync(string id);

        Task<IEnumerable<StudentDto>> GetAllStudentsForCatalogAsync();
    }
}