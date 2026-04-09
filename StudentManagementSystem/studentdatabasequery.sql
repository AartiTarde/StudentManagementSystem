CREATE TABLE Students (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Age INT,
    Course NVARCHAR(100),
    CreatedDate DATETIME DEFAULT GETDATE()
);

SELECT * FROM Students;

INSERT INTO Students (Name, Email, Age, Course)
VALUES ('Aarti', 'aarti@test.com', 22, 'Computer Science');