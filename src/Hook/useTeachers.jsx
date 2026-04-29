import { useState, useCallback } from "react";
import useAuth from "./useAuth"; // Adjust the import path

const API = `${process.env.REACT_APP_BACKEND_URL}/teachers`;

export default function useTeachers() {
  const { branch } = useAuth();
  
  const [teachers, setTeachers] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all teachers
  const fetchTeachers = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const url = branch 
        ? `${API}/${branch}/get-all?page=${page}&limit=${limit}`
        : `${API}?page=${page}&limit=${limit}`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to fetch teachers");
      }

      setTeachers(result.data);
      setPagination({
        ...result.pagination,
        currentPage: page,     // Ensure current page matches request
        itemsPerPage: limit    // Ensure current limit matches request
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // Fetch a single teacher by ID
  const getTeacherById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || result.message || "Failed to fetch teacher");
      
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new teacher
  const createTeacher = async (teacherData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...teacherData, branch }), 
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || result.message || "Failed to create");

      await fetchTeachers(pagination.currentPage, pagination.itemsPerPage);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a teacher
  const updateTeacher = async (id, teacherData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherData),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || result.message || "Failed to update");

      await fetchTeachers(pagination.currentPage, pagination.itemsPerPage);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a teacher
  const removeTeacher = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || result.message || "Failed to delete");

      await fetchTeachers(pagination.currentPage, pagination.itemsPerPage);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  
  return {
    teachers,
    pagination,
    loading,
    error,
    fetchTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    removeTeacher,
  };
}