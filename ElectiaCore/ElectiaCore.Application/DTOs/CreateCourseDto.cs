using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{ 
    public class CreateCourseDto
    {
        public string Title { get; set; }

        public int CenterId { get; set; }

        public CourseModality ModalityId { get; set; }

        public int EnrollmentCapacity { get; set; }

        public string? MainProfessorId { get; set; }

        public string? CollaboratingProfessors { get; set; }

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

        public StrategicAxis StrategicAxesId { get; set; }

        public StrategicSector StrategicSectorsId { get; set; }

        //public IFormFile? AuthorizationLetter { get; set; }

        public string? AuthorizationLetterDataBase64 { get; set; } = null!;

        public string? ImgUrl {  get; set; } 

    }
}
