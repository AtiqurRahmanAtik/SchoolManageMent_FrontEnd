import { useState, useCallback } from 'react';
import useAuth from './useAuth';


const API = `${process.env.REACT_APP_BACKEND_URL}/employee-roles`;

const useEmployeeRole = () => {
  const { branch } = useAuth();
  
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Fetch all roles (Optional, if you want to see globally across branches)
  const getAllEmployeeRoles = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch employee roles');
      
      const result = await response.json();
      if (result.success) {
        setEmployeeRoles(result.data);
        setPagination(result.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch roles by specific branch (Default use case)
  const getEmployeeRolesByBranch = useCallback(async (page = 1, limit = 10) => {
    if (!branch) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/${branch}/get-all?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch branch employee roles');
      
      const result = await response.json();
      if (result.success) {
        setEmployeeRoles(result.data);
        setPagination(result.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // Get a single employee role by ID
  const getEmployeeRoleById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      if (!response.ok) throw new Error('Failed to fetch employee role details');
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new employee role
  const createEmployeeRole = async (roleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...roleData, branch }), // Ensure branch is attached
      });
      
      if (!response.ok) throw new Error('Failed to create employee role');
      
      const newRole = await response.json();
      
      // Update local state to reflect the addition immediately
      setEmployeeRoles((prev) => [newRole, ...prev]);
      return newRole;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing employee role
  const updateEmployeeRole = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) throw new Error('Failed to update employee role');
      
      const updatedRole = await response.json();
      
      // Update local state
      setEmployeeRoles((prev) =>
        prev.map((role) => (role._id === id ? updatedRole : role))
      );
      return updatedRole;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an employee role
  const removeEmployeeRole = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete employee role');
      
      // Remove from local state
      setEmployeeRoles((prev) => prev.filter((role) => role._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    employeeRoles,
    pagination,
    loading,
    error,
    getAllEmployeeRoles,
    getEmployeeRolesByBranch,
    getEmployeeRoleById,
    createEmployeeRole,
    updateEmployeeRole,
    removeEmployeeRole,
  };
};

export default useEmployeeRole;