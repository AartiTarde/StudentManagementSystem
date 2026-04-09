# 🎓 Student Management System (Full Stack)

## 📌 Overview

The **Student Management System** is a full-stack web application developed using **ASP.NET Core Web API (Backend)** and **React.js (Frontend)**.
It enables secure management of student records with full CRUD functionality and JWT-based authentication.

---

## 🚀 Features

### 🔹 Backend (ASP.NET Core Web API)

* RESTful API for student management
* JWT Authentication & Authorization
* Global Exception Handling Middleware
* Structured Logging using Serilog
* Swagger API Documentation
* Layered Architecture (Controller, Service, Repository)

### 🔹 Frontend (React.js)

* User Login with JWT Authentication
* View, Add, Update, Delete Students
* API integration using Axios
* Protected routes using token

---

## 🛠️ Technology Stack

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* JWT Authentication
* Serilog
* Swagger

### Frontend

* React.js
* Axios
* React Router DOM

---

## 📂 Project Structure

```id="s9r7k2"
StudentManagementSystem/
│
├── Backend/
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/
│   ├── DTOs/
│   ├── Data/
│   ├── Middleware/
│   └── Program.cs
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   └── App.js
│
└── README.md
```

---

## 📦 Backend Dependencies

| Package                                       | Version |
| --------------------------------------------- | ------- |
| Microsoft.AspNetCore.Authentication.JwtBearer | 8.0.25  |
| Microsoft.EntityFrameworkCore                 | 8.0.25  |
| Microsoft.EntityFrameworkCore.SqlServer       | 8.0.25  |
| Microsoft.EntityFrameworkCore.Tools           | 8.0.25  |
| Serilog.AspNetCore                            | 8.0.3   |
| Serilog.Sinks.Console                         | 6.1.1   |
| Serilog.Sinks.File                            | 7.0.0   |
| Swashbuckle.AspNetCore                        | 8.1.4   |

---

## ⚙️ Setup Instructions

---

### 🔹 Backend Setup

1. Navigate to backend folder:

```bash id="yq1n3d"
cd Backend
```

2. Restore dependencies:

```bash id="c2q7lm"
dotnet restore
```

3. Configure `appsettings.json`:

```json id="5tw1vh"
"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=StudentDB;Trusted_Connection=True;TrustServerCertificate=True;"
},
"Jwt": {
  "Key": "YourStrongSecretKey1234567890!@#",
  "Issuer": "StudentAPI",
  "Audience": "StudentAPIUsers",
  "DurationInMinutes": 60
}
```

4. Apply migrations:

```bash id="k8xv4m"
dotnet ef database update
```

5. Run backend:

```bash id="h4t2zd"
dotnet run
```

👉 API runs at:

```id="azx8vy"
https://localhost:7278
```

---

### 🔹 Frontend Setup

1. Navigate to frontend folder:

```bash id="pr8zqk"
cd Frontend
```

2. Install dependencies:

```bash id="t9k3wd"
npm install
```

3. Start application:

```bash id="z8x1pw"
npm start
```

👉 App runs at:

```id="f2q8mn"
http://localhost:3000
```

---

## 🔐 Authentication Flow

1. User logs in via:

   ```
   /api/auth/login
   ```
2. JWT token is generated
3. Token stored in browser
4. Token sent in header:

```id="u7w4r9"
Authorization: Bearer <token>
```

---

## 📘 API Endpoints

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| POST   | /api/auth/login   | Generate JWT token |
| GET    | /api/student      | Get all students   |
| POST   | /api/student      | Add student        |
| PUT    | /api/student/{id} | Update student     |
| DELETE | /api/student/{id} | Delete student     |

---

## 📊 Logging

Logs are generated using Serilog:

```id="m3z9kp"
/logs/log.txt
```

---

## ⚠️ Common Issues

| Issue               | Solution               |
| ------------------- | ---------------------- |
| 401 Unauthorized    | Add Bearer token       |
| DB connection error | Check SQL Server       |
| CORS error          | Enable CORS in backend |
| JWT invalid         | Check secret key       |

---

## 🧪 Testing

Use Swagger UI:

```id="d4v7tx"
https://localhost:7278/swagger
```

---

## 📚 References

* https://learn.microsoft.com/aspnet/core
* https://reactjs.org/
* https://serilog.net/

---

## 👨‍💻 Author

Developed as part of a full-stack assignment demonstrating modern web development practices using .NET and React.

---

## ⭐ Conclusion

This project demonstrates a **secure, scalable, and maintainable full-stack application** using industry-standard tools and architecture.
