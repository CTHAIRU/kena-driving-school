"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Printer,
  CheckCircle2,
  Clock,
  Car,
  UserCheck,
  Calendar,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Info,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentPracticalSheetPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingPraNo, setSigningPraNo] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState("ALL");

  const fetchSheet = async () => {
    try {
      const res = await fetch("/api/practical-sheet");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheet();
  }, []);

  const handleStudentSign = async (praNo: number) => {
    setSigningPraNo(praNo);
    try {
      const res = await fetch("/api/practical-sheet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: data?.student?.id,
          praNo,
          studentSign: true,
        }),
      });
      if (res.ok) {
        fetchSheet();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSigningPraNo(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { student, entries = [], summary } = data || {};

  const filteredEntries = entries.filter((entry: any) => {
    if (activePhase === "ALL") return true;
    if (activePhase === "PHASE_1") return entry.praNo >= 1 && entry.praNo <= 9;
    if (activePhase === "PHASE_2") return entry.praNo >= 10 && entry.praNo <= 18;
    if (activePhase === "PHASE_3") return entry.praNo >= 19 && entry.praNo <= 25;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Official Practical Training Sheet
            </h1>
            <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full uppercase">
              25 Lessons Syllabus
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            KENA Driving School verified in-vehicle progress tracking card required for NTSA test booking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/practical-topics"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <span>View 25 Lesson Guides</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Sheet</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-black text-orange-700 font-mono">
                {summary?.completed || 0}
              </span>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase">/ 25 Done</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {student?.firstName} {student?.lastName}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">
                  {student?.admissionNumber || "KNA-2026-001"}
                </span>
                {summary?.isTestReady ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> NTSA Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" /> In Training
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Course: <strong className="text-slate-800">{student?.licenseCategory}</strong> •
                Transmission: <strong className="text-slate-800">{student?.transmission}</strong> •
                Instructor:{" "}
                <strong className="text-slate-800">
                  {student?.assignedInstructor
                    ? `${student.assignedInstructor.firstName} ${student.assignedInstructor.lastName}`
                    : "Tabby House Pool"}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 block uppercase">NTSA Progress</span>
              <span className="text-2xl font-black text-orange-600 font-mono">
                {summary?.progressPct || 0}%
              </span>
            </div>
            <div className="w-32 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${summary?.progressPct || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActivePhase("ALL")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activePhase === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All 25 Lessons
            </button>
            <button
              onClick={() => setActivePhase("PHASE_1")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activePhase === "PHASE_1"
                  ? "bg-orange-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Phase 1: Basic Controls (1–9)
            </button>
            <button
              onClick={() => setActivePhase("PHASE_2")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activePhase === "PHASE_2"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Phase 2: Dynamics &amp; Assessments (10–18)
            </button>
            <button
              onClick={() => setActivePhase("PHASE_3")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activePhase === "PHASE_3"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Phase 3: Advanced &amp; Exam (19–25)
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden lg:flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Click &apos;Sign&apos; to verify lesson attendance</span>
          </div>
        </div>
      </div>

      {/* THE OFFICIAL PRACTICAL SHEET (Formatted to replicate physical sheet) */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm overflow-hidden p-6 sm:p-8 print:p-0 print:border-none">
        {/* Printable Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
            KENA DRIVING SCHOOL &amp; COMPUTER COLLEGE
          </h2>
          <p className="text-xs font-bold tracking-widest text-slate-600 uppercase mt-0.5">
            Tabby House Rm 72, Thika • Official Practical Progress Sheet
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 print:bg-transparent">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Name</span>
              <strong className="text-slate-900">{student?.firstName} {student?.lastName}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Admission No.</span>
              <strong className="text-orange-700 font-mono">{student?.admissionNumber || "KNA-2026-001"}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Class &amp; Transmission</span>
              <strong className="text-slate-900">{student?.licenseCategory} ({student?.transmission})</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">NTSA PDL No.</span>
              <strong className="text-slate-900 font-mono">{student?.pdlNumber || "PDL-2026-XXXX"}</strong>
            </div>
          </div>
        </div>

        {/* 25 LESSON PROGRESS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-900 font-black uppercase text-[11px] tracking-wider bg-slate-100 print:bg-transparent">
                <th className="py-2.5 px-3 border border-slate-300 w-16 text-center">PRA NO.</th>
                <th className="py-2.5 px-4 border border-slate-300">LESSON.</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-28">STUDENT SIGN.</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-28">INST. SIGN.</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-28">DATE</th>
                <th className="py-2.5 px-4 border border-slate-300">T.O.V</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-28">OFFICIAL SIGN.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEntries.map((item: any) => {
                const isMilestone =
                  item.praNo === 10 || item.praNo === 17 || item.praNo === 18 || item.praNo === 22 || item.praNo === 25;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isMilestone ? "bg-orange-50/30 font-semibold" : ""
                    }`}
                  >
                    {/* PRA NO. */}
                    <td className="py-2 px-3 border border-slate-300 text-center font-mono font-bold text-slate-700">
                      {item.praNo}.
                    </td>

                    {/* LESSON TITLE */}
                    <td className="py-2 px-4 border border-slate-300 font-bold text-slate-900">
                      <div className="flex items-center justify-between">
                        <span>{item.lessonTitle}</span>
                        {isMilestone && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 print:hidden">
                            KEY DRILL
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STUDENT SIGN. */}
                    <td className="py-2 px-3 border border-slate-300 text-center">
                      {item.studentSign ? (
                        <div className="inline-flex items-center gap-1 text-emerald-700 font-bold font-serif italic text-xs">
                          <span>A. Wanjiru</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 print:hidden" />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStudentSign(item.praNo)}
                          disabled={signingPraNo === item.praNo}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-700 font-bold rounded text-[10px] border border-slate-200 transition-colors print:hidden"
                        >
                          {signingPraNo === item.praNo ? "Signing..." : "Sign"}
                        </button>
                      )}
                    </td>

                    {/* INST. SIGN. */}
                    <td className="py-2 px-3 border border-slate-300 text-center">
                      {item.instructorSign ? (
                        <div className="inline-flex items-center gap-1 text-blue-800 font-bold font-serif italic text-xs">
                          <span>M. Kariuki</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 print:hidden" />
                        </div>
                      ) : (
                        <span className="text-slate-300 italic text-[11px]">Pending</span>
                      )}
                    </td>

                    {/* DATE */}
                    <td className="py-2 px-3 border border-slate-300 text-center font-mono text-[11px] text-slate-700">
                      {item.date ? formatDate(item.date) : "—"}
                    </td>

                    {/* T.O.V (Type of Vehicle / Time of Vehicle) */}
                    <td className="py-2 px-4 border border-slate-300 font-mono text-[11px] text-slate-600">
                      {item.tov || "—"}
                    </td>

                    {/* OFFICIAL SIGN. */}
                    <td className="py-2 px-3 border border-slate-300 text-center">
                      {item.officialSign ? (
                        <span className="text-purple-800 font-bold font-serif italic text-[11px]">
                          KENA STAMP
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Printable Footer Signatures */}
        <div className="mt-8 pt-6 border-t-2 border-slate-800 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="border-b border-slate-400 h-10 mb-1" />
            <span className="font-bold text-slate-800 uppercase block">Candidate Signature</span>
            <span className="text-[10px] text-slate-400">Acknowledges lesson hours</span>
          </div>
          <div>
            <div className="border-b border-slate-400 h-10 mb-1" />
            <span className="font-bold text-slate-800 uppercase block">Lead Instructor Signature</span>
            <span className="text-[10px] text-slate-400">NTSA License Certified</span>
          </div>
          <div>
            <div className="border-b border-slate-400 h-10 mb-1" />
            <span className="font-bold text-slate-800 uppercase block">Director / Official Seal</span>
            <span className="text-[10px] text-slate-400">KENA Driving School Thika</span>
          </div>
        </div>
      </div>
    </div>
  );
}
