import React, { useState, useEffect, useMemo } from 'react';
import useStudents from '../../Hook/useStudents'; // Adjust the import path as needed
import useSection from '../../Hook/useSection'; // Adjust the import path for your useSection hook
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helper component declared strictly OUTSIDE the main function to prevent re-renders
const AdmissionField = ({ label, name, type = 'text', value, onChange, placeholder, required = false, options = [], colSpan = 1 }) => {
  return (
    <div className={`col-span-${colSpan} flex flex-col`}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'select' ? (
        <div className="relative">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
          >
            <option value="" disabled>{placeholder || 'Select...'}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
          {/* Custom Select Dropdown Arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm placeholder:text-gray-400"
        />
      )}
    </div>
  );
};

// Initial state defined outside to easily reuse for reset
const initialFormState = {
  studentName: '',
  registrationNo: '',
  studentClass: '',
  section: '',
  studentPhoto: '', 
  dateOfAdmission: '',
  discountInFee: '',
  dateOfBirth: '',
  studentBirthFormId: '',
  gender: '',
  previousSchool: '',
  religion: '',
  bloodGroup: '',
  previousIdBoardRollNo: '',
  additionalNote: '',
  totalSiblings: '',
  address: '',
  fatherName: '',
  fatherNationalId: '',
  fatherOccupation: '',
  fatherEducation: '',
  fatherMobileNo: '',
  fatherIncome: '',
  motherName: '',
  motherNationalId: '',
  motherOccupation: '',
  motherEducation: '',
  motherMobileNo: '',
  motherIncome: '',
  selectFamily: '',
  mobileNo: '', 
};

export default function Admissions() {
  const { createStudent, loading, error } = useStudents();
  
  // Bring in the useSection hook
  const { sections, getSections } = useSection();

  // Fetch sections automatically when the component mounts
  useEffect(() => {
    getSections();
  }, [getSections]);

  // State for form data
  const [formData, setFormData] = useState(initialFormState);
  
  // State for toggling parents section visibility
  const [showParents, setShowParents] = useState(false);

  // Extract unique Class Names from the fetched sections
  const uniqueClasses = useMemo(() => {
    const classSet = new Set(sections.map((s) => s.className));
    return Array.from(classSet).filter(Boolean); // filter(Boolean) removes empty/undefined values
  }, [sections]);

  // Extract Section Names (dynamically filters based on the selected class)
  const availableSections = useMemo(() => {
    let relevantSections = sections;
    // If a class is selected, only show sections that belong to that specific class
    if (formData.studentClass) {
      relevantSections = sections.filter((s) => s.className === formData.studentClass);
    }
    const sectionSet = new Set(relevantSections.map((s) => s.sectionName));
    return Array.from(sectionSet).filter(Boolean);
  }, [sections, formData.studentClass]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If the user changes the class, reset the section field so they don't submit an invalid combination
    if (name === 'studentClass') {
      setFormData((prev) => ({ ...prev, [name]: value, section: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    setFormData(initialFormState); // Clear form fields
    setShowParents(false);         // Hide parent sections on reset
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudent(formData);
      toast.success('Student Admission Successfully Created!');
      handleReset(); // Clear form on success
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(err.message || 'Failed to submit admission form');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="max-w-7xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-white/60">
        
        {/* Form Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Admission Form
          </h1>
          <p className="text-gray-500 font-medium">Please fill out all the necessary information carefully.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm">
            <p className="font-semibold">Submission Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Student Information */}
          <section className="bg-white rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
              <span className="bg-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center mr-4 text-xl font-bold shadow-md">1</span>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Student Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              <AdmissionField label="Student Name" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Full Name" required />
              <AdmissionField label="Registration No" name="registrationNo" value={formData.registrationNo} onChange={handleChange} placeholder="E.g. REG-2026" required />
              
              <AdmissionField 
                label="Select Class" 
                name="studentClass" 
                type="select" 
                value={formData.studentClass} 
                onChange={handleChange} 
                required 
                options={uniqueClasses} 
              />
              
              <AdmissionField 
                label="Section" 
                name="section" 
                type="select" 
                value={formData.section} 
                onChange={handleChange} 
                required 
                options={availableSections} 
              />
              
              <AdmissionField label="Picture Name / URL (Optional)" name="studentPhoto" type="text" value={formData.studentPhoto} onChange={handleChange} placeholder="Image link or file name" />
              <AdmissionField label="Date of Admission" name="dateOfAdmission" type="date" value={formData.dateOfAdmission} onChange={handleChange} required />
              
              <AdmissionField label="Discount In Fee (%)" name="discountInFee" type="number" value={formData.discountInFee} onChange={handleChange} placeholder="0" required />
              <AdmissionField label="Mobile No / WhatsApp" name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder="+1 234 567 8900" />
            </div>
          </section>

          {/* Section 2: Other Information */}
          <section className="bg-white rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
              <span className="bg-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center mr-4 text-xl font-bold shadow-md">2</span>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Other Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              <AdmissionField label="Date Of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
              <AdmissionField label="Student Birth Form ID / NIC" name="studentBirthFormId" value={formData.studentBirthFormId} onChange={handleChange} placeholder="ID Number" />
              
              <AdmissionField label="Gender" name="gender" type="select" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
              <AdmissionField label="Previous School" name="previousSchool" value={formData.previousSchool} onChange={handleChange} placeholder="School Name" />
              <AdmissionField label="Religion" name="religion" type="select" value={formData.religion} onChange={handleChange} options={['Islam', 'Christianity', 'Hinduism', 'Buddhism', 'Other']} />
              
              <AdmissionField label="Blood Group" name="bloodGroup" type="select" value={formData.bloodGroup} onChange={handleChange} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
              <AdmissionField label="Previous ID / Board Roll No" name="previousIdBoardRollNo" value={formData.previousIdBoardRollNo} onChange={handleChange} placeholder="Roll Number" />
              <AdmissionField label="Total Siblings" name="totalSiblings" type="number" value={formData.totalSiblings} onChange={handleChange} placeholder="0" />
              
              <div className="md:col-span-2">
                <AdmissionField label="Any Additional Note" name="additionalNote" value={formData.additionalNote} onChange={handleChange} placeholder="Special instructions or notes..." />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-grow w-full">
                <AdmissionField label="Full Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street, City, State, Zip" />
              </div>
              <div className="w-full md:w-auto">
                <button 
                  type="button" 
                  onClick={() => setShowParents(!showParents)}
                  className={`w-full md:w-auto font-bold py-3 px-8 rounded-xl shadow-sm transition-all duration-200 border flex items-center justify-center
                    ${showParents ? 'bg-red-100 hover:bg-red-200 text-red-800 border-red-200' : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200'}`}
                >
                  {showParents ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      Remove Parents Info
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      Add Parents Info
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Render Sections 3 and 4 only if showParents is true */}
          {showParents && (
            <div className="space-y-12 animate-fade-in-down">
              {/* Section 3: Father/Guardian Information */}
              <section className="bg-white rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                  <span className="bg-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center mr-4 text-xl font-bold shadow-md">3</span>
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Father/Guardian Info</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                  <AdmissionField label="Father Name" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Full Name" />
                  <AdmissionField label="National ID" name="fatherNationalId" value={formData.fatherNationalId} onChange={handleChange} placeholder="National ID" />
                  <AdmissionField label="Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} placeholder="Job Title" />
                  
                  <AdmissionField label="Education" name="fatherEducation" value={formData.fatherEducation} onChange={handleChange} placeholder="Highest Degree" />
                  <AdmissionField label="Mobile No" name="fatherMobileNo" value={formData.fatherMobileNo} onChange={handleChange} placeholder="Phone Number" />
                  <AdmissionField label="Monthly Income" name="fatherIncome" type="number" value={formData.fatherIncome} onChange={handleChange} placeholder="Amount" />
                </div>
              </section>

              {/* Section 4: Mother Information */}
              <section className="bg-white rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                  <span className="bg-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center mr-4 text-xl font-bold shadow-md">4</span>
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Mother Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                  <AdmissionField label="Mother Name" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Full Name" />
                  <AdmissionField label="National ID" name="motherNationalId" value={formData.motherNationalId} onChange={handleChange} placeholder="National ID" />
                  <AdmissionField label="Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} placeholder="Job Title" />
                  
                  <AdmissionField label="Education" name="motherEducation" value={formData.motherEducation} onChange={handleChange} placeholder="Highest Degree" />
                  <AdmissionField label="Mobile No" name="motherMobileNo" value={formData.motherMobileNo} onChange={handleChange} placeholder="Phone Number" />
                  <AdmissionField label="Monthly Income" name="motherIncome" type="number" value={formData.motherIncome} onChange={handleChange} placeholder="Amount" />
                </div>
              </section>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-200">
            <button 
              type="button" 
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 shadow-sm transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Reset Form
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Submit Admission
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}