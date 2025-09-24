using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ElectiaCore.Domain.Entities
{
    public class Student
    {
        [Key]
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string IDNumber { get; set; }
        public string PrimaryEmail { get; set; }
        public string EveaUsername { get; set; }
        public string PhoneNumber { get; set; }

        public int FacultyId { get; set; }
        public Faculty Faculty { get; set; }

        public int MajorId { get; set;}
        public Major Major { get; set; }

        public AcademicYear AcademicYear { get; set; }

        public string? SecondaryEmail { get; set; }

        // Relationship with ApplicationUser
        [ForeignKey("UserId")]
        public IdentityUser User { get; set; }   

        [JsonIgnore]
        public List<CourseApplication> CourseApplications { get; set; } = new();

        public bool IsDeleted { get; set; }
    }

    public enum AcademicYear
    {
        [Display(Name = "N/A")] 
        None,

        [Display(Name = "1ro")]
        First, 

        [Display(Name = "2do")]
        Second,

        [Display(Name = "3ro")]
        Third,

        [Display(Name = "4to")]
        Fourth
    }
}


