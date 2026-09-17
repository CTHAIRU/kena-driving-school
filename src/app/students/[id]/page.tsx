"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Award,
  CheckCircle2,
  Clock,
  Car,
  GraduationCap,
  Star,
  Check,
  AlertCircle,
  Plus,
  FileText,
  FileCheck2,
  ExternalLink,
  Printer,
  PackageCheck,
  Edit3,
  Save,
  BookOpen,
  Sparkles,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  detectCourseType,
  CourseType,
  CertificateStatus,
  generateCertificateNumber,
} from "@/lib/courseProgressShared";

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingSkill, setUpdatingSkill] = useState<string | null>(null);

  // Certificate Management State
  const [certStatus, setCertStatus] = useState<string>("UNCOLLECTED");
  const [certNumber, setCertNumber] = useState<string>("");
  const [certIssueDate, setCertIssueDate] = useState<string>("");
  const [certRemarks, setCertRemarks] = useState<string>("");
  const [savingCert, setSavingCert] = useState(false);
  const [certSaveSuccess, setCertSaveSuccess] = useState(false);

  // Module Progress State (Computer & AI)
  const [modules, setModules] = useState<any[]>([]);
  const [moduleSummary, setModuleSummary] = useState<any>(null);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [modStatus, setModStatus] = useState("COMPLETED");
  const [modScore, setModScore] = useState<number | string>("");
  const [modClasswork, setModClasswork] = useState("");
  const [modRemarks, setModRemarks] = useState("");
  const [savingModule, setSavingModule] = useState(false);

  // Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("MOBILE_MONEY");
  const [payRef, setPayRef] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/students/${studentId}`);
      const data = await res.json();
      setStudent(data);

      if (data && !data.error) {
        setCertStatus(data.certificateStatus || "UNCOLLECTED");
        setCertNumber(data.certificateNumber || "");
        setCertIssueDate(
          data.certificateIssueDate
            ? new Date(data.certificateIssueDate).toISOString().split("T")[0]
            : ""
        );
        setCertRemarks(data.certificateRemarks || "");

        const cType = detectCourseType(data.package?.name, data.licenseCategory);
        if (cType === "COMPUTER" || cType === "AI") {
          try {
            const modRes = await fetch(`/api/students/module-progress?studentId=${studentId}`);
            const modData = await modRes.json();
            if (modData && modData.modules) {
              setModules(modData.modules);
              setModuleSummary(modData.summary);
            }
          } catch (mErr) {
            console.error("Failed to fetch module progress:", mErr);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchStudent();
  }, [studentId]);

  const handleSkillStatusChange = async (skillName: string, newStatus: string) => {
    setUpdatingSkill(skillName);
    try {
      await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillUpdate: {
            skillName,
            status: newStatus,
          },
        }),
      });
      await fetchStudent();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingSkill(null);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchStudent();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          amount: parseFloat(payAmount),
          paymentMethod: payMethod,
          transactionRef: payRef,
          notes: payNotes,
        }),
      });
      if (res.ok) {
        setIsPaymentModalOpen(false);
        setPayAmount("");
        setPayRef("");
        setPayNotes("");
        fetchStudent();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPaying(false);
    }
  };

  const handleSaveCertificate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingCert(true);
    setCertSaveSuccess(false);
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateStatus: certStatus,
          certificateNumber: certNumber || null,
          certificateIssueDate: certIssueDate || null,
          certificateRemarks: certRemarks || null,
        }),
      });
      if (res.ok) {
        setCertSaveSuccess(true);
        setTimeout(() => setCertSaveSuccess(false), 3500);
        await fetchStudent();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingCert(false);
    }
  };

  const handleQuickCertStatusChange = async (newStatus: string) => {
    setCertStatus(newStatus);
    try {
      await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateStatus: newStatus }),
      });
      await fetchStudent();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAutoGenerateCertNumber = () => {
    const cType = detectCourseType(student?.package?.name, student?.licenseCategory);
    const newCertNo = generateCertificateNumber(cType, student?.admissionNumber || student?.idNumber || studentId);
    setCertNumber(newCertNo);
    if (!certIssueDate) {
      setCertIssueDate(new Date().toISOString().split("T")[0]);
    }
  };

  const handleOpenEditModule = (mod: any) => {
    setEditingModule(mod);
    setModStatus(mod.status || "COMPLETED");
    setModScore(mod.score !== null && mod.score !== undefined ? mod.score : "");
    setModClasswork(mod.classwork || "");
    setModRemarks(mod.remarks || "");
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    setSavingModule(true);
    try {
      const cType = detectCourseType(student?.package?.name, student?.licenseCategory);
      const res = await fetch("/api/students/module-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          courseType: editingModule.courseType || cType,
          moduleNumber: editingModule.moduleNumber,
          status: modStatus,
          score: modScore !== "" ? Number(modScore) : null,
          classwork: modClasswork,
          remarks: modRemarks,
        }),
      });
      if (res.ok) {
        setEditingModule(null);
        await fetchStudent();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingModule(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 font-semibold">Student record not found</p>
        <Link href="/students" className="text-blue-600 text-xs hover:underline mt-2 inline-block">
          Return to Student Directory
        </Link>
      </div>
    );
  }

  const progressPct = Math.min(
    100,
    Math.round((student.completedHours / (student.requiredHours || 1)) * 100)
  );

  const courseType = detectCourseType(student.package?.name, student.licenseCategory);
  const isComputer = courseType === "COMPUTER";
  const isAI = courseType === "AI";
  const isDriving = courseType === "DRIVING";

  const getSkillColor = (status: string) => {
    switch (status) {
      case "MASTERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold";
      case "PROFICIENT":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "IN_PROGRESS":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb */}
      <Link
        href="/students"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Directory</span>
      </Link>

      {/* Student Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            {student.firstName[0]}
            {student.lastName[0]}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900">
                {student.firstName} {student.lastName}
              </h1>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                ID: {student.idNumber}
              </span>
              {student.pdlNumber && (
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3" /> NTSA: {student.pdlNumber}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              {student.email} • {student.phone} • <span className="font-semibold text-slate-700">{student.branch || "Tabby House, Thika"}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                isComputer
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : isAI
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-orange-50 text-orange-700 border-orange-200"
              }`}>
                {isComputer
                  ? "💻 Computer Packages Certification (10 Modules)"
                  : isAI
                  ? "🤖 Artificial Intelligence Masterclasses (9 Topics)"
                  : `🚗 ${student.licenseCategory}`}
              </span>

              {isDriving && student.transmission !== "NONE" && (
                <span className="text-xs font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-200">
                  {student.transmission}
                </span>
              )}

              {student.eCitizenRef && (
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  eCitizen: {student.eCitizenRef}
                </span>
              )}

              {student.package && (
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  Package: {student.package.name}
                </span>
              )}

              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                certStatus === "COLLECTED"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : certStatus === "PRINTING"
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-blue-50 text-blue-800 border-blue-300"
              }`}>
                {certStatus === "COLLECTED" ? (
                  <><span>🎓</span> Certificate: Collected</>
                ) : certStatus === "PRINTING" ? (
                  <><span>🖨️</span> Certificate: Printing</>
                ) : (
                  <><span>📦</span> Certificate: Uncollected</>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Status Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Certificate Quick Select Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-xs font-medium text-slate-500">Certificate:</span>
            <select
              value={certStatus}
              onChange={(e) => handleQuickCertStatusChange(e.target.value)}
              className={`border rounded-lg text-xs font-bold px-2.5 py-1 focus:outline-none cursor-pointer ${
                certStatus === "COLLECTED"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : certStatus === "PRINTING"
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-blue-50 border-blue-300 text-blue-800"
              }`}
            >
              <option value="UNCOLLECTED">Uncollected</option>
              <option value="PRINTING">Printing</option>
              <option value="COLLECTED">Collected</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-xs font-medium text-slate-500">Stage:</span>
            <select
              value={student.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2.5 py-1 text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="ENROLLED">Enrolled (New)</option>
              <option value="IN_TRAINING">In Training</option>
              <option value="TEST_READY">Test Ready</option>
              <option value="GRADUATED">Graduated (Licensed)</option>
            </select>
          </div>

          {isDriving && (
            <Link
              href={`/schedule?studentId=${student.id}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Lesson</span>
            </Link>
          )}

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module Progress or Practical Hours */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isComputer ? "Computer Modules" : isAI ? "AI Masterclass Topics" : "Practical Hours"}
            </span>
            {isComputer || isAI ? (
              <BookOpen className="w-4 h-4 text-blue-600" />
            ) : (
              <Clock className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isComputer || isAI ? (
              <>
                <span className="text-2xl font-bold text-slate-900">
                  {moduleSummary?.completedCount ?? modules.filter((m) => m.status === "COMPLETED").length}{" "}
                  <span className="text-sm font-normal text-slate-500">
                    / {isComputer ? 10 : 9} {isComputer ? "modules" : "topics"}
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-slate-900">{student.completedHours} hrs</span>
                <span className="text-xs text-slate-500">/ {student.requiredHours} hrs</span>
              </>
            )}
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                (isComputer || isAI ? (moduleSummary?.progressPercentage || 0) : progressPct) >= 100
                  ? "bg-emerald-500"
                  : "bg-blue-600"
              }`}
              style={{
                width: `${
                  isComputer || isAI ? (moduleSummary?.progressPercentage || 0) : progressPct
                }%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>
              {isComputer || isAI ? (moduleSummary?.progressPercentage || 0) : progressPct}% completed
            </span>
            {(isComputer || isAI) && moduleSummary?.averageScore !== null && moduleSummary?.averageScore !== undefined && (
              <span className="font-bold text-emerald-600">
                Avg Score: {moduleSummary.averageScore}%
              </span>
            )}
          </p>
        </div>

        {/* Assigned Instructor / Tutor */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isComputer ? "Assigned Computer Tutor" : isAI ? "Assigned AI Tutor" : "Assigned Instructor"}
            </span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          {student.assignedInstructor ? (
            <div className="mt-2">
              <p className="text-base font-bold text-slate-900">
                {student.assignedInstructor.firstName} {student.assignedInstructor.lastName}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.assignedInstructor.specializations ||
                  (isComputer ? "Computer College Tutor" : isAI ? "AI Masterclass Lead" : "Driving Instructor")}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Rating: ⭐ {student.assignedInstructor.rating || "5.0"} / 5.0
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-3">No instructor/tutor currently assigned</p>
          )}
        </div>

        {/* Account Balance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account Balance</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">
              {student.balance > 0 ? formatCurrency(student.balance) : "$0.00"}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className={student.balance > 0 ? "text-amber-600 font-medium" : "text-emerald-600 font-medium"}>
              {student.balance > 0 ? "Payment Outstanding" : "Course Fully Paid"}
            </span>
            <span className="text-slate-400">Total: {formatCurrency(student.package?.price || 0)}</span>
          </div>
        </div>
      </div>

      {/* Certificate Collection & Graduation Status Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" /> Certificate Collection &amp; Issuance Status
              </h3>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  certStatus === "COLLECTED"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : certStatus === "PRINTING"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
                }`}
              >
                {certStatus === "COLLECTED"
                  ? "✓ Collected"
                  : certStatus === "PRINTING"
                  ? "🖨️ Printing"
                  : "📦 Uncollected"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage graduation credential status, print production workflow, and student collection sign-off.
            </p>
          </div>

          {certSaveSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Certificate details updated successfully!
            </span>
          )}
        </div>

        {/* Status Callout Banner */}
        <div className="mt-4">
          {certStatus === "COLLECTED" ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Certificate Collected &amp; Handed to Student</h4>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  The candidate has physically received their graduation certificate. Serial:{" "}
                  <strong className="font-mono">{certNumber || "N/A"}</strong>
                  {student.certificateIssueDate && ` • Issued on: ${formatDate(student.certificateIssueDate)}`}
                </p>
              </div>
            </div>
          ) : certStatus === "PRINTING" ? (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Printer className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Certificate in Printing Press Queue</h4>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Queued with the examinations press for official high-resolution printing, gold foil seal embossing, and director verification.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-900">Certificate Uncollected (Awaiting Pickup)</h4>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Certificate printed or ready for release at school reception desk (Tabby House Rm 72). Candidate must present original National ID.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Form */}
        <form onSubmit={handleSaveCertificate} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Collection Status (Dropdown) *
            </label>
            <select
              value={certStatus}
              onChange={(e) => setCertStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              <option value="UNCOLLECTED">Uncollected (Ready for Pickup)</option>
              <option value="PRINTING">Printing (In Production)</option>
              <option value="COLLECTED">Collected (Handed to Student)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Certificate Serial Number
              </label>
              <button
                type="button"
                onClick={handleAutoGenerateCertNumber}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
              >
                <Sparkles className="w-3 h-3" /> Auto-Gen
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. KENA-CERT-COMP-2026-006"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Issue / Collection Date
            </label>
            <input
              type="date"
              value={certIssueDate}
              onChange={(e) => setCertIssueDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={savingCert}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingCert ? "Saving..." : "Save Certificate"}</span>
            </button>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Collection Notes &amp; Identity Verification Remarks
            </label>
            <input
              type="text"
              placeholder="e.g. Verified with National ID by front desk registrar. Handed to candidate in person."
              value={certRemarks}
              onChange={(e) => setCertRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </form>
      </div>

      {/* Module Progress Tracker (Computer & AI Courses) */}
      {(isComputer || isAI) && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  {isComputer
                    ? "Computer Packages Certification (10 Modules)"
                    : "Artificial Intelligence Masterclasses (9 Topics)"}
                </h3>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {modules.filter((m) => m.status === "COMPLETED").length} /{" "}
                  {isComputer ? 10 : 9} Completed
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click &quot;Edit Module&quot; to update assessment scores, classwork, and tutor remarks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {moduleSummary?.averageScore !== null && moduleSummary?.averageScore !== undefined && (
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">Average Grade</span>
                  <span className="text-sm font-black text-emerald-600">
                    {moduleSummary.averageScore}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Modules Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 text-center w-12 border-r border-slate-200">#</th>
                  <th className="py-3 px-4 border-r border-slate-200">Module / Topic Name</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200 w-28">Status</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200 w-20">Score</th>
                  <th className="py-3 px-4 border-r border-slate-200">Classwork Assignment</th>
                  <th className="py-3 px-4 border-r border-slate-200">Tutor Assessment / Remarks</th>
                  <th className="py-3 px-3 text-center border-r border-slate-200 w-28">Certified Tutor</th>
                  <th className="py-3 px-3 text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map((mod) => (
                  <tr key={mod.id || mod.moduleNumber} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-500 border-r border-slate-100">
                      {mod.moduleNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100">
                      {mod.moduleTitle}
                    </td>
                    <td className="py-3 px-3 text-center border-r border-slate-100">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          mod.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : mod.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {mod.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800 border-r border-slate-100">
                      {mod.score !== null && mod.score !== undefined ? (
                        <span
                          className={
                            mod.score >= 70
                              ? "text-emerald-600"
                              : mod.score >= 50
                              ? "text-blue-600"
                              : "text-amber-600"
                          }
                        >
                          {mod.score}%
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 border-r border-slate-100">
                      {mod.classwork || <span className="text-slate-300 italic">No classwork assigned</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-600 border-r border-slate-100 italic">
                      {mod.remarks || <span className="text-slate-300 not-italic">—</span>}
                    </td>
                    <td className="py-3 px-3 text-center text-[11px] text-slate-600 border-r border-slate-100 font-medium">
                      {mod.tutor ? `${mod.tutor.firstName} ${mod.tutor.lastName}` : <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenEditModule(mod)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Driving Competencies & Practical Progress Sheet */}
      {isDriving && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" /> Practical Driving Competencies
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any skill status to update instructor assessment in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Mastered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Proficient
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> In Progress
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {student.skills?.map((skill: any) => (
            <div
              key={skill.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${
                    skill.status === "MASTERED"
                      ? "text-emerald-600"
                      : skill.status === "PROFICIENT"
                      ? "text-blue-600"
                      : "text-slate-300"
                  }`}
                />
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {skill.skillName}
                </span>
              </div>

              <select
                disabled={updatingSkill === skill.skillName}
                value={skill.status}
                onChange={(e) => handleSkillStatusChange(skill.skillName, e.target.value)}
                className={`text-[11px] px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${getSkillColor(
                  skill.status
                )}`}
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="PROFICIENT">Proficient</option>
                <option value="MASTERED">Mastered</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Official 25-Lesson Practical Progress Sheet (KENA Paper Syllabus) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-orange-600" /> Official Practical Progress Sheet (25 Lessons)
              </h3>
              <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full uppercase">
                KENA Practical Card
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Physical progress sheet digital twin. Signed off per practical session by instructor and candidate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/portal/student/practical-sheet"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <span>Full Print Sheet</span>
              <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {(!student.practicalSheetEntries || student.practicalSheetEntries.length === 0) ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No practical sheet records initialized yet. Entries will populate upon practical lesson scheduling.
            </p>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center w-16">PRA NO.</th>
                  <th className="py-2.5 px-4 border-r border-slate-200">LESSON</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center">STUDENT SIGN</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center">INST. SIGN</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center">DATE</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">T.O.V</th>
                  <th className="py-2.5 px-3 text-center">OFFICIAL SIGN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {student.practicalSheetEntries.map((pra: any) => (
                  <tr key={pra.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 border-r border-slate-100 text-center font-mono font-bold text-slate-600">
                      {pra.praNo}.
                    </td>
                    <td className="py-2 px-4 border-r border-slate-100 font-bold text-slate-900">
                      {pra.lessonTitle}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-100 text-center">
                      {pra.studentSign ? (
                        <span className="text-emerald-700 font-serif italic font-bold">Signed</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-100 text-center">
                      {pra.instructorSign ? (
                        <span className="text-blue-700 font-serif italic font-bold">Certified</span>
                      ) : (
                        <span className="text-slate-300">Pending</span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-100 text-center font-mono text-[11px] text-slate-600">
                      {pra.date ? formatDate(pra.date) : "—"}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-100 font-mono text-[11px] text-slate-600">
                      {pra.tov || "—"}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {pra.officialSign ? (
                        <span className="text-purple-700 font-serif font-bold text-[10px] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                          APPROVED
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )}

      {/* Two Column Section: Lesson Log & Financial Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lesson History */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-indigo-600" /> Lesson History & Feedback
          </h3>

          <div className="space-y-4">
            {student.lessons?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No lessons recorded yet.</p>
            ) : (
              student.lessons?.map((lesson: any) => (
                <div key={lesson.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      {formatDate(lesson.startTime)} ({formatTime(lesson.startTime)})
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        lesson.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Instructor: {lesson.instructor?.firstName} {lesson.instructor?.lastName}
                    {lesson.vehicle && ` • ${lesson.vehicle.make} (${lesson.vehicle.registrationPlate})`}
                  </p>

                  {lesson.skillsCovered && (
                    <p className="text-[11px] text-slate-500 font-medium">
                      Focus: {lesson.skillsCovered}
                    </p>
                  )}

                  {lesson.instructorFeedback && (
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 italic">
                      &quot;{lesson.instructorFeedback}&quot;
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payments History */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Payment Transactions
            </h3>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Record
            </button>
          </div>

          <div className="space-y-3">
            {student.payments?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No payment transactions recorded.</p>
            ) : (
              student.payments?.map((payment: any) => (
                <div
                  key={payment.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{formatCurrency(payment.amount)}</p>
                    <p className="text-[11px] text-slate-500">
                      {payment.paymentMethod.replace("_", " ")} • Ref: {payment.transactionRef}
                    </p>
                    <p className="text-[10px] text-slate-400">{formatDate(payment.createdAt)}</p>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {payment.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Record Payment for {student.firstName}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Outstanding Course Balance: <strong className="text-amber-600">{formatCurrency(student.balance)}</strong>
            </p>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder={student.balance.toString()}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="MOBILE_MONEY">Mobile Money (M-Pesa / Airtel)</option>
                  <option value="CREDIT_CARD">Credit / Debit Card</option>
                  <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                  <option value="CASH">Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Transaction Reference</label>
                <input
                  type="text"
                  placeholder="e.g. MP-8491823 or leave empty for auto-generated"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Deposit for highway lessons"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {isPaying ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Module Modal */}
      {editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Edit Module {editingModule.moduleNumber}: {editingModule.moduleTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  Update student performance, marks, classwork and tutor assessment remarks.
                </p>
              </div>
              <button
                onClick={() => setEditingModule(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status *</label>
                  <select
                    value={modStatus}
                    onChange={(e) => setModStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="NOT_STARTED">Not Started</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Practical Score (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 85"
                    value={modScore}
                    onChange={(e) => setModScore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Classwork Assignment</label>
                <input
                  type="text"
                  placeholder="e.g. Financial ledger with SUMIF, VLOOKUP, pivot tables & chart"
                  value={modClasswork}
                  onChange={(e) => setModClasswork(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tutor Assessment Remarks</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Excellent command of spreadsheet formulas and chart formatting."
                  value={modRemarks}
                  onChange={(e) => setModRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingModule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {savingModule ? "Saving..." : "Save Module Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
