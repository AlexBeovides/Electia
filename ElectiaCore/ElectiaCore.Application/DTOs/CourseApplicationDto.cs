using ElectiaCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{
    public class CourseApplicationDto
    {
        public int CourseId { get; set; }

        public string MotivationLetter { get; set; }
        public int AcademicYearId { get; set; } 
    }
}
