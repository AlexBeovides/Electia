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
    public class CourseInstancesController : Controller
    {
        private readonly ICourseInstanceService _courseInstanceService;

        public CourseInstancesController(ICourseInstanceService courseInstanceService)
        {
            _courseInstanceService = courseInstanceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseInstance>>> GetCourseInstances()
        {
            return Ok(await _courseInstanceService.GetAllCourseInstancesAsync());
        }
         
        [HttpGet("ForCatalog")]
        public async Task<ActionResult<IEnumerable<CoursesCatalogDto>>> GetCourseInstancesForCatalog()
        {
            // devuelve todos los courseInstances q no hayan terminado de impartirse

            return Ok(await _courseInstanceService.GetAllCourseInstancesForCatalogAsync());
        }

        [HttpGet("ForCatalog/FromStudent")]
        public async Task<ActionResult<IEnumerable<CoursesCatalogDto>>> GetCourseInstancesForCatalogFromStudent()
        {
            // devuelve todos los courseInstances q no hayan terminado de impartirse

            return Ok(await _courseInstanceService.GetAllCourseInstancesForCatalogFromStudentAsync());
        }

        [Authorize(Roles = "Professor")]
        [HttpGet("ForCatalog/FromProfessor")]
        public async Task<ActionResult<IEnumerable<CoursesCatalogDto>>> GetCourseInstancesForCatalogFromProfessor()
        {
            var professorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(professorId))
            {
                return BadRequest("User identifier is missing");
            }

            return Ok(await _courseInstanceService.GetAllCourseInstancesForCatalogFromProfessorAsync(professorId));
        }

        [Authorize(Roles = "Student")]
        [HttpGet("ForCatalog/Enrolled")]
        public async Task<ActionResult<IEnumerable<CoursesCatalogDto>>> GetCourseInstancesEnrolledForCatalog()
        {
            // devuelve los courseInstances en los q esta inscrito un estudiante dado
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(studentId))
            {
                return BadRequest("User identifier is missing");
            }

            return Ok(await _courseInstanceService.GetAllCourseInstancesEnrolledForCatalogAsync(studentId));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseInstance>> GetCourseInstance(int id)
        {
            var courseInstance = await _courseInstanceService.GetCourseInstanceAsync(id);

            if (courseInstance == null)
            {
                return NotFound();
            }

            return courseInstance;
        }

        // GET: api/Courses/ForCatalog/5
        [HttpGet("ForCatalog/{id}")]
        public async Task<ActionResult<CoursesCatalogDto>> GetCourseInstanceForCatalog(int id)
        {
            var course = await _courseInstanceService.GetCourseInstanceForCatalogAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return course;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourseInstance(int id, [FromBody] CourseInstance courseInstance)
        {
            if (id != courseInstance.Id)
            {
                return BadRequest();
            }

            await _courseInstanceService.UpdateCourseInstanceAsync(courseInstance);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<CourseInstance>> PostCourseInstance([FromBody] CourseInstance courseInstance)
        {
            await _courseInstanceService.AddCourseInstanceAsync(courseInstance);
            return CreatedAtAction("GetCourseInstance", new { id = courseInstance.Id }, courseInstance);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourseInstance(int id)
        {
            await _courseInstanceService.DeleteCourseInstanceAsync(id);

            return NoContent();
        }
    }
}

 