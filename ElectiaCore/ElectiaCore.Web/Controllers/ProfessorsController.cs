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
    public class ProfessorsController : ControllerBase
    {
        private readonly IProfessorService _professorService;

        public ProfessorsController(IProfessorService professorService)
        {
            _professorService = professorService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Professor>>> GetProfessors()
        {
            return Ok(await _professorService.GetAllProfessorsAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("ForCatalog")]
        public async Task<ActionResult<IEnumerable<ProfessorDto>>> GetProfessorsForCatalog()
        {
            return Ok(await _professorService.GetAllProfessorsForCatalogAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Professor>> GetProfessor(string id)
        {
            var professor = await _professorService.GetProfessorAsync(id);

            if (professor == null)
            {
                return NotFound();
            }

            return professor;
        }

        [Authorize(Roles = "Professor")]
        [HttpGet("ForForm")]
        public async Task<ActionResult<IEnumerable<Professor>>> GetProfessorForForm()
        {
            var professorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(professorId))
            {
                return BadRequest("User identifier is missing");
            }

            return Ok(await _professorService.GetProfessorForFormAsync(professorId));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProfessor(string id, Professor professor)
        {
            if (id != professor.UserId)
            {
                return BadRequest();
            }

            await _professorService.UpdateProfessorAsync(professor);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Professor>> PostProfessor(Professor professor)
        {
            await _professorService.AddProfessorAsync(professor);

            return CreatedAtAction("GetProfessor", new { id = professor.UserId }, professor);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfessor(string id)
        {
            await _professorService.DeleteProfessorAsync(id);

            return NoContent();
        }

        // Expose TeacherCategory enum
        [HttpGet("teacher-categories")]
        public IActionResult GetTeacherCategories()
        {
            var teacherCategories = Enum.GetValues(typeof(TeacherCategory))
                                .Cast<TeacherCategory>()
                                .Select(e => new
                                {
                                    id = (int)e,
                                    name = EnumHelper.GetEnumDisplayName(e)
                                });
            return Ok(teacherCategories);
        }        // Expose AcademicDegree enum
        [HttpGet("academic-degrees")]
        public IActionResult GetAcademicDegrees()
        {
            var academicDegrees = Enum.GetValues(typeof(AcademicDegree))
                                .Cast<AcademicDegree>()
                                .Select(e => new
                                {
                                    id = (int)e,
                                    name = EnumHelper.GetEnumDisplayName(e)
                                });
            return Ok(academicDegrees);
        }

        // GET: api/Professors/stats
        [Authorize(Roles = "Professor")]
        [HttpGet("stats")]
        public async Task<ActionResult<ProfessorStatsDto>> GetProfessorStats()
        {
            var professorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(professorId))
            {
                return BadRequest("User identifier is missing");
            }

            var stats = await _professorService.GetProfessorStatsAsync(professorId);
            return Ok(stats);
        }

        
    }
}

    