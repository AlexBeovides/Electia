using ElectiaCore.Domain.Entities;
using ElectiaCore.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ElectiaCore.Infrastructure.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly ElectiaDbContext _context;

        public StudentRepository(ElectiaDbContext context)
        {
            _context = context;
        }

        public async Task<Student> GetStudentAsync(string id)
        { 
            var student = await _context.Students
                .Include(s => s.Faculty)
                .Include(s => s.Major)
                .FirstOrDefaultAsync(p => p.UserId == id);

            if (student == null)
            {
                throw new KeyNotFoundException("Student not found");
            }
            return student;
        }


        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        { 
            return await _context.Students
                .Where(c => !c.IsDeleted)
                .Include(c => c.Faculty)
                .Include(c => c.Major) 
                .ToListAsync();
        }

        public async Task AddStudentAsync(Student student)
        {
            await _context.Set<Student>().AddAsync(student);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateStudentAsync(Student student)
        {
            _context.Set<Student>().Update(student);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStudentAsync(string id)
        {
            var student = await GetStudentAsync(id);
            student.IsDeleted = true; 
            await _context.SaveChangesAsync(); 
        }


    }
}