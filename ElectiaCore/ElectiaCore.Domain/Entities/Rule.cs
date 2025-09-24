using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Entities
{
    public class Rule
    {
        [Key]
        public int Id { get; set; } 

        public int CourseInstanceId { get; set; } 

        public int? MajorId { get; set; } 
        public AcademicYear? AcademicYear { get; set; }
        public int? Priority { get; set; }

        [ForeignKey("CourseInstanceId")]
        public CourseInstance? CourseInstance { get; set; }

        [ForeignKey("MajorId")]
        public Major? Major { get; set; }

        public bool IsDeleted { get; set; }
    }
}
