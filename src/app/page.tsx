"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import {
  Users,
  GraduationCap,
  Car,
  CreditCard,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  CarFront,
  Award,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatTime, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { role, isAuthenticated } = useRole();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "STUDENT") {
        router.replace("/portal/student");
        return;
      }
      if (role === "INSTRUCTOR") {
        router.replace("/portal/instructor");
        return;
      }
    }
  }, [role, isAuthenticated, router]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "ADMIN" || !role) {
      fetchDashboard();
    }
  }, [role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading KENA Driving School operations...</p>
        </div>
      </div>
    );
  }

  const { stats, todayLessons = [], vehicles = [], upcomingExams = [], alerts = [] } = data || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Quick Action Shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              KENA Operations Dashboard
            </h1>
            <span className="text-[11px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
              Thika Campus
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            NTSA driving lessons, dual-control fleet, student PDLs, and computer college certifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/students"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Student</span>
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4 text-orange-600" />
            <span>Book Lesson</span>
          </Link>
          <Link
            href="/billing"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Record M-Pesa</span>
          </Link>
        </div>
      </div>

      {/* 3 Dedicated Role Portals Selection Card (Student, Instructor, Admin/Superadmin) */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 p-6 rounded-3xl text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-800/60">
            Quotation Architecture
          </span>
          <h2 className="text-lg font-black mt-2">Three Dedicated Role Portals</h2>
          <p className="text-xs text-slate-300 mt-1">
            Access the dedicated dashboards tailored to Student, Instructor, and Admin responsibilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/portal/student"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>1. Student Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-orange-300 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/portal/instructor"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>2. Instructor Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-300 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/portal/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300" />
            <span>3. Admin / Superadmin</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-orange-200 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Compliance / Alerts Banner if any */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-900">Fleet Inspection & NTSA Safety Compliance</h4>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-amber-800">
              {alerts.map((a: any, idx: number) => (
                <span key={idx} className="flex items-center gap-1.5">
                  • <strong>{a.title}:</strong> {a.message}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/vehicles"
            className="text-xs font-bold text-amber-900 underline hover:text-amber-700 shrink-0"
          >
            Manage Fleet
          </Link>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Students</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.activeStudents || 0}</span>
            <span className="text-xs text-slate-500 font-medium">/ {stats?.totalStudents || 0} enrolled</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 text-amber-600 font-bold">
              <Award className="w-3.5 h-3.5" /> {stats?.testReadyStudents || 0} NTSA Test-Ready
            </span>
            <span className="text-emerald-600 font-bold">{stats?.graduatedStudents || 0} Licensed</span>
          </div>
        </div>

        {/* Card 2: Instructors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">NTSA Instructors</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.activeInstructors || 0}</span>
            <span className="text-xs text-emerald-600 font-bold">All Licensed</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Avg Rating: ⭐ 4.9 / 5.0</span>
            <Link href="/instructors" className="text-orange-600 hover:underline font-semibold">View</Link>
          </div>
        </div>

        {/* Card 3: Fleet Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Fleet Availability</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.availableVehicles || 0}</span>
            <span className="text-xs text-slate-500 font-medium">/ {stats?.totalVehicles || 0} cars &amp; bikes</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="text-amber-600 font-medium">{stats?.inMaintenanceVehicles || 0} in garage</span>
            <Link href="/vehicles" className="text-orange-600 hover:underline font-semibold">Details</Link>
          </div>
        </div>

        {/* Card 4: Financial Overview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tuition Collected</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{formatCurrency(stats?.totalRevenue || 0)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="text-amber-600 font-bold">Unpaid: {formatCurrency(stats?.totalOutstanding || 0)}</span>
            <Link href="/billing" className="text-orange-600 hover:underline font-semibold">M-Pesa</Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule + Fleet & Test Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Lesson Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Today&apos;s Driving Sessions (Thika &amp; Highway)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {todayLessons.length} practical &amp; mock test sessions scheduled
              </p>
            </div>
            <Link
              href="/schedule"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              Full Calendar <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 flex-1 divide-y divide-slate-100">
            {todayLessons.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No lessons scheduled for today. Click &quot;Book Lesson&quot; to assign a session.
              </div>
            ) : (
              todayLessons.map((lesson: any) => (
                <div key={lesson.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 text-center">
                      <p className="text-xs font-bold text-slate-800">{formatTime(lesson.startTime)}</p>
                      <p className="text-[10px] text-slate-400">{lesson.durationHours} hrs</p>
                    </div>
                    <div className="w-1.5 h-10 rounded-full bg-orange-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {lesson.student?.firstName} {lesson.student?.lastName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Instructor: {lesson.instructor?.firstName} {lesson.instructor?.lastName}
                        {lesson.vehicle && ` • ${lesson.vehicle.make} (${lesson.vehicle.registrationPlate})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        lesson.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : lesson.status === "SCHEDULED"
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {lesson.status}
                    </span>
                    <Link
                      href={`/students/${lesson.studentId}`}
                      className="text-xs text-slate-400 hover:text-slate-700 p-1"
                      title="View Student"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Test Readiness & Quick Fleet Roster */}
        <div className="space-y-6">
          {/* Upcoming Exams Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-600" /> NTSA Road Test Bookings
              </h3>
              <Link href="/exams" className="text-xs font-bold text-orange-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingExams.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No upcoming NTSA road tests scheduled.</p>
              ) : (
                upcomingExams.map((exam: any) => (
                  <div key={exam.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{exam.student?.firstName} {exam.student?.lastName}</span>
                      <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono">
                        {exam.examType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {formatDate(exam.scheduledDate)} • {exam.testCenter}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Fleet Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CarFront className="w-4 h-4 text-emerald-600" /> Thika Fleet
              </h3>
              <Link href="/vehicles" className="text-xs font-bold text-orange-600 hover:underline">
                Manage
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {vehicles.slice(0, 4).map((v: any) => (
                <div key={v.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-bold text-slate-800">{v.make} {v.model}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{v.registrationPlate} • {v.transmission}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.status === "AVAILABLE"
                        ? "bg-emerald-50 text-emerald-700"
                        : v.status === "MAINTENANCE"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
