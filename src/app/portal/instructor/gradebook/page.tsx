"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Star,
  Award,
  Sparkles,
  FileCheck2,
  Car,
  Calendar,
  Clock,
  UserCheck,
  Check,
  Laptop,
  GraduationCap,
  BookOpen,
  Edit,
} from "lucide-react";
import { formatDate, STANDARD_DRIVING_SKILLS } from "@/lib/utils";

function GradebookContent() {
  const searchParams = useSearchParams();
  const preselectedStudentId = searchParams.get("studentId");
  const initialTab = searchParams.get("tab") === "evaluations" ? "EVALUATIONS" : searchParams.get("tab") === "modules" ? "MODULE_PROGRESS" : "PRACTICAL_SHEET";

  const [activeTab, setActiveTab] = useState<"PRACTICAL_SHEET" | "EVALUATIONS" | "MODULE_PROGRESS">(initialTab);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState(preselectedStudentId || "");
  const [practicalData, setPracticalData] = useState<any>(null);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [moduleProgressData, setModuleProgressData] = useState<any>(null);
  const [loadingModules, setLoadingModules] = useState(false);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingPraNo, setActionLoadingPraNo] = useState<number | null>(null);

  // Form State for Evaluations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState(STANDARD_DRIVING_SKILLS[0]);
  const [score, setScore] = useState("85");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form State for Module Progress & Classwork
  const [moduleModal, setModuleModal] = useState<{
    isOpen: boolean;
    module: any | null;
    status: string;
    score: string;
    classwork: string;
    remarks: string;
  }>({
    isOpen: false,
    module: null,
    status: "COMPLETED",
    score: "85",
    classwork: "",
    remarks: "",
  });

  // Quick In-Vehicle Sign Modal for a specific practical lesson
  const [signModal, setSignModal] = useState<{
    isOpen: boolean;
    entry: any | null;
    date: string;
    tov: string;
    status: string;
    remarks: string;
  }>({
    isOpen: false,
    entry: null,
    date: new Date().toISOString().slice(0, 10),
    tov: "Toyota Belta KDA 123X (Manual) - 08:30",
    status: "COMPLETED",
    remarks: "",
  });

  const fetchData = async () => {
    try {
      const [stRes, grRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/gradebook"),
      ]);
      const stData = await stRes.json();
      const grData = await grRes.json();

      const stList = Array.isArray(stData) ? stData : [];
      setStudents(stList);
      setGrades(Array.isArray(grData) ? grData : []);

      const activeId = selectedStudentId || (stList.length > 0 ? stList[0].id : "");
      if (activeId) {
        setSelectedStudentId(activeId);
        fetchStudentPracticalSheet(activeId);
        fetchStudentModuleProgress(activeId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentPracticalSheet = async (studentId: string) => {
    setLoadingSheet(true);
    try {
      const res = await fetch(`/api/practical-sheet?studentId=${studentId}`);
      const json = await res.json();
      setPracticalData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSheet(false);
    }
  };

  const fetchStudentModuleProgress = async (studentId: string) => {
    setLoadingModules(true);
    try {
      const res = await fetch(`/api/students/module-progress?studentId=${studentId}`);
      if (res.ok) {
        const json = await res.json();
        setModuleProgressData(json);
        if (json.courseType === "COMPUTER" || json.courseType === "AI") {
          setActiveTab("MODULE_PROGRESS");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingModules(false);
    }
  };

  const handleOpenModuleModal = (m: any) => {
    setModuleModal({
      isOpen: true,
      module: m,
      status: m.status || "COMPLETED",
      score: m.score !== null && m.score !== undefined ? String(m.score) : "85",
      classwork: m.classwork || "",
      remarks: m.remarks || `Student successfully demonstrated competencies for ${m.moduleTitle}.`,
    });
  };

  const handleSaveModuleProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleModal.module) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/students/module-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          moduleNumber: moduleModal.module.moduleNumber,
          courseType: moduleProgressData?.courseType || "COMPUTER",
          status: moduleModal.status,
          score: moduleModal.score ? Number(moduleModal.score) : null,
          classwork: moduleModal.classwork,
          remarks: moduleModal.remarks,
        }),
      });
      if (res.ok) {
        setModuleModal({ ...moduleModal, isOpen: false });
        await fetchStudentModuleProgress(selectedStudentId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
    fetchStudentPracticalSheet(id);
    fetchStudentModuleProgress(id);
  };

  // Open Quick Sign Modal for instructor
  const handleOpenSignModal = (entry: any) => {
    const student = practicalData?.student;
    const defaultTov = student?.assignedInstructor?.vehicle
      ? `${student.assignedInstructor.vehicle.make} ${student.assignedInstructor.vehicle.registrationPlate} (${student.transmission})`
      : `Toyota Belta KDA 123X (${student?.transmission || "Manual"}) - 09:00`;

    setSignModal({
      isOpen: true,
      entry,
      date: entry.date ? new Date(entry.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      tov: entry.tov || defaultTov,
      status: "COMPLETED",
      remarks: entry.remarks || `Candidate met NTSA standards for ${entry.lessonTitle}.`,
    });
  };

  const handleSaveSignOff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signModal.entry) return;
    setActionLoadingPraNo(signModal.entry.praNo);

    try {
      const res = await fetch("/api/practical-sheet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          praNo: signModal.entry.praNo,
          instructorSign: true,
          instructorId: practicalData?.student?.assignedInstructor?.id || null,
          date: signModal.date,
          tov: signModal.tov,
          status: signModal.status,
          remarks: signModal.remarks,
        }),
      });

      if (res.ok) {
        setSignModal({ ...signModal, isOpen: false });
        fetchStudentPracticalSheet(selectedStudentId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingPraNo(null);
    }
  };

  // Quick 1-click toggle for instructor signature
  const handleQuickToggleSign = async (entry: any) => {
    setActionLoadingPraNo(entry.praNo);
    try {
      const newSign = !entry.instructorSign;
      const res = await fetch("/api/practical-sheet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          praNo: entry.praNo,
          instructorSign: newSign,
          instructorId: practicalData?.student?.assignedInstructor?.id || null,
          date: newSign && !entry.date ? new Date().toISOString() : entry.date,
          tov:
            newSign && !entry.tov
              ? `Toyota Belta KDA 123X (${practicalData?.student?.transmission || "Manual"})`
              : entry.tov,
          status: newSign ? "COMPLETED" : "PENDING",
        }),
      });

      if (res.ok) {
        fetchStudentPracticalSheet(selectedStudentId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingPraNo(null);
    }
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/gradebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          instructorId: "default",
          topic,
          score: Number(score),
          remarks,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setRemarks("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const isComputerCourse =
    moduleProgressData?.courseType === "COMPUTER" ||
    selectedStudent?.package?.name?.toLowerCase().includes("computer") ||
    selectedStudent?.licenseCategory?.toLowerCase().includes("computer");
  const isAICourse =
    moduleProgressData?.courseType === "AI" ||
    selectedStudent?.package?.name?.toLowerCase().includes("ai") ||
    selectedStudent?.licenseCategory?.toLowerCase().includes("ai");
  const isComputerOrAI = isComputerCourse || isAICourse;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isComputerCourse
                ? "Computer College Modules & Classwork Evaluation"
                : isAICourse
                ? "Artificial Intelligence Masterclasses Evaluation"
                : "Instructor Practical Evaluation & Sign-Off"}
            </h1>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                isComputerCourse
                  ? "bg-blue-100 text-blue-800"
                  : isAICourse
                  ? "bg-purple-100 text-purple-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {isComputerCourse ? "💻 Computer Faculty" : isAICourse ? "🤖 AI Faculty" : "🚗 In-Vehicle Faculty"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isComputerOrAI
              ? "Input module marks, record classwork assignments, and track certificate completion."
              : "Sign off the 25 official practical lessons in-car and record competency grading."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
          {isComputerOrAI ? (
            <button
              onClick={() => setActiveTab("MODULE_PROGRESS")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeTab === "MODULE_PROGRESS"
                  ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>{isComputerCourse ? "10 Computer Modules" : "9 AI Topics"} (Progress)</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab("PRACTICAL_SHEET")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeTab === "PRACTICAL_SHEET"
                  ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>25 Practical Sheet (Sign-Off)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("EVALUATIONS")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTab === "EVALUATIONS"
                ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Score Gradebook</span>
          </button>
        </div>
      </div>

      {/* Student Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isComputerCourse
                ? "bg-blue-50 text-blue-600"
                : isAICourse
                ? "bg-purple-50 text-purple-600"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            {isComputerCourse ? <Laptop className="w-5 h-5" /> : isAICourse ? <Sparkles className="w-5 h-5" /> : <Car className="w-5 h-5" />}
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Candidate / Student
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="mt-0.5 font-bold text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.firstName} {st.lastName} ({st.admissionNumber || "No Adm"} • {st.licenseCategory || st.package?.name || "Driving"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Summary: Computer/AI Module Progress or Driving Practical Summary */}
        {isComputerOrAI && moduleProgressData?.summary ? (
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Certified Modules</span>
              <strong className="text-slate-900 font-mono text-sm">
                {moduleProgressData.summary.completedCount} / {moduleProgressData.summary.totalModules}
              </strong>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Course Progress</span>
              <strong className="text-orange-600 font-mono text-sm">
                {moduleProgressData.summary.progressPercentage}%
              </strong>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Avg Score</span>
              <strong className="text-slate-800 font-mono text-sm">
                {moduleProgressData.summary.averageScore ? `${moduleProgressData.summary.averageScore}%` : "—"}
              </strong>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Certificate</span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  (moduleProgressData.summary.certificateStatus || "UNCOLLECTED") === "COLLECTED"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : (moduleProgressData.summary.certificateStatus || "UNCOLLECTED") === "PRINTING"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
                }`}
              >
                {(moduleProgressData.summary.certificateStatus || "UNCOLLECTED") === "COLLECTED"
                  ? "🎓 Collected"
                  : (moduleProgressData.summary.certificateStatus || "UNCOLLECTED") === "PRINTING"
                  ? "🖨️ Printing"
                  : "📦 Uncollected"}
              </span>
            </div>
          </div>
        ) : practicalData?.summary ? (
          <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Certified</span>
              <strong className="text-slate-900 font-mono text-sm">
                {practicalData.summary.completed} / 25
              </strong>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">NTSA Progress</span>
              <strong className="text-orange-600 font-mono text-sm">
                {practicalData.summary.progressPct}%
              </strong>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Test Readiness</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  practicalData.summary.isTestReady
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {practicalData.summary.isTestReady ? "READY" : "IN PROGRESS"}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* TAB: MODULE & CLASSWORK PROGRESS (FOR COMPUTER & AI) */}
      {activeTab === "MODULE_PROGRESS" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                {isComputerCourse ? (
                  <Laptop className="w-5 h-5 text-blue-600" />
                ) : (
                  <Sparkles className="w-5 h-5 text-purple-600" />
                )}
                {isComputerCourse
                  ? "Computer Packages Curriculum & Classwork Record (10 Modules)"
                  : "Artificial Intelligence Masterclasses & Practical Portfolio (9 Topics)"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Input grades, sign off classwork submissions, and track candidate certification milestones.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                Passing Standard: &ge;70%
              </span>
            </div>
          </div>

          {loadingModules ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading module syllabus &amp; progress...</div>
          ) : !moduleProgressData?.modules || moduleProgressData.modules.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No module records found for this student.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3 border-r border-slate-200 text-center w-14">NO.</th>
                    <th className="py-3 px-4 border-r border-slate-200 w-52">MODULE / TOPIC</th>
                    <th className="py-3 px-3 border-r border-slate-200 text-center w-28">STATUS</th>
                    <th className="py-3 px-4 border-r border-slate-200">CLASSWORK / LAB TASK</th>
                    <th className="py-3 px-3 border-r border-slate-200 text-center w-24">SCORE</th>
                    <th className="py-3 px-4 border-r border-slate-200">TUTOR REMARKS</th>
                    <th className="py-3 px-3 border-r border-slate-200 text-center w-32">COMPLETED</th>
                    <th className="py-3 px-3 text-right w-28">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {moduleProgressData.modules.map((mod: any) => {
                    const isComp = mod.status === "COMPLETED";
                    const isProg = mod.status === "IN_PROGRESS";

                    return (
                      <tr key={mod.id || mod.moduleNumber} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-mono font-bold text-slate-600">
                          {mod.moduleNumber}.
                        </td>
                        <td className="py-2.5 px-4 border-r border-slate-100 font-bold text-slate-900">
                          {mod.moduleTitle}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isComp
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : isProg
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {isComp ? "Completed" : isProg ? "In Progress" : "Not Started"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 border-r border-slate-100 text-slate-700">
                          {mod.classwork ? (
                            <span className="font-medium text-slate-800">{mod.classwork}</span>
                          ) : (
                            <span className="text-slate-400 italic">No task recorded yet</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-mono font-bold">
                          {mod.score !== null && mod.score !== undefined ? (
                            <span
                              className={`px-2 py-0.5 rounded-lg text-xs ${
                                mod.score >= 90
                                  ? "bg-emerald-50 text-emerald-700 font-black"
                                  : mod.score >= 75
                                  ? "bg-blue-50 text-blue-700 font-bold"
                                  : "bg-amber-50 text-amber-700 font-bold"
                              }`}
                            >
                              {mod.score}%
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 border-r border-slate-100 text-slate-600 italic">
                          {mod.remarks || <span className="text-slate-300 not-italic">—</span>}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-mono text-[11px] text-slate-500">
                          {mod.completedAt ? formatDate(mod.completedAt) : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleOpenModuleModal(mod)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200"
                          >
                            <Edit className="w-3 h-3" /> Input Marks
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: 25-LESSON PRACTICAL SHEET SIGN-OFF */}
      {activeTab === "PRACTICAL_SHEET" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-orange-600" /> Official Practical Progress Sheet (25 Lessons)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Check off instructor signatures in real time as the candidate completes each practical session in the vehicle.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">
                Click &quot;Certify&quot; to sign with date &amp; T.O.V
              </span>
            </div>
          </div>

          {loadingSheet ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading student practical sheet...</div>
          ) : !practicalData || practicalData.entries?.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No practical entries found for this candidate.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3 border-r border-slate-200 text-center w-16">PRA NO.</th>
                    <th className="py-3 px-4 border-r border-slate-200">LESSON</th>
                    <th className="py-3 px-3 border-r border-slate-200 text-center w-28">STUDENT SIGN</th>
                    <th className="py-3 px-3 border-r border-slate-200 text-center w-36">INST. SIGN</th>
                    <th className="py-3 px-3 border-r border-slate-200 text-center w-28">DATE</th>
                    <th className="py-3 px-4 border-r border-slate-200">T.O.V</th>
                    <th className="py-3 px-3 border-r border-slate-200 text-center w-24">OFFICIAL</th>
                    <th className="py-3 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {practicalData.entries.map((entry: any) => {
                    const isCompleted = entry.instructorSign;
                    const isMilestone =
                      entry.praNo === 10 || entry.praNo === 17 || entry.praNo === 18 || entry.praNo === 22 || entry.praNo === 25;

                    return (
                      <tr
                        key={entry.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isMilestone ? "bg-orange-50/20 font-semibold" : ""
                        }`}
                      >
                        {/* PRA NO */}
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-mono font-bold text-slate-600">
                          {entry.praNo}.
                        </td>

                        {/* LESSON TITLE */}
                        <td className="py-2.5 px-4 border-r border-slate-100 font-bold text-slate-900">
                          <div className="flex items-center justify-between">
                            <span>{entry.lessonTitle}</span>
                            {isMilestone && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                                EXAM DRILL
                              </span>
                            )}
                          </div>
                        </td>

                        {/* STUDENT SIGN */}
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                          {entry.studentSign ? (
                            <span className="text-emerald-700 font-serif italic font-bold">Signed</span>
                          ) : (
                            <span className="text-slate-300 italic text-[10px]">Awaiting</span>
                          )}
                        </td>

                        {/* INST. SIGN */}
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                          {entry.instructorSign ? (
                            <button
                              onClick={() => handleQuickToggleSign(entry)}
                              disabled={actionLoadingPraNo === entry.praNo}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
                              title="Click to revoke signature"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span className="font-serif italic">M. Kariuki</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenSignModal(entry)}
                              disabled={actionLoadingPraNo === entry.praNo}
                              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors"
                            >
                              Certify
                            </button>
                          )}
                        </td>

                        {/* DATE */}
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-mono text-[11px] text-slate-600">
                          {entry.date ? formatDate(entry.date) : "—"}
                        </td>

                        {/* T.O.V */}
                        <td className="py-2.5 px-4 border-r border-slate-100 font-mono text-[11px] text-slate-600">
                          {entry.tov || "—"}
                        </td>

                        {/* OFFICIAL */}
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                          {entry.officialSign ? (
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              APPROVED
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[10px]">—</span>
                          )}
                        </td>

                        {/* ACTION */}
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleOpenSignModal(entry)}
                            className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCORE EVALUATIONS GRADEBOOK */}
      {activeTab === "EVALUATIONS" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Competency Score Evaluations</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                NTSA mock scores and detailed examiner remarks. Passing Standard: &ge;75%
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Record New Practical Grade
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading gradebook entries...</div>
          ) : grades.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No evaluations recorded yet. Click &quot;Record New Practical Grade&quot; to begin.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Candidate</th>
                    <th className="px-5 py-3.5">Practical Topic</th>
                    <th className="px-5 py-3.5">Score</th>
                    <th className="px-5 py-3.5">Assessment</th>
                    <th className="px-5 py-3.5">Instructor Remarks</th>
                    <th className="px-5 py-3.5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grades.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">
                          {g.student?.firstName} {g.student?.lastName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">ID: {g.student?.idNumber}</p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        {g.topic}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-black text-slate-900">{g.score}%</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            g.status === "EXCELLENT"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : g.status === "PASS"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {g.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-sm">
                        {g.remarks || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-slate-500 text-[11px]">
                        {formatDate(g.gradedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* QUICK IN-VEHICLE SIGN-OFF MODAL */}
      {signModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block">
                  Practical Lesson #{signModal.entry?.praNo}
                </span>
                <h3 className="font-black text-lg text-slate-900">
                  {signModal.entry?.lessonTitle}
                </h3>
              </div>
              <button
                onClick={() => setSignModal({ ...signModal, isOpen: false })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSignOff} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Practical Date *</label>
                  <input
                    type="date"
                    required
                    value={signModal.date}
                    onChange={(e) => setSignModal({ ...signModal, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={signModal.status}
                    onChange={(e) => setSignModal({ ...signModal, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="COMPLETED">Completed (Pass)</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="PENDING">Pending Retake</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  T.O.V (Type &amp; Time of Vehicle) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Belta KDA 123X (Manual) - 08:30"
                  value={signModal.tov}
                  onChange={(e) => setSignModal({ ...signModal, tov: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructor Session Feedback</label>
                <textarea
                  rows={2}
                  value={signModal.remarks}
                  onChange={(e) => setSignModal({ ...signModal, remarks: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-2 text-[11px] text-orange-900">
                <UserCheck className="w-4 h-4 text-orange-600 shrink-0" />
                <span>
                  Submitting will record certified <strong>Instructor Signature (M. Kariuki)</strong> on the official sheet.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSignModal({ ...signModal, isOpen: false })}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingPraNo !== null}
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold shadow-sm disabled:opacity-50"
                >
                  {actionLoadingPraNo !== null ? "Saving..." : "Sign & Save to Sheet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INPUT MODULE PROGRESS & CLASSWORK MODAL */}
      {moduleModal.isOpen && moduleModal.module && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600 font-bold">
                  {isComputerCourse ? <Laptop className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Module {moduleModal.module.moduleNumber}: {moduleModal.module.moduleTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input student progress, practical classwork assessment, and marks.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModuleModal({ ...moduleModal, isOpen: false })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModuleProgress} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Module Status *</label>
                  <select
                    value={moduleModal.status}
                    onChange={(e) => setModuleModal({ ...moduleModal, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-orange-500"
                  >
                    <option value="COMPLETED">Completed (Certified)</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="NOT_STARTED">Not Started</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Practical Score (0 - 100)%</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={moduleModal.score}
                    onChange={(e) => setModuleModal({ ...moduleModal, score: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-orange-500"
                    placeholder="e.g. 85"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Classwork / Lab Assignment Task</label>
                <input
                  type="text"
                  value={moduleModal.classwork}
                  onChange={(e) => setModuleModal({ ...moduleModal, classwork: e.target.value })}
                  placeholder="e.g. Completed Excel payroll ledger with SUMIF & Pivot chart"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tutor Feedback &amp; Remarks</label>
                <textarea
                  rows={3}
                  value={moduleModal.remarks}
                  onChange={(e) => setModuleModal({ ...moduleModal, remarks: e.target.value })}
                  placeholder="e.g. Candidate demonstrated good understanding of key concepts and completed all exercises."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModuleModal({ ...moduleModal, isOpen: false })}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Progress & Classwork"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD EVALUATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Record Practical Competency Evaluation</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitGrade} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Student *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} (ID: {st.idNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Practical Topic *</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  {STANDARD_DRIVING_SKILLS.map((sk) => (
                    <option key={sk} value={sk}>
                      {sk}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Practical Evaluation Score (0 - 100)% *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Instructor Remarks</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Good clutch balance on steep gradient; needs further practice reversing into angle parking bays."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Submit Practical Score"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InstructorGradebookPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading gradebook...</div>}>
      <GradebookContent />
    </Suspense>
  );
}
