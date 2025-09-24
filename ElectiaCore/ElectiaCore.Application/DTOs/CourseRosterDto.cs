using ElectiaCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{
    public class CourseRosterDto
    { 
        public int Id {  get; set; }
        public string StudentName { get; set; }
        public string FacultyName { get; set; } 
        public string MajorName { get; set; }
        public string AcademicYearName { get; set; }
        public string PrimaryEmail { get; set; }
        public string? SecondaryEmail { get; set; }
        public string PhoneNumber { get; set; }

        public int? Grade1 { get; set; }
        public int? Grade2 { get; set; }
        public int? Grade3 { get; set; }
        public string? Comment { get; set; }
    } 
}
