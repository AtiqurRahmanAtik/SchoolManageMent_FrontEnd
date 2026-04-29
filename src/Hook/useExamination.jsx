import { useState, useCallback } from "react";
import useAuth from "./useAuth"; 

const API = `${process.env.REACT_APP_BACKEND_URL}/examination`;

export const useExamination = () => {
  const [examinations, setExaminations] = useState([]);
  const [examinationDetails, setExaminationDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch } = useAuth(); 

  // GET: All Examinations (Paginated)
  const fetchAllExaminations = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({ page, limit });
      const response = await fetch(`${API}/?${queryParams.toString()}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch examinations");
      
      setExaminations(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET: All Examinations by Branch (Paginated)
  const fetchExaminationsByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({ page, limit });
      const response = await fetch(`${API}/${targetBranch}/get-all?${queryParams.toString()}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch branch examinations");
      
      setExaminations(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // GET: Single Examination Details By ID
  const fetchExaminationById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || result.error || "Examination not found");
      
      setExaminationDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST: Create a new Examination
  const createExamination = useCallback(async (examinationData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ...examinationData, branch: examinationData.branch || branch };
      
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create examination");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err; 
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // PUT: Update an Examination
  const updateExamination = useCallback(async (id, examinationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examinationData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update examination");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE: Remove an Examination
  const removeExamination = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete examination");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    examinations,
    examinationDetails,
    pagination,
    loading,
    error,
    fetchAllExaminations,
    fetchExaminationsByBranch,
    fetchExaminationById,
    createExamination,
    updateExamination,
    removeExamination,
  };
};

export default useExamination;