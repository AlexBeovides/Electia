using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Entities
{
    public class Professor
    {
        [Key]
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string PrimaryEmail { get; set; }
        public TeacherCategory TeacherCategory { get; set; }
        public AcademicDegree AcademicDegree { get; set; }
        public string? Landline { get; set; }
        public string PhoneNumber { get; set; }

        public string? SecondaryEmail { get; set; }

        public List<Course> MainCourses { get; set; } = new();

        // Relationship with ApplicationUser
        [ForeignKey("UserId")]
        public IdentityUser User { get; set; }

        public bool IsDeleted { get; set; }
    }

    public enum TeacherCategory
    {
        [Display(Name = "Profesor titular")]
        FullProfessor,

        [Display(Name = "Profesor auxiliar")]
        AuxiliaryProfessor,

        [Display(Name = "Profesor asistente")]
        AssistantProfessor,

        [Display(Name = "Profesor instructor")]
        Instructor
    }

    public enum AcademicDegree
    {
        [Display(Name = "Licenciado")]
        Bachelor,

        [Display(Name = "Master en ciencias")]
        MasterOfScience,

        [Display(Name = "Doctor en ciencias")]
        DoctorOfScience
    }
}
