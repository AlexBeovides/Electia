using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.Services;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens; 
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ElectiaCore.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly ElectiaDbContext _context;
        private readonly IAccountService _accountService;

        public AccountController(ElectiaDbContext context, IAccountService accountService,
            UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _context = context;
            _accountService = accountService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var loginResult = await _accountService.Login(loginDto);

            if (loginResult != null)
            {
                return Ok(new
                {
                    Token = loginResult.Token,
                    Role = loginResult.Role
                });
            }

            return Unauthorized();
        }

        [HttpPost("register-professor")]
        public async Task<IActionResult> RegisterProfessor([FromForm] RegisterProfessorDto registerProfessorDto)
        {
            var result = await _accountService.RegisterProfessor(registerProfessorDto);

            if (result.Succeeded)
            {
                return Ok();
            }

            var errors = result.Errors.Select(x => x.Description);
            return BadRequest(errors);
        }

        [HttpPost("register-student")]
        public async Task<IActionResult> RegisterStudent([FromForm] RegisterStudentDto registerStudentDto)
        {
            var result = await _accountService.RegisterStudent(registerStudentDto);

            if (result.Succeeded)
            {
                return Ok();
            }

            var errors = result.Errors.Select(x => x.Description);
            return BadRequest(errors);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userRole))
            {
                return Unauthorized();
            }

            var contactInfo = await _accountService.GetUserContactInfo(userId, userRole);

            return Ok(contactInfo);
        }


    }
}
