using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{
    public class RegisterStudentDto
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public string FullName { get; set; }  
        public string IdNumber { get; set; }
        public string EveaUsername { get; set; }
        public string PhoneNumber { get; set; }
        public int FacultyId { get; set; }
        public int MajorId { get; set; }
        public string? SecondaryEmail { get; set; }
    }
}

