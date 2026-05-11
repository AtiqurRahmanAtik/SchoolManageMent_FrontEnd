import { useState, useCallback } from "react";
import useAuth from "./useAuth"; // Adjust the import path as necessary

const API = `${process.env.REACT_APP_BACKEND_URL}/blogs`;

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogDetails, setBlogDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch } = useAuth(); 

  // GET: All Blogs (Paginated)
  const fetchAllBlogs = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch blogs");
      
      setBlogs(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  
  // GET: All Blogs by Branch (Paginated)
  const fetchBlogsByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/${targetBranch}/get-all?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch branch blogs");
      
      setBlogs(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // GET: Single Blog Details By ID
  const fetchBlogById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || result.error || "Blog not found");
      
      setBlogDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST: Create a new Blog
  const createBlog = useCallback(async (blogData) => {
    setLoading(true);
    setError(null);
    try {
      // Fallback to the authenticated user's branch if not provided in the form
      const payload = { ...blogData, branch: blogData.branch || branch };
      
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // Add this if you enable authenticateToken middleware
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create blog");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw so components can handle form submission errors
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // PUT: Update a Blog
  const updateBlog = useCallback(async (id, blogData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(blogData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update blog");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE: Remove a Blog
  const removeBlog = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        // headers: { "Authorization": `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete blog");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    blogs,
    blogDetails,
    pagination,
    loading,
    error,
    fetchAllBlogs,
    fetchBlogsByBranch,
    fetchBlogById,
    createBlog,
    updateBlog,
    removeBlog,
  };  
};

export default useBlogs;