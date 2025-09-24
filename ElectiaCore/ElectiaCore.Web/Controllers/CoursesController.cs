using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.DTOs;
using ElectiaCore.Application.Helpers;
using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    // GET: api/Courses 
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
    {
        return Ok(await _courseService.GetAllCoursesAsync());
    }

    [HttpGet("FromProfessor")]
    [Authorize(Roles = "Professor")]
    public async Task<ActionResult<IEnumerable<CoursesCatalogDto>>> GetCoursesFromProfessor()
    {
        var professorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(professorId))
        {
            return BadRequest("User identifier is missing");
        }

        return Ok(await _courseService.GetAllCoursesFromProfessorAsync(professorId));
    }

    // New endpoint for students
    [HttpGet("ForCatalog")]
    public async Task<ActionResult<IEnumerable<CoursesCatalogDto>>> GetCoursesForCatalog()
    {
        return Ok(await _courseService.GetAllCoursesForCatalogAsync());
    }

    // GET: api/Courses/5
    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetCourse(int id)
    {
        var course = await _courseService.GetCourseAsync(id);

        if (course == null)
        {
            return NotFound();
        }

        return course;
    }

    // GET: api/Courses/ForCatalog/5
    [HttpGet("ForCatalog/{id}")]
    public async Task<ActionResult<CoursesCatalogDto>> GetCourseForCatalog(int id)
    {
        var course = await _courseService.GetCourseForCatalogAsync(id);

        if (course == null)
        {
            return NotFound();
        }

        return course;
    }

    // PUT: api/Courses/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCourse(int id, Course course)
    {
        if (id != course.Id)
        {
            return BadRequest();
        }

        await _courseService.UpdateCourseAsync(course);

        return NoContent();
    }

    [Authorize(Roles = "Professor")]
    [HttpPut("ByProfessor/{id}")]
    public async Task<IActionResult> PutCourseByProfessor(int id, [FromForm] EditCourseDto course)
    {
        await _courseService.UpdateCourseByProfessorAsync(course);

        return NoContent();
    }

    // POST: api/Courses
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Course>> PostCourse([FromForm] CreateCourseDto courseDto)
    {
        var course = await _courseService.AddCourseAsync(courseDto);

        return Ok(course);
    }

    [Authorize(Roles = "Professor")]
    [HttpPost("FromProfessor")]
    public async Task<ActionResult<Course>> PostCourseProfessor([FromForm] CreateCourseDto courseDto)
    {
        var professorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(professorId))
        {
            return BadRequest("User identifier is missing");
        }

        courseDto.MainProfessorId = professorId;
        var course = await _courseService.AddCourseAsync(courseDto);

        return Ok(course);
    }

    // DELETE: api/Courses/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        await _courseService.DeleteCourseAsync(id);

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("Approve/{id}")]
    public async Task<IActionResult> ApproveCourse(int id)
    { 
        await _courseService.ApproveCourseAsync(id);

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("Reject/{id}")]
    public async Task<IActionResult> RejectCourse(int id)
    {
        await _courseService.RejectCourseAsync(id);

        return NoContent();
    }

    // Expose CourseModality enum
    [HttpGet("course-modalities")]
    public IActionResult GetCourseModalities()
    {
        var modalities = Enum.GetValues(typeof(CourseModality))
                             .Cast<CourseModality>()
                              .Select(e => new
                              {
                                  id = (int)e,
                                  name = EnumHelper.GetEnumDisplayName(e)
                              });
        return Ok(modalities);
    }

    // Expose StrategicAxis enum
    [HttpGet("strategic-axes")]
    public IActionResult GetStrategicAxes()
    {
        var axes = Enum.GetValues(typeof(StrategicAxis))
                       .Cast<StrategicAxis>()
                        .Select(e => new
                        {
                            id = (int)e,
                            name = EnumHelper.GetEnumDisplayName(e)
                        });
        return Ok(axes);
    }

    // Expose StrategicSector enum
    [HttpGet("strategic-sectors")]
    public IActionResult GetStrategicSectors()
    {
        var sectors = Enum.GetValues(typeof(StrategicSector))
                          .Cast<StrategicSector>()
                          .Select(e => new
                          {
                              id = (int)e,
                              name = EnumHelper.GetEnumDisplayName(e)
                          });
        return Ok(sectors);
    }

}