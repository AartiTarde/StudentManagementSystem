using StudentManagementSystem.DTOs;
using StudentManagementSystem.Models;
using StudentManagementSystem.Repositories;

namespace StudentManagementSystem.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repo;
        private readonly ILogger<StudentService> _logger;

        public StudentService(IStudentRepository repo, ILogger<StudentService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<IEnumerable<Student>> GetAll()
            => await _repo.GetAllAsync();

        public async Task<Student> GetById(int id)
            => await _repo.GetByIdAsync(id);

        public async Task Add(StudentDto dto)
        {
            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                Age = dto.Age,
                Course = dto.Course,
                CreatedDate = DateTime.Now
            };

            await _repo.AddAsync(student);
        }

        public async Task Update(int id, StudentDto dto)
        {
            var student = await _repo.GetByIdAsync(id);
            if (student == null) throw new Exception("Student not found");

            student.Name = dto.Name;
            student.Email = dto.Email;
            student.Age = dto.Age;
            student.Course = dto.Course;

            await _repo.UpdateAsync(student);
        }

        public async Task Delete(int id)
        {
            var student = await _repo.GetByIdAsync(id);

            if (student == null)
            {
                _logger.LogWarning("Delete failed. Student not found with Id: {Id}", id);
                throw new KeyNotFoundException("Student not found");
            }

            _logger.LogInformation("Deleting student with Id: {Id}", id);

            await _repo.DeleteAsync(student);
        }
    }
}
