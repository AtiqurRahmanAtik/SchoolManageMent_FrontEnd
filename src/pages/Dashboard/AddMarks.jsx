import React, { useEffect, useState } from 'react';
import useStudents from '../../Hook/useStudents'; 
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

export default function AddMarks() {
  // --- Student Hook ---
  const {
    students,
    pagination,
    loading: studentLoading,
    error: studentError,
    fetchStudentsByBranch,
  } = useStudents();

  // --- Student Marks Hook ---
  const { 
    createMark, 
    loading: marksLoading,
    error: marksError 
  } = useStudentMarks();

  // --- Examination Hook ---
  const { 
    examinations, 
    loading: examLoading,
    error: examError,
    fetchExaminationsByBranch 
  } = useExamination();

  // --- Section Hook ---
  const { sections, getSections } = useSection();

  // --- Subject Hook ---
  const { subjects, fetchSubjectsByBranch } = useSubject();

  // --- Grade Hook ---
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

  // Modal & Mark State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [markData, setMarkData] = useState({ 
    subjectId: "", 
    mark: "", 
    grade: "" 
  });
  const [formErrors, setFormErrors] = useState({});

  // --- Dynamic Table Headers ---
  const tableHeaders = [
    { id: "student", label: "Student Name", className: "py-4 rounded-tl-box" },
    { id: "regNo", label: "Registration No", className: "py-4 hidden sm:table-cell" },
    { id: "classInfo", label: "Class & Section", className: "py-4 hidden md:table-cell" },
    { id: "actions", label: "Actions", className: "py-4 text-right rounded-tr-box pr-8" }
  ];

  // Initial Data Fetching
  useEffect(() => {
    getSections(1, 1000); 
    fetchExaminationsByBranch(undefined, 1, 1000); 
    fetchGradesByBranch(undefined, 1, 1000); 
  }, [getSections, fetchExaminationsByBranch, fetchGradesByBranch]);

  useEffect(() => {
    fetchStudentsByBranch(undefined, currentPage, limit, debouncedSearch);
  }, [fetchStudentsByBranch, currentPage, limit, debouncedSearch]);

  // Debounce logic
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
  
  const uniqueExams = examinations && examinations.length > 0 
    ? Array.from(new Set(
        examinations.map((e) => e.examName || e.examinationName || e.name).filter(Boolean)
      ))
    : [];

  // --- Handlers ---
  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const handleLimitChange = (e) => { 
    setLimit(parseInt(e.target.value, 10)); 
    setCurrentPage(1); 
  };
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterSearch = () => {
    setAppliedFilterClass(filterClass);
    setAppliedFilterSection(filterSection);
    setAppliedFilterExam(filterExam);
    setCurrentPage(1);
  };

  // Open Modal - Add Mark
  const openAddMarkModal = (student) => {
    if (!appliedFilterExam) {
      toast.warning("Please select an Examination from the filters first.");
      return;
    }
    setSelectedStudent(student);
    // Fetch subjects for this student's class
    fetchSubjectsByBranch(undefined, student.studentClass, 1, 1000); 
    setMarkData({ subjectId: "", mark: "", grade: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setMarkData({ subjectId: "", mark: "", grade: "" });
    setFormErrors({});
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};

    if (!markData.subjectId.trim()) {
      errors.subjectId = "Subject is required";
    }
    if (!markData.mark.trim()) {
      errors.mark = "Mark is required";
    } else if (isNaN(markData.mark) || markData.mark < 0 || markData.mark > 100) {
      errors.mark = "Mark must be between 0 and 100";
    }
    if (!markData.grade.trim()) {
      errors.grade = "Grade is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Mark Form Submission
  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Find the subject name from the subjects list
    const subject = subjects.find(s => s._id === markData.subjectId);

    const payload = {
      studentId: selectedStudent._id,
      studentName: selectedStudent.studentName,
      studentImage: selectedStudent.studentPhoto || "",
      registrationNo: selectedStudent.registrationNo,
      examType: appliedFilterExam,
      studentClass: selectedStudent.studentClass,
      section: selectedStudent.section,
      subjectName: subject ? subject.SubjectName : "",
      mark: markData.mark, // ✅ Include the mark value
      grade: markData.grade,
      // branch is handled automatically inside createMark hook via useAuth
    };


    // console.log("send marks : ", payload)

    try {
      await createMark(payload);
      toast.success(`✓ Marks added successfully for ${selectedStudent.studentName}`);
      closeModal();
      // Optionally refresh the students list or marks list
    } catch (err) {
      toast.error(err.message || "Failed to add marks");
    }
  };

  // --- Filtering Logic ---
  const filteredResults = students?.filter((student) => {
    if (appliedFilterClass && student.studentClass !== appliedFilterClass) return false;
    if (appliedFilterSection && student.section !== appliedFilterSection) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans relative">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Mtitle 
        title="Add Student Marks" 
        middlecontent={
          <span className="text-sm text-base-content/70 hidden md:inline-block">
            Assign marks and grades to students based on examinations.
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
          
          {/* Exam Dropdown */}
          <div className="form-control w-full sm:max-w-xs">
            <label className="label"><span className="label-text font-semibold">Select Exam</span></label>
            <select 
              className="select select-bordered w-full" 
              value={filterExam} 
              onChange={(e) => setFilterExam(e.target.value)}
              disabled={examLoading}
            >
              <option value="">
                {examLoading ? "Loading exams..." : "All Exams"}
              </option>
              {uniqueExams.length > 0 ? (
                uniqueExams.map((exam, idx) => (
                  <option key={idx} value={exam}>{exam}</option>
                ))
              ) : (
                <option disabled>No examinations available</option>
              )}
            </select>
            {examError && <span className="text-error text-xs mt-1">{examError}</span>}
          </div>

          {/* Class Dropdown */}
          <div className="form-control w-full sm:max-w-xs">
            <label className="label"><span className="label-text font-semibold">Class</span></label>
            <select 
              className="select select-bordered w-full" 
              value={filterClass} 
              onChange={(e) => {setFilterClass(e.target.value); setFilterSection("");}}
            >
              <option value="">All Classes</option>
              {uniqueClasses.map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Section Dropdown */}
          <div className="form-control w-full sm:max-w-xs">
            <label className="label"><span className="label-text font-semibold">Section</span></label>
            <select 
              className="select select-bordered w-full" 
              value={filterSection} 
              onChange={(e) => setFilterSection(e.target.value)} 
              disabled={!filterClass}
            >
              <option value="">All Sections</option>
              {filterAvailableSections.map((sec, idx) => (
                <option key={idx} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button onClick={handleFilterSearch} className="btn btn-primary">
            Search Students
          </button>
          
          {/* Clear Filters Button */}
          {(appliedFilterClass || appliedFilterSection || appliedFilterExam) && (
            <button 
              onClick={() => {
                setFilterClass(""); 
                setFilterSection(""); 
                setFilterExam(""); 
                setAppliedFilterClass(""); 
                setAppliedFilterSection(""); 
                setAppliedFilterExam("");
                setCurrentPage(1);
              }} 
              className="btn btn-ghost text-error"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="overflow-x-auto rounded-box">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200 text-base-content text-sm">
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header.id} className={header.className}>
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {studentLoading ? (
                <SkeletonLoader />
              ) : filteredResults?.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="py-12 text-center">
                    <MtableLoading data={filteredResults} />
                    <p className="text-lg font-medium text-base-content/50 mt-[-40px]">
                      No students found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredResults?.map((student) => (
                  <tr key={student._id} className="hover">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10 bg-base-200">
                            <img 
                              src={student.studentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.studentName)}&background=random`} 
                              alt="student" 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{student.studentName}</div>
                          {appliedFilterExam && (
                            <div className="text-xs text-primary font-medium">
                              {appliedFilterExam}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 hidden sm:table-cell font-medium">
                      {student.registrationNo || 'N/A'}
                    </td>
                    <td className="py-4 hidden md:table-cell">
                      {student.studentClass}{' '}
                      <span className="text-primary text-xs ml-1">
                        ({student.section})
                      </span>
                    </td>
                    <td className="py-4 text-right pr-6">
                      <button 
                        onClick={() => openAddMarkModal(student)} 
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Add Mark
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!studentLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center md:justify-end mt-6">
          <div className="join shadow-sm border border-base-200 rounded-lg bg-base-100">
            <Pagination 
              currentPage={currentPage}
              totalPages={pagination.totalPages || 1}
              totalItems={pagination.totalItems || 0}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Add Mark Modal */}
      {isModalOpen && (
        <div className="modal modal-open backdrop-blur">
          <div className="modal-box max-w-md w-full">
            {/* Modal Header */}
            <h3 className="font-bold text-lg mb-2 text-primary border-b pb-3">
              Add Mark
            </h3>
            
            {/* Student Info */}
            <div className="mb-4 p-3 bg-base-200 rounded-lg">
              <p className="text-sm font-semibold text-base-content">
                {selectedStudent?.studentName}
              </p>
              <p className="text-xs text-base-content/70 mt-1">
                Reg No: {selectedStudent?.registrationNo}
              </p>
              <p className="text-xs text-base-content/70">
                Class: {selectedStudent?.studentClass} | Section: {selectedStudent?.section}
              </p>
              <p className="text-xs text-base-content/70">
                Exam: <span className="text-primary font-semibold">{appliedFilterExam}</span>
              </p>
            </div>

            {/* Mark Form */}
            <form onSubmit={handleMarkSubmit} className="space-y-4">
              
              {/* Subject Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Select Subject *</span>
                  <span className="label-text-alt text-primary text-xs">
                    {subjects?.length > 0 ? `${subjects.length} subject(s)` : "No subjects"}
                  </span>
                </label>
                <select 
                  className={`select select-bordered w-full ${formErrors.subjectId ? "select-error" : ""}`}
                  value={markData.subjectId}
                  onChange={(e) => {
                    setMarkData({...markData, subjectId: e.target.value});
                    setFormErrors({...formErrors, subjectId: ""});
                  }}
                >
                  <option value="">Choose a subject</option>
                  {subjects?.map((subj) => (
                    <option key={subj._id} value={subj._id}>
                      {subj.SubjectName} {subj.SubjectCode ? `(${subj.SubjectCode})` : ''}
                    </option>
                  ))}
                </select>
                {formErrors.subjectId && (
                  <label className="label"><span className="label-text-alt text-error">{formErrors.subjectId}</span></label>
                )}
                {subjects?.length === 0 && !formErrors.subjectId && (
                  <label className="label"><span className="label-text-alt text-warning">No subjects available for this class</span></label>
                )}
              </div>
              
              {/* Mark & Grade Row */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Mark Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Mark (0-100) *</span>
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    min="0"
                    max="100"
                    step="0.5"
                    className={`input input-bordered w-full ${formErrors.mark ? "input-error" : ""}`}
                    value={markData.mark}
                    onChange={(e) => {
                      setMarkData({...markData, mark: e.target.value});
                      setFormErrors({...formErrors, mark: ""});
                    }}
                  />
                  {formErrors.mark && (
                    <label className="label"><span className="label-text-alt text-error">{formErrors.mark}</span></label>
                  )}
                </div>

                {/* Grade Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Grade *</span>
                  </label>
                  <select 
                    className={`select select-bordered w-full ${formErrors.grade ? "select-error" : ""}`}
                    value={markData.grade}
                    onChange={(e) => {
                      setMarkData({...markData, grade: e.target.value});
                      setFormErrors({...formErrors, grade: ""});
                    }}
                  >
                    <option value="">Select</option>
                    {grades?.map((g) => (
                      <option key={g._id} value={g.gradeName}>
                        {g.gradeName}
                      </option>
                    ))}
                  </select>
                  {formErrors.grade && (
                    <label className="label"><span className="label-text-alt text-error">{formErrors.grade}</span></label>
                  )}
                  {grades?.length === 0 && !formErrors.grade && (
                    <label className="label"><span className="label-text-alt text-warning">No grades defined</span></label>
                  )}
                </div>
              </div>

              {/* Form Error Message */}
              {marksError && (
                <div className="alert alert-error shadow-sm">
                  <span className="text-sm">{marksError}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="modal-action gap-2 mt-6 border-t pt-4">
                <button 
                  type="button" 
                  className="btn btn-ghost btn-sm"
                  onClick={closeModal}
                  disabled={marksLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm gap-2"
                  disabled={
                    subjects?.length === 0 || 
                    marksLoading || 
                    grades?.length === 0
                  }
                >
                  {marksLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Mark"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Modal Backdrop */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}>close</button>
          </form>
        </div>
      )}
    </div>
  );
}