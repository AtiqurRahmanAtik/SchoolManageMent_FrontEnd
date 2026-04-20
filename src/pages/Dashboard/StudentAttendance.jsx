import React, { useState, useEffect } from "react";
import { Calendar, ChevronDown, Check, UserCheck } from "lucide-react";
import useStudentAttendance from "../../Hook/useStudentAttendance";
import useSection from "../../Hook/useSection"; // Adjust path if necessary

const StudentAttendance = () => {
  // --- Hooks ---
  const { createStudentAttendance, loading: submitting } = useStudentAttendance();
  const { sections, getSections, loading: sectionsLoading } = useSection();

  // --- State ---
  const [formData, setFormData] = useState({
    date: "2026-04-19", 
    classId: "",
  });

  // Fetch sections/classes on component mount
  useEffect(() => {
    getSections(1, 100); 
  }, [getSections]);

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudentAttendance({
        date: formData.date,
        classId: formData.classId,
      });
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error submitting attendance", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12 font-sans w-full min-h-[80vh] bg-gray-50/50">
      
      {/* Main Card Container */}
      <div className="bg-white shadow-xl shadow-indigo-100/50 rounded-3xl p-8 sm:p-10 w-full max-w-lg border border-indigo-50">
        
        {/* Header section */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="bg-[#705FF5]/10 p-3.5 rounded-2xl text-[#705FF5]">
            <UserCheck size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Add Attendance
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Update daily class records
            </p>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
          
          {/* Date Picker */}
          <div className="relative w-full group">
            {/* Floating Label */}
            <label className="absolute -top-3 left-6 bg-[#705FF5] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm z-10 transition-transform duration-300 group-focus-within:-translate-y-1">
              Date *
            </label>
            <div className="relative flex items-center border-2 border-[#A7A6F5]/40 rounded-full px-6 py-3.5 bg-gray-50 hover:border-[#705FF5]/60 focus-within:border-[#705FF5] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#705FF5]/10 transition-all duration-300">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full outline-none bg-transparent text-gray-800 font-semibold appearance-none cursor-text"
                style={{ colorScheme: "light" }}
              />
              <Calendar className="absolute right-6 text-[#705FF5] pointer-events-none transition-colors group-focus-within:text-[#5b4be0]" size={22} strokeWidth={2.5} />
            </div>
          </div>

          {/* Class Dropdown */}
          <div className="relative w-full group">
            {/* Floating Label */}
            <label className="absolute -top-3 left-6 bg-[#705FF5] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm z-10 transition-transform duration-300 group-focus-within:-translate-y-1">
              Select Class *
            </label>
            <div className="relative flex items-center border-2 border-[#A7A6F5]/40 rounded-full px-6 py-3.5 bg-gray-50 hover:border-[#705FF5]/60 focus-within:border-[#705FF5] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#705FF5]/10 transition-all duration-300">
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                className="w-full outline-none bg-transparent text-gray-800 font-semibold appearance-none cursor-pointer"
              >
                <option value="" disabled hidden>
                  {sectionsLoading ? "Loading classes..." : "Select a class"}
                </option>
                {/* Creating a shallow copy to sort descending based on className before mapping */}
                {[...sections]
                  .sort((a, b) => {
                    const nameA = a.className || "";
                    const nameB = b.className || "";
                    // 'b' compared to 'a' gives descending order. {numeric: true} handles numbers like 'Class 10' correctly
                    return nameB.localeCompare(nameA, undefined, { numeric: true });
                  })
                  .map((section) => (
                    <option key={section._id} value={section._id} className="font-medium text-gray-800">
                      {section.className} {section.sectionName ? `(${section.sectionName})` : ""}
                    </option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 text-[#705FF5] pointer-events-none transition-transform duration-300 group-focus-within:rotate-180" size={22} strokeWidth={2.5} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full sm:w-auto sm:mx-auto flex items-center justify-center gap-3 bg-[#FFC56F] hover:bg-[#ffb446] active:scale-95 text-gray-900 font-bold px-10 py-4 rounded-full transition-all duration-200 shadow-lg shadow-[#FFC56F]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <Check size={22} strokeWidth={3} />
            {submitting ? "Saving Record..." : "Submit Attendance"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentAttendance;