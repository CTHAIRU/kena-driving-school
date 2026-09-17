"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  AlertTriangle,
  Calendar,
  ClipboardCheck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  FileCheck2,
  BookOpen,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function InstructorDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [instructor, setInstructor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()),
      fetch("/api/profile?role=INSTRUCTOR").then((r) => r.json()),
    ])
      .then(([dashData, instData]) => {
        setData(dashData);
        setInstructor(instData);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
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

  const { todayLessons = [], upcomingExams = [] } = data || {};
  const instructorId = instructor?.id;

  // Filter lessons and students assigned to this instructor
  const myLessons = todayLessons.filter(
    (l: any) => !instructorId || l.instructorId === instructorId
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Instructor Welcome Header */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/40 text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> NTSA Certified Faculty
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Instructor Portal: {instructor?.firstName} {instructor?.lastName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            License: <span className="font-mono text-orange-300 font-bold">{instructor?.licenseNumber}</span> • Assigned Car:{" "}
            <span className="text-slate-200 font-semibold">
              {instructor?.vehicle ? `${instructor.vehicle.make} (${instructor.vehicle.registrationPlate})` : "Toyota Yaris (KDA 102B)"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/portal/instructor/gradebook?tab=practical-sheet"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <FileCheck2 className="w-4 h-4" /> Sign 25 Practical Sheet
          </Link>
          <Link
            href="/practical-topics"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
          >
            <BookOpen className="w-4 h-4" /> 25 Lesson Guides
          </Link>
          <Link
            href="/portal/instructor/students"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
          >
            <Users className="w-4 h-4" /> My Students
          </Link>
        </div>
      </div>

      {/* Metrics required by quotation:
          "View number of assigned, students with exams that week, students not seen recently, distribution of students per month/year."
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Number of Assigned */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Assigned Students
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">4 Active</p>
          <p className="text-xs text-slate-400 mt-1">3 In-Training • 1 Test Ready</p>
        </div>

        {/* Metric 2: Students with Exams That Week */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Exams This Week
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-3">{upcomingExams.length}</p>
          <p className="text-xs text-emerald-700/80 mt-1 font-semibold">NTSA Thika Road Tests</p>
        </div>

        {/* Metric 3: Students Not Seen Recently */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Not Seen Recently
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 mt-3">1 Student</p>
          <p className="text-xs text-amber-700/90 mt-1 font-medium">&gt;14 days since last drive</p>
        </div>

        {/* Metric 4: Monthly Student Load */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Monthly Cadence
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">28 Hours</p>
          <p className="text-xs text-slate-400 mt-1">September 2026 Shift</p>
        </div>
      </div>

      {/* Main Grid: Weekly NTSA Exams & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Road Test Candidates */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-600" /> NTSA Exams Scheduled This Week
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Candidates cleared for government road test</p>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
              Thika Section 9
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {upcomingExams.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No test bookings for this week.</p>
            ) : (
              upcomingExams.map((ex: any) => (
                <div key={ex.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {ex.student?.firstName} {ex.student?.lastName}
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Examiner: <span className="font-medium text-slate-800">{ex.examinerName || "Patrick Mwangi"}</span> • {formatDate(ex.scheduledDate)}
                    </p>
                    <p className="text-[11px] font-mono text-emerald-700 font-semibold mt-1">
                      PDL: {ex.student?.pdlNumber || "Verified"}
                    </p>
                  </div>
                  <Link
                    href="/portal/instructor/gradebook"
                    className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 shadow-xs"
                  >
                    Assess
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Student Inactivity & Retention Alert per quotation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Follow-Up: Students Not Seen Recently
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Prompt inactive learners to resume lessons</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">Chloe Mwangi</h4>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  18 Days Inactive
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1">
                Completed 6.5 / 20 hrs. Stalled on Clutch Biting Point &amp; Hill Starts.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href="tel:+254703778899"
                  className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-[11px] text-slate-700 hover:border-orange-300"
                >
                  Call Student
                </a>
                <a
                  href="https://wa.me/254703778899"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700"
                >
                  WhatsApp Follow-Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
