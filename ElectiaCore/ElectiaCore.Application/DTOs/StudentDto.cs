using ElectiaCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{
    public class StudentDto
    {
        public string UserId { get; set; }
        public string FullName { get; set; }
         
        public string? IDNumber { get; set; }
        public string? PrimaryEmail { get; set; }
        public string? EveaUsername { get; set; }
        public string? PhoneNumber { get; set; }

        public string? FacultyName { get; set; } 
        public string? MajorName { get; set; } 

        public string? SecondaryEmail { get; set; }

    }
}
