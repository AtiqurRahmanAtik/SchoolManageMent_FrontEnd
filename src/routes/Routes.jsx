import { createBrowserRouter, Navigate } from "react-router-dom";


import Root from "./Root/Root";
import PrivateRoot from "./Root/PrivateRoot";
import Aroot from "./Root/Aroot";

import Home from "../pages/Dashboard/Home";


import Login from "../pages/Login/Login";
import Error404 from "../pages/Error404/Error404";


import NavHome from "../pages/NavHome/NavHome";







import HomePage from "../pages/HomePage/HomePage";

import Register from "../pages/Register/Register";





export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
   
  
      // If you still need the Login page, you can add it on a separate path like this:
      // 
      {
        path: "/login",
        element: <Login />,
      },
      
      {
        path: "/register",
        element: <Register />,
      },
      

      // Navbar routes
{
    path: "/",
    element: <NavHome />, // NavHome stays on the screen always
    children: [
      {
        path: "/", // When the user is at the root URL
        element: <HomePage />, // Show all the banners and sliders
      },
    
    ]
  }
,



    


    ],
  },


  // DashBoard 
  {
    // Pathless layout route to wrap everything in Aroot (Sidebar/Header)
    element: <Aroot />,
    errorElement: <Error404 />,
    children: [
      // --- Dashboard ---
      {
        path: "dashboard",
        element: <PrivateRoot><Home/></PrivateRoot>,
      },

      
     








     
     




    
      // --- Logout ---
      {
        path: "logout",
        element: <PrivateRoot><Navigate to="/" replace /></PrivateRoot>,
      },
    ],
  },
]);