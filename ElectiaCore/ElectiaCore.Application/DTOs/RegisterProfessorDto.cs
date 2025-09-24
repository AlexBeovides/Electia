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
    public class RegisterProfessorDto
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public string FullName { get; set; }
        public TeacherCategory TeacherCategory { get; set; }
        public AcademicDegree AcademicDegree { get; set; }
        public string? Landline { get; set; }
        public string PhoneNumber { get; set; }
        public string? SecondaryEmail { get; set; }
    }
}

