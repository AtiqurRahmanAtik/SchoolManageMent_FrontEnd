import { useState, useCallback } from "react";
// Import useAuth from your authentication context path
// import { useAuth } from "../../context/AuthContext"; 

const API = `${process.env.REACT_APP_BACKEND_URL}/notice`;

const useNotice = () => {
  // Assuming useAuth provides the current branch
  // const { branch } = useAuth(); 

  const [notices, setNotices] = useState([]);
  const [singleNotice, setSingleNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  // 1. Get All Notices (with pagination)
  const getAllNotices = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch notices");
      
      setNotices(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Get Notices By Branch (with pagination)
  const getNoticesByBranch = useCallback(async (branchName, page = 1, limit = 10) => {
    if (!branchName) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/${branchName}/get-all?page=${page}&limit=${limit}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to fetch branch notices");

      setNotices(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Get Notice By ID
  const getNoticeById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to fetch notice");

      setSingleNotice(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Create Notice
  const createNotice = useCallback(async (noticeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticeData),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to create notice");

      return result;
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to handle in component (e.g., showing a toast)
    } finally {
      setLoading(false);
    }
  }, []);

  // 5. Update Notice
  const updateNotice = useCallback(async (id, noticeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticeData),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || result.error || "Failed to update notice");

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 6. Delete Notice
  const removeNotice = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete notice");

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notices,
    singleNotice,
    loading,
    error,
    pagination,
    getAllNotices,
    getNoticesByBranch,
    getNoticeById,
    createNotice,
    updateNotice,
    removeNotice,
  };
};

export default useNotice;