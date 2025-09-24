using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace ElectiaCore.Infrastructure
{
    public class DatabaseSeeder
    {

        public DatabaseSeeder()
        {

        }

        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

            string[] roleNames = { "SuperAdmin", "Admin", "Professor", "Student" };

            foreach (var roleName in roleNames)
            {
                var roleExists = await roleManager.RoleExistsAsync(roleName);
                if (!roleExists)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            string superAdminEmail = "superadmin@gmail.com"; 
            string superAdminPassword = "G7v$k9Tq#2LmZ@eB";

            var superAdminUser = await userManager.FindByEmailAsync(superAdminEmail);
            if (superAdminUser == null)
            {
                var newSuperAdmin = new IdentityUser
                {
                    UserName = superAdminEmail,
                    Email = superAdminEmail
                };

                var result = await userManager.CreateAsync(newSuperAdmin, superAdminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newSuperAdmin, "SuperAdmin");
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine(error.Description);
                    }
                }
            }

            string adminEmail = "admin@gmail.com";
            string adminPassword = "Admin_55";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                var newAdmin = new IdentityUser
                {
                    UserName = adminEmail,
                    Email = adminEmail
                };

                var result = await userManager.CreateAsync(newAdmin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, "Admin");
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine(error.Description);
                    }
                }
            }

             
        }

        public async Task SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Major>().HasData(
                new Major { Id = 1, Name = "Licenciatura en Ciencias de la Computación" },
                new Major { Id = 2, Name = "Licenciatura en Matemática" },
                new Major { Id = 3, Name = "Licenciatura en Ciencia de Datos" },
                new Major { Id = 4, Name = "Licenciatura en Física" },
                new Major { Id = 5, Name = "Licenciatura en Química" },
                new Major { Id = 6, Name = "Licenciatura en Biología" },
                new Major { Id = 7, Name = "Licenciatura en Microbiología y Virología" },
                new Major { Id = 8, Name = "Licenciatura en Bioquímica y Biología Molecular" },
                new Major { Id = 9, Name = "Licenciatura en Derecho" },
                new Major { Id = 10, Name = "Licenciatura en Psicología" }
            );

            modelBuilder.Entity<Faculty>().HasData(
                new Faculty { Id = 1, Name = "Facultad de Matemática y Computación" },
                new Faculty { Id = 2, Name = "Facultad de Física" },
                new Faculty { Id = 3, Name = "Facultad de Química" },
                new Faculty { Id = 4, Name = "Facultad de Biología" },
                new Faculty { Id = 5, Name = "Facultad de Derecho" },
                new Faculty { Id = 6, Name = "Facultad de Psicología" }
            );

            modelBuilder.Entity<Center>().HasData(
               new Center { Id = 1, Name = "Instituto de Criptografía" },
               new Center { Id = 2, Name = "Grupo de Inteligencia Artificial" }
           );

            //modelBuilder.Entity<Professor>().HasData(
            //new Professor
            //{
            //    UserId = "52583890-24fa-4d75-8d37-a9e95c19edd6",
            //    FullName = "Dr. John Doe",
            //    PrimaryEmail = "johndoe@example.com",
            //    TeacherCategory = TeacherCategory.FullProfessor,
            //    AcademicDegree = AcademicDegree.Bachelor,
            //    Landline = "123-456-7890",
            //    PhoneNumber = "987-654-3210",
            //    SecondaryEmail = "john.doe@university.edu"
            //}
            // );
        }
    }
}