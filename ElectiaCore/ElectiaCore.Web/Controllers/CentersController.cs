using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CentersController : ControllerBase
    {
        private readonly ICenterService _centerService;

        public CentersController(ICenterService centerService)
        {
            _centerService = centerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Center>>> GetCenters()
        {
            return Ok(await _centerService.GetAllCentersAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Center>> GetCenter(int id)
        {
            var center = await _centerService.GetCenterAsync(id);

            if (center == null)
            {
                return NotFound();
            }

            return center;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCenter(int id, Center center)
        {
            if (id != center.Id)
            {
                return BadRequest();
            }

            await _centerService.UpdateCenterAsync(center);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Center>> PostCenter(Center center)
        {
            await _centerService.AddCenterAsync(center);

            return CreatedAtAction("GetCenter", new { id = center.Id }, center);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCenter(int id)
        {
            await _centerService.DeleteCenterAsync(id);

            return NoContent();
        }
    }
}