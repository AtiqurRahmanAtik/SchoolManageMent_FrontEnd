import { useState, useCallback } from "react";
import useAuth from "./useAuth"; // Adjust the import path as necessary

const API = `${process.env.REACT_APP_BACKEND_URL}/recent-notices`;

export const useRecentNotices = () => {
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentNoticeDetails, setRecentNoticeDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch } = useAuth(); 

  // GET: All Recent Notices (Paginated)
  const fetchAllRecentNotices = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch recent notices");
      
      setRecentNotices(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  
  // GET: All Recent Notices by Branch (Paginated)
  const fetchRecentNoticesByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/${targetBranch}/get-all?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch branch recent notices");
      
      setRecentNotices(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // GET: Single Recent Notice Details By ID
  const fetchRecentNoticeById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || result.error || "Recent notice not found");
      
      setRecentNoticeDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST: Create a new Recent Notice
  const createRecentNotice = useCallback(async (noticeData) => {
    setLoading(true);
    setError(null);
    try {
      // Fallback to the authenticated user's branch if not provided in the form
      const payload = { ...noticeData, branch: noticeData.branch || branch };
      
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // Add this if you enable authenticateToken middleware
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create recent notice");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw so components can handle form submission errors
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // PUT: Update a Recent Notice
  const updateRecentNotice = useCallback(async (id, noticeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(noticeData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update recent notice");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE: Remove a Recent Notice
  const removeRecentNotice = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        // headers: { "Authorization": `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete recent notice");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recentNotices,
    recentNoticeDetails,
    pagination,
    loading,
    error,
    fetchAllRecentNotices,
    fetchRecentNoticesByBranch,
    fetchRecentNoticeById,
    createRecentNotice,
    updateRecentNotice,
    removeRecentNotice,
  };  
};

export default useRecentNotices;