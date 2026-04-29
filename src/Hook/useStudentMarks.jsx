import { useState, useCallback } from "react";
import useAuth from "./useAuth"; 

const API = `${process.env.REACT_APP_BACKEND_URL}/student-marks`;

export const useStudentMarks = () => {
  const [marks, setMarks] = useState([]);
  const [markDetails, setMarkDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch } = useAuth(); 

  // GET: All Student Marks (Paginated)
  const fetchAllMarks = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch marks");
      
      setMarks(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET: Student Marks by Branch (Paginated)
  const fetchMarksByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API}/${targetBranch}/get-all?page=${page}&limit=${limit}`
      );
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch branch marks");
      
      setMarks(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // GET: Single Mark Detail By ID
  const fetchMarkById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || result.error || "Mark record not found");
      
      setMarkDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST: Create a new Student Mark
  const createMark = useCallback(async (markData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ...markData, branch: markData.branch || branch };
      
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create mark record");
      
      // Update local state to include the new mark
      setMarks((prev) => [result.data || result, ...prev]);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err; 
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // PUT: Update a Student Mark
  const updateMark = useCallback(async (id, markData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(markData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update mark");
      
      setMarks((prev) => prev.map((item) => (item._id === id ? result : item)));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE: Remove a Student Mark record
  const removeMark = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE"
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete mark");
      
      setMarks((prev) => prev.filter((item) => item._id !== id));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    marks,
    markDetails,
    pagination,
    loading,
    error,
    fetchAllMarks,
    fetchMarksByBranch,
    fetchMarkById,
    createMark,
    updateMark,
    removeMark,
  };
};

export default useStudentMarks;