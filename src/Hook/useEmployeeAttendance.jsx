import { useState, useCallback } from "react";
import useAuth from "./useAuth"; // Ensure you import your useAuth hook

const API = `${process.env.REACT_APP_BACKEND_URL}/employee-attendance`;

export const useEmployeeAttendance = () => {
  const [employeeAttendances, setEmployeeAttendances] = useState([]);
  const [employeeAttendanceDetails, setEmployeeAttendanceDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Added token here to securely call your authenticated backend routes
  const { branch, token } = useAuth(); 

  // Helper function to build query parameters
  const buildQueryParams = (page, limit, filters = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (filters.date) params.append("date", filters.date);
    if (filters.employeeRole) params.append("employeeRole", filters.employeeRole);
    if (filters.employeeMobileNo) params.append("employeeMobileNo", filters.employeeMobileNo);
    if (filters.search) params.append("search", filters.search);
    return params.toString();
  };

  // GET: All Employee Attendances (Paginated & Searchable via Filters)
  const fetchAllEmployeeAttendances = useCallback(async (page = 1, limit = 10, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = buildQueryParams(page, limit, filters);
      const response = await fetch(`${API}/?${queryString}`, {
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      });
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch employee attendances");
      
      setEmployeeAttendances(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  
  // GET: All Employee Attendances by Branch (Paginated & Searchable via Filters)
  const fetchEmployeeAttendancesByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = buildQueryParams(page, limit, filters);
      const response = await fetch(`${API}/${targetBranch}/get-all?${queryString}`, {
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      });
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch branch employee attendances");
      
      setEmployeeAttendances(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch, token]);

  // GET: Single Employee Attendance Details By ID
  const fetchEmployeeAttendanceById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || result.error || "Employee attendance not found");
      
      setEmployeeAttendanceDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // POST: Create OR Update (Upsert) a new Employee Attendance
  const createEmployeeAttendance = useCallback(async (employeeAttendanceData) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure the payload has the required fields for the backend Upsert to work:
      // specifically 'employeeId' and 'date'.
      const payload = { ...employeeAttendanceData, branch: employeeAttendanceData.branch || branch };
      
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create/update employee attendance");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err; 
    } finally {
      setLoading(false);
    }
  }, [branch, token]);

  // PUT: Update an Employee Attendance (Targeted update by MongoDB _id)
  const updateEmployeeAttendance = useCallback(async (id, employeeAttendanceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(employeeAttendanceData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update employee attendance");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // DELETE: Remove an Employee Attendance
  const removeEmployeeAttendance = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete employee attendance");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    employeeAttendances,
    employeeAttendanceDetails,
    pagination,
    loading,
    error,
    fetchAllEmployeeAttendances,
    fetchEmployeeAttendancesByBranch,
    fetchEmployeeAttendanceById,
    createEmployeeAttendance,
    updateEmployeeAttendance,
    removeEmployeeAttendance,
  };
};

export default useEmployeeAttendance;