using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Entities
{
    public class CourseApplication
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]           /// is this mandatory????????
        public int Id { get; set; }

        public string StudentId { get; set; }
        public int CourseId { get; set; }

        public string MotivationLetter { get; set; }

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

        public DateTime AppliedAt { get; set; } = DateTime.Now;
         

        // Navigation properties
        [ForeignKey("StudentId")]
        public Student Student { get; set; }

        [ForeignKey("CourseId")]
        public CourseInstance Course { get; set; }

        public bool IsDeleted { get; set; } = false;
    }

    public enum ApplicationStatus
    {
        Pending,
        Accepted,
        Rejected
    }

}
