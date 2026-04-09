# Student Management System – Backend (ASP.NET Core Web API)

## 1. Introduction

This project is the backend implementation of a **Student Management System** developed using **ASP.NET Core Web API**. It provides RESTful endpoints for managing student data and ensures secure access using **JWT Authentication**.

The application follows a **layered architecture** to maintain clean separation of concerns and scalability.

---

## 2. Features

* CRUD operations for student management
* JWT-based authentication and authorization
* Global exception handling using middleware
* Structured logging using Serilog
* Swagger API documentation
* Layered architecture (Controller, Service, Repository)

---

## 3. Technology Stack

* Framework : ASP.NET Core Web API(version 8)
* Language : C#
* Database: SQL Server
* ORM: Entity Framework Core
* Authentication: JWT (JSON Web Token)
* Logging: Serilog
* API Documentation: Swagger

---

## 4. Dependencies / NuGet Packages

| Package                                       | Version | Purpose                                 |
| --------------------------------------------- | ------- | --------------------------------------- |
| Microsoft.AspNetCore.Authentication.JwtBearer | 8.0.25  | JWT authentication and token validation |
| Microsoft.EntityFrameworkCore                 | 8.0.25  | ORM for database operations             |
| Microsoft.EntityFrameworkCore.SqlServer       | 8.0.25  | SQL Server provider                     |
| Microsoft.EntityFrameworkCore.Tools           | 8.0.25  | EF Core migrations                      |
| Serilog.AspNetCore                            | 8.0.3   | Logging integration                     |
| Serilog.Sinks.Console                         | 6.1.1   | Console logging                         |
| Serilog.Sinks.File                            | 7.0.0   | File logging                            |
| Swashbuckle.AspNetCore                        | 8.1.4   | Swagger documentation                   |

---

## 5. Installation of Packages

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.25
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.25
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.25
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.25
dotnet add package Serilog.AspNetCore --version 8.0.3
dotnet add package Serilog.Sinks.Console --version 6.1.1
dotnet add package Serilog.Sinks.File --version 7.0.0
dotnet add package Swashbuckle.AspNetCore --version 8.1.4
```

---

## 6. Project Architecture

```text
Controllers/   → Handles HTTP requests  
Services/      → Business logic  
Repositories/  → Data access  
Models/        → Entity models  
DTOs/          → Data transfer objects  
Data/          → DbContext  
Middleware/    → Exception handling  
```

---

## 7. Database Schema

	Students Table

| Column      | Type               |
| ----------- | ------------------ |
| Id          | INT (PK, Identity) |
| Name        | NVARCHAR(100)      |
| Email       | NVARCHAR(100)      |
| Age         | INT                |
| Course      | NVARCHAR(100)      |
| CreatedDate | DATETIME           |

---

## 8. Prerequisites

* .NET SDK 6 or later
* SQL Server (Express or Full)
* SQL Server Management Studio (SSMS)

---

## 9. Database Configuration

Update `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=StudentDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

---

## 10. JWT Configuration

```json
"Jwt": {
  "Key": "YourStrongSecretKey1234567890!@#",
  "Issuer": "StudentAPI",
  "Audience": "StudentAPIUsers",
  "DurationInMinutes": 60
}
```

---

## 11. Apply Migrations

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 12. Running the Application

```bash
dotnet run
```

API URL:

```text
https://localhost:7278
```

Swagger UI:

```text
https://localhost:7278/swagger
```

---

## 13. API Endpoints

### Authentication

* POST `/api/auth/login` → Generate JWT token

### Student APIs

* GET `/api/student` → Get all students
* POST `/api/student` → Add new student
* PUT `/api/student/{id}` → Update student
* DELETE `/api/student/{id}` → Delete student

