using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ElectiaCore.Infrastructure;
using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.Services;
using ElectiaCore.Infrastructure.Repositories;
using ElectiaCore.Domain.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ElectiaDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 10,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null)));

builder.Services.AddDefaultIdentity<IdentityUser>(options => { })
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ElectiaDbContext>();


//Add CORS services.
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("your_secret_key_here_that_is_at_least_32_characters_long")),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });

// Services
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IAdminEmailService, AdminEmailService>();
builder.Services.AddScoped<IAdminEmailRepository, AdminEmailRepository>();
builder.Services.AddScoped<IProfessorService, ProfessorService>();
builder.Services.AddScoped<IProfessorRepository, ProfessorRepository>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ICenterService, CenterService>();
builder.Services.AddScoped<ICenterRepository, CenterRepository>();

builder.Services.AddScoped<IFacultyService, FacultyService>();
builder.Services.AddScoped<IFacultyRepository, FacultyRepository>();
builder.Services.AddScoped<IMajorService, MajorService>();
builder.Services.AddScoped<IMajorRepository, MajorRepository>();
builder.Services.AddScoped<IRuleService, RuleService>();
builder.Services.AddScoped<IRuleRepository, RuleRepository>();

builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<ICourseApplicationService, CourseApplicationService>();
builder.Services.AddScoped<ICourseApplicationRepository, CourseApplicationRepository>();
builder.Services.AddScoped<ICourseInstanceService, CourseInstanceService>();
builder.Services.AddScoped<ICourseInstanceRepository, CourseInstanceRepository>();
builder.Services.AddScoped<ICourseGradeService, CourseGradeService>();
builder.Services.AddScoped<ICourseGradeRepository, CourseGradeRepository>();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
   c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

   // Define the BearerAuth scheme
   c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
   {
       Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
       Name = "Authorization",
       In = ParameterLocation.Header,
       Type = SecuritySchemeType.Http,
       Scheme = "bearer"
   });

   c.AddSecurityRequirement(new OpenApiSecurityRequirement
   {
       {
           new OpenApiSecurityScheme
           {
               Reference = new OpenApiReference
               {
                   Type = ReferenceType.SecurityScheme,
                   Id = "Bearer"
               }
           },
           new string[] {}
       }
   });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var context = services.GetRequiredService<ElectiaDbContext>();
    
    // Reintentar inicialización de base de datos con delays
    int retryCount = 0;
    int maxRetries = 10;
    
    while (retryCount < maxRetries)
    {
        try
        {
            logger.LogInformation($"Intentando inicializar base de datos... Intento {retryCount + 1}/{maxRetries}");
            
            // Aplicar migraciones automáticamente
            logger.LogInformation("Aplicando migraciones de Entity Framework...");
            await context.Database.MigrateAsync();
            logger.LogInformation("Migraciones aplicadas exitosamente");
            
            // Inicializar datos semilla
            await DatabaseSeeder.InitializeAsync(services);
            logger.LogInformation("Base de datos inicializada exitosamente");
            break;
        }
        catch (Exception ex)
        {
            retryCount++;
            logger.LogWarning($"Error en intento {retryCount}/{maxRetries}: {ex.Message}");
            
            if (retryCount >= maxRetries)
            {
                logger.LogError($"No se pudo inicializar la base de datos después de {maxRetries} intentos");
                throw;
            }
            
            // Esperar antes del siguiente intento
            int delay = retryCount * 2; // 2, 4, 6, 8... segundos
            logger.LogInformation($"Esperando {delay} segundos antes del siguiente intento...");
            await Task.Delay(TimeSpan.FromSeconds(delay));
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Solo usar HTTPS redirection en desarrollo, no en Docker
if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

// Use CORS middleware here.
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
