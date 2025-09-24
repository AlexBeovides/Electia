using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Entities
{
    public class CourseGrade
    {
        [Key]
        public int Id { get; set;}

        public int CourseId { get; set; }
        public string StudentId { get; set; }
        public int? Grade1 { get; set; }
        public int? Grade2 { get; set; }
        public int? Grade3 { get; set; }
        public string? Comment { get; set; }

        [ForeignKey("CourseId")]
        public CourseInstance CourseInstance { get; set; }

        [ForeignKey("StudentId")]
        public Student Student { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}
