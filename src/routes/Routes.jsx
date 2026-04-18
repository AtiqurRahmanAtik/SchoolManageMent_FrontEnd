import { createBrowserRouter, Navigate } from "react-router-dom";

// --- Layouts & Roots ---
import Root from "./Root/Root";
import PrivateRoot from "./Root/PrivateRoot";
import Aroot from "./Root/Aroot"; // Dashboard Layout (Sidebar/Header)

// --- Public Pages ---


// --- Dashboard Pages ---
import Home from "../pages/Dashboard/Home"; // Main Dashboard view
// (You will need to create the following components in your pages folder)













import Teachers from "../pages/Dashboard/Teachers";
import Section from "../pages/Dashboard/Section";
import Classes from "../pages/Dashboard/Classes";
import Admissions from "../pages/Dashboard/Admissions";
import AttendanceReport from "../pages/Dashboard/AttendanceReport";
import Attendance from "../pages/Dashboard/Attendance";
import Calendar from "../pages/Dashboard/Calendar";

import Subjects from "../pages/Dashboard/Subjects";
import TeacherAttendance from "../pages/Dashboard/TeacherAttendance";

import Exams from "../pages/Dashboard/Exams";
import Results from "../pages/Dashboard/Results";
import Routine from "../pages/Dashboard/Routine";
import Salary from "../pages/Dashboard/Salary";
import Notices from "../pages/Dashboard/Notices";
import Progress from "../pages/Dashboard/Progress";
import Students from "../pages/Dashboard/Students";
import Login from "../pages/Login";
import Register from "../pages/Register";

import HomePage from "../pages/HomePage";
import Error404 from "../pages/Error404";
import NavHome from "../pages/NavHome";
import Employee from "../pages/Dashboard/Employee";
import EmployeeAttendance from "../pages/Dashboard/EmployeeAttendance";
import EmployeeRole from "../pages/Dashboard/EmployeeRole";




export const router = createBrowserRouter([
  // ==========================================
  // PUBLIC ROUTES (Website Front-End)
  // ==========================================
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      // Navbar routes (Home Page Wrapper)
      {
        path: "/",
        element: <NavHome />, // NavHome stays on the screen always
        children: [
          {
            path: "/", // When the user is at the root URL
            element: <HomePage />, // Show all the banners and sliders
          },
        ],
      },
    ],
  },

  // ==========================================
  // PRIVATE ROUTES (Admin/School Dashboard)
  // ==========================================
  {
    // Pathless layout route to wrap everything in Aroot (Sidebar/Header)
    element: <Aroot />,
    errorElement: <Error404 />,
    children: [
      {
        path: "dashboard",
        element: <PrivateRoot><Home /></PrivateRoot>,
      },
      {
        path: "students",
        element: <PrivateRoot><Students /></PrivateRoot>,
      },
      {
        path: "admissions",
        element: <PrivateRoot><Admissions /></PrivateRoot>,
      },
      {
        path: "teachers",
        element: <PrivateRoot><Teachers /></PrivateRoot>,
      },
      {
        path: "employee",
        element: <PrivateRoot><Employee /></PrivateRoot>,
      },
      {
        path: "classes",
        element: <PrivateRoot><Classes /></PrivateRoot>,
      },
      {
        path: "section",
        element: <PrivateRoot><Section /></PrivateRoot>,
      },
      {
        path: "subjects",
        element: <PrivateRoot><Subjects /></PrivateRoot>,
      },
      {
        path: "attendance",
        element: <PrivateRoot><Attendance /></PrivateRoot>,
      },
      {
        path: "teacher-attendance",
        element: <PrivateRoot><TeacherAttendance /></PrivateRoot>,
      },
        {
        path: "employee-role",
        element: <PrivateRoot><EmployeeRole /></PrivateRoot>,
      },
      {
        path: "employee-attendance",
        element: <PrivateRoot><EmployeeAttendance /></PrivateRoot>,
      },
      {
        path: "attendance-report",
        element: <PrivateRoot><AttendanceReport /></PrivateRoot>,
      },
      {
        path: "exams",
        element: <PrivateRoot><Exams /></PrivateRoot>,
      },
      {
        path: "results",
        element: <PrivateRoot><Results /></PrivateRoot>,
      },
      {
        path: "routine",
        element: <PrivateRoot><Routine /></PrivateRoot>,
      },
      {
        path: "salary",
        element: <PrivateRoot><Salary /></PrivateRoot>,
      },
      {
        path: "notices",
        element: <PrivateRoot><Notices /></PrivateRoot>,
      },
      {
        path: "calendar",
        element: <PrivateRoot><Calendar /></PrivateRoot>,
      },
      {
        path: "progress",
        element: <PrivateRoot><Progress /></PrivateRoot>,
      },
      // --- Logout Route ---
      {
        path: "logout",
        element: <PrivateRoot><Navigate to="/" replace /></PrivateRoot>,
      },
    ],
  },
]);