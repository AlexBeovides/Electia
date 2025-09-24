using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Interfaces;
using ElectiaCore.Domain.Entities;
using ElectiaCore.Infrastructure;
using ElectiaCore.Domain.Interfaces;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using ElectiaCore.Application.Helpers;

namespace ElectiaCore.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ElectiaDbContext _context;
        
        private readonly IProfessorRepository _professorRepository; 
        private readonly IStudentRepository _studentRepository;
      
        public AccountService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, ElectiaDbContext context,
            IProfessorRepository professorRepository, IStudentRepository studentRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;

            _professorRepository = professorRepository;
            _studentRepository = studentRepository;
        }
         
        private async Task<string> GenerateJwtToken(IdentityUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("your_secret_key_here_that_is_at_least_32_characters_long"); // Replace with your secret key
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims), 
                Expires = DateTime.UtcNow.AddHours(8), // Token expiration, adjust as needed
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<LoginResultDto> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.UserName == loginDto.Email);

            var result = await _signInManager.PasswordSignInAsync(loginDto.Email, loginDto.Password, isPersistent: false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                user = await _userManager.Users
                .FirstOrDefaultAsync(u => u.UserName == loginDto.Email);
                var roles = await _userManager.GetRolesAsync(user);


                var token = await GenerateJwtToken(user);

                return new LoginResultDto
                {
                    Token = token,
                    Role = roles[0]
                };

            }

            return null;
        }

        public async Task<IdentityResult> RegisterProfessor(RegisterProfessorDto registerProfessorDto)
        {
            // llamado a metodo en Infrastructure q llame a la API de evea O_o y checkee q existe el user y pass q me dieron

            var user = new IdentityUser
            {
                UserName = registerProfessorDto.Email,
                Email = registerProfessorDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerProfessorDto.Password);

            if (result.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(user, "Professor");
                if (!roleResult.Succeeded)
                {
                    return IdentityResult.Failed(roleResult.Errors.ToArray());
                }

                var professor = new Professor
                {
                    UserId = user.Id,
                    FullName = registerProfessorDto.FullName,
                    PrimaryEmail = registerProfessorDto.Email,
                    TeacherCategory = registerProfessorDto.TeacherCategory,
                    AcademicDegree = registerProfessorDto.AcademicDegree,
                    Landline = registerProfessorDto.Landline,
                    PhoneNumber = registerProfessorDto.PhoneNumber,
                    SecondaryEmail = registerProfessorDto.SecondaryEmail,

                };

                _context.Professors.Add(professor);
                await _context.SaveChangesAsync();
            }

            return result;
        }

        public async Task<IdentityResult> RegisterStudent(RegisterStudentDto registerStudentDto)
        {
            // llamado a metodo en Infrastructure q llame a la API de evea O_o y checkee q existe el user y pass q me dieron

            var user = new IdentityUser
            {
                UserName = registerStudentDto.Email,
                Email = registerStudentDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerStudentDto.Password);

            if (result.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(user, "Student");
                if (!roleResult.Succeeded)
                {
                    return IdentityResult.Failed(roleResult.Errors.ToArray());
                }

                var student = new Student
                {
                    UserId = user.Id,
                    FullName = registerStudentDto.FullName,
                    IDNumber = registerStudentDto.IdNumber,
                    PrimaryEmail = registerStudentDto.Email,
                    EveaUsername = registerStudentDto.EveaUsername,
                    PhoneNumber = registerStudentDto.PhoneNumber,
                    FacultyId = registerStudentDto.FacultyId,
                    MajorId = registerStudentDto.MajorId,
                    SecondaryEmail = registerStudentDto.SecondaryEmail
                };

                _context.Students.Add(student);
                await _context.SaveChangesAsync();
            }

            return result;
        }

        public async Task<UserInfoDto> GetUserContactInfo(string userId, string userRole)
        {
            var contactInfo = new UserInfoDto
            {
                Role = userRole
            };

            switch (userRole.ToLower())
            {
                case "professor":
                    var professor = await _professorRepository.GetProfessorAsync(userId);
                    if (professor != null)
                    {
                        contactInfo.FullName = professor.FullName;
                        contactInfo.PrimaryEmail = professor.PrimaryEmail;
                        contactInfo.SecondaryEmail = professor.SecondaryEmail;
                        contactInfo.PhoneNumber = professor.PhoneNumber;
                        contactInfo.Landline = professor.Landline;
                        contactInfo.TeacherCategory = EnumHelper.GetEnumDisplayName(professor.TeacherCategory);
                        contactInfo.AcademicDegree = EnumHelper.GetEnumDisplayName(professor.AcademicDegree);
                    }
                    break;

                case "student":
                    var student = await _studentRepository.GetStudentAsync(userId);
                    if (student != null)
                    {
                        contactInfo.FullName = student.FullName;
                        contactInfo.PrimaryEmail = student.PrimaryEmail;
                        contactInfo.SecondaryEmail = student.SecondaryEmail;
                        contactInfo.PhoneNumber = student.PhoneNumber;
                        contactInfo.IDNumber = student.IDNumber;
                        contactInfo.EveaUsername = student.EveaUsername;
                        contactInfo.Faculty = student.Faculty?.Name;
                        contactInfo.Major = student.Major?.Name;
                        contactInfo.AcademicYear = EnumHelper.GetEnumDisplayName(student.AcademicYear);
                    }
                    break;

                case "admin":
                    var adminUser = await _userManager.FindByIdAsync(userId);
                    if (adminUser != null)
                    {
                        contactInfo.PrimaryEmail = adminUser.Email; 
                    }
                    break;

                case "superadmin":
                    var superAdminUser = await _userManager.FindByIdAsync(userId);
                    if (superAdminUser != null)
                    {
                        contactInfo.PrimaryEmail = superAdminUser.Email;
                    }
                    break;

                default:
                    return null;
            }

            return contactInfo;
        }
    }
}
 