import React, { useEffect, useState } from 'react';
import useSection from '../../Hook/useSection'; 
import useExamination from '../../Hook/useExamination';
import useSubject from '../../Hook/useSubject'; 
import useGrade from '../../Hook/useGrade'; 
import useStudentMarks from '../../Hook/useStudentMarks'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components Library
import Mtitle from '../../components library/Mtitle'; 
import TableControls from '../../components/TableControls'; 
import Pagination from '../../components/Pagination'; 
import SkeletonLoader from '../../components/SkeletonLoader'; 
import MtableLoading from '../../components library/MtableLoading'; 

export default function Results() {
  // --- Hooks ---
  const { 
    marks, 
    pagination, 
    loading: marksLoading, 
    fetchMarksByBranch, 
    updateMark, 
    removeMark 
  } = useStudentMarks();

  const { examinations, fetchExaminationsByBranch } = useExamination();
  const { sections, getSections } = useSection();
  const { subjects, fetchSubjectsByBranch } = useSubject();
  const { grades, fetchGradesByBranch } = useGrade();

  // --- Local States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 

  // Filter States
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterExam, setFilterExam] = useState(""); 
  
  const [appliedFilterClass, setAppliedFilterClass] = useState("");
  const [appliedFilterSection, setAppliedFilterSection] = useState("");
  const [appliedFilterExam, setAppliedFilterExam] = useState(""); 

  // Modals & Selected Data States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMark, setSelectedMark] = useState(null);
  const [editFormData, setEditFormData] = useState({ mark: "", grade: "" });

  // --- Dynamic Table Headers ---
  const tableHeaders = [
    { id: "student", label: "Student Details", className: "py-4 rounded-tl-box" },
    { id: "actions", label: "Actions", className: "py-4 text-center rounded-tr-box pr-8" }
  ];

  // Initial Data Fetching
  useEffect(() => {
    getSections(1, 1000); 
    fetchExaminationsByBranch(undefined, 1, 1000); 
    fetchGradesByBranch(undefined, 1, 1000); 
  }, [getSections, fetchExaminationsByBranch, fetchGradesByBranch]);

  useEffect(() => {
    fetchMarksByBranch(undefined, currentPage, limit);
  }, [fetchMarksByBranch, currentPage, limit]);

  // Debounce search logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm) setCurrentPage(1); 
    }, 500); 
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- Dropdown Extraction ---
  const uniqueClasses = Array.from(new Set(sections?.map((s) => s.className).filter(Boolean)));
  const filterAvailableSections = Array.from(new Set(sections
    ?.filter((s) => !filterClass || s.className === filterClass)
    .map((s) => s.sectionName)
    .filter(Boolean)));
  const uniqueExams = Array.from(new Set(examinations?.map((e) => e.examinationName || e.examName).filter(Boolean)));

  // --- Handlers ---
  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const handleLimitChange = (e) => { setLimit(parseInt(e.target.value, 10)); setCurrentPage(1); };
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterSearch = () => {
    setAppliedFilterClass(filterClass);
    setAppliedFilterSection(filterSection);
    setAppliedFilterExam(filterExam);
    setCurrentPage(1);
  };

  // --- Action Handlers ---
  const handleView = (markRecord) => {
    setSelectedMark(markRecord);
    setIsViewModalOpen(true);
  };

  const handleEdit = (markRecord) => {
    setSelectedMark(markRecord);
    setEditFormData({ mark: markRecord.mark, grade: markRecord.grade });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this mark record?")) {
      try {
        await removeMark(id);
        toast.success("Mark deleted successfully");
        fetchMarksByBranch(undefined, currentPage, limit); // Refresh data
      } catch (err) {
        toast.error("Failed to delete mark");
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMark(selectedMark._id, editFormData);
      toast.success(`Marks updated for ${selectedMark.studentName}`);
      setIsEditModalOpen(false);
      setSelectedMark(null);
      fetchMarksByBranch(undefined, currentPage, limit); // Refresh data
    } catch (err) {
      toast.error("Failed to update marks");
    }
  };

  // --- Filtering Logic ---
  const filteredResults = marks?.filter((item) => {
    if (appliedFilterClass && item.studentClass !== appliedFilterClass) return false;
    if (appliedFilterSection && item.section !== appliedFilterSection) return false;
    if (appliedFilterExam && item.examType !== appliedFilterExam) return false;
    if (debouncedSearch && !item.studentName?.toLowerCase().includes(debouncedSearch.toLowerCase()) && 
        !item.registrationNo?.toLowerCase().includes(debouncedSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans relative">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Mtitle 
        title="Student Results" 
        middlecontent={
          <span className="text-sm text-base-content/70 hidden md:inline-block">
            View, edit, and manage student examination marks.
          </span>
        }
        rightcontent={
          <button className="btn btn-primary shadow-sm" onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print List
          </button>
        }
      />

      {/* Filter Section */}
      <div className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-200 mb-6 space-y-4">
        <TableControls 
          itemsPerPage={limit} 
          onItemsPerPageChange={handleLimitChange} 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />

        <div className="flex flex-wrap items-end gap-4 border-t border-base-200 pt-4">
          <div className="form-control w-full sm:max-w-xs">
            <label className="label"><span className="label-text font-semibold">Select Exam</span></label>
            <select className="select select-bordered w-full" value={filterExam} onChange={(e) => setFilterExam(e.target.value)}>
              <option value="">All Exams</option>
              {uniqueExams.map((exam, idx) => <option key={idx} value={exam}>{exam}</option>)}
            </select>
          </div>

          <div className="form-control w-full sm:max-w-xs">
            <label className="label"><span className="label-text font-semibold">Class</span></label>
            <select className="select select-bordered w-full" value={filterClass} onChange={(e) => {setFilterClass(e.target.value); setFilterSection("");}}>
              <option value="">All Classes</option>
              {uniqueClasses.map((cls, idx) => <option key={idx} value={cls}>{cls}</option>)}
            </select>
          </div>

          <div className="form-control w-full sm:max-w-xs">
            <label className="label"><span className="label-text font-semibold">Section</span></label>
            <select className="select select-bordered w-full" value={filterSection} onChange={(e) => setFilterSection(e.target.value)} disabled={!filterClass}>
              <option value="">All Sections</option>
              {filterAvailableSections.map((sec, idx) => <option key={idx} value={sec}>{sec}</option>)}
            </select>
          </div>

          <button onClick={handleFilterSearch} className="btn btn-primary">Filter Results</button>
          
          {(appliedFilterClass || appliedFilterSection || appliedFilterExam) && (
            <button onClick={() => {
              setFilterClass(""); setFilterSection(""); setFilterExam(""); 
              setAppliedFilterClass(""); setAppliedFilterSection(""); setAppliedFilterExam("");
            }} className="btn btn-ghost text-error">Clear</button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="overflow-x-auto rounded-box">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200 text-base-content text-sm">
              <tr>
                {tableHeaders.map((header) => <th key={header.id} className={header.className}>{header.label}</th>)}
              </tr>
            </thead>
            
            <tbody>
              {marksLoading ? (
                <SkeletonLoader />
              ) : filteredResults?.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="py-12 text-center">
                    <MtableLoading data={filteredResults} />
                    <p className="text-lg font-medium text-base-content/50 mt-[-40px]">No marks found</p>
                  </td>
                </tr>
              ) : (
                filteredResults?.map((markRecord) => (
                  <tr key={markRecord._id} className="hover">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10 bg-base-200">
                            <img 
                              src={markRecord.studentImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(markRecord.studentName)}&background=random`} 
                              alt="student" 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{markRecord.studentName}</div>
                          <div className="text-xs text-base-content/70">Reg: {markRecord.registrationNo || 'N/A'}</div>
                          <div className="text-xs font-medium text-primary">
                            {markRecord.studentClass} ({markRecord.section})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center pr-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleView(markRecord)} className="btn btn-xs btn-info btn-outline" title="View">
                          View
                        </button>
                        <button onClick={() => handleEdit(markRecord)} className="btn btn-xs btn-warning btn-outline" title="Edit">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(markRecord._id)} className="btn btn-xs btn-error btn-outline" title="Delete">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!marksLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center md:justify-end mt-6">
          <Pagination 
            currentPage={currentPage}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.totalItems || 0}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* View Mark Modal */}
      {isViewModalOpen && selectedMark && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-4 text-info border-b pb-2">Mark Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Student:</span> {selectedMark.studentName}</p>
              <p><span className="font-semibold">Class & Section:</span> {selectedMark.studentClass} ({selectedMark.section})</p>
              <p><span className="font-semibold">Exam:</span> {selectedMark.examType}</p>
              <p><span className="font-semibold">Subject:</span> {selectedMark.subjectName}</p>
              <div className="divider my-2"></div>
              <p><span className="font-semibold">Mark:</span> <span className="text-lg font-bold">{selectedMark.mark}</span></p>
              <p><span className="font-semibold">Grade:</span> <span className="badge badge-primary">{selectedMark.grade}</span></p>
            </div>
            <div className="modal-action">
              <button className="btn btn-sm" onClick={() => setIsViewModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mark Modal */}
      {isEditModalOpen && selectedMark && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4 text-warning border-b pb-2">
              Edit Mark: {selectedMark.studentName}
            </h3>
            <div className="mb-4 text-xs text-base-content/70">
              <p>Subject: <span className="font-semibold">{selectedMark.subjectName}</span></p>
              <p>Exam: <span className="font-semibold">{selectedMark.examType}</span></p>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Mark</span></label>
                  <input 
                    type="number" 
                    placeholder="0-100" 
                    className="input input-bordered w-full" 
                    required
                    value={editFormData.mark}
                    onChange={(e) => setEditFormData({...editFormData, mark: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Grade</span></label>
                  <select 
                    className="select select-bordered w-full"
                    value={editFormData.grade}
                    onChange={(e) => setEditFormData({...editFormData, grade: e.target.value})}
                    required
                  >
                    <option value="">Select</option>
                    {grades?.map((g) => (
                      <option key={g._id} value={g.gradeName}>{g.gradeName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-action mt-6 border-t pt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-warning">Update Mark</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}