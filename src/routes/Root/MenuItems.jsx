import {
  MdDashboard,
  MdOutlinePeople,
  MdOutlinePersonAdd,
  MdOutlineSchool,
  MdOutlineBadge,
  MdOutlineClass,
  MdOutlineMenuBook,
  MdOutlineFactCheck,
  MdOutlineAssessment,
  MdOutlineEditNote,
  MdOutlineEmojiEvents,
  MdOutlineSchedule,
  MdOutlinePayments,
  MdOutlineNotifications,
  MdOutlineCalendarMonth,
  MdOutlineTrendingUp,
  MdLogout
} from "react-icons/md";

const useMenuItems = () => {
  const allItems = [
    { title: "Dashboard", path: "/dashboard", icon: <MdDashboard className="text-xl" /> },
    { title: "Students", path: "/students", icon: <MdOutlinePeople className="text-xl" /> },
    { title: "Admissions", path: "/admissions", icon: <MdOutlinePersonAdd className="text-xl" /> },
    { title: "Teachers", path: "/teachers", icon: <MdOutlineSchool className="text-xl" /> },
    { title: "Staff", path: "/staff", icon: <MdOutlineBadge className="text-xl" /> },
    { title: "Classes", path: "/classes", icon: <MdOutlineClass className="text-xl" /> },
    { title: "Subjects", path: "/subjects", icon: <MdOutlineMenuBook className="text-xl" /> },
    { title: "Attendance", path: "/attendance", icon: <MdOutlineFactCheck className="text-xl" /> },
    { title: "Teacher Attendance", path: "/teacher-attendance", icon: <MdOutlineFactCheck className="text-xl" /> },
    { title: "Staff Attendance", path: "/staff-attendance", icon: <MdOutlineFactCheck className="text-xl" /> },
    { title: "Attendance Report", path: "/attendance-report", icon: <MdOutlineAssessment className="text-xl" /> },
    { title: "Exams", path: "/exams", icon: <MdOutlineEditNote className="text-xl" /> },
    { title: "Results", path: "/results", icon: <MdOutlineEmojiEvents className="text-xl" /> },
    { title: "Routine", path: "/routine", icon: <MdOutlineSchedule className="text-xl" /> },
    { title: "Salary", path: "/salary", icon: <MdOutlinePayments className="text-xl" /> },
    { title: "Notices", path: "/notices", icon: <MdOutlineNotifications className="text-xl" /> },
    { title: "Calendar", path: "/calendar", icon: <MdOutlineCalendarMonth className="text-xl" /> },
    { title: "Progress", path: "/progress", icon: <MdOutlineTrendingUp className="text-xl" /> },
    // I am keeping logout here, but usually, it's handled separately in the UI (like in the top bar)
    { title: "Logout", path: "/logout", icon: <MdLogout className="text-xl" /> },
  ];

  return allItems;
};

export default useMenuItems;