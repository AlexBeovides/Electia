using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElectiaCore.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MajorsController : ControllerBase
    {
        private readonly IMajorService _majorService;

        public MajorsController(IMajorService majorService)
        {
            _majorService = majorService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Major>>> GetMajors()
        {
            return Ok(await _majorService.GetAllMajorsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Major>> GetMajor(int id)
        {
            var major = await _majorService.GetMajorAsync(id);

            if (major == null)
            {
                return NotFound();
            }

            return major;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMajor(int id, Major major)
        {
            if (id != major.Id)
            {
                return BadRequest();
            }

            await _majorService.UpdateMajorAsync(major);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Major>> PostMajor(Major major)
        {
            await _majorService.AddMajorAsync(major);

            return CreatedAtAction("GetMajor", new { id = major.Id }, major);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMajor(int id)
        {
            await _majorService.DeleteMajorAsync(id);

            return NoContent();
        }
    }
}