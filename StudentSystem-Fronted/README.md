Student Management System – Frontend (React)

1. Introduction

This project is the frontend implementation of a Student Management System developed using React.js. It interacts with an ASP.NET Core Web API backend and supports secure operations through JWT-based authentication.

The application enables users to manage student records, including creating, viewing, updating, and deleting data.


2. Features

 1.Secure user authentication using JWT
 2.Retrieve all student records
 3.Add new student details
 4.Update existing student information
 5.Delete student records
 6.Integration with RESTful Web API

3. Technology Stack

1. Frontend: React.js
2. HTTP Client: Axios
3. Routing: React Router DOM
4. Backend (API): ASP.NET Core Web API
5. Authentication: JWT (JSON Web Token)


4. Prerequisites

Ensure the following are installed on your system:

* Node.js (v16 or higher)
* npm (v8 or higher)
* Running backend API (ASP.NET Core)



5. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd student-ui
npm install
```

Alternatively, install required packages manually:

```bash
npm install axios react-router-dom
```

---

6. Running the Application

To start the development server:

```bash
npm start
```

The application will run at:

```
http://localhost:3000
```

---

7. Backend Configuration

Ensure the backend API is running before starting the frontend.

Example API base URL:

```
https://localhost:7278/api
```

Update the base URL in the API configuration file if required.

---

8. Authentication Workflow

1. The user logs in using valid credentials (Username :admin ,Password : 1234)
2. The backend generates a JWT token
3. The token is stored in browser storage
4. The token is included in the Authorization header for secured requests

---

## 9. Project Structure

```
src/
 ├── api/
 │    └── api.js
 ├── pages/
 │    ├── Login.js
 │    └── Students.js
 ├── App.js
 └── index.js
```

---

## 10. Available Scripts

 `npm start` – Runs the application in development mode
 `npm run build` – Builds the application for production
 `npm run eject` – Ejects configuration (irreversible)

---

## 11. Deployment

To generate a production build:

```bash
npm run build
```

The optimized files will be available in the `build/` directory.

---

