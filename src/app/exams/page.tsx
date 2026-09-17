"use client";

import { useEffect, useState } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Calendar,
  User,
  ShieldCheck,
  X,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ExamsPage() {
  const [data, setData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Book Exam Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookError, setBookError] = useState("");
  const [newExam, setNewExam] = useState({
    studentId: "",
    examType: "PRACTICAL",
    scheduledDate: "",
    testCenter: "NTSA Thika Test Center (Section 9)",
    examinerName: "",
    notes: "",
  });

  // Outcome Modal
  const [outcomeExamId, setOutcomeExamId] = useState<string | null>(null);
  const [result, setResult] = useState("PASSED");
  const [score, setScore] = useState("95");
  const [examiner, setExaminer] = useState("");
  const [outcomeNotes, setOutcomeNotes] = useState("");
  const [isSubmittingOutcome, setIsSubmittingOutcome] = useState(false);

  const fetchExams = async () => {
    try {
      const [exRes, stRes] = await Promise.all([
        fetch("/api/exams"),
        fetch("/api/students"),
      ]);
      const exJson = await exRes.json();
      const stJson = await stRes.json();

      setData(exJson);
      setStudents(Array.isArray(stJson) ? stJson : []);
      if (stJson.length > 0 && !newExam.studentId) {
        setNewExam((prev) => ({ ...prev, studentId: stJson[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleBookExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setBookError("");

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExam),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to book exam");

      setIsBookModalOpen(false);
      setNewExam({
        studentId: students[0]?.id || "",
        examType: "PRACTICAL",
        scheduledDate: "",
        testCenter: "National Road Safety Authority - Test Center A",
        examinerName: "",
        notes: "",
      });
      fetchExams();
    } catch (err: any) {
      setBookError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcomeExamId) return;
    setIsSubmittingOutcome(true);

    try {
      const res = await fetch("/api/exams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: outcomeExamId,
          result,
          score: parseInt(score) || undefined,
          examinerName: examiner,
          notes: outcomeNotes,
        }),
      });

      if (res.ok) {
        setOutcomeExamId(null);
        fetchExams();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingOutcome(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { exams = [], stats } = data || {};
  const testReadyStudents = students.filter((s) => s.status === "TEST_READY");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Examinations & Test Readiness</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Manage official driving road tests, theory evaluations, and licensing graduation.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Official Exam</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Test-Ready Students</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">{testReadyStudents.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Met required practical hours</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Test Slots</span>
          <p className="text-2xl font-bold text-blue-600 mt-2">{stats?.pendingCount || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting examiner assessment</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Official Pass Rate</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{stats?.passRate || 0}%</p>
          <p className="text-[11px] text-slate-400 mt-1">Based on {stats?.passedCount || 0} passes</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Exams Logged</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats?.totalExams || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Theory & road tests</p>
        </div>
      </div>

      {/* Test-Ready Alert Callout */}
      {testReadyStudents.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <h4 className="font-bold text-amber-900">
                {testReadyStudents.length} Students are Eligible for Official Driving Tests
              </h4>
              <p className="text-amber-800 mt-0.5">
                These candidates have completed their required hours and mastered essential road competencies:{" "}
                {testReadyStudents.map((s) => `${s.firstName} ${s.lastName}`).join(", ")}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
          >
            Book Candidate
          </button>
        </div>
      )}

      {/* Exams Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" /> Examination Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Exam Type</th>
                <th className="px-5 py-3.5">Scheduled Date & Center</th>
                <th className="px-5 py-3.5">Examiner</th>
                <th className="px-5 py-3.5">Result</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((exam: any) => (
                <tr key={exam.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {exam.student?.firstName} {exam.student?.lastName}
                    <p className="text-[11px] font-normal text-slate-400">
                      ID: {exam.student?.idNumber}
                    </p>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                      {exam.examType}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-800">{formatDate(exam.scheduledDate)}</p>
                    <p className="text-[11px] text-slate-500">{exam.testCenter}</p>
                  </td>

                  <td className="px-5 py-3.5 text-slate-700">
                    {exam.examinerName || <span className="text-slate-400 italic">Not Assigned</span>}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        exam.result === "PASSED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : exam.result === "FAILED"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {exam.result} {exam.score !== null && `(${exam.score}%)`}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    {exam.result === "PENDING" ? (
                      <button
                        onClick={() => {
                          setOutcomeExamId(exam.id);
                          setExaminer(exam.examinerName || "");
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                      >
                        Record Outcome
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Finalized</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Exam Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Book Official Driving Examination</h3>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{bookError}</span>
              </div>
            )}

            <form onSubmit={handleBookExam} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Candidate *</label>
                <select
                  required
                  value={newExam.studentId}
                  onChange={(e) => setNewExam({ ...newExam, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Candidate --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.status} • {s.completedHours}h completed)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Exam Type</label>
                  <select
                    value={newExam.examType}
                    onChange={(e) => setNewExam({ ...newExam, examType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="PRACTICAL">Practical Driving Test</option>
                    <option value="THEORY">Theory & Highway Code Test</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Test Date *</label>
                  <input
                    type="date"
                    required
                    value={newExam.scheduledDate}
                    onChange={(e) => setNewExam({ ...newExam, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Examination Center *</label>
                <input
                  type="text"
                  required
                  value={newExam.testCenter}
                  onChange={(e) => setNewExam({ ...newExam, testCenter: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Assigned Government Examiner</label>
                <input
                  type="text"
                  placeholder="e.g. Officer John Maina"
                  value={newExam.examinerName}
                  onChange={(e) => setNewExam({ ...newExam, examinerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Special Notes / Vehicle Assigned</label>
                <input
                  type="text"
                  placeholder="e.g. Car reserved: Toyota Yaris (KDA 102B)"
                  value={newExam.notes}
                  onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Booking..." : "Book Examination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Outcome Modal */}
      {outcomeExamId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Record Examination Outcome</h3>
            <p className="text-xs text-slate-500 mt-1">
              Passing a practical test will promote candidate to <strong>GRADUATED</strong>.
            </p>

            <form onSubmit={handleSaveOutcome} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Official Result</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setResult("PASSED")}
                    className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-2 ${
                      result === "PASSED"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> PASSED
                  </button>
                  <button
                    type="button"
                    onClick={() => setResult("FAILED")}
                    className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-2 ${
                      result === "FAILED"
                        ? "bg-rose-50 border-rose-500 text-rose-700"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <XCircle className="w-4 h-4" /> FAILED
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Test Score (% / Marks)</label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="e.g. 96"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Examiner Name</label>
                <input
                  type="text"
                  value={examiner}
                  onChange={(e) => setExaminer(e.target.value)}
                  placeholder="Official Examiner"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Examiner Comments</label>
                <textarea
                  rows={2}
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="Minor faults notes, lane discipline observation, etc."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOutcomeExamId(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOutcome}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {isSubmittingOutcome ? "Saving..." : "Finalize Outcome"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
