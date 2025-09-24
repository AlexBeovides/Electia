using Microsoft.EntityFrameworkCore;
using ElectiaCore.Infrastructure;
using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ElectiaCore.Tests.Helpers
{
    public static class TestDbContextHelper
    {
        public static ElectiaDbContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<ElectiaDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ElectiaDbContext(options);

            // Seed basic data for testing
            SeedTestData(context);

            return context;
        }

        private static void SeedTestData(ElectiaDbContext context)
        {
            // Add test Centers
            var centers = new List<Center>
            {
                new Center
                {
                    Id = 1,
                    Name = "Test Center 1",
                    IsDeleted = false
                },
                new Center
                {
                    Id = 2,
                    Name = "Test Center 2",
                    IsDeleted = false
                }
            };
            context.Centers.AddRange(centers);

            // Add test Faculties
            var faculties = new List<Faculty>
            {
                new Faculty
                {
                    Id = 1,
                    Name = "Faculty of Engineering",
                    IsDeleted = false
                },
                new Faculty
                {
                    Id = 2,
                    Name = "Faculty of Sciences",
                    IsDeleted = false
                }
            };
            context.Faculties.AddRange(faculties);

            // Add test Majors
            var majors = new List<Major>
            {
                new Major
                {
                    Id = 1,
                    Name = "Computer Science",
                    FacultyId = 1,
                    IsDeleted = false
                },
                new Major
                {
                    Id = 2,
                    Name = "Software Engineering",
                    FacultyId = 1,
                    IsDeleted = false
                },
                new Major
                {
                    Id = 3,
                    Name = "Mathematics",
                    FacultyId = 2,
                    IsDeleted = false
                }
            };
            context.Majors.AddRange(majors);            // Add test Identity Users
            var users = new List<IdentityUser>
            {
                new IdentityUser
                {
                    Id = "test-prof-id",
                    UserName = "testprofessor@test.com",
                    Email = "testprofessor@test.com",
                    EmailConfirmed = true
                },
                new IdentityUser
                {
                    Id = "test-prof-id-2",
                    UserName = "testprofessor2@test.com",
                    Email = "testprofessor2@test.com",
                    EmailConfirmed = true
                },
                new IdentityUser
                {
                    Id = "test-student-id",
                    UserName = "teststudent@test.com",
                    Email = "teststudent@test.com",
                    EmailConfirmed = true
                },
                new IdentityUser
                {
                    Id = "test-student-id-2",
                    UserName = "teststudent2@test.com",
                    Email = "teststudent2@test.com",
                    EmailConfirmed = true
                }
            };
            context.Users.AddRange(users);

            // Add test Professors
            var professors = new List<Professor>
            {
                new Professor
                {
                    UserId = "test-prof-id",
                    FullName = "Test Professor",
                    PrimaryEmail = "testprofessor@test.com",
                    TeacherCategory = TeacherCategory.FullProfessor,
                    AcademicDegree = AcademicDegree.DoctorOfScience,
                    PhoneNumber = "123456789",
                    Landline = "987654321",
                    SecondaryEmail = "secondary@test.com",
                    IsDeleted = false
                },
                new Professor
                {
                    UserId = "test-prof-id-2",
                    FullName = "Test Professor 2",
                    PrimaryEmail = "testprofessor2@test.com",
                    TeacherCategory = TeacherCategory.AssistantProfessor,
                    AcademicDegree = AcademicDegree.MasterOfScience,
                    PhoneNumber = "987654321",
                    IsDeleted = false
                }            };
            context.Professors.AddRange(professors);

            // Add test Students
            var students = new List<Student>
            {
                new Student
                {
                    UserId = "test-student-id",
                    FullName = "Test Student",
                    IDNumber = "12345678901",
                    PrimaryEmail = "teststudent@test.com",
                    EveaUsername = "teststudent",
                    PhoneNumber = "123456789",
                    FacultyId = 1,
                    MajorId = 1,
                    AcademicYear = AcademicYear.Third,
                    IsDeleted = false
                },
                new Student
                {
                    UserId = "test-student-id-2",
                    FullName = "Test Student 2",
                    IDNumber = "98765432109",
                    PrimaryEmail = "teststudent2@test.com",
                    EveaUsername = "teststudent2",
                    PhoneNumber = "987654321",
                    FacultyId = 2,
                    MajorId = 3,
                    AcademicYear = AcademicYear.Second,
                    IsDeleted = false
                }            };
            context.Students.AddRange(students);

            // Add test Course
            var course = new Course
            {
                Id = 1,
                Title = "Test Course",
                CourseJustification = "Test Justification",
                GeneralObjective = "Test Objective",
                SpecificObjectives = "Test Specific",
                CourseSyllabus = "Test Syllabus",
                BasicBibliography = "Test Bibliography",
                ComplementaryBibliography = "Test Complementary",
                EvaluationSystem = "Test Evaluation",
                ModalityJustification = "Test Modality",
                BasicRequirements = "Test Requirements",
                MeetingPlace = "Test Place",
                EnrollmentCapacity = 30,
                CenterId = 1,
                MainProfessorId = "test-prof-id",
                Modality = CourseModality.Virtual,
                StrategicAxes = StrategicAxis.HumanPotential,
                StrategicSectors = StrategicSector.Telecommunications,
                ImgUrl = "test-img-url",
                IsDeleted = false
            };
            context.Courses.Add(course);

            // Add test CourseInstances
            var courseInstances = new List<CourseInstance>
            {
                new CourseInstance
                {
                    Id = 1,
                    CourseId = 1,
                    StartDate = DateTime.Now.AddDays(30),
                    EndDate = DateTime.Now.AddDays(90),
                    IsDeleted = false
                },
                new CourseInstance
                {
                    Id = 2,
                    CourseId = 1,
                    StartDate = DateTime.Now.AddDays(120),
                    EndDate = DateTime.Now.AddDays(180),
                    IsDeleted = false
                }
            };
            context.CourseInstances.AddRange(courseInstances);

            context.SaveChanges();
        }
    }
}