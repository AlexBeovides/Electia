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
    public class AdminEmailsController : ControllerBase
    {
        private readonly IAdminEmailService _adminEmailService;

        public AdminEmailsController(IAdminEmailService adminEmailService)
        {
            _adminEmailService = adminEmailService;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminEmail>>> GetAdminEmails()
        {
            return Ok(await _adminEmailService.GetAllAdminEmailsAsync());
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminEmail>> GetAdminEmail(int id)
        {
            var adminEmail = await _adminEmailService.GetAdminEmailAsync(id);

            if (adminEmail == null)
            {
                return NotFound();
            }

            return adminEmail;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdminEmail(int id, AdminEmail adminEmail)
        {
            if (id != adminEmail.Id)
            {
                return BadRequest();
            }

            await _adminEmailService.UpdateAdminEmailAsync(adminEmail);

            return NoContent();
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<ActionResult<AdminEmail>> PostAdminEmail(AdminEmail adminEmail)
        {
            await _adminEmailService.AddAdminEmailAsync(adminEmail);

            return CreatedAtAction("GetAdminEmail", new { id = adminEmail.Id }, adminEmail);
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdminEmail(int id)
        {
            await _adminEmailService.DeleteAdminEmailAsync(id);

            return NoContent();
        }
    }
}
