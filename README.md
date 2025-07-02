# 🚀 Task Manager

<p align="center">
  <img src="https://res.cloudinary.com/damlr67d9/image/upload/v1751454105/taskmanager-logo_hfm2lq.svg" alt="Task Manager Logo" width="120" />
</p>

<p align="center">
  <b>Modern, full-stack Task Manager for teams & individuals</b><br>
  <i>Role-based dashboards, real-time progress, file uploads, analytics, and more.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/MongoDB-6.x-brightgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/Ant%20Design-5.x-blue?logo=ant-design" />
</p>

---

## 📑 Table of Contents

- [🖼️ Preview](#️-preview)
- [✨ Features](#-features)
- [🗂️ Project Structure](#️-project-structure)
- [🔧 Backend Details](#-backend-details)
- [🎨 Frontend Details](#-frontend-details)
- [⚡ Quick Start](#-quick-start)
- [🛠️ API Endpoints (Backend)](#️-api-endpoints-backend)
- [👥 Authors](#-authors)

---

## 🖼️ Preview

<p align="center">
  <a href="https://drive.google.com/file/d/12bhg3GLBJ-DRK9DlqcjNAAm1SoG29ksP/view?usp=sharing" target="_blank">
    <img src="https://res.cloudinary.com/damlr67d9/image/upload/v1751469148/admin-dashboard-dark_ssj0ag.png" alt="Task Manager Demo Video" width="480" />
    <br>
    <i>Watch Demo Video</i>
  </a>
</p>

---

## ✨ Features

- **Authentication & Roles**: Secure JWT login, Admin & Member roles
- **Admin Dashboard**: Manage users, create/assign tasks, export reports
- **User Dashboard**: View & update assigned tasks, see personal stats
- **Task Management**: Priorities, statuses (Pending, In Progress, Completed, Overdue), checklists
- **File Uploads**: Cloudinary integration for images & attachments
- **Data Visualization**: Charts for task distribution & priorities
- **Modern UI**: Ant Design, dark/light mode, avatars, progress bars
- **Export**: Download tasks/users as Excel

---

## 🗂️ Project Structure

```
Task-manager/
├── backend/           # Node.js/Express REST API
│   ├── config/        # Database & cloudinary config
│   ├── controllers/   # Route logic for auth, tasks, users, reports
│   ├── middlewears/   # Auth & file upload middleware
│   ├── models/        # Mongoose schemas (User, Task)
│   ├── routes/        # API route definitions
│   ├── uploads/       # Uploaded files (gitignored)
│   └── index.js       # App entry point
│
├── frontend/          # React + Vite client
│   ├── public/        # Static assets
│   ├── src/
│   │   ├── Admin/     # Admin dashboard pages
│   │   ├── User/      # User dashboard pages
│   │   ├── auth/      # Login/Signup
│   │   ├── components/# Reusable UI components
│   │   ├── context/   # React context providers
│   │   ├── hooks/     # Custom React hooks
│   │   ├── utils/     # API paths, axios config, helpers
│   │   └── routes/    # Route protection
│   ├── index.html     # App HTML template
│   └── main.jsx       # App entry point
└── README.md          # Project documentation
```

---

## 🔧 Backend Details

- `index.js`: Sets up Express, connects to MongoDB, configures CORS, JSON parsing, static uploads, and API routes.
- **config/:**
  - `db.js`: Connects to MongoDB using Mongoose
  - `cloudinary.js`: Configures Cloudinary for file uploads
- **controllers/:**
  - `authControllers.js`: Handles registration, login, profile, password hashing, JWT
  - `userControllers.js`: Admin user management, user details, task counts
  - `taskControllers.js`: Task CRUD, assignment, filtering, sorting, progress, checklist
  - `reportControllers.js`: Exports tasks/users to Excel
- **middlewears/:**
  - `authMiddlewears.js`: JWT protection, admin-only access
  - `uploadMiddlewears.js`: Multer memory storage, file type/size filter, Cloudinary upload
- **models/:**
  - `User.js`: User schema (name, email, password, profile image, role, timestamps)
  - `Task.js`: Task schema (title, description, priority, status, due date, assigned users, attachments, checklist, progress, timestamps)
- **routes/:**
  - `authRoutes.js`: Register, login, profile, image upload
  - `userRoutes.js`: Admin user management, user details
  - `taskRoutes.js`: Task CRUD, assignment, dashboard data
  - `reportRoutes.js`: Export tasks/users to Excel

---

## 🎨 Frontend Details

- **App.jsx:** Main router, role-based route protection, redirects, 404 handling
- **Admin/:**
  - `Dashboard.jsx`: Admin dashboard (stats, charts, recent tasks)
  - `CreateTask.jsx`: Create or update tasks
  - `ManageTask.jsx`: List, search, filter, download tasks
  - `ManageUsers.jsx`: List/search users, view user details
- **User/:**
  - `UserDashboard.jsx`: User dashboard (stats, charts, recent tasks)
  - `MyTasks.jsx`: List assigned tasks
  - `TaskDetails.jsx`: Task details, progress, checklist
- **auth/:**
  - `Login.jsx`, `Signup.jsx`: Auth forms, validation, profile image upload
- **components/:**
  - `DashboardLayout.jsx`: Sidebar, theming, navigation
  - `AdminSummary.jsx`, `TaskCharts.jsx`, `RecentTasksSection.jsx`: Dashboard widgets
  - `GenericTaskList.jsx`: Task list with search, filter, sort, progress
  - `TaskForm.jsx`: Create/update task form
  - `UserDetailView.jsx`: User details, assigned tasks
  - `UserSelectionModal.jsx`: Assign users to tasks
  - `Loading.jsx`, `Forbidden.jsx`, `NotFoundPage.jsx`: UX helpers
- **context/:**
  - `ThemeContext.js`, `ThemeProvider.jsx`: Dark/light mode
  - `UserContext.js`, `userProvider.jsx`: User state, auth context
- **hooks/:**
  - `useTasks.jsx`: Fetch, filter, and manage tasks
- **utils/:**
  - `apiPaths.js`: API endpoint paths
  - `axiosConfig.js`: Axios instance with auth
  - `data.jsx`: Sidebar menu data, constants

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/goutam-dev/Task-manager.git
cd Task-manager
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Setup

- **Backend**: Create `backend/.env` with:
  ```env
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ADMIN_INVITE_TOKEN=your_admin_token
  ```
- **Frontend**: Create `frontend/.env` (optional for API URL):
  ```env
  VITE_API_BASE_URL=http://localhost:5000
  ```

### 3. Run the App

- **Backend**:
  ```bash
  cd backend
  npm run dev   # or npm start
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```
- Visit: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ API Endpoints (Backend)

<details>
<summary><b>Click to expand</b></summary>

### Auth

- `POST   /api/auth/register` — Register user/admin
- `POST   /api/auth/login` — Login
- `GET    /api/auth/profile` — Get profile (auth)

- `POST   /api/auth/upload-image` — Upload profile image

### Tasks

- `GET    /api/tasks/` — List tasks (admin: all, user: assigned)
- `POST   /api/tasks/` — Create task (admin)
- `GET    /api/tasks/:id` — Get task by ID
- `PUT    /api/tasks/:id` — Update task
- `DELETE /api/tasks/:id` — Delete task (admin)
- `PUT    /api/tasks/:id/status` — Update status
- `PUT    /api/tasks/:id/todo` — Update checklist
- `GET    /api/tasks/dashboard-data` — Admin dashboard stats
- `GET    /api/tasks/user-dashboard-data` — User dashboard stats

### Users

- `GET    /api/users/` — List users (admin)
- `GET    /api/users/:id` — Get user
- `GET    /api/users/details/:id` — User details + tasks (admin)

### Reports

- `GET    /api/reports/export/tasks` — Export all tasks (Excel)
- `GET    /api/reports/export/users` — Export user-task report (Excel)

</details>

---

## 👨‍💻 Authors

<div align="center">
  <a href="https://github.com/goutam-dev" target="_blank">
    <img src="https://img.shields.io/badge/Author-Goutam-blue?style=for-the-badge" alt="Goutam" />
  </a>
  <a href="https://github.com/huzaifa-cell" target="_blank">
    <img src="https://img.shields.io/badge/Author-Huzaifa-green?style=for-the-badge" alt="Huzaifa" />
  </a>
</div>

---
