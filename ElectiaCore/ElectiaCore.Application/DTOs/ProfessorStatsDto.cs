using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{
    public class ProfessorStatsDto
    {
        public int CoursesCreated { get; set; }
        public int ActiveCourses { get; set; }
        public int EnrolledStudents { get; set; }
    }
}
