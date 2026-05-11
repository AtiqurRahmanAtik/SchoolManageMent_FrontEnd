import { useState, useCallback } from "react";
import useAuth from "./useAuth"; // Adjust the import path as necessary

const API = `${process.env.REACT_APP_BACKEND_URL}/contact-us`;

export const useContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [contactDetails, setContactDetails] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { branch } = useAuth(); 

  // GET: All Contacts (Paginated)
  const fetchAllContacts = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch contacts");
      
      setContacts(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  
  // GET: All Contacts by Branch (Paginated)
  const fetchContactsByBranch = useCallback(async (targetBranch = branch, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/${targetBranch}/get-all?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Failed to fetch branch contacts");
      
      setContacts(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // GET: Single Contact Details By ID
  const fetchContactById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/get-id/${id}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || result.error || "Contact not found");
      
      setContactDetails(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST: Create a new Contact
  const createContact = useCallback(async (contactData) => {
    setLoading(true);
    setError(null);
    try {
      // Fallback to the authenticated user's branch if not provided in the form
      const payload = { ...contactData, branch: contactData.branch || branch };
      
      const response = await fetch(`${API}/post`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // Add this if you enable authenticateToken middleware
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create contact");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw so components can handle form submission errors
    } finally {
      setLoading(false);
    }
  }, [branch]);

  // PUT: Update a Contact
  const updateContact = useCallback(async (id, contactData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(contactData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to update contact");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE: Remove a Contact
  const removeContact = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        // headers: { "Authorization": `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Failed to delete contact");
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contacts,
    contactDetails,
    pagination,
    loading,
    error,
    fetchAllContacts,
    fetchContactsByBranch,
    fetchContactById,
    createContact,
    updateContact,
    removeContact,
  };  
};

export default useContactUs;