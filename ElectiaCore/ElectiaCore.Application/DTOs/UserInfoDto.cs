using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{
    public class UserInfoDto
    {
        public string Role { get; set; }
        public string? PrimaryEmail { get; set; }
        public string? FullName { get; set; }
        public string? SecondaryEmail { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Landline { get; set; }
        public string? IDNumber { get; set; }
        public string? EveaUsername { get; set; }
        public string? TeacherCategory { get; set; }
        public string? AcademicDegree { get; set; }
        public string? Faculty { get; set; }
        public string? Major { get; set; }
        public string? AcademicYear { get; set; }
    }
}
