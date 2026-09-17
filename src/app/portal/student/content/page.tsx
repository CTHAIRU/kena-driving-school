"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Video,
  Download,
  Play,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Monitor,
  Brain,
  Search,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  X,
  Briefcase,
  Wrench,
  Keyboard,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { OFFICIAL_AI_TOPICS, type AITopic } from "@/lib/aiCurriculum";
import { OFFICIAL_COMPUTER_TOPICS, type ComputerTopic } from "@/lib/computerCurriculum";

export default function StudentContentPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ALL" | "DRIVING" | "COMPUTER" | "AI">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [selectedAITopic, setSelectedAITopic] = useState<AITopic | null>(null);
  const [selectedCompTopic, setSelectedCompTopic] = useState<ComputerTopic | null>(null);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setMaterials(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesFilter = filter === "ALL" || m.category === filter;
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filteredAITopics = OFFICIAL_AI_TOPICS.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.shortTitle.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.keyTools.some((tool) => tool.toLowerCase().includes(q))
    );
  });

  const filteredCompTopics = OFFICIAL_COMPUTER_TOPICS.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.shortTitle.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.keySoftware.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-orange-600" />
            KENA Learning &amp; Course Materials Library
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Course Content &amp; Curriculum Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access official syllabi, interactive topic breakdowns, and study materials across Driving, Computer Packages, and Modern AI.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs self-start md:self-center">
          {(
            [
              { key: "ALL", label: "All Curricula" },
              { key: "DRIVING", label: "🚗 Driving (25)" },
              { key: "COMPUTER", label: "💻 Computer (10)" },
              { key: "AI", label: "🤖 Modern AI (9)" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                filter === key
                  ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics, formulas, software (e.g. ChatGPT, Excel, VLOOKUP, Runway, Hill Start)..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* 1. FEATURED 25 PRACTICAL LESSONS (Shows on ALL or DRIVING) */}
      {(filter === "ALL" || filter === "DRIVING") && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-xs shrink-0 border border-white/20">
              <FileCheck2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase mb-1">
                Official NTSA Driving Curriculum
              </div>
              <h2 className="text-xl font-black tracking-tight">Official 25 Practical Lessons Syllabus</h2>
              <p className="text-xs sm:text-sm text-orange-100/90 mt-1 max-w-xl leading-relaxed">
                Standardized in-vehicle tracking from Lesson 1 (Introduction) through Lesson 25 (Reversing Pt 3). Digital student and instructor sign-off with vehicle audit logs.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/portal/student/practical-sheet"
              className="px-4 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" /> My 25 Practical Sheet
            </Link>
            <Link
              href="/practical-topics"
              className="px-4 py-2.5 bg-orange-800/60 hover:bg-orange-800 text-white font-bold rounded-xl text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>Explore Drill Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. MODERN AI CURRICULUM (Shows on ALL or AI) */}
      {(filter === "ALL" || filter === "AI") && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Modern AI Curriculum Structure ({OFFICIAL_AI_TOPICS.length} Topics)
                </h2>
                <p className="text-xs text-slate-500">
                  Step-by-step topics taught in Artificial Intelligence with in-depth practical guides &amp; monetization strategies.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200 self-start sm:self-center">
              Category: AI Masterclass
            </span>
          </div>

          {/* AI Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAITopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedAITopic(topic)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      AI-{topic.id.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {topic.estimatedHours}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  {/* Key tools pill badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {topic.keyTools.slice(0, 3).map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-200"
                      >
                        {tool}
                      </span>
                    ))}
                    {topic.keyTools.length > 3 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 text-slate-400">
                        +{topic.keyTools.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform">
                  <span>View Useful Info &amp; Drills</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. COMPUTER PACKAGES CURRICULUM (Shows on ALL or COMPUTER) */}
      {(filter === "ALL" || filter === "COMPUTER") && (
        <section className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Computer Packages Curriculum Structure ({OFFICIAL_COMPUTER_TOPICS.length} Topics)
                </h2>
                <p className="text-xs text-slate-500">
                  Standardized modules from computer fundamentals and Microsoft Office suite to PC maintenance and internet security.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200 self-start sm:self-center">
              Category: Computer College
            </span>
          </div>

          {/* Computer Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedCompTopic(topic)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      COMP-{topic.id.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {topic.estimatedHours}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  {/* Key software pill badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {topic.keySoftware.slice(0, 3).map((soft) => (
                      <span
                        key={soft}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-200"
                      >
                        {soft}
                      </span>
                    ))}
                    {topic.keySoftware.length > 3 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 text-slate-400">
                        +{topic.keySoftware.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                  <span>View Useful Info &amp; Labs</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. DOWNLOADABLE MANUALS & VIDEO MEDIA LIBRARY */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Study Guides &amp; Tutorial Media Directory ({filteredMaterials.length})
            </h2>
            <p className="text-xs text-slate-500">
              Downloadable PDFs, reference handbooks, and recorded lecture videos.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No materials found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.category === "DRIVING"
                          ? "bg-orange-100 text-orange-800"
                          : item.category === "COMPUTER"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.category}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      {item.contentType === "VIDEO" ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-rose-500" /> Video
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5 text-blue-500" /> PDF Document
                        </>
                      )}
                      {item.fileSize && ` • ${item.fileSize}`}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {item.contentType === "VIDEO" ? (
                    <button
                      onClick={() => setSelectedVideo(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors w-full justify-center cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-rose-600" /> Watch Video Tutorial
                    </button>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-xl text-xs font-bold transition-colors w-full justify-center border border-slate-200"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF Manual
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL 1: AI TOPIC DETAIL INSPECTOR */}
      {selectedAITopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 text-slate-900 my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-purple-50 to-white rounded-t-3xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-purple-600 text-white">
                    AI-{selectedAITopic.id.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md">
                    {selectedAITopic.level} • {selectedAITopic.estimatedHours}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{selectedAITopic.title}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">{selectedAITopic.summary}</p>
              </div>
              <button
                onClick={() => setSelectedAITopic(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Useful Info */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Overview */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" /> Topic Overview
                </h4>
                <p className="leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedAITopic.overview}
                </p>
              </div>

              {/* Core Concepts Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Core Concepts Taught
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedAITopic.coreConcepts.map((concept, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                      <p className="font-bold text-slate-900">{concept.name}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{concept.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Tools */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-purple-600" /> Essential Tools &amp; Platforms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAITopic.keyTools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 text-purple-800 font-bold rounded-xl border border-purple-200 text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Practical Hands-On Workflows */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Practical Hands-On Exercises
                </h4>
                <ul className="space-y-2">
                  {selectedAITopic.practicalWorkflows.map((flow, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-xs leading-relaxed text-slate-700">{flow}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prompt Engineering Templates */}
              {selectedAITopic.promptTemplates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Copy className="w-4 h-4 text-purple-600" /> Ready-to-Use Prompt Templates
                  </h4>
                  {selectedAITopic.promptTemplates.map((pt, i) => (
                    <div key={i} className="bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-2 font-mono text-[11px]">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <span className="text-purple-400 font-bold font-sans text-xs">{pt.title}</span>
                        <button
                          onClick={() => handleCopyPrompt(pt.prompt, i)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-sans font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedPromptIndex === i ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Prompt
                            </>
                          )}
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{pt.prompt}</p>
                      <p className="text-[10px] text-slate-400 font-sans italic pt-1">{pt.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Job Creation & Marketing Tactics */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" /> Job Creation &amp; Commercial Marketing Opportunities
                </h4>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2 text-emerald-950">
                  <p className="font-bold text-xs">How students can monetize this skill:</p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs">
                    {selectedAITopic.jobAndMarketingTactics.map((tactic, i) => (
                      <li key={i} className="leading-relaxed">{tactic}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Kenyan Local Context */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold text-xs">🇰🇪 Local Kenyan Application Context:</p>
                <p className="text-xs leading-relaxed text-amber-800">{selectedAITopic.localKenyanContext}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50 rounded-b-3xl">
              <button
                onClick={() => setSelectedAITopic(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Close Topic Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPUTER TOPIC DETAIL INSPECTOR */}
      {selectedCompTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 text-slate-900 my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-blue-50 to-white rounded-t-3xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-blue-600 text-white">
                    COMP-{selectedCompTopic.id.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
                    {selectedCompTopic.level} • {selectedCompTopic.estimatedHours}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{selectedCompTopic.title}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">{selectedCompTopic.summary}</p>
              </div>
              <button
                onClick={() => setSelectedCompTopic(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Useful Info */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Overview */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Module Overview
                </h4>
                <p className="leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedCompTopic.overview}
                </p>
              </div>

              {/* Core Concepts Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-blue-600" /> Core Concepts Taught
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCompTopic.coreConcepts.map((concept, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                      <p className="font-bold text-slate-900">{concept.name}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{concept.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Software */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-blue-600" /> Software &amp; Applications Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCompTopic.keySoftware.map((app, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-blue-50 text-blue-800 font-bold rounded-xl border border-blue-200 text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Practical Hands-On Lab Exercises */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Practical Lab Exercises
                </h4>
                <ul className="space-y-2">
                  {(selectedCompTopic.practicalExercises || selectedCompTopic.practicalWorkflows || []).map((ex, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-xs leading-relaxed text-slate-700">{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Essential Keyboard Shortcuts */}
              {selectedCompTopic.keyboardShortcuts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Keyboard className="w-4 h-4 text-blue-600" /> Essential Keyboard Shortcuts
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCompTopic.keyboardShortcuts.map((sc, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                        <kbd className="px-2 py-1 bg-white rounded border border-slate-300 font-mono text-[11px] font-bold text-slate-800 shadow-2xs">
                          {sc.key}
                        </kbd>
                        <span className="text-[11px] text-slate-600 font-medium text-right">{sc.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Skills */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-600" /> Career &amp; Employment Skills
                </h4>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-2 text-blue-950">
                  <p className="font-bold text-xs">Workplace opportunities for this skill:</p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs">
                    {selectedCompTopic.jobAndCareerSkills.map((skill, i) => (
                      <li key={i} className="leading-relaxed">{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Real-World Kenyan Scenario */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold text-xs">🇰🇪 Real-World Kenyan Workplace Scenario:</p>
                <p className="text-xs leading-relaxed text-amber-800">{selectedCompTopic.realWorldKenyaScenario}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50 rounded-b-3xl">
              <button
                onClick={() => setSelectedCompTopic(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Close Module Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                  KENA Video Lecture
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{selectedVideo.title}</h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden shadow-inner">
              <div className="w-16 h-16 rounded-full bg-orange-600/90 flex items-center justify-center text-white shadow-xl shadow-orange-600/40 mb-3">
                <Play className="w-7 h-7 fill-white ml-1" />
              </div>
              <p className="text-sm font-bold text-center">{selectedVideo.title}</p>
              <p className="text-xs text-slate-400 mt-1">Duration: {selectedVideo.fileSize || "Lecture Stream"}</p>
              <p className="text-[11px] text-orange-400 mt-3 font-mono">
                Tabby House Thika • KENA Media Server
              </p>
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
              {selectedVideo.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
