using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Entities
{
    public class CourseInstance                 
    {
        [Key]
        public int Id { get; set; }

        public int CourseId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [ForeignKey("CourseId")]
        public Course Course { get; set; }

        [JsonIgnore]
        public List<CourseApplication> Applications { get; set; } = new();

        [JsonIgnore]
        public List<Rule> Rules { get; set; } = new();

        public bool IsDeleted { get; set; }
    }
}
