using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementSystem.DTOs;
using StudentManagementSystem.Models;
using StudentManagementSystem.Services;

namespace StudentManagementSystem.Controllers
{
    /// <summary>
    /// Controller responsible for handling all student-related operations.All endpoints require authentication via JWT.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _service;
        private readonly ILogger<StudentController> _logger;

        /// <summary>
        /// Constructor for injecting dependencies.
       
        public StudentController(IStudentService service, ILogger<StudentController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <returns>List of students</returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            _logger.LogInformation("Fetching all students");

            var data = await _service.GetAll();

            return Ok(data);
        }

        /// <summary>
        /// Adds a new student to the system.
        /// </summary>
        
        [HttpPost]
        public async Task<IActionResult> Post(StudentDto dto)
        {
            _logger.LogInformation("Adding a new student: {Email}", dto.Email);

            await _service.Add(dto);

            return Ok("Student added");
        }

        /// <summary>
        /// Updates an existing student's details.
        /// </summary>
       
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, StudentDto dto)
        {
            _logger.LogInformation("Updating student with Id: {Id}", id);

            await _service.Update(id, dto);

            return Ok("Updated");
        }

        /// <summary>
        /// Deletes a student from the system.
        /// </summary>
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Deleting student with Id: {Id}", id);

            await _service.Delete(id);

            return Ok("Deleted");
        }
    }
}