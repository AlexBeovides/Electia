using Microsoft.AspNetCore.Http;
using ElectiaCore.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Services
{

    public class FileStorageService : IFileStorageService
    {
        public async Task<string> SaveFileAsync(IFormFile file)
        {
            // Guardar el archivo en el servidor
            var uploadsFolder = Path.Combine("wwwroot", "uploads");
            Directory.CreateDirectory(uploadsFolder); // Asegúrate de que la carpeta exista

            var filePath = Path.Combine(uploadsFolder, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filePath;
        }
    }

    
}
