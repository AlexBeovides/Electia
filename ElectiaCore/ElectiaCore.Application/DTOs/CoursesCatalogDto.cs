using ElectiaCore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{
    public class CoursesCatalogDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CenterName { get; set; }
        public string ModalityName { get; set; }
        public int EnrollmentCapacity { get; set; }
        public string MainProfessorName { get; set; }

        public string? CollaboratingProfessors { get; set;}

        public string CourseJustification { get; set; }

        public string GeneralObjective { get; set; }

        public string SpecificObjectives { get; set; }

        public string CourseSyllabus { get; set; }

        public string BasicBibliography { get; set; }

        public string ComplementaryBibliography { get; set; }

        public string EvaluationSystem { get; set; }

        public string ModalityJustification { get; set; }

        public string BasicRequirements { get; set; }

        public string MeetingPlace { get; set; }

        public int StrategicAxesId { get; set; }                 // remove?
        public string StrategicAxesName { get; set; }

        public int StrategicSectorsId { get; set; }             // remove?
        public string StrategicSectorsName { get; set; }

        public string? AuthorizationLetterDataBase64 { get; set; } = null!;
        public string ImgUrl { get; set; }

        public bool IsApproved { get; set; }
        public CourseStatus? Status { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
