import { useState, useCallback } from "react";
import useAuth from "./useAuth"; // Ensure you import your useAuth hook

const API = `${process.env.REACT_APP_BACKEND_URL}/student-attendance`;

export const useStudentAttendance = () => {
  const [studentAttendances, setStudentAttendances] = useState([]);
  const [studentAttendanceDetails, setStudentAttendanceDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch, token } = useAuth(); 

  // Helper function to build query parameters
  const buildQueryParams = (page, limit, filters = {}) => {
    const params = new URLSearchParams({ page, limit });
    
    if (filters.search) params.append("search", filters.search);
    if (filters.date) params.append("date", filters.date);
    if (filters.studentClass) params.append("studentClass", filters.studentClass);
    if (filters.section) params.append("section", filters.section);
    
    return params.toString();
  };

  // GET: All Student Attendances
  const fetchAllStudentAttendances = useCallback(async (page = 1, limit = 10, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = buildQueryParams(page, limit, filters);
      const response = await fetch(`${API}/?${queryString}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch student attendances");
      
      setStudentAttendances(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  // GET: All Student Attendances by Branch
  const fetchStudentAttendancesByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = buildQueryParams(page, limit, filters);
      const response = await fetch(`${API}/${targetBranch}/get-all?${queryString}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch branch student attendances");
      
      setStudentAttendances(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch, token]);

  // GET: Single
  const fetchStudentAttendanceById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || result.error || "Student attendance not found");
      
      setStudentAttendanceDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // POST: Create
  const createStudentAttendance = useCallback(async (studentAttendanceData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ...studentAttendanceData, branch: studentAttendanceData.branch || branch };
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create student attendance");
      return result;
    } catch (err) {
      setError(err.message);
      throw err; 
    } finally {
      setLoading(false);
    }
  }, [branch, token]);

  // PUT: Update
  const updateStudentAttendance = useCallback(async (id, studentAttendanceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(studentAttendanceData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update student attendance");
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // DELETE: Remove
  const removeStudentAttendance = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete student attendance");
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    studentAttendances,
    studentAttendanceDetails,
    pagination,
    loading,
    error,
    fetchAllStudentAttendances,
    fetchStudentAttendancesByBranch,
    fetchStudentAttendanceById,
    createStudentAttendance,
    updateStudentAttendance,
    removeStudentAttendance,
  };
};

export default useStudentAttendance;