using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Entities
{
    public class Course
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; }

        public int CenterId { get; set; }

        [JsonIgnore]
        public Center Center { get; set; }

        public CourseModality Modality { get; set; }
        public int EnrollmentCapacity { get; set; }

        public string MainProfessorId { get; set; }

        [JsonIgnore]
        public Professor MainProfessor { get; set; }

        public string? CollaboratingProfessors { get; set; }

        [StringLength(500, ErrorMessage = "Course justification cannot exceed 500 words")]          /// son palabras no caracteres lo q hay q checkear, check en el servicio
        [Display(Name = "Fundamentación de la Asignatura")]
        public string CourseJustification { get; set; }

        [Display(Name = "Objetivo general")]
        public string GeneralObjective { get; set; }

        [Display(Name = "Objetivos específicos")]
        public string SpecificObjectives { get; set; }

        [Display(Name = "Temario de la asignatura")]
        public string CourseSyllabus { get; set; }

        [Display(Name = "Bibliografía básica")]
        public string BasicBibliography { get; set; }

        [Display(Name = "Bibliografía complementaria")]
        public string ComplementaryBibliography { get; set; }

        [Display(Name = "Sistema de evaluación")]
        public string EvaluationSystem { get; set; }

        [Display(Name = "Fundamentación de la selección de la modalidad")]
        public string ModalityJustification { get; set; }

        [Display(Name = "Requisitos básicos para desempeñarse en la asignatura")]
        public string BasicRequirements { get; set; }

        [Display(Name = "Lugar de encuentro para la asignatura")]
        public string MeetingPlace { get; set; }

        [Display(Name = "Ejes estratégicos")]
        public StrategicAxis StrategicAxes { get; set; }

        [Display(Name = "Sectores estratégicos")]
        public StrategicSector StrategicSectors { get; set; }

        //public string? AuthorizationLetterPath { get; set; }
        public byte[]? AuthorizationLetterData { get; set; }

        public string ImgUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }

        public CourseStatus Status { get; set; } = CourseStatus.Pending;
         
        public bool IsDeleted { get; set; }
    }

    public enum CourseStatus
    {
        Pending,
        Approved,
        Rejected
    }

    public enum CourseModality
    {
        [Display(Name = "Virtual")]
        Virtual,

        [Display(Name = "Presencial")]
        InPerson,

        [Display(Name = "Híbrida")]
        Hybrid
    }

    public enum StrategicAxis
    { 
        [Display(Name = "Gobierno eficaz y socialista e integración social")]
        GovernmentAndSocialIntegration,

        [Display(Name = "Transformación productiva e inserción internacional")]
        ProductiveTransformation,

        [Display(Name = "Infraestructura")]
        Infrastructure,

        [Display(Name = "Potencial humano")]
        HumanPotential,

        [Display(Name = "Ciencia, tecnología e innovación")]
        ScienceAndTechnology,

        [Display(Name = "Recursos naturales y medio ambiente")]
        NaturalResources,

        [Display(Name = "Desarrollo humano, justicia y equidad")]
        HumanDevelopment
    }

    public enum StrategicSector
    { 
        [Display(Name = "Construcción")]
        Construction,

        [Display(Name = "Electro energético")]
        ElectroEnergy,

        [Display(Name = "Telecomunicaciones")]
        Telecommunications,

        [Display(Name = "Logística integrada de transporte")]
        TransportLogistics,

        [Display(Name = "Logística integrada de redes e instalaciones hidráulica y sanitaria")]
        HydraulicNetworks,

        [Display(Name = "Turismo")]
        Tourism,

        [Display(Name = "Los servicios técnicos profesionales")]
        TechnicalServices,

        [Display(Name = "El servicio productor de alimentos")]
        FoodProduction,

        [Display(Name = "Industria farmacéutica")]
        PharmaceuticalIndustry,

        [Display(Name = "Biotecnológica y producciones biomédicas")]
        Biotechnology,

        [Display(Name = "Agroindustria azucarera y sus derivados")]
        SugarIndustry,

        [Display(Name = "Industria ligera")]
        LightIndustry
    }
}
