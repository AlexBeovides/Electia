using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Entities
{
    public class Faculty
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public List<Major> Majors { get; set; } = new();

        // More Stuff Incoming
        public bool IsDeleted { get; set; }
    }
}
