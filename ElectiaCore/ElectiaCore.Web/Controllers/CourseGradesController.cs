using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using ElectiaCore.Application.Services;
using System.Text.Json; 
using OfficeOpenXml; 

namespace ElectiaCore.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseGradesController : ControllerBase
    {
        private readonly ICourseGradeService _courseGradeService;

        public CourseGradesController(ICourseGradeService courseGradeService)
        {
            _courseGradeService = courseGradeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseGrade>>> GetCourseGrades()
        {
            return Ok(await _courseGradeService.GetAllCourseGradesAsync());
        }
         
        [HttpGet("ByCourse/{courseId}")]
        public async Task<ActionResult<IEnumerable<CourseRosterDto>>> GetCourseGradesByCourseId(int courseId)
        {
            return Ok(await _courseGradeService.GetAllCourseGradesByCourseIdAsync(courseId));
        }

        [HttpGet("{courseGradeId}")]
        public async Task<ActionResult<CourseGrade>> GetCourseGrade(int courseGradeId)
        {
            var courseGrade = await _courseGradeService.GetCourseGradeAsync(courseGradeId);

            if (courseGrade == null)
            {
                return NotFound();
            }

            return courseGrade;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<CourseGrade>> PostCourseGrade(CourseGrade courseGrade)
        {
            await _courseGradeService.AddCourseGradeAsync(courseGrade);

            return CreatedAtAction("GetCourseGrade", new { courseId = courseGrade.CourseId, studentId = courseGrade.StudentId }, courseGrade);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{courseGradeId}")]
        public async Task<IActionResult> PutCourseGrade(int courseGradeId, CourseGrade courseGrade)
        {
            if (courseGradeId != courseGrade.Id)
            {
                return BadRequest();
            }

            await _courseGradeService.UpdateCourseGradeAsync(courseGrade);

            return NoContent();
        }

        [Authorize(Roles = "Professor")]
        [HttpPut("ByProfessor/{courseGradeId}")]
        public async Task<IActionResult> PutCourseGradeByProfessor(int courseGradeId, [FromBody] EditGradeDto editGradeDto)
        {
            if (courseGradeId != editGradeDto.Id)
            {
                return BadRequest();
            }

            await _courseGradeService.UpdateCourseGradeByProfessorAsync(editGradeDto);

            return NoContent();
        }

        [Authorize(Roles = "Admin, Professor")]
        [HttpDelete("{courseGradeId}")]
        public async Task<IActionResult> DeleteCourseGrade(int courseGradeId)
        {
            await _courseGradeService.DeleteCourseGradeAsync(courseGradeId);

            return NoContent();
        }

        [Authorize(Roles = "Admin, Professor")]
        [HttpPost("enroll")]
        public async Task<ActionResult> EnrollStudent([FromBody] EnrollmentRequestDto request)
        {
            await _courseGradeService.EnrollStudentAsync(request.CourseId, request.StudentId);
            return Ok(new { message = "Estudiante inscrito exitosamente." });
        }

        [HttpPost("generate-enrollment/{courseInstanceId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GenerateEnrollment(int courseInstanceId)
        {
            try
            {
                await _courseGradeService.GenerateEnrollmentAsync(courseInstanceId);
                return Ok(new { message = "Matrícula generada exitosamente" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error interno del servidor" });
            }
        }


    }
}