using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Entities
{
    public class Center
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // More Stuff Incoming
        public bool IsDeleted { get; set; }
    }
}
