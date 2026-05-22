# TOEIC Project - Complete File Structure and Overview

## Project Architecture
This is a full-stack TOEIC (Test of English for International Communication) learning platform with three main components:
- **BackEnd**: Java Spring Boot REST API
- **FrontEnd**: React + Vite with Tailwind CSS
- **Python**: FastAPI service for analysis

---

## 📁 BACKEND (Java Spring Boot)

### Core Configuration
- **pom.xml** - Maven build configuration
  - Spring Boot 3.2.5
  - Java 21
  - Dependencies: JPA, MySQL, Security, Mail, JJWT, OpenAPI Doc
  - MySQL Connector, Spring Security, Spring Mail

- **application.properties** - Application configuration
  ```properties
  MySQL Database: toeic_db (localhost:3306, user: root)
  Mail: Gmail SMTP (hvthang1705@gmail.com)
  Groq API Key configured
  Hibernate: update DDL
  ```

### Project Structure
```
src/main/java/com/toeic/backend/
├── BackendApplication.java          # Main Spring Boot entry point
├── entity/                          # JPA Entities
│   ├── User.java                    # User (id, username, email, password, role)
│   ├── ToeicTest.java              # TOEIC Test (id, title, description, status, createdAt)
│   ├── Part5.java                  # Part 5 Questions (id, question_number, question, options A-D, answer, explanation, label)
│   ├── Part6.java                  # Part 6 Questions
│   ├── Part7.java                  # Part 7 Questions
│   ├── Role.java                   # Role enum
│   └── PasswordResetToken.java      # Password reset token management
├── repository/                      # JPA Repositories
│   ├── UserRepository              # User queries (findByUsername, findByEmail)
│   ├── ToeicTestRepo               # Test CRUD
│   ├── Part5Repo                   # Part 5 CRUD
│   ├── Part6Repo                   # Part 6 CRUD
│   ├── Part7Repo                   # Part 7 CRUD
│   ├── ProgressRepo                # Progress tracking
│   ├── PlacementTestRepo           # Placement test
│   ├── LessonRepo                  # Lessons
│   ├── RoleRepo                    # Role management
│   └── PasswordResetTokenRepository # Token management
├── controller/                      # REST Controllers
│   ├── AuthController              # Auth endpoints (/api/auth)
│   │   ├── POST /register          # User registration
│   │   ├── POST /login             # User login
│   │   ├── GET /profile            # User profile (JWT header)
│   │   └── POST /forgot-password   # Password reset
│   ├── ToeicTestController         # Test management endpoints (/api/tests)
│   │   ├── POST                    # Create test
│   │   ├── GET                     # Get all tests
│   │   └── GET /{id}               # Get full test with parts (READY status only)
│   ├── UserController              # User management
│   ├── AdminController             # Admin operations
│   ├── Part5Controller             # Part 5 management
│   ├── Part6Controller             # Part 6 management
│   ├── Part7Controller             # Part 7 management
│   ├── PlacementTestController     # Placement test
│   ├── ProgressController          # Progress tracking
│   ├── StudyPlantController        # Study plan management
│   ├── TestController              # General test operations
│   ├── HomeController              # Home page
│   └── AiController                # AI features
├── service/                         # Business Logic Layer
│   ├── AuthService                 # Authentication logic (login with username/password)
│   ├── ToeicTestService            # Test creation and status management
│   │   ├── createTest()            # Create test with DRAFT status
│   │   └── updateStatus()          # Update to READY if all parts present
│   ├── UserService                 # User management
│   ├── EmailService                # Email sending (password reset, etc.)
│   ├── AIService                   # AI features (placeholder)
│   ├── Part5Service                # Part 5 business logic
│   ├── Part6Service                # Part 6 business logic
│   ├── Part7Service                # Part 7 business logic
│   ├── LearningService             # Learning features
│   ├── ProgressService             # Progress tracking
│   ├── PlacementTestService        # Placement test logic
│   └── StudyPlanService            # Study plan generation
├── security/                        # Security Configuration
│   └── JwtUtil                      # JWT Token Management
│       ├── SECRET: "toeic-secret-key-toeic-secret-key-toeic-secret-key"
│       ├── generateToken()          # Create JWT token with username
│       ├── generateToken(username, role)  # Create JWT with role claim
│       ├── extractUsername()        # Extract subject from token
│       └── validateToken()          # Verify token validity (24hr expiration)
├── config/                          # Spring Configuration
├── data/                            # Data models/DTOs
├── API/                             # API documentation/specs
└── ai/                              # AI integration
```

