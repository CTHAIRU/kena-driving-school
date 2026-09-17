"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Car,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  FileCheck2,
  Compass,
  Wrench,
  Award,
  Layers,
  ChevronRight,
  Printer,
  X,
} from "lucide-react";
import { OFFICIAL_PRACTICAL_TOPICS, type PracticalTopic } from "@/lib/practicalTopics";

export default function PracticalTopicsDirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState<PracticalTopic | null>(null);

  const filteredTopics = OFFICIAL_PRACTICAL_TOPICS.filter((topic) => {
    if (selectedPhase !== "ALL" && !topic.phase.includes(selectedPhase)) return false;
    if (selectedCategory !== "ALL" && topic.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = topic.title.toLowerCase().includes(q);
      const matchDesc = topic.description.toLowerCase().includes(q);
      const matchSkills = topic.keySkills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSkills) return false;
    }
    return true;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "FOUNDATION":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      case "MANEUVERS":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "ROADCRAFT":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "ASSESSMENT":
        return "bg-orange-50 text-orange-800 border-orange-200";
      case "TECHNICAL":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/40 text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Official KENA Practical Syllabus
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            25 Practical Lessons &amp; In-Vehicle Roadcraft Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            The complete, step-by-step practical driving curriculum used by KENA Driving School instructors and recognized by the National Transport and Safety Authority (NTSA).
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-xl text-slate-200 font-mono">
              25 Sequenced Lessons
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl text-slate-200">
              3 Structured Phases
            </span>
            <span className="bg-orange-500/30 border border-orange-500/40 px-3 py-1 rounded-xl text-orange-200 font-bold">
              Manual &amp; Automatic Dual-Control
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/portal/student/practical-sheet"
            className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 text-center"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>My Digital Practical Sheet</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition-all border border-white/15 flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Syllabus</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lesson e.g. parking, clutch, roundabout, hill start..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 placeholder:text-slate-400"
          />
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedPhase("ALL")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              selectedPhase === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All 25
          </button>
          <button
            onClick={() => setSelectedPhase("PHASE 1")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              selectedPhase === "PHASE 1"
                ? "bg-orange-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Phase 1: Basic (1–9)
          </button>
          <button
            onClick={() => setSelectedPhase("PHASE 2")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              selectedPhase === "PHASE 2"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Phase 2: Dynamics (10–18)
          </button>
          <button
            onClick={() => setSelectedPhase("PHASE 3")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              selectedPhase === "PHASE 3"
                ? "bg-purple-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Phase 3: Advanced (19–25)
          </button>
        </div>
      </div>

      {/* Grid of 25 Practical Lessons */}
      {filteredTopics.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          No practical lessons matching &quot;{search}&quot;. Try adjusting your filter terms.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const isMilestone =
              topic.praNo === 10 || topic.praNo === 17 || topic.praNo === 18 || topic.praNo === 22 || topic.praNo === 25;

            return (
              <div
                key={topic.praNo}
                onClick={() => setSelectedTopic(topic)}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group relative ${
                  isMilestone ? "border-orange-300/80 bg-orange-50/10" : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-orange-600 transition-colors">
                      #{topic.praNo}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(
                          topic.category
                        )}`}
                      >
                        {topic.category}
                      </span>
                      {isMilestone && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 uppercase">
                          Milestone
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug group-hover:text-orange-600 transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {topic.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Core In-Vehicle Skills:
                    </span>
                    {topic.keySkills.slice(0, 2).map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {topic.estimatedMinutes} mins
                  </span>
                  <span className="font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Drill</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TOPIC DETAIL MODAL / DRAWER */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white font-mono font-black text-lg flex items-center justify-center">
                  #{selectedTopic.praNo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(
                        selectedTopic.category
                      )}`}
                    >
                      {selectedTopic.category}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      {selectedTopic.phase}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {selectedTopic.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 my-4 space-y-5 text-xs pr-1">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Curriculum Objective &amp; Overview</h4>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {selectedTopic.description}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Practical Competencies &amp; In-Vehicle Checklist</span>
                </h4>
                <div className="space-y-2">
                  {selectedTopic.keySkills.map((skill, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>NTSA Examination Test Tips &amp; Traps</span>
                </h4>
                <p className="text-amber-900/90 leading-relaxed">
                  {selectedTopic.ntsaTips}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 text-purple-900 border border-purple-100 text-xs">
                <span className="font-semibold">Recommended Session Allocation:</span>
                <span className="font-bold font-mono">{selectedTopic.estimatedMinutes} Minutes (1 Session)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <Link
                href="/portal/student/practical-sheet"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                <span>Check Your Progress on this Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Lesson Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
