using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Entities
{
    public class Major
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int? FacultyId { get; set; }

        [JsonIgnore]
        public Faculty? Faculty { get; set; }

        public bool IsDeleted { get; set; }
    }
}
