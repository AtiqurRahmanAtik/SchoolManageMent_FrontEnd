import { createBrowserRouter, Navigate } from "react-router-dom";

// --- Layouts & Roots ---
import Root from "./Root/Root";
import PrivateRoot from "./Root/PrivateRoot";
import Aroot from "./Root/Aroot"; // Dashboard Layout (Sidebar/Header)

// --- Public Pages ---


// --- Dashboard Pages ---
import Home from "../pages/Dashboard/Home"; // Main Dashboard view
// (You will need to create the following components in your pages folder)
import Students from "../pages/Students/Students";
import Admissions from "../pages/Admissions/Admissions";
import Error404 from "../pages/Error404/Error404";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import NavHome from "../pages/NavHome/NavHome";
import HomePage from "../pages/HomePage/HomePage";

import Staff from "../pages/Staff/Staff";

import Subjects from "../pages/Subjects/Subjects";
import Attendance from "../pages/Attendance/Attendance";
import TeacherAttendance from "../pages/TeacherAttendance/TeacherAttendance";
import StaffAttendance from "../pages/StaffAttendance/StaffAttendance";
import Exams from "../pages/Exams/Exams";
import Results from "../pages/Results/Results";
import Routine from "../pages/Routine/Routine";
import Salary from "../pages/Salary/Salary";
import Notices from "../pages/Notices/Notices";
import Calendar from "../pages/Calendar/Calendar";
import Progress from "../pages/Progress/Progress";
import AttendanceReport from "../pages/AttendanceReport/AttendanceReport";

import Teachers from "../pages/Dashboard/Teachers";
import Section from "../pages/Dashboard/Section";
import Classes from "../pages/Dashboard/Classes";


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
        path: "staff",
        element: <PrivateRoot><Staff /></PrivateRoot>,
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
        path: "staff-attendance",
        element: <PrivateRoot><StaffAttendance /></PrivateRoot>,
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