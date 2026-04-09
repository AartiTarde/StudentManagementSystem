using StudentManagementSystem.DTOs;
using StudentManagementSystem.Models;

namespace StudentManagementSystem.Services
{
    public interface IStudentService
    {
        Task<IEnumerable<Student>> GetAll();
        Task<Student> GetById(int id);
        Task Add(StudentDto dto);
        Task Update(int id, StudentDto dto);
        Task Delete(int id);
    }
}
