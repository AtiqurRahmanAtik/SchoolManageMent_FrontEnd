import React, { useEffect, useState } from 'react';
import useTeachers from '../../Hook/useTeachers'; // Adjust path as needed
import Pagination from '../../components/Pagination'; // Adjust path as needed

export default function Teachers() {
  
  const { 
    teachers, 
    pagination, 
    loading, 
    error, 
    fetchTeachers, 
    getTeacherById,
    removeTeacher,
    createTeacher,
    updateTeacher
  } = useTeachers();

  // Local state for the "Show entries" dropdown
  const [limit, setLimit] = useState(10);

  // Form & Add/Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null); // Tracks if we are editing
  const [formData, setFormData] = useState({
    teacherName: '',
    subject: '',
    phoneNumber: '',
    email: '',
    teacherPhoto: ''
  });

  // View Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  // Fetch teachers on component mount or when limit changes
  useEffect(() => {
    fetchTeachers(1, limit);
  }, [fetchTeachers, limit]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      await removeTeacher(id);
    }
  };

  const handlePageChange = (newPage) => {
    fetchTeachers(newPage, limit);
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper to reset form
  const resetForm = () => {
    setFormData({
      teacherName: '',
      subject: '',
      phoneNumber: '',
      email: '',
      teacherPhoto: ''
    });
    setEditId(null);
    setIsModalOpen(false);
  };

  // Handle Add/Edit Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      if (editId) {
        // Edit mode
        result = await updateTeacher(editId, formData);
      } else {
        // Create mode
        result = await createTeacher(formData);
      }

      if (result) {
        resetForm();
      } else {
        alert(`Failed to ${editId ? 'update' : 'add'} teacher. Please try again.`);
      }
    } catch (err) {
      console.error(`Error ${editId ? 'updating' : 'adding'} teacher:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Button Click
  const handleEditClick = async (id) => {
    const fetchedTeacher = await getTeacherById(id);
    if (fetchedTeacher) {
      setFormData({
        teacherName: fetchedTeacher.teacherName || '',
        subject: fetchedTeacher.subject || '',
        phoneNumber: fetchedTeacher.phoneNumber || '',
        email: fetchedTeacher.email || '',
        teacherPhoto: fetchedTeacher.teacherPhoto || ''
      });
      setEditId(fetchedTeacher._id);
      setIsModalOpen(true);
    } else {
      alert("Could not load teacher data for editing.");
    }
  };

  // Handle View Button Click
  const handleViewClick = async (id) => {
    const fetchedTeacher = await getTeacherById(id);
    if (fetchedTeacher) {
      setViewData(fetchedTeacher);
      setIsViewModalOpen(true);
    } else {
      alert("Could not load teacher data for viewing.");
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen relative">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Teachers Management</h1>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow transition"
        >
          + Add Teacher
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
        
        {loading && teachers.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-lg">Loading Teachers...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <tr key={teacher._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 border-b border-gray-100 bg-white text-sm">
                          <img 
                            src={teacher.teacherPhoto} 
                            alt={teacher.teacherName} 
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                          />
                        </td>
                        <td className="px-6 py-4 border-b border-gray-100 bg-white text-sm">
                          <p className="text-gray-900 font-medium">{teacher.teacherName}</p>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-100 bg-white text-sm">
                          <p className="text-gray-700">{teacher.subject}</p>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-100 bg-white text-sm">
                          <p className="text-gray-900">{teacher.phoneNumber}</p>
                          <p className="text-gray-500 text-xs">{teacher.email}</p>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-100 bg-white text-sm text-center space-x-4">
                          <button 
                            className="text-green-500 hover:text-green-700 font-medium"
                            onClick={() => handleViewClick(teacher._id)}
                          >
                            View
                          </button>
                          <button 
                            className="text-blue-500 hover:text-blue-700 font-medium"
                            onClick={() => handleEditClick(teacher._id)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 font-medium"
                            onClick={() => handleDelete(teacher._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 bg-white text-sm text-center text-gray-500">
                        No teachers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Bar: Limit Dropdown & Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center text-sm text-gray-700 font-medium">
                <span className="mr-2">Show:</span>
                <select 
                  value={limit}
                  onChange={handleLimitChange}
                  className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <Pagination 
                currentPage={pagination?.currentPage || 1}
                totalPages={pagination?.totalPages || 1}
                totalItems={pagination?.totalItems || 0}
                itemsPerPage={pagination?.itemsPerPage || limit}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editId ? 'Edit Teacher' : 'Add New Teacher'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Mathematics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. +1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. john@school.edu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                  <input 
                    type="url" 
                    name="teacherPhoto"
                    value={formData.teacherPhoto}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? 'Saving...' : (editId ? 'Update Teacher' : 'Save Teacher')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Single Teacher Modal */}
      {isViewModalOpen && viewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Teacher Profile</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              <img 
                src={viewData.teacherPhoto} 
                alt={viewData.teacherName} 
                className="w-32 h-32 rounded-full object-cover shadow-sm mb-4 border-4 border-gray-50"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{viewData.teacherName}</h3>
              <p className="text-blue-600 font-medium mb-4">{viewData.subject}</p>
              
              <div className="w-full bg-gray-50 rounded-md p-4 space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 w-24">Email:</span>
                  <span className="text-gray-800">{viewData.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 w-24">Phone:</span>
                  <span className="text-gray-800">{viewData.phoneNumber}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 w-24">Branch:</span>
                  <span className="text-gray-800">{viewData.branch || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
               <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium transition"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}