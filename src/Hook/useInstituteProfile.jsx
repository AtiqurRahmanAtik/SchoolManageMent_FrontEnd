// src/hooks/useInstituteProfile.js
import { useState, useCallback } from "react";
import useAuth from "./useAuth"; // Adjust path as needed

const API = `${process.env.REACT_APP_BACKEND_URL}/institute-profile`;

export const useInstituteProfile = () => {
  const [instituteProfiles, setInstituteProfiles] = useState([]);
  const [instituteProfileDetails, setInstituteProfileDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch } = useAuth();

  // GET: All Institute Profiles (Paginated)
  const fetchAllInstituteProfiles = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/?page=${page}&limit=${limit}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to fetch institute profiles");

      setInstituteProfiles(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET: All Institute Profiles by Branch (Paginated)
  const fetchInstituteProfilesByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/${targetBranch}/get-all?page=${page}&limit=${limit}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to fetch branch institute profiles");

      setInstituteProfiles(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // GET: Single Institute Profile By ID
  const fetchInstituteProfileById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || result.error || "Institute profile not found");

      setInstituteProfileDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST: Create a new Institute Profile
  const createInstituteProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ...profileData, branch: profileData.branch || branch };

      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // Uncomment if authentication is required
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create institute profile");

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // PUT: Update an Institute Profile
  const updateInstituteProfile = useCallback(async (id, profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update institute profile");

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE: Remove an Institute Profile
  const removeInstituteProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        // headers: { "Authorization": `Bearer ${token}` }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete institute profile");

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    instituteProfiles,
    instituteProfileDetails,
    pagination,
    loading,
    error,
    fetchAllInstituteProfiles,
    fetchInstituteProfilesByBranch,
    fetchInstituteProfileById,
    createInstituteProfile,
    updateInstituteProfile,
    removeInstituteProfile,
  };
};

export default useInstituteProfile;