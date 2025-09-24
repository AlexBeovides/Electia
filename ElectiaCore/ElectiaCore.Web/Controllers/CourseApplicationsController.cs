using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.Services;
using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ElectiaCore.Web.Controllers
{
    [Route("api/[controller]")]
    public class CourseApplicationsController : Controller
    {
        private readonly ICourseApplicationService _courseApplicationService;

        public CourseApplicationsController(ICourseApplicationService courseApplicationService)
        {
            _courseApplicationService = courseApplicationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseApplication>>> GetCourseApplications()
        {
            return Ok(await _courseApplicationService.GetAllCourseApplicationsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseApplication>> GetCourseApplication(int id)
        {
            var courseApplication = await _courseApplicationService.GetCourseApplicationAsync(id);

            if (courseApplication == null)
            {
                return NotFound();
            }

            return courseApplication;
        }

        [Authorize(Roles = "Admin, Professor")]
        [HttpGet("ByCourse/{courseId}")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetCourseApplicationsByCourseId(int courseId)
        {
            return Ok(await _courseApplicationService.GetAllCourseApplicationsByCourseIdAsync(courseId));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourseApplication(int id, CourseApplication courseApplication)
        {
            if (id != courseApplication.Id)
            {
                return BadRequest();
            }

            await _courseApplicationService.UpdateCourseApplicationAsync(courseApplication);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<CourseApplication>> PostCourseApplication(CourseApplication courseApplication)
        {
            await _courseApplicationService.AddCourseApplicationAsync(courseApplication);

            return CreatedAtAction("GetCourseApplication", new { id = courseApplication.Id }, courseApplication);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourseApplication(int id)
        {
            await _courseApplicationService.DeleteCourseApplicationAsync(id);

            return NoContent();
        }

        [Authorize(Roles = "Student")]
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyToCourse([FromBody] CourseApplicationDto courseApplicationDto)
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(studentId))
            {
                return BadRequest("User identifier is missing");
            }

            Console.WriteLine(courseApplicationDto.AcademicYearId);

            try
            {
                await _courseApplicationService.ApplyToCourseAsync(studentId, courseApplicationDto);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Manejo genérico de errores
                return StatusCode(500, new { message = "An unexpected error occurred", details = ex.Message });
            }
        }

        [Authorize(Roles = "Student")]
        [HttpDelete("withdraw/{courseId}")]
        public async Task<IActionResult> WithdrawFromCourse(int courseId)
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(studentId))
            {
                return BadRequest("User identifier is missing");
            }

            try
            {
                await _courseApplicationService.WithdrawFromCourseAsync(studentId, courseId);
                return Ok(new { message = "Successfully withdrawed from the course" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred", details = ex.Message });
            }
        }

        [HttpGet("isApplicant")]
        [Authorize]
        public async Task<IActionResult> IsApplicant(int courseId)
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(studentId))
            {
                return BadRequest("User identifier is missing");
            }

            int applicationStatus = await _courseApplicationService.IsStudentApplicant(courseId, studentId);

            return Ok(new { applicationStatus });
        }
    }
}



