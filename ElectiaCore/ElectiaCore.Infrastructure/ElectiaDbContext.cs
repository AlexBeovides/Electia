using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ElectiaCore.Domain.Entities;

namespace ElectiaCore.Infrastructure
{
    public class ElectiaDbContext : IdentityDbContext<IdentityUser>
    {
        private readonly DatabaseSeeder _seeder;

        public ElectiaDbContext(DbContextOptions<ElectiaDbContext> options)
            : base(options)
        {
            _seeder = new DatabaseSeeder();
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Center> Centers { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Major> Majors { get; set; }
        public DbSet<Professor> Professors { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<CourseApplication> CourseApplications { get; set; }
        public DbSet<CourseInstance> CourseInstances { get; set; }        public DbSet<CourseGrade> CourseGrades { get; set; }
        public DbSet<Rule> Rules { get; set; }
        public DbSet<AdminEmail> AdminEmails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Don't forget to call base method

            _seeder.SeedData(modelBuilder).Wait();

            modelBuilder.Entity<Course>()
                .HasOne(c => c.MainProfessor)
                .WithMany(p => p.MainCourses)
                .HasForeignKey(c => c.MainProfessorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Course>(entity =>
            {
                entity.Property(e => e.AuthorizationLetterData)
                      .HasColumnType("varbinary(max)");
            });

        }
    }
}