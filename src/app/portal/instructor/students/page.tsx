"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, Phone, Mail, Award, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filtered = students.filter((s) => {
    // Status filter per quotation: active or completed
    if (filter === "ACTIVE" && s.status === "GRADUATED") return false;
    if (filter === "COMPLETED" && s.status !== "GRADUATED") return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.idNumber.toLowerCase().includes(q) ||
      (s.pdlNumber && s.pdlNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Students Roster</h1>
          <p className="text-xs text-slate-500 mt-1">
            Learners enrolled under your supervision for practical driving and mock examinations.
          </p>
        </div>

        {/* Filter per quotation: active or completed */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {(["ALL", "ACTIVE", "COMPLETED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                filter === st
                  ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st === "ALL" ? "All Students" : st === "ACTIVE" ? "Active Candidates" : "Completed / Graduated"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by name, ID number, or NTSA PDL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 shadow-xs"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading assigned candidates...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No matching students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-5 py-3.5">NTSA PDL No.</th>
                  <th className="px-5 py-3.5">Category &amp; Gear</th>
                  <th className="px-5 py-3.5">Practical Hours</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => {
                  const isComputer = s.licenseCategory?.toLowerCase().includes("computer") || s.package?.name?.toLowerCase().includes("computer");
                  const isAI = s.licenseCategory?.toLowerCase().includes("ai") || s.package?.name?.toLowerCase().includes("ai");
                  const isComputerOrAI = isComputer || isAI;

                  const totalMods = isComputer ? 10 : isAI ? 9 : 0;
                  const completedMods = Array.isArray(s.moduleProgress)
                    ? s.moduleProgress.filter((m: any) => m.status === "COMPLETED").length
                    : 0;
                  const modPct = totalMods > 0 ? Math.min(100, Math.round((completedMods / totalMods) * 100)) : 0;
                  const drivingPct = Math.min(100, Math.round((s.completedHours / (s.requiredHours || 20)) * 100));

                  const displayPct = isComputerOrAI ? modPct : drivingPct;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl font-black flex items-center justify-center text-xs ${
                              isComputer
                                ? "bg-blue-100 text-blue-800"
                                : isAI
                                ? "bg-purple-100 text-purple-800"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {s.firstName[0]}
                            {s.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {s.firstName} {s.lastName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Adm: {s.admissionNumber || s.idNumber} • {s.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {isComputerOrAI ? (
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              s.certificateStatus === "COLLECTED"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : s.certificateStatus === "PRINTING"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-blue-100 text-blue-800 border border-blue-300"
                            }`}
                          >
                            {s.certificateStatus === "COLLECTED"
                              ? "🎓 Collected"
                              : s.certificateStatus === "PRINTING"
                              ? "🖨️ Printing"
                              : "📦 Uncollected"}
                          </span>
                        ) : s.pdlNumber ? (
                          <span className="font-mono font-bold text-emerald-700">{s.pdlNumber}</span>
                        ) : (
                          <span className="text-slate-400 font-normal">Pending</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800">{s.package?.name || s.licenseCategory}</p>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {isComputerOrAI ? (isComputer ? "10 Modules" : "9 Topics") : s.transmission}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {isComputerOrAI
                              ? `${completedMods}/${totalMods} ${isComputer ? "mods" : "topics"}`
                              : `${s.completedHours}/${s.requiredHours} hrs`}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">({displayPct}%)</span>
                        </div>
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              isComputer ? "bg-blue-600" : isAI ? "bg-purple-600" : "bg-orange-600"
                            }`}
                            style={{ width: `${displayPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            s.status === "GRADUATED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : s.status === "TEST_READY"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {s.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/portal/instructor/gradebook?studentId=${s.id}${
                            isComputerOrAI ? "&tab=modules" : ""
                          }`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                        >
                          {isComputerOrAI ? "Input Progress" : "Grade Practical"}{" "}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
