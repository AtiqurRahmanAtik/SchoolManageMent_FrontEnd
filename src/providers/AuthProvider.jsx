import { createContext, useState } from "react";
import PropTypes from "prop-types";

import useAxiosPublic from "../Hook/useAxiosPublic";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosPublic();

  const [branch, setBranch] = useState(() => {
    const storedBranch = localStorage.getItem("authBranch");
    return storedBranch || user?.branch || "teaxo";
  });

 
 // Registration
  const registerUser = async (userData) => {
    
    setLoading(true);
    try {
      // Added the environment variable to the API request URL to match loginUser
      const API = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${API}/user/post`, userData);
      const data = response.data;

   

      // NOTE: If your backend automatically logs the user in upon registration 
      // and returns a token & user object, you can uncomment the lines below:
      // setUser(data.user);
      // setBranch(data.user.branch);
      // localStorage.setItem("authUser", JSON.stringify(data.user));
      // localStorage.setItem("authBranch", data.user.branch);
      // localStorage.setItem("authToken", data.token);

      return data;
    } catch (error) {
      // Log the actual error to the console so you know what really failed!
      console.error("Actual Registration Error:", error.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // LoginUser
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const API = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${API}/user/login`, { email, password });
      const data = response.data;

      console.log("Login data : ", data);

      setUser(data.user);
      setBranch(data.user.branch);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("authBranch", data.user.branch);
      localStorage.setItem("authToken", data.token);

      return data.user;
    } catch (error) {
      console.error("Actual Login Error:", error.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // LogoutUser
  const logoutUser = async () => {
    setLoading(true);
    try {
      // Optional: Call the backend logout if the user is currently set
      if (user?.email) {
        await axiosSecure.post("/user/logout", { email: user.email });
      }

      // 1. Clear React State
      setUser(null);
      setBranch("teaxo"); // Reset to default branch instead of keeping the old one

      // 2. Clear ALL Local and Session Storage (Removes all cached tokens and data)
      localStorage.clear();
      sessionStorage.clear();

      // 3. Force a hard reload to the home page. 
      // This immediately destroys any in-memory cache (like React Query or local variables) in all pages.
      window.location.href = "/";
      
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    loading,
    branch,
    registerUser,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;