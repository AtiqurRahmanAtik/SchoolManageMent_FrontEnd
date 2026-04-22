import React, { useState, useEffect } from "react";
import useSubject from "../../Hook/useSubject"; // Adjust path as needed
import useTeachers from "../../Hook/useTeachers"; // Adjust path as needed

export default function Routine() {
  // Fetch subjects and classes using the provided hook
  const { subjects, fetchSubjectsByBranch, loading: subjectLoading } = useSubject();
  
  // Fetch teachers using the provided hook
  const { teachers, fetchTeachers, loading: teacherLoading } = useTeachers();

  // Times from 8:00 to 5:00
  const times = [
    "8:00-9:00",
    "9:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-1:00",
    "1:00-2:00",
    "2:00-3:00",
    "3:00-4:00",
    "4:00-5:00",
  ];
  
  // Days from Saturday to Thursday
  const days = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];

  // State to hold the routine data. 
  // Key format: "CLASSNAME-DAY-TIME" (e.g., "Grade 10-SATURDAY-8:00-9:00")
  const [routineData, setRoutineData] = useState({});

  // Filter state for the top dropdown
  const [selectedClass, setSelectedClass] = useState("");

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    day: "SATURDAY",
    time: "8:00-9:00",
    teacherName: "",
    subjectName: "",
    subjectCode: "",
  });

  // Fetch all subjects and teachers on mount to populate dropdowns
  useEffect(() => {
    fetchSubjectsByBranch(undefined, "", 1, 100); 
    fetchTeachers(1, 100); // Fetching up to 100 teachers for the dropdown
  }, [fetchSubjectsByBranch, fetchTeachers]);

  // Extract unique classes for the dropdowns
  const uniqueClasses = Array.from(
    new Set(subjects?.map((sub) => sub.ClassName).filter(Boolean))
  );

  // Derived state: Subjects specific to the selected class in the modal
  const classSubjects = subjects?.filter(sub => sub.ClassName === formData.className) || [];
  
  // Derived state: Subject Codes specific to the selected subject in the modal
  const availableSubjectCodes = Array.from(
    new Set(classSubjects
      .filter(sub => sub.SubjectName === formData.subjectName)
      .map(sub => sub.SubjectCode)
      .filter(Boolean)
    )
  );

  // Handlers
  const openModal = () => {
    setFormData((prev) => ({ ...prev, className: selectedClass || (uniqueClasses[0] || "") }));
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-fill Subject Code when a Subject Name is selected
  const handleSubjectChange = (e) => {
    const selectedSubName = e.target.value;
    const matchedSubjects = classSubjects.filter(sub => sub.SubjectName === selectedSubName);
    
    setFormData((prev) => ({
      ...prev,
      subjectName: selectedSubName,
      // Auto-select the first available code for this subject to save the user a click
      subjectCode: matchedSubjects.length > 0 ? matchedSubjects[0].SubjectCode : "",
    }));
  };

  const handleSaveRoutine = (e) => {
    e.preventDefault();
    if (!formData.className) {
      alert("Please select a class first.");
      return;
    }
    
    const key = `${formData.className}-${formData.day}-${formData.time}`;
    setRoutineData((prev) => ({
      ...prev,
      [key]: {
        teacherName: formData.teacherName,
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
      },
    }));
    closeModal();
    // Reset specific form fields after save
    setFormData({ ...formData, teacherName: "", subjectName: "", subjectCode: "" });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Page Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Class Routine Management
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Manage and organize daily schedules for classes
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          {/* Main Select Class Dropdown */}
          <select
            className="select select-bordered w-full sm:w-64 focus:select-primary"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={subjectLoading}
          >
            <option value="" disabled>
              {subjectLoading ? "Loading Classes..." : "Select Class to View"}
            </option>
            {uniqueClasses.map((cls, index) => (
              <option key={index} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <button onClick={openModal} className="btn btn-primary shadow-sm" disabled={!selectedClass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Routine
          </button>
        </div>
      </div>

      {/* Main Schedule Card */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="overflow-x-auto rounded-box p-4 md:p-6">
          
          {!selectedClass ? (
            <div className="py-20 text-center flex flex-col items-center justify-center text-base-content/50">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xl font-medium">No Class Selected</p>
              <p className="text-sm mt-2">Please select a class from the dropdown above to view or edit its routine.</p>
            </div>
          ) : (
            <div className="min-w-[900px]">
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                
                {/* Table Header */}
                <div className="bg-base-200 py-3 rounded-md font-bold text-base-content border border-base-300 flex items-center justify-center">
                  TIME
                </div>
                {days.map((day) => (
                  <div
                    key={day}
                    className="bg-base-200 py-3 rounded-md font-bold text-base-content border border-base-300 flex items-center justify-center"
                  >
                    {day}
                  </div>
                ))}

                {/* Table Body */}
                {times.map((time) => (
                  <React.Fragment key={time}>
                    {/* Time Column */}
                    <div className="bg-base-200 py-3 rounded-md font-bold text-base-content border border-base-300 flex items-center justify-center">
                      {time}
                    </div>
                    
                    {/* Day Columns for the specific time */}
                    {days.map((day) => {
                      const key = `${selectedClass}-${day}-${time}`;
                      const cellData = routineData[key];
                      
                      return (
                        <div
                          key={key}
                          className="bg-base-100 min-h-[70px] p-2 rounded-md border border-base-200 shadow-sm flex flex-col items-center justify-center text-xs overflow-hidden hover:border-primary transition-colors"
                        >
                          {cellData ? (
                            <>
                              <span className="font-bold text-primary">{cellData.subjectName}</span>
                              <span className="text-base-content/70 font-medium">{cellData.subjectCode}</span>
                              <span className="text-base-content/50 italic mt-1">{cellData.teacherName}</span>
                            </>
                          ) : (
                            <span className="text-base-content/20">-</span>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Routine Modal */}
      <div className={`modal ${isModalOpen ? "modal-open" : ""}`} style={{ zIndex: 999 }}>
        <div className="modal-box">
          <button type="button" onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          
          <h3 className="font-bold text-xl mb-4 border-b border-base-200 pb-2">
            Edit Class Routine
          </h3>

          <form onSubmit={handleSaveRoutine} className="space-y-4 py-2">
            
            {/* Target Class */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Class</span>
              </label>
              <input
                type="text"
                value={formData.className}
                readOnly
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Day Selection */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Select Day</span>
                </label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  required
                  className="select select-bordered w-full focus:select-primary"
                >
                  {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>

              {/* Time Selection */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Class Time</span>
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="select select-bordered w-full focus:select-primary"
                >
                  {times.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
            </div>

            {/* Subject Name Dropdown */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Subject Name</span>
              </label>
              <select
                name="subjectName"
                value={formData.subjectName}
                onChange={handleSubjectChange}
                required
                className="select select-bordered w-full focus:select-primary"
              >
                <option value="" disabled>Select a Subject</option>
                {Array.from(new Set(classSubjects.map(sub => sub.SubjectName))).map((subName, index) => (
                  <option key={index} value={subName}>
                    {subName}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Code Dropdown */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Subject Code</span>
              </label>
              <select
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleInputChange}
                required
                disabled={!formData.subjectName || availableSubjectCodes.length === 0}
                className="select select-bordered w-full focus:select-primary"
              >
                <option value="" disabled>Select Subject Code</option>
                {availableSubjectCodes.map((code, index) => (
                  <option key={index} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher Name Dropdown */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Teacher Name</span>
              </label>
              <select
                name="teacherName"
                value={formData.teacherName}
                onChange={handleInputChange}
                required
                disabled={teacherLoading}
                className="select select-bordered w-full focus:select-primary text-black"
              >
                <option value="" disabled>
                  {teacherLoading ? "Loading Teachers..." : "Select a Teacher"}
                </option>
                {/* Uses teacherName exactly as per your database schema */}
                {teachers?.map((teacher, index) => (
                  <option key={teacher._id || index} value={teacher.teacherName} className="text-black">
                    {teacher.teacherName}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action mt-6">
              <button type="button" onClick={closeModal} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary min-w-[120px]">
                Save Routine
              </button>
            </div>
          </form>
        </div>
        
        {/* Backdrop click to close */}
        <div className="modal-backdrop" onClick={closeModal}>
          <button type="button" className="cursor-default">close</button>
        </div>
      </div>
    </div>
  );
}