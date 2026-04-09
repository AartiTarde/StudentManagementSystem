namespace StudentManagementSystem.DTOs
{
    /// <summary>
    /// Data Transfer Object for student operations.
    /// </summary>
    public class StudentDto
    {
        
        public string Name { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
        public string Course { get; set; }
    }
}