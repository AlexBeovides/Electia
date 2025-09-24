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
    public class ProfessorDto
    {
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string PrimaryEmail { get; set; }
        public string TeacherCategoryName { get; set; }
        public string AcademicDegreeName { get; set; }
        public string? Landline { get; set; }
        public string PhoneNumber { get; set; }

        public string? SecondaryEmail { get; set; }

        public bool IsApproved { get; set; }
    }
} 