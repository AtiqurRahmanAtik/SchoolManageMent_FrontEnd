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


{
  title: "Employee",
  icon: <MdOutlineSchool className="text-xl" />, 
  list: [
    {
      title: "Employees",
      path: "/employee",
      icon: <MdOutlineSchool className="text-xl" />,
    },
     {
      title: "Employee List",
      path: "/employee/list", 
      icon: <MdOutlineSchool className="text-xl" />,
    },
    {
      title: "Employee Role",
      path: "/employee/role", 
      icon: <MdOutlineSchool className="text-xl" />,
    },
    
  ],
},



    


    { title: "Classes", path: "/classes", icon: <MdOutlineClass className="text-xl" /> },
    { title: "Section", path: "/section", icon: <MdOutlineClass className="text-xl" /> },
    { title: "Subjects", path: "/subjects", icon: <MdOutlineMenuBook className="text-xl" /> },
    
    { 
  title: "Attendance",  
  icon: <MdOutlineFactCheck className="text-xl" />,

  list: [
    { 
      title: "Student Attendance", 
      path: "/attendance/student", // Correct router path
      icon: <MdOutlineFactCheck className="text-xl" /> 
    },
    { 
      title: "Employee Attendance", 
      path: "/attendance/employee", // Correct router path
      icon: <MdOutlineFactCheck className="text-xl" /> 
    },
  ]
},


  // { title: "Attendance", path: "/attendance", icon: <MdOutlineFactCheck className="text-xl" /> },
  //   { title: "Teacher Attendance", path: "/teacher-attendance", icon: <MdOutlineFactCheck className="text-xl" /> },
  //   { title: "Employee Attendance", path: "/employee-attendance", icon: <MdOutlineFactCheck className="text-xl" /> },


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