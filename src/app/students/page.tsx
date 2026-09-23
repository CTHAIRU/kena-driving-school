"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Filter,
  ArrowRight,
  GraduationCap,
  Calendar,
  X,
  Check,
  Award,
  Edit2,
  Trash2,
  Printer,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { detectStudentCourses } from "@/lib/courseProgressShared";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [transFilter, setTransFilter] = useState("ALL");
  const [certFilter, setCertFilter] = useState("ALL");

  // Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    admissionNumber: "",
    phone: "",
    email: "",
    idNumber: "",
    status: "ENROLLED",
    balance: 0,
    transmission: "MANUAL",
    pdlNumber: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    pdlNumber: "",
    eCitizenRef: "",
    licenseCategory: "Category B - Light Vehicle",
    transmission: "MANUAL",
    packageId: "",
    instructorId: "",
    notes: "",
  });

  const handleStartEdit = (st: any) => {
    setEditingStudent(st);
    setEditForm({
      firstName: st.firstName || "",
      lastName: st.lastName || "",
      admissionNumber: st.admissionNumber || "",
      phone: st.phone || "",
      email: st.email || "",
      idNumber: st.idNumber || "",
      status: st.status || "ENROLLED",
      balance: st.balance || 0,
      transmission: st.transmission || "MANUAL",
      pdlNumber: st.pdlNumber || "",
      notes: st.notes || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingStudent(null);
        fetchStudents();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete student "${name}"? This action will remove all their lessons, skills, and ledger history.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchStudents();
      } else {
        alert("Failed to delete student");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickCertStatusChange = async (studentId: string, newStatus: string) => {
    try {
      await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateStatus: newStatus }),
      });
      fetchStudents();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (transFilter !== "ALL") params.append("transmission", transFilter);
      if (certFilter !== "ALL") params.append("certificateStatus", certFilter);

      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [pkgRes, instRes] = await Promise.all([
        fetch("/api/billing"),
        fetch("/api/instructors"),
      ]);
      const pkgData = await pkgRes.json();
      const instData = await instRes.json();
      setPackages(pkgData.packages || []);
      setInstructors(Array.isArray(instData) ? instData : []);
      if (pkgData.packages?.length > 0) {
        setNewStudent((prev) => ({ ...prev, packageId: pkgData.packages[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchMeta();
  }, [statusFilter, transFilter, certFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to enroll student");
      }

      setIsEnrollModalOpen(false);
      setNewStudent({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        idNumber: "",
        pdlNumber: "",
        eCitizenRef: "",
        licenseCategory: "Category B - Light Vehicle",
        transmission: "MANUAL",
        packageId: packages[0]?.id || "",
        instructorId: "",
        notes: "",
      });
      fetchStudents();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "TEST_READY":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "GRADUATED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "IN_TRAINING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Manage student enrollments, driving hours progress, and licensing milestones.
          </p>
        </div>

        <Link
          href="/portal/admin/add-student"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Student Enrollment</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium text-[11px] text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_TRAINING">In Training</option>
              <option value="TEST_READY">Test Ready</option>
              <option value="GRADUATED">Graduated</option>
              <option value="ENROLLED">Enrolled (New)</option>
            </select>
          </div>

          {/* Transmission Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium text-[11px] text-slate-400">Gearbox:</span>
            <select
              value={transFilter}
              onChange={(e) => setTransFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Transmissions</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatic</option>
            </select>
          </div>

          {/* Certificate Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium text-[11px] text-slate-400">Certificate:</span>
            <select
              value={certFilter}
              onChange={(e) => setCertFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Certificates</option>
              <option value="UNCOLLECTED">Uncollected</option>
              <option value="PRINTING">Printing</option>
              <option value="COLLECTED">Collected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading student directory...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No students found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or enroll a new student.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Course / Class &amp; Gear</th>
                  <th className="px-5 py-3.5">Instructor / Tutor</th>
                  <th className="px-5 py-3.5">Progress</th>
                  <th className="px-5 py-3.5">Stage</th>
                  <th className="px-5 py-3.5">Certificate</th>
                  <th className="px-5 py-3.5">Balance</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const detected = detectStudentCourses(student.package?.name, student.licenseCategory);
                  const isComp = detected.hasComputer;
                  const isAi = detected.hasAI;
                  const isDriving = detected.hasDriving;
                  const isTech = isComp || isAi;

                  const totalMods = isComp ? 10 : isAi ? 9 : 0;
                  const completedMods = student.moduleProgress
                    ? student.moduleProgress.filter((m: any) => m.status === "COMPLETED").length
                    : 0;

                  const progressPct = isTech
                    ? totalMods > 0
                      ? Math.round((completedMods / totalMods) * 100)
                      : 0
                    : Math.min(
                        100,
                        Math.round((student.completedHours / (student.requiredHours || 1)) * 100)
                      );

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                            isComp
                              ? "bg-blue-100 text-blue-700"
                              : isAi
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/students/${student.id}`}
                                className="font-bold text-slate-900 hover:text-orange-600 transition-colors"
                              >
                                {student.firstName} {student.lastName}
                              </Link>
                              {student.admissionNumber && (
                                <span className="text-[10px] font-mono font-bold bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">
                                  {student.admissionNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              ID: {student.idNumber} {student.pdlNumber && `• PDL: ${student.pdlNumber}`} • {student.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-800">
                          {student.licenseCategory || (isComp ? "Computer Packages" : isAi ? "AI Masterclasses" : "Driving Course")}
                        </span>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {isComp && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                              💻 10 Modules
                            </span>
                          )}
                          {isAi && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
                              🤖 9 Topics
                            </span>
                          )}
                          {isDriving && student.transmission && student.transmission !== "NONE" && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                student.transmission === "MANUAL"
                                  ? "bg-orange-50 text-orange-700 border border-orange-100"
                                  : "bg-cyan-50 text-cyan-700 border border-cyan-100"
                              }`}
                            >
                              🚗 {student.transmission}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        {student.assignedInstructor ? (
                          <div className="text-slate-800">
                            <p className="font-medium">
                              {student.assignedInstructor.firstName} {student.assignedInstructor.lastName}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 w-44">
                        <div className="flex items-center justify-between text-[11px] mb-1 text-slate-600">
                          <span>
                            {isTech
                              ? `${completedMods}/${totalMods} ${isComp ? "mods" : "topics"}`
                              : `${student.completedHours}h completed`}
                          </span>
                          <span className="font-medium">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progressPct >= 100 ? "bg-emerald-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {isTech ? "Module syllabus" : `${student.requiredHours} total required`}
                        </p>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                            student.status
                          )}`}
                        >
                          {student.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <select
                            value={student.certificateStatus || "UNCOLLECTED"}
                            onChange={(e) => handleQuickCertStatusChange(student.id, e.target.value)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                              student.certificateStatus === "COLLECTED"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : student.certificateStatus === "PRINTING"
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "bg-blue-50 text-blue-800 border-blue-300"
                            }`}
                          >
                            <option value="UNCOLLECTED">Uncollected</option>
                            <option value="PRINTING">Printing</option>
                            <option value="COLLECTED">Collected</option>
                          </select>
                          {student.certificateNumber && (
                            <p className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]" title={student.certificateNumber}>
                              {student.certificateNumber}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        {student.balance > 0 ? (
                          <span className="font-semibold text-amber-600">
                            {formatCurrency(student.balance)}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Paid
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(student)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors"
                            title="Edit Student Information"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteStudent(
                                student.id,
                                `${student.firstName} ${student.lastName}`
                              )
                            }
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                            title="Delete / Remove Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/students/${student.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                          >
                            <span>Profile</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Edit Student: {editingStudent.firstName} {editingStudent.lastName}
                </h3>
                <p className="text-xs text-slate-500">
                  Update candidate credentials, tuition fee balance, and NTSA licensing status.
                </p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    value={editForm.admissionNumber}
                    onChange={(e) => setEditForm({ ...editForm, admissionNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">National ID *</label>
                  <input
                    type="text"
                    required
                    value={editForm.idNumber}
                    onChange={(e) => setEditForm({ ...editForm, idNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="ENROLLED">Enrolled</option>
                    <option value="IN_TRAINING">In Training</option>
                    <option value="TEST_READY">Test Ready</option>
                    <option value="GRADUATED">Graduated</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={editForm.transmission}
                    onChange={(e) => setEditForm({ ...editForm, transmission: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="BOTH">Both (Dual)</option>
                    <option value="NONE">None (Computer/AI)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee Balance (KSh)</label>
                  <input
                    type="number"
                    value={editForm.balance}
                    onChange={(e) =>
                      setEditForm({ ...editForm, balance: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NTSA PDL Number</label>
                <input
                  type="text"
                  placeholder="PDL-2026-..."
                  value={editForm.pdlNumber}
                  onChange={(e) => setEditForm({ ...editForm, pdlNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructor / Admin Notes</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Student Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Enrollment Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Enroll New Driving Student</h3>
                <p className="text-xs text-slate-500">
                  Register student credentials, course package, and assigned instructor.
                </p>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 7..."
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">National ID / Passport *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 38291044"
                    value={newStudent.idNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, idNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gearbox Preference</label>
                  <select
                    value={newStudent.transmission}
                    onChange={(e) => setNewStudent({ ...newStudent, transmission: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATIC">Automatic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NTSA PDL Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. PDL-2026-8910"
                    value={newStudent.pdlNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, pdlNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">eCitizen Reference (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. EC-NTSA-99104"
                    value={newStudent.eCitizenRef}
                    onChange={(e) => setNewStudent({ ...newStudent, eCitizenRef: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Course Package</label>
                  <select
                    value={newStudent.packageId}
                    onChange={(e) => setNewStudent({ ...newStudent, packageId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.totalHours}h - {formatCurrency(pkg.price)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Assigned Instructor</label>
                  <select
                    value={newStudent.instructorId}
                    onChange={(e) => setNewStudent({ ...newStudent, instructorId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Assign Later --</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.firstName} {inst.lastName} ({inst.specializations})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Special Notes / Medical / Goals</label>
                <textarea
                  rows={2}
                  placeholder="Nervous driver, weekend availability only, etc."
                  value={newStudent.notes}
                  onChange={(e) => setNewStudent({ ...newStudent, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Enrolling..." : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
