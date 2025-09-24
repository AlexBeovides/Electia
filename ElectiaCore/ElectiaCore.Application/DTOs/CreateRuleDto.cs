using ElectiaCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{
    public class CreateRuleDto
    { 
        public int CourseInstanceId { get; set; }

        public int? MajorId { get; set; }
        public int? AcademicYear { get; set; }

        public int? Priority { get; set; }
    }
}
