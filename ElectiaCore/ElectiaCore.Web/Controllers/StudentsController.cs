using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Helpers;
using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ElectiaCore.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return Ok(await _studentService.GetAllStudentsAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("ForCatalog")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentsForCatalog()
        {
            return Ok(await _studentService.GetAllStudentsForCatalogAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(string id)
        {
            var student = await _studentService.GetStudentAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(string id, Student student)
        {
            if (id != student.UserId)
            {
                return BadRequest();
            }

            await _studentService.UpdateStudentAsync(student);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student student)
        {
            await _studentService.AddStudentAsync(student);

            return CreatedAtAction("GetStudent", new { id = student.UserId }, student);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            await _studentService.DeleteStudentAsync(id);

            return NoContent();
        }

        // Expose AcademicYears enum
        [HttpGet("academic-years")]
        public IActionResult GetAcademicYears()
        {
            var academicYears = Enum.GetValues(typeof(AcademicYear))
                                .Cast<AcademicYear>()
                                .Select(e => new
                                {
                                    id = (int)e,
                                    name = EnumHelper.GetEnumDisplayName(e)
                                });
            return Ok(academicYears);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("MyDetails")]
        public async Task<ActionResult<Student>> GetMyDetails()
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(studentId))
            {
                return BadRequest("User identifier is missing");
            }

            var student = await _studentService.GetStudentAsync(studentId);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }
    }
}