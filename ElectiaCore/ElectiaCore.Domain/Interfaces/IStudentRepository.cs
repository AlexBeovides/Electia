using ElectiaCore.Domain.Entities;

namespace ElectiaCore.Domain.Interfaces
{
    public interface IStudentRepository
    {
        Task<Student> GetStudentAsync(string id);
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        Task AddStudentAsync(Student student);
        Task UpdateStudentAsync(Student student);
        Task DeleteStudentAsync(string id);
    }
}