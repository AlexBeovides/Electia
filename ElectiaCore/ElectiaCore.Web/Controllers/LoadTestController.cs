using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.DTOs;
using ElectiaCore.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElectiaCore.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoadTestController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ElectiaDbContext _context;

        public LoadTestController(
            IAccountService accountService, 
            UserManager<IdentityUser> userManager,
            ElectiaDbContext context)
        {
            _accountService = accountService;
            _userManager = userManager;
            _context = context;
        }

        [HttpPost("bulk-create-students")]
        [Authorize(Roles = "Admin")] // Solo admin puede ejecutar esto
        public async Task<IActionResult> BulkCreateStudents()
        {
            var results = new List<string>();
            
            for (int i = 1; i <= 100; i++)
            {
                var email = $"usuario{i}@gmail.com";
                var registerDto = new RegisterStudentDto
                {
                    Email = email,
                    Password = "Banana_55",
                    FullName = $"Usuario Test {i}",
                    IdNumber = "02071012345",
                    EveaUsername = "USUARIOTest",
                    PhoneNumber = "51238899",
                    FacultyId = 1,
                    MajorId = 1
                };

                try
                {
                    var result = await _accountService.RegisterStudent(registerDto);
                    if (result.Succeeded)
                    {
                        results.Add($"Usuario {email} creado exitosamente");
                    }
                    else
                    {
                        results.Add($"Error creando {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
                catch (Exception ex)
                {
                    results.Add($"Excepción creando {email}: {ex.Message}");
                }
            }

            return Ok(new { Results = results });
        }

        [HttpDelete("bulk-delete-students")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BulkDeleteStudents()
        {
            var results = new List<string>();
            
            for (int i = 1; i <= 100; i++)
            {
                var email = $"usuario{i}@gmail.com";
                
                try
                {
                    var user = await _userManager.FindByEmailAsync(email);
                    if (user != null)
                    {
                        // Eliminar el registro del estudiante
                        var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == user.Id);
                        if (student != null)
                        {
                            _context.Students.Remove(student);
                        }

                        // Eliminar el usuario de Identity
                        var result = await _userManager.DeleteAsync(user);
                        if (result.Succeeded)
                        {
                            results.Add($"Usuario {email} eliminado exitosamente");
                        }
                        else
                        {
                            results.Add($"Error eliminando {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                        }
                    }
                    else
                    {
                        results.Add($"Usuario {email} no encontrado");
                    }
                }
                catch (Exception ex)
                {
                    results.Add($"Excepción eliminando {email}: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { Results = results });
        }

        [HttpDelete("bulk-delete-course-applications")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BulkDeleteCourseApplications()
        {
            // Define el rango de IDs aquí
            int startId = 133;
            int endId = 213;
            
            var results = new List<string>();
            int deletedCount = 0;

            try
            {
                // Buscar todas las aplicaciones en el rango de IDs
                var applicationsToDelete = await _context.CourseApplications
                    .Where(ca => ca.Id >= startId && ca.Id <= endId)
                    .ToListAsync();

                if (applicationsToDelete.Any())
                {
                    foreach (var application in applicationsToDelete)
                    {
                        _context.CourseApplications.Remove(application);
                        
                        deletedCount++;
                        results.Add($"CourseApplication ID {application.Id} marcada como eliminada");
                    }

                    await _context.SaveChangesAsync();
                    results.Add($"Total de aplicaciones procesadas: {deletedCount}");
                }
                else
                {
                    results.Add($"No se encontraron CourseApplications en el rango de IDs {startId}-{endId}");
                }
            }
            catch (Exception ex)
            {
                results.Add($"Error eliminando CourseApplications: {ex.Message}");
                return BadRequest(new { Results = results });
            }

            return Ok(new { 
                Results = results, 
                DeletedCount = deletedCount,
                IdRange = $"{startId}-{endId}"
            });
        }
    }
}