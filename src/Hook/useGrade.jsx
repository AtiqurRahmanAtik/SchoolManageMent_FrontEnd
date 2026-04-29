import { useState, useCallback } from "react";
import useAuth from "./useAuth"; 

const API = `${process.env.REACT_APP_BACKEND_URL}/grade`;

export const useGrade = () => {
  const [grades, setGrades] = useState([]);
  const [gradeDetails, setGradeDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch } = useAuth(); 

  // GET: All Grades (Paginated)
  const fetchAllGrades = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({ page, limit });
      const response = await fetch(`${API}/?${queryParams.toString()}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch grades");
      
      setGrades(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET: All Grades by Branch (Paginated)
  const fetchGradesByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({ page, limit });
      const response = await fetch(`${API}/${targetBranch}/get-all?${queryParams.toString()}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch branch grades");
      
      setGrades(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // GET: Single Grade Details By ID
  const fetchGradeById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || result.error || "Grade not found");
      
      setGradeDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST: Create a new Grade
  const createGrade = useCallback(async (gradeData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ...gradeData, branch: gradeData.branch || branch };
      
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create grade");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err; 
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // PUT: Update a Grade
  const updateGrade = useCallback(async (id, gradeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gradeData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update grade");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE: Remove a Grade
  const removeGrade = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete grade");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    grades,
    gradeDetails,
    pagination,
    loading,
    error,
    fetchAllGrades,
    fetchGradesByBranch,
    fetchGradeById,
    createGrade,
    updateGrade,
    removeGrade,
  };
};

export default useGrade;