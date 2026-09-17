"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Car,
  FileText,
  Receipt,
  Award,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<any>(null);
  const [practicalSummary, setPracticalSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile?role=STUDENT").then((r) => r.json()),
      fetch("/api/practical-sheet").then((r) => r.json()),
    ])
      .then(([studentData, sheetData]) => {
        setStudent(studentData);
        setPracticalSummary(sheetData?.summary || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isComputer =
    student?.licenseCategory?.toLowerCase().includes("computer") ||
    student?.package?.name?.toLowerCase().includes("computer");
  const isAI =
    student?.licenseCategory?.toLowerCase().includes("ai") ||
    student?.package?.name?.toLowerCase().includes("ai");
  const isComputerOrAI = isComputer || isAI;

  const totalModules = isComputer ? 10 : isAI ? 9 : 0;
  const completedModules = Array.isArray(student?.moduleProgress)
    ? student.moduleProgress.filter((m: any) => m.status === "COMPLETED").length
    : 0;
  const modProgressPct = totalModules > 0 ? Math.min(100, Math.round((completedModules / totalModules) * 100)) : 0;

  const completedHrs = student?.completedHours || 0;
  const requiredHrs = student?.requiredHours || 20;
  const drivingProgressPct = Math.min(100, Math.round((completedHrs / requiredHrs) * 100));

  const effectiveProgressPct = isComputerOrAI ? modProgressPct : drivingProgressPct;
  const certStatus = student?.certificateStatus || "UNCOLLECTED";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/40 text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Student Learning Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {student?.firstName || "Student"}!
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Track your {isComputer ? "10 Computer College modules" : isAI ? "9 Artificial Intelligence topics" : "NTSA driving competencies"}, verify instructor feedback, and check certificate status.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-xl font-mono text-orange-200">
              Admission: {student?.admissionNumber || student?.idNumber || "KNA-2026"}
            </span>
            {student?.pdlNumber && !isComputerOrAI && (
              <span className="bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-xl text-emerald-300 font-bold">
                NTSA PDL: {student.pdlNumber}
              </span>
            )}
            <span className="bg-white/10 px-3 py-1 rounded-xl text-slate-200">
              Course: {student?.package?.name || student?.licenseCategory || "KENA Program"}
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl text-slate-200">
              Campus: {student?.branch || "Tabby House, Thika"}
            </span>
          </div>
        </div>
      </div>

      {/* CERTIFICATE COLLECTION STATUS SECTION */}
      <div
        className={`rounded-3xl p-6 border shadow-sm transition-all ${
          certStatus === "COLLECTED"
            ? "bg-gradient-to-r from-emerald-900 to-slate-900 text-white border-emerald-700/50"
            : certStatus === "PRINTING"
            ? "bg-gradient-to-r from-amber-900 to-slate-900 text-white border-amber-700/50"
            : "bg-gradient-to-r from-blue-950 to-slate-900 text-white border-blue-800/50"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-2xl shrink-0 backdrop-blur-xs ${
                certStatus === "COLLECTED"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : certStatus === "PRINTING"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}
            >
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  Official Certificate Desk
                </span>
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    certStatus === "COLLECTED"
                      ? "bg-emerald-500/30 border-emerald-400 text-emerald-200"
                      : certStatus === "PRINTING"
                      ? "bg-amber-500/30 border-amber-400 text-amber-200"
                      : "bg-blue-500/30 border-blue-400 text-blue-200"
                  }`}
                >
                  {certStatus === "COLLECTED"
                    ? "🎓 Certificate Collected"
                    : certStatus === "PRINTING"
                    ? "🖨️ Printing in Progress"
                    : "📦 Ready for Collection (Uncollected)"}
                </span>
              </div>

              <h2 className="text-xl font-black mt-1.5 tracking-tight">
                {certStatus === "COLLECTED"
                  ? "Official Certificate Collected & Verified"
                  : certStatus === "PRINTING"
                  ? "Certificate Currently Printing"
                  : "Certificate Collection Status: Uncollected"}
              </h2>

              <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
                {certStatus === "COLLECTED"
                  ? `Your official graduation certificate has been collected from the campus front desk. Serial Number: ${
                      student?.certificateNumber || "KENA-CERT-2026"
                    }.`
                  : certStatus === "PRINTING"
                  ? "Your certificate has been queued and is currently being printed by the examination department. You will be notified once it arrives at the Tabby House reception."
                  : student?.status === "GRADUATED" || completedModules >= totalModules
                  ? "🎉 Congratulations on completing all modules! Your certificate is ready for collection at the Front Desk (Tabby House, 4th Floor, Room 72). Please carry your original National ID."
                  : "Complete your coursework and practical modules to unlock your institutional graduation certificate."}
              </p>

              {student?.certificateNumber && (
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-xl">
                  <span>Serial:</span>
                  <span className="text-orange-300">{student.certificateNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Course Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isComputer ? "10 Computer Modules" : isAI ? "9 AI Masterclass Topics" : "Practical Lessons"}
            </span>
            <div
              className={`p-2 rounded-xl ${
                isComputer ? "bg-blue-50 text-blue-600" : isAI ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"
              }`}
            >
              {isComputerOrAI ? <BookOpen className="w-4 h-4" /> : <Car className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{effectiveProgressPct}%</span>
            <span className="text-xs text-slate-500 font-medium">
              {isComputerOrAI
                ? `(${completedModules} of ${totalModules} completed)`
                : `(${completedHrs}/${requiredHrs} hrs)`}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isComputer ? "bg-blue-600" : isAI ? "bg-purple-600" : "bg-orange-600"
              }`}
              style={{ width: `${effectiveProgressPct}%` }}
            />
          </div>
        </div>

        {/* Academic / Road Test Readiness */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isComputerOrAI ? "Academic Status" : "NTSA Test Status"}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-black text-emerald-600 uppercase tracking-wide block">
              {student?.status === "GRADUATED"
                ? "Certified Graduate"
                : student?.status === "TEST_READY"
                ? "Test / Exam Ready"
                : "Training in Progress"}
            </span>
            <p className="text-xs text-slate-400 mt-1">
              {isComputerOrAI
                ? student?.assignedInstructor
                  ? `Assigned Tutor: ${student.assignedInstructor.firstName} ${student.assignedInstructor.lastName}`
                  : "Supervised by Faculty"
                : "Thika Section 9 Test Center"}
            </p>
          </div>
        </div>

        {/* Tuition Fee Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Account Balance
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(student?.balance || 0)}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">
              {student?.balance === 0 ? "Fully Paid" : "Pending"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pay via M-Pesa Till: 713449
          </p>
        </div>
      </div>

      {/* REAL-TIME MODULE-BY-MODULE PROGRESS (FOR COMPUTER & AI STUDENTS) */}
      {isComputerOrAI && Array.isArray(student?.moduleProgress) && student.moduleProgress.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>My Module Progress &amp; Classwork Marks</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time evaluation input recorded by your assigned tutor.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
              {completedModules} / {totalModules} Modules Certified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {student.moduleProgress.map((m: any) => {
              const isComp = m.status === "COMPLETED";
              const isProg = m.status === "IN_PROGRESS";

              return (
                <div
                  key={m.id || m.moduleNumber}
                  className={`p-4 rounded-2xl border transition-all ${
                    isComp
                      ? "bg-emerald-50/30 border-emerald-200 shadow-xs"
                      : isProg
                      ? "bg-amber-50/30 border-amber-200"
                      : "bg-slate-50/50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Module {m.moduleNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isComp
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : isProg
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {isComp ? "Completed" : isProg ? "In Progress" : "Not Started"}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{m.moduleTitle}</h4>

                  {m.classwork && (
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      Classwork: <span className="text-slate-800">{m.classwork}</span>
                    </p>
                  )}

                  {m.score !== null && m.score !== undefined && (
                    <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-500">Tutor Evaluation Score:</span>
                      <span
                        className={`font-black font-mono text-xs px-2 py-0.5 rounded-md ${
                          m.score >= 90
                            ? "bg-emerald-100 text-emerald-800"
                            : m.score >= 75
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {m.score}%
                      </span>
                    </div>
                  )}

                  {m.remarks && (
                    <p className="text-[11px] text-slate-500 italic mt-1.5 bg-white p-2 rounded-xl border border-slate-100">
                      &quot;{m.remarks}&quot;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Official 25-Lesson Practical Progress Sheet Banner (For Driving Students) */}
      {!isComputerOrAI && (
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs shrink-0">
              <FileCheck2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  Official Practical Sheet
                </span>
                <span className="text-xs font-mono font-bold text-orange-100">
                  {practicalSummary?.completed || 0} / 25 Lessons Certified
                </span>
              </div>
              <h3 className="text-lg font-black mt-1">In-Vehicle Practical Progress Tracking Card</h3>
              <p className="text-xs text-orange-100/90 mt-0.5 max-w-xl">
                From Lesson 1 (Introduction) through Lesson 25 (Reversing Pt 3). Verify your instructor signatures, vehicle details (T.O.V), and digital attendance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/portal/student/practical-sheet"
              className="px-4 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-black rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Open Practical Sheet</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards per Quotation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/portal/student/courses"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">My Courses</h3>
            <p className="text-xs text-slate-500 mt-1">
              View your enrolled Driving, Computer, and AI training packages.
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 flex items-center gap-1 mt-4">
            View Courses <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/portal/student/content"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Course Content</h3>
            <p className="text-xs text-slate-500 mt-1">
              Read NTSA Model Town Board manuals and watch driving video tutorials.
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 flex items-center gap-1 mt-4">
            Browse Materials <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/portal/student/payments"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Payments &amp; Invoices</h3>
            <p className="text-xs text-slate-500 mt-1">
              Download official KENA receipts and track your M-Pesa deposits.
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 flex items-center gap-1 mt-4">
            Check Invoices <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/portal/student/profile"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">My Profile</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review personal enrollment details and update your portal password.
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 flex items-center gap-1 mt-4">
            Edit Password <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
