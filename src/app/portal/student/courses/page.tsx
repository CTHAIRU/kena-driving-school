"use client";

import { useEffect, useState } from "react";
import { BookOpen, Car, Laptop, Sparkles, Clock, CheckCircle2, Award } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function StudentCoursesPage() {
  const [filter, setFilter] = useState("ALL");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch packages and student profile
    Promise.all([
      fetch("/api/billing").then((r) => r.json()),
      fetch("/api/profile?role=STUDENT").then((r) => r.json()),
    ])
      .then(([billingData, studentData]) => {
        const pkgs = billingData.packages || [];
        // Map packages with student's active status
        const list = pkgs.map((pkg: any) => {
          const isEnrolled = studentData?.packageId === pkg.id;
          let category = "DRIVING";
          if (pkg.category.toLowerCase().includes("computer")) category = "COMPUTER";
          else if (pkg.category.toLowerCase().includes("ai")) category = "AI";

          const completedModulesCount = isEnrolled && Array.isArray(studentData?.moduleProgress)
            ? studentData.moduleProgress.filter((m: any) => m.status === "COMPLETED").length
            : 0;
          const totalModulesCount = category === "COMPUTER" ? 10 : category === "AI" ? 9 : 0;

          return {
            ...pkg,
            parsedCategory: category,
            isEnrolled,
            completedHours: isEnrolled ? studentData.completedHours : 0,
            status: isEnrolled ? studentData.status : "AVAILABLE",
            completedModulesCount,
            totalModulesCount,
            certificateStatus: isEnrolled ? (studentData?.certificateStatus || "UNCOLLECTED") : null,
          };
        });
        setCourses(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = courses.filter((c) => {
    if (filter === "ALL") return true;
    return c.parsedCategory === filter;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "DRIVING":
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800">DRIVING</span>;
      case "COMPUTER":
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">COMPUTER COLLEGE</span>;
      case "AI":
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">MODERN AI</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Courses &amp; Programs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse your enrolled curricula and explore additional training offerings at KENA.
          </p>
        </div>

        {/* Category Filters per quotation: Computer, AI, Driving, or all */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {["ALL", "DRIVING", "COMPUTER", "AI"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                filter === cat
                  ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat === "ALL" ? "All Courses" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((course) => (
            <div
              key={course.id}
              className={`p-6 rounded-2xl border transition-all bg-white flex flex-col justify-between ${
                course.isEnrolled
                  ? "border-orange-500/60 shadow-md ring-1 ring-orange-500/20"
                  : "border-slate-200 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getCategoryBadge(course.parsedCategory)}
                  {course.isEnrolled ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500">Available</span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base">{course.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{course.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    {course.parsedCategory === "COMPUTER" ? (
                      <Laptop className="w-4 h-4 text-blue-500" />
                    ) : course.parsedCategory === "AI" ? (
                      <Sparkles className="w-4 h-4 text-purple-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                    {course.parsedCategory === "COMPUTER"
                      ? "10 Modules Certification"
                      : course.parsedCategory === "AI"
                      ? "9 AI Masterclasses"
                      : `${course.totalHours} Practical Hours`}
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {formatCurrency(course.price)}
                  </span>
                </div>

                {course.isEnrolled && (
                  <div>
                    {course.parsedCategory === "COMPUTER" || course.parsedCategory === "AI" ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span>
                            {course.parsedCategory === "COMPUTER" ? "10 Modules Syllabus" : "9 AI Topics"}
                          </span>
                          <span>
                            {course.completedModulesCount || 0} / {course.totalModulesCount || 10} certified
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              course.parsedCategory === "COMPUTER" ? "bg-blue-600" : "bg-purple-600"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(
                                  ((course.completedModulesCount || 0) / (course.totalModulesCount || 10)) * 100
                                )
                              )}%`,
                            }}
                          />
                        </div>

                        {course.certificateStatus && (
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Certificate Collection:
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                course.certificateStatus === "COLLECTED"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : course.certificateStatus === "PRINTING"
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-blue-100 text-blue-800 border border-blue-300"
                              }`}
                            >
                              {course.certificateStatus === "COLLECTED"
                                ? "🎓 Collected"
                                : course.certificateStatus === "PRINTING"
                                ? "🖨️ Printing"
                                : "📦 Ready for Collection"}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>Practical Hours Progress</span>
                          <span>
                            {course.completedHours} / {course.totalHours} hrs
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.round((course.completedHours / course.totalHours) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
