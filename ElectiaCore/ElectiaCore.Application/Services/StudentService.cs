using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using ElectiaCore.Application.Helpers;

namespace ElectiaCore.Application.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;

        public StudentService(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        public async Task<Student> GetStudentAsync(string id)
        {
            return await _studentRepository.GetStudentAsync(id);
        }

        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            return await _studentRepository.GetAllStudentsAsync();
        }

        public async Task<IEnumerable<StudentDto>> GetAllStudentsForCatalogAsync()
        {
            var students = await _studentRepository.GetAllStudentsAsync();
             
            var studentDtos = students
                .Select(s => new StudentDto
                {
                    UserId = s.UserId,
                    FullName = s.FullName,
                    IDNumber = s.IDNumber,
                    PrimaryEmail = s.PrimaryEmail,
                    EveaUsername = s.EveaUsername,
                    PhoneNumber = s.PhoneNumber,

                    FacultyName = s.Faculty.Name,
                    MajorName = s.Major.Name,

                    SecondaryEmail = s.SecondaryEmail,

                     
                })
                .ToList();

            return studentDtos;
        }

      

        public async Task AddStudentAsync(Student student)
        {
            await _studentRepository.AddStudentAsync(student);
        }

        public async Task UpdateStudentAsync(Student student)
        {
            await _studentRepository.UpdateStudentAsync(student);
        }

        public async Task DeleteStudentAsync(string id)
        {
            await _studentRepository.DeleteStudentAsync(id);
        }
    }
}