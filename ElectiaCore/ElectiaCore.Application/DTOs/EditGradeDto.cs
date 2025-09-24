using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.DTOs
{
    public class EditGradeDto
    {
        public int Id { get; set; }
        public int? Grade1 { get; set; }
        public int? Grade2 { get; set; }
        public int? Grade3 { get; set; }
        public string? Comment { get; set; }
    }
}
