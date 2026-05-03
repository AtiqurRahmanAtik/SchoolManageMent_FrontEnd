import { useState, useCallback } from "react";
import useAuth from "./useAuth"; 

const API = `${process.env.REACT_APP_BACKEND_URL}/salary`;

export const useSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch } = useAuth(); 

  const fetchAllSalaries = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({ page, limit, search });
      const response = await fetch(`${API}/?${queryParams.toString()}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || "Failed to fetch salaries");
      
      setSalaries(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSalariesByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10, search = "") => {
    if (!targetBranch) return;
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({ page, limit, search });
      const response = await fetch(`${API}/${targetBranch}/get-all?${queryParams.toString()}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || "Failed to fetch branch salaries");
      
      setSalaries(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  const fetchSalaryById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || "Salary not found");
      
      setSalaryDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSalary = useCallback(async (salaryData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ...salaryData, branch: salaryData.branch || branch };
      
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to create salary");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err; 
    } finally {
      setLoading(false);
    }
  }, [branch]);

  const updateSalary = useCallback(async (id, salaryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salaryData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update salary");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeSalary = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete salary");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    salaries,
    salaryDetails,
    pagination,
    loading,
    error,
    fetchAllSalaries,
    fetchSalariesByBranch,
    fetchSalaryById,
    createSalary,
    updateSalary,
    removeSalary,
  };
};

export default useSalary;