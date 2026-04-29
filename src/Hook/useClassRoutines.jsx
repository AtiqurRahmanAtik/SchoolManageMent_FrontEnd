import { useState, useCallback } from "react";
import useAuth from "./useAuth"; 

const API = `${process.env.REACT_APP_BACKEND_URL}/class-routine`;

export const useClassRoutines = () => {
  const [classRoutines, setClassRoutines] = useState([]);
  const [classRoutineDetails, setClassRoutineDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch } = useAuth(); 

  // GET: All Class Routines (Paginated & Searchable)
  const fetchAllClassRoutines = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch class routines");
      
      setClassRoutines(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  
  // GET: All Class Routines by Branch (Paginated & Searchable)
  const fetchClassRoutinesByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/${targetBranch}/get-all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch branch class routines");
      
      setClassRoutines(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // GET: Single Class Routine Details By ID
  const fetchClassRoutineById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || result.error || "Class routine not found");
      
      setClassRoutineDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST: Create a new Class Routine
  const createClassRoutine = useCallback(async (classRoutineData) => {
    setLoading(true);
    setError(null);
    try {
      // Fallback to the authenticated user's branch if not provided in the form
      const payload = { ...classRoutineData, branch: classRoutineData.branch || branch };
      
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // Add this if you enable authenticateToken middleware
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create class routine");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw so components can handle form submission errors
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // PUT: Update a Class Routine
  const updateClassRoutine = useCallback(async (id, classRoutineData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(classRoutineData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update class routine");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE: Remove a Class Routine
  const removeClassRoutine = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        // headers: { "Authorization": `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete class routine");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    classRoutines,
    classRoutineDetails,
    pagination,
    loading,
    error,
    fetchAllClassRoutines,
    fetchClassRoutinesByBranch,
    fetchClassRoutineById,
    createClassRoutine,
    updateClassRoutine,
    removeClassRoutine,
  };  
};

export default useClassRoutines;