### Key Features
- **Authentication**: JWT-based authentication with password encryption
- **Test Management**: Create TOEIC tests composed of Part 5, 6, 7
- **User Roles**: USER and ADMIN roles
- **Password Reset**: Email-based password reset with tokens
- **Progress Tracking**: Track user learning progress
- **Email Service**: Gmail SMTP integration
- **Placement Tests**: Initial assessment tests
- **AI Integration**: Groq API for AI features

---

## 🎨 FRONTEND (React + Vite)

### Configuration Files
- **package.json** - Dependencies and scripts
  ```json
  Scripts: dev (vite), build, lint (eslint), preview
  Key Dependencies:
  - react 19.2.0
  - react-router-dom 7.13.1
  - axios 1.13.6
  - tailwindcss 4.2.2
  - recharts 3.8.0 (charts)
  - framer-motion 12.38.0 (animations)
  - lucide-react 1.0.1 (icons)
  - react-icons 5.6.0 (additional icons)
  - react-calendar-heatmap 1.10.0 (calendar visualization)
  ```

- **vite.config.js** - Vite configuration with React and Tailwind
- **tailwind.config.js** - Tailwind CSS configuration
- **index.html** - HTML entry point

### Application Structure
```
src/
├── main.jsx                         # React entry point
│   └── Configures axios with credentials
├── App.jsx                          # Main routing component
│   Routes:
│   ├── / → AuthCheck (session verification)
│   ├── /login → Login page
│   ├── /register → Register page
│   ├── /forgot → ForgotPassword page
│   └── Protected routes:
│       ├── UserLayout:
│       │   ├── /dashboard → User Dashboard
│       │   └── /profile → User Profile
│       └── AdminLayout:
│           ├── /admin/dashboard → Admin Dashboard
│           └── /admin/upload → Upload page
├── index.css                        # Global styles
├── App.css                          # App-specific styles
├── main.jsx                         # App bootstrap
├── mockData.js                      # Mock data for UI development
│
├── auth/
│   └── AuthCheck.jsx               # Session check component
│       └── Calls /api/auth/me endpoint
│       └── Redirects based on role (ADMIN vs USER)
│
├── layouts/
│   ├── UserLayout.jsx              # User dashboard layout
│   └── AdminLayout.jsx             # Admin dashboard layout
│
├── pages/
│   ├── Login.jsx                   # Login form (email/password)
│   ├── Register.jsx                # Registration form (username, email, password)
│   │   └── Custom typing animation effect
│   ├── ForgotPassword.jsx          # Password recovery
│   ├── User/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx       # Main user dashboard
│   │   │   ├── Dashboard.css       # Dashboard styles
│   │   │   ├── WelcomeCard.jsx     # Welcome greeting
│   │   │   ├── AICard.jsx          # AI insights card
│   │   │   ├── StatsCard.jsx       # Statistics display
│   │   │   ├── WeaknessCard.jsx    # Weakness analysis
│   │   │   ├── PredictionCard.jsx  # Score prediction
│   │   │   ├── QuickAction.jsx     # Quick action buttons
│   │   │   ├── ActivityCard.jsx    # User activity log
│   │   │   ├── ProgressChart.jsx   # Progress visualization
│   │   │   └── CalendarCard.jsx    # Activity calendar heatmap
│   │   ├── Home/
│   │   ├── Learning/
│   │   ├── Profile/
│   │   ├── Progress/
│   │   └── StudyPlant/
│   └── Admin/
│       ├── Dashboard/
│       │   ├── AdminDashboard.jsx
│       │   └── AdminDashboard.css
│       ├── ManageAnswer/
│       │   ├── ManageAnswer.jsx
│       │   └── ManageAnswer.css
│       ├── ManageQuestion/
│       │   ├── ManageQuestion.jsx
│       │   └── ManageQuestion.css
│       ├── ManageUser/
│       │   ├── ManageUser.jsx
│       │   └── ManageUser.css
│       ├── ManageVocabulary/
│       │   ├── ManageVocabulary.jsx
│       │   └── ManageVocabulary.css
│       ├── Statistics/
│       │   ├── Statistics.jsx
│       │   └── Statistic.css
│       └── Upload/
│
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.css
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── HeaderAdmin.jsx
│   │   │   └── HeaderUser.jsx    # User header with search, notifications, user menu
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   ├── Navbar/
│   │   │   └── Navbar.jsx
│   │   └── Sidebar/
│   │       ├── Sidebar.jsx
│   │       ├── Sidebar.css
│   │       ├── SidebarAdmin.jsx
│   │       └── SidebarUser.jsx
│   └── Other custom components
│
├── hooks/
│   └── useDarkMode.jsx             # Custom dark mode hook
│
├── services/
│   └── authService.js              # API service (currently empty)
│
├── styles/
│   ├── global.css                  # Global styles
│   ├── reset.css                   # CSS reset
│   ├── typography.css              # Typography styles
│   └── variables.css               # CSS variables
│
└── assets/
    └── Static assets (images, etc.)
```

### Key Features
- **Authentication**: Login/Register/Forgot Password flows
- **Session Management**: AuthCheck on app load
- **Role-Based UI**: Different layouts for USER and ADMIN
- **Dashboard**: Comprehensive user dashboard with AI insights
- **Admin Panel**: Manage questions, answers, users, vocabulary
- **Visualizations**: Progress charts, activity calendars
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Animations**: Smooth transitions with Framer Motion
- **Dark Mode**: Custom hook for theme switching

---

## 🐍 PYTHON Backend (FastAPI)

### Configuration
- **main.py** - FastAPI application entry point
  ```python
  from fastapi import FastAPI
  app = FastAPI()
  
  @app.get("/")
  def home():
      return {"message": "AI service running"}
  ```

- **requirements.txt** - Dependencies
  ```
  FastAPI 0.128.8
  Uvicorn 0.39.0 (ASGI server)
  Pydantic 2.12.5 (data validation)
  Numpy 2.0.2
  Pandas 2.3.3
  Starlette 0.49.3
  Other: h11, anyio, click, exceptiongroup, typing-extensions, etc.
  ```

### Project Structure
```
Python/
├── main.py                         # FastAPI app bootstrap
├── requirements.txt                # Python dependencies
└── modules/
    └── analyze/
        ├── router.py              # API routes (empty)
        ├── service.py             # Business logic (empty)
        ├── schema.py              # Pydantic models (empty)
        └── model.py               # Data models (empty)
```

### Status
- Basic FastAPI setup configured
- Analysis module structure in place but largely empty
- Ready for implementation of AI analysis features

---

## 🌐 API Endpoints Summary

### Authentication Endpoints
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login (returns email, role)
GET    /api/auth/profile           Get user profile (requires JWT)
GET    /api/auth/me                Get current user session
POST   /api/auth/forgot-password   Request password reset
```

### Test Management Endpoints
```
GET    /api/tests                  List all TOEIC tests
POST   /api/tests                  Create new test
GET    /api/tests/{id}             Get full test (if READY status)
```

### Admin Endpoints
```
Implied routes for:
- Managing users
- Managing questions
- Managing answers
- Managing vocabulary
- Uploading content
- Viewing statistics
```

### User Endpoints
```
Implied routes for:
- User dashboard data
- Progress tracking
- Study plans
- Placement tests
- Learning materials
```

---

## 🔐 Security Features

### Authentication
- JWT token-based authentication (24-hour expiration)
- Password encryption with Spring Security PasswordEncoder
- Session management with HttpSession

### Authorization
- Role-based access control (USER vs ADMIN)
- Protected routes based on user role

### API Security
- CORS enabled for localhost:5173 (Frontend)
- Credentials included in requests (withCredentials: true)

---

## 📊 Database Schema (MySQL)

### Tables
- `users` - User accounts (id, username, email, password, role)
- `toeic_test` - TOEIC exams (id, title, description, status, createdAt)
- `part5` - Reading questions (id, question_number, question, options, answer, explanation, label, test_id)
- `part6` - Error identification questions (similar structure)
- `part7` - Reading comprehension questions (similar structure)
- `password_reset_tokens` - Password reset tokens
- Other tables for progress, lessons, placements, roles

---

## 🔧 Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Spring Boot | 3.2.5 |
| Java Version | OpenJDK | 21 |
| Database | MySQL | (local) |
| ORM | Hibernate/JPA | (bundled) |
| Security | Spring Security | 6.x |
| JWT | JJWT | 0.11.5 |
| Frontend | React | 19.2.0 |
| Frontend Build | Vite | 7.2.4 |
| Styling | Tailwind CSS | 4.2.2 |
| Routing | React Router | 7.13.1 |
| HTTP Client | Axios | 1.13.6 |
| Animations | Framer Motion | 12.38.0 |
| Python Service | FastAPI | 0.128.8 |
| AI Integration | Groq API | (configured) |

---

## 📝 Development Status

### Implemented ✅
- Core authentication system
- User/Admin role system
- TOEIC test structure (Part 5, 6, 7)
- Basic dashboard UI
- Admin management panels
- JWT security
- MySQL database integration
- FastAPI bootstrap

### In Progress 🔄
- Admin upload/management features
- Progress tracking system
- AI analysis features
- Study plan generation

### Todo 📋
- Placement test system
- Learning features
- Python analysis service implementation
- Comprehensive error handling
- Logging system
- Unit/Integration tests

---

## 🚀 Running the Project

### Backend
```bash
cd BackEnd
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd FrontEnd
npm install
npm run dev
# Runs on http://localhost:5173
```

### Python Service
```bash
cd Python
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```
