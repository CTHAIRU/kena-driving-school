"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileUp, FileText, Video, Plus, Check, Trash2, ExternalLink, Compass, FileCheck2 } from "lucide-react";

export default function AdminContentPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "DRIVING",
    contentType: "PDF",
    url: "",
    description: "",
    fileSize: "",
  });

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/content");
      const json = await res.json();
      setMaterials(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setForm({
          title: "",
          category: "DRIVING",
          contentType: "PDF",
          url: "",
          description: "",
          fileSize: "",
        });
        fetchContent();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Course Materials &amp; Media Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload PDF syllabi, Highway Code study guides, and embed practical driving &amp; computer videos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Upload Material
        </button>
      </div>

      {/* Curriculum Reference Banners for Driving, Computer & AI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Driving */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wider uppercase mb-2">
              Driving Syllabus
            </div>
            <h3 className="text-base font-black tracking-tight">25 Practical Lessons</h3>
            <p className="text-xs text-orange-100 mt-1">
              Phases 1–3 standardized driving syllabus, town board, vehicle inspection and NTSA grading.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-[11px] font-medium text-orange-100">25 Lessons</span>
            <Link
              href="/practical-topics"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-orange-700 hover:bg-orange-50 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <FileCheck2 className="w-3.5 h-3.5" /> View Syllabus
            </Link>
          </div>
        </div>

        {/* Computer */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wider uppercase mb-2">
              Computer College
            </div>
            <h3 className="text-base font-black tracking-tight">10 Computer Modules</h3>
            <p className="text-xs text-blue-100 mt-1">
              Windows, Word, Excel, Access, Publisher, PowerPoint, Email &amp; Internet, and Hardware Maintenance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-[11px] font-medium text-blue-100">10 Modules</span>
            <Link
              href="/portal/student/content?tab=COMPUTER"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Modules
            </Link>
          </div>
        </div>

        {/* AI */}
        <div className="bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-3xl p-5 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wider uppercase mb-2">
              Modern AI Course
            </div>
            <h3 className="text-base font-black tracking-tight">9 Applied AI Topics</h3>
            <p className="text-xs text-purple-100 mt-1">
              ChatGPT, Gemini, NotebookLM, Prompt Engineering, Media Generation &amp; Freelance Monetization.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-[11px] font-medium text-purple-100">9 Topics</span>
            <Link
              href="/portal/student/content?tab=AI"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Topics
            </Link>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Library Directory ({materials.length})</h3>
          <span className="text-xs text-slate-400">Categorized by Driving, Computer &amp; AI</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading learning library...</div>
        ) : materials.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No materials uploaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Title &amp; Description</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Format</th>
                  <th className="px-5 py-3.5">Size / Length</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 max-w-sm">
                      <p className="font-bold text-slate-900">{m.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{m.description || "-"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          m.category === "DRIVING"
                            ? "bg-orange-100 text-orange-800"
                            : m.category === "COMPUTER"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {m.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        {m.contentType === "VIDEO" ? (
                          <Video className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-blue-500" />
                        )}
                        {m.contentType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-medium">
                      {m.fileSize || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                      >
                        Open Resource <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Upload Learning Resource</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Model Town Board Right of Way Rules"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="DRIVING">Driving Course</option>
                    <option value="COMPUTER">Computer College</option>
                    <option value="AI">Modern AI</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Content Format *</label>
                  <select
                    value={form.contentType}
                    onChange={(e) => setForm({ ...form, contentType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="VIDEO">Video Stream / Tutorial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">File URL / Video Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://... or https://youtube.com/..."
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Size / Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 5.4 MB or 22 mins"
                  value={form.fileSize}
                  onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of topics covered in this material"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Uploading..." : "Save Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
