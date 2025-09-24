using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities; 
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Interfaces
{
    public interface IAccountService
    {
        Task<LoginResultDto> Login(LoginDto loginDto);
        Task<IdentityResult> RegisterProfessor(RegisterProfessorDto registerProfessorDto);
        Task<IdentityResult> RegisterStudent(RegisterStudentDto registerStudentDto);
        Task<UserInfoDto> GetUserContactInfo(string userId, string userRole);
    }
}
