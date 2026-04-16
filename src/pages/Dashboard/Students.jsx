import React, { useEffect, useState } from 'react';
import useStudents from '../../Hook/useStudents'; // Adjust the import path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

// Import your reusable components (Adjust the paths according to your project structure)
import Mtitle from '../../components library/Mtitle'; 
import TableControls from '../../components/TableControls'; 
import Pagination from '../../components/Pagination'; 
import SkeletonLoader from '../../components/SkeletonLoader'; 

export default function Students() {
  const {
    students,
    pagination,
    loading,
    error,
    fetchStudentsByBranch,
    removeStudent,
    updateStudent // Added update API hook
  } = useStudents();

  // State for pagination & table controls
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // State for Update/Edit Modal
  const [editingStudent, setEditingStudent] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch students when component mounts or page/limit changes
  useEffect(() => {
    fetchStudentsByBranch(undefined, currentPage, itemsPerPage);
  }, [fetchStudentsByBranch, currentPage, itemsPerPage]);

  // Handle student deletion (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await removeStudent(id);
        toast.success("Student deleted successfully!");
        fetchStudentsByBranch(undefined, currentPage, itemsPerPage);
      } catch (err) {
        toast.error(err.message || "Failed to delete student.");
      }
    }
  };

  // Handle Edit button click
  const handleEditClick = (student) => {
    setEditingStudent(student); // Open modal with student data
  };

  // Handle Edit form submission (UPDATE)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateStudent(editingStudent._id, editingStudent);
      toast.success("Student updated successfully!");
      setEditingStudent(null); // Close modal
      fetchStudentsByBranch(undefined, currentPage, itemsPerPage); // Refresh data
    } catch (err) {
      toast.error(err.message || "Failed to update student.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Edit Form Input Changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent(prev => ({ ...prev, [name]: value }));
  };

  // Local Search Filtering (READ)
  const filteredStudents = students?.filter((student) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      student.studentName?.toLowerCase().includes(lowerSearch) ||
      student.registrationNo?.toLowerCase().includes(lowerSearch) ||
      student.studentClass?.toLowerCase().includes(lowerSearch)
    );
  });

  // Reusable action buttons for the table rows
  const renderActionButtons = (student) => (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={() => handleEditClick(student)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit Student"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
      </button>
      <button 
        onClick={() => handleDelete(student._id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Student"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans relative">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        
        {/* REUSABLE TITLE COMPONENT */}
        <Mtitle 
          title="Students Directory" 
          middlecontent={<span className="text-sm text-gray-500">Manage and view all enrolled students.</span>}
          rightcontent={
            <Link to={"/admissions"}>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add New Student
              </button>
            </Link>
          }
        />

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm">
            <p className="font-semibold">Error Loading Students</p>
            <p>{error}</p>
            <button 
              onClick={() => fetchStudentsByBranch(undefined, currentPage, itemsPerPage)}
              className="mt-2 text-sm underline font-medium hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
          
          {/* REUSABLE TABLE CONTROLS */}
          <div className="mb-6">
            <TableControls 
              itemsPerPage={itemsPerPage} 
              onItemsPerPageChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to page 1 whenever the limit changes
              }} 
              searchTerm={searchTerm} 
              onSearchChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Student Info</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Registration</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Class & Section</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                
                {loading ? (
                  /* REUSABLE SKELETON LOADER */
                  <SkeletonLoader />
                ) : filteredStudents && filteredStudents.length > 0 ? (
                  /* Render Data */
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <img 
                            src={student.studentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.studentName)}&background=random`} 
                            alt={student.studentName} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{student.studentName}</p>
                            <p className="text-sm text-gray-500">{student.gender || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {student.registrationNo || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <p className="font-medium text-gray-900">{student.studentClass || 'N/A'}</p>
                        <p className="text-sm text-gray-500">Sec: {student.section || 'N/A'}</p>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{student.mobileNo || student.fatherMobileNo || 'No Number'}</p>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {renderActionButtons(student)}
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Empty State */
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <p className="font-medium">No students found.</p>
                        <p className="text-sm mt-1">Try adjusting your search criteria or add new students.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* REUSABLE PAGINATION */}
          {!loading && pagination && (
            <div className="mt-6">
              <Pagination 
                currentPage={currentPage}
                totalPages={pagination.totalPages || 1}
                totalItems={pagination.totalItems || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

        </div>
      </div>

      {/* --- EDIT STUDENT MODAL --- */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-down">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Edit Student Info</h3>
              <button onClick={() => setEditingStudent(null)} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input 
                  type="text" name="studentName" required
                  value={editingStudent.studentName || ''} onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input 
                    type="text" name="studentClass" required
                    value={editingStudent.studentClass || ''} onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input 
                    type="text" name="section" required
                    value={editingStudent.section || ''} onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input 
                  type="text" name="mobileNo"
                  value={editingStudent.mobileNo || ''} onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}