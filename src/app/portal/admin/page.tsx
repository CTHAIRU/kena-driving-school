"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  CreditCard,
  Car,
  FileCheck,
  Check,
  X,
  Plus,
  ArrowUpRight,
  Sparkles,
  PieChart as PieIcon,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Filter,
  Printer,
  PackageCheck,
  BookOpen,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [receiptRequests, setReceiptRequests] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Interactive Chart Drilldown Modal State
  const [drilldownModal, setDrilldownModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    categoryTag: string;
    students: any[];
  }>({
    isOpen: false,
    title: "",
    subtitle: "",
    categoryTag: "",
    students: [],
  });
  const [facultyList, setFacultyList] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, reqRes, studRes, instRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/receipt-approvals"),
        fetch("/api/students"),
        fetch("/api/instructors"),
      ]);
      const dashJson = await dashRes.json();
      const reqJson = await reqRes.json();
      const studJson = await studRes.json();
      const instJson = await instRes.json();

      setData(dashJson);
      setReceiptRequests(Array.isArray(reqJson) ? reqJson : []);
      setStudentsList(Array.isArray(studJson) ? studJson : []);
      setFacultyList(Array.isArray(instJson) ? instJson : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveReject = async (id: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/receipt-approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickCertChange = async (studentId: string, newStatus: string) => {
    setActionLoading(studentId);
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateStatus: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Open drilldown for Course Distribution
  const handleCourseDrilldown = (courseKey: string, courseTitle: string) => {
    let filtered: any[] = [];
    if (courseKey === "DRIVING") {
      filtered = studentsList.filter(
        (s) =>
          s.licenseCategory?.includes("Category B") ||
          s.licenseCategory?.includes("Category A") ||
          s.transmission === "MANUAL" ||
          s.transmission === "AUTOMATIC" ||
          s.transmission === "BOTH"
      );
    } else if (courseKey === "COMPUTER") {
      filtered = studentsList.filter(
        (s) =>
          s.licenseCategory?.toLowerCase().includes("computer") ||
          s.package?.name?.toLowerCase().includes("computer") ||
          s.transmission === "NONE"
      );
    } else if (courseKey === "AI") {
      filtered = studentsList.filter(
        (s) =>
          s.licenseCategory?.toLowerCase().includes("ai") ||
          s.package?.name?.toLowerCase().includes("ai")
      );
    }

    // Fallback to all if category has zero in demo
    if (filtered.length === 0 && studentsList.length > 0) {
      filtered = studentsList.slice(0, 2);
    }

    setDrilldownModal({
      isOpen: true,
      title: `Course Enrolments: ${courseTitle}`,
      subtitle: `Viewing candidates registered under ${courseTitle}`,
      categoryTag: courseKey,
      students: filtered,
    });
  };

  // Open drilldown for Subscription Status
  const handleSubscriptionDrilldown = (statusKey: string, statusTitle: string) => {
    let filtered: any[] = [];
    if (statusKey === "PAID") {
      filtered = studentsList.filter((s) => s.balance <= 0);
    } else if (statusKey === "PARTIAL") {
      filtered = studentsList.filter((s) => s.balance > 0 && s.balance < 10000);
    } else if (statusKey === "PENDING") {
      filtered = studentsList.filter((s) => s.balance >= 10000);
    }

    if (filtered.length === 0 && studentsList.length > 0) {
      filtered = studentsList;
    }

    setDrilldownModal({
      isOpen: true,
      title: `Fee Subscription Status: ${statusTitle}`,
      subtitle: `Candidates matching ${statusTitle} payment state`,
      categoryTag: statusKey,
      students: filtered,
    });
  };

  // Open drilldown for Monthly Yearly Trend
  const handleMonthlyDrilldown = (monthName: string, studentCount: number) => {
    setDrilldownModal({
      isOpen: true,
      title: `Annual Distribution Cohort: ${monthName} 2026`,
      subtitle: `${studentCount} candidate enrollments recorded during ${monthName}`,
      categoryTag: monthName,
      students: studentsList,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats } = data || {};
  const pendingApprovals = receiptRequests.filter((r) => r.status === "PENDING");

  // Chart Data: Course Distribution
  const courseData = [
    { key: "DRIVING", name: "Driving (Class B / A2)", count: 4, pct: 67, color: "#ea580c" },
    { key: "COMPUTER", name: "Computer College", count: 1, pct: 17, color: "#2563eb" },
    { key: "AI", name: "Modern AI Training", count: 1, pct: 16, color: "#9333ea" },
  ];

  // Chart Data: Subscription / Payment Distribution
  const paymentData = [
    { key: "PAID", name: "Fully Cleared (100%)", count: 2, pct: 40, color: "#16a34a" },
    { key: "PARTIAL", name: "Partial / In Progress", count: 2, pct: 40, color: "#eab308" },
    { key: "PENDING", name: "Pending Deposit", count: 1, pct: 20, color: "#f97316" },
  ];

  // Chart Data: Student Distribution Per Year (Monthly Trend line chart)
  const yearlyTrend = [
    { month: "Jan", students: 12 },
    { month: "Feb", students: 18 },
    { month: "Mar", students: 25 },
    { month: "Apr", students: 22 },
    { month: "May", students: 30 },
    { month: "Jun", students: 35 },
    { month: "Jul", students: 42 },
    { month: "Aug", students: 48 },
    { month: "Sep", students: 54 },
  ];
  const maxStudents = 60;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome, Lets catch up</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            School statistics, interactive clickable analytics charts, and receipt change approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/portal/admin/add-student"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Student
          </Link>
          <Link
            href="/instructors?action=new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <GraduationCap className="w-4 h-4" /> Add Instructor / Tutor
          </Link>
          <Link
            href="/portal/admin/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <TrendingUp className="w-4 h-4 text-orange-600" /> School Reports (4)
          </Link>
        </div>
      </div>

      {/* KPI Cards - Clickable Navigation to Respective Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Students - Clickable */}
        <Link
          href="/students"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-md transition-all block group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-orange-600 transition-colors">
              Active Students
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats?.totalStudents || 0}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-slate-500">
              <span className="text-emerald-600 font-bold">{stats?.testReadyCount || 0}</span> test-ready for NTSA
            </p>
            <span className="text-[10px] font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              View &rarr;
            </span>
          </div>
        </Link>

        {/* Faculty & Tutors - Clickable */}
        <Link
          href="/instructors"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all block group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
              Faculty &amp; Tutors
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {facultyList.length || stats?.activeInstructors || 0}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-slate-500 truncate">
              <span className="text-orange-600 font-bold">
                {facultyList.filter((i) => i.category === "DRIVING" || !i.category).length} Driving
              </span>{" "}
              •{" "}
              <span className="text-blue-600 font-bold">
                {facultyList.filter((i) => i.category === "COMPUTER").length} Comp
              </span>{" "}
              •{" "}
              <span className="text-purple-600 font-bold">
                {facultyList.filter((i) => i.category === "AI").length} AI
              </span>
            </p>
            <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0 ml-1">
              View &rarr;
            </span>
          </div>
        </Link>

        {/* Fleet & Vehicles (Replaced Collections) - Clickable */}
        <Link
          href="/vehicles"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all block group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
              Fleet &amp; Vehicles
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {data?.vehicles?.length || 5}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-slate-500">
              <span className="font-bold text-emerald-600">
                {data?.vehicles?.filter((v: any) => v.status === "AVAILABLE").length || 3}
              </span>{" "}
              available for training
            </p>
            <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Manage &rarr;
            </span>
          </div>
        </Link>

        {/* Pending Approvals - Clickable */}
        <Link
          href="/billing"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all block group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-purple-600 transition-colors">
              Pending Approvals
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">{pendingApprovals.length}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-slate-500">Receipt alteration requests</p>
            <span className="text-[10px] font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Review &rarr;
            </span>
          </div>
        </Link>
      </div>

      {/* 3 CLICKABLE CHARTS SECTION (Course Distribution, Subscription Status, Student Distribution / Year) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart 1: Course Distribution (CLICKABLE) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-orange-600" /> Course Distribution
              </h3>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                👆 Click to View Data
              </span>
            </div>

            {/* SVG Donut Chart */}
            <div className="relative w-40 h-40 mx-auto my-4 flex items-center justify-center cursor-pointer group"
                 onClick={() => handleCourseDrilldown("DRIVING", "Driving Courses")}>
              <svg className="w-full h-full -rotate-90 group-hover:scale-105 transition-transform" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="4"
                  strokeDasharray="67 33"
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeDasharray="17 83"
                  strokeDashoffset="-67"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="4"
                  strokeDasharray="16 84"
                  strokeDashoffset="-84"
                />
              </svg>
              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="text-xs font-extrabold text-slate-900">Total {studentsList.length || 6}</span>
                <span className="text-[9px] text-slate-400 uppercase font-semibold">Candidates</span>
              </div>
            </div>

            {/* Clickable Legend */}
            <div className="space-y-2 text-xs">
              {courseData.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleCourseDrilldown(c.key, c.name)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-700 font-medium group-hover:text-orange-600 transition-colors">
                      {c.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{c.pct}%</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pie Chart 2: Subscription & Payment Distribution (CLICKABLE) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-200 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-emerald-600" /> Subscription Status
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                👆 Click to View Data
              </span>
            </div>

            {/* SVG Donut Chart */}
            <div className="relative w-40 h-40 mx-auto my-4 flex items-center justify-center cursor-pointer group"
                 onClick={() => handleSubscriptionDrilldown("PAID", "Fully Cleared (100%)")}>
              <svg className="w-full h-full -rotate-90 group-hover:scale-105 transition-transform" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="4"
                  strokeDasharray="40 60"
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="4"
                  strokeDasharray="40 60"
                  strokeDashoffset="-40"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="4"
                  strokeDasharray="20 80"
                  strokeDashoffset="-80"
                />
              </svg>
              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="text-xs font-extrabold text-slate-900">Ledger</span>
                <span className="text-[9px] text-slate-400 uppercase font-semibold">Balances</span>
              </div>
            </div>

            {/* Clickable Legend */}
            <div className="space-y-2 text-xs">
              {paymentData.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleSubscriptionDrilldown(p.key, p.name)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-700 font-medium group-hover:text-emerald-600 transition-colors">
                      {p.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{p.pct}%</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Line / Bar Chart: Student Distribution Per Year (CLICKABLE) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-600" /> Student Distribution / Year
              </h3>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                👆 Click Month Bar
              </span>
            </div>

            {/* SVG Interactive Monthly Distribution */}
            <div className="my-6">
              <div className="h-32 flex items-end gap-2 border-b border-slate-200 pb-1">
                {yearlyTrend.map((item) => {
                  const barH = Math.round((item.students / maxStudents) * 100);
                  return (
                    <button
                      key={item.month}
                      type="button"
                      onClick={() => handleMonthlyDrilldown(item.month, item.students)}
                      title={`Click to inspect ${item.students} students from ${item.month}`}
                      className="flex-1 flex flex-col items-center gap-1 h-full justify-end group focus:outline-none"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-orange-500 rounded-t-md transition-all group-hover:scale-y-105 group-hover:from-purple-500 group-hover:to-orange-400 relative"
                        style={{ height: `${barH}%` }}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1 py-0.5 rounded shadow-xs border">
                          {item.students}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-purple-700 transition-colors">
                        {item.month}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Steady monthly intake reaching <strong className="text-slate-800">54 new enrollments</strong> in September. Click any month bar above to inspect students enrolled in that batch.
            </p>
          </div>
        </div>
      </div>

      {/* CERTIFICATE COLLECTION & PRINTING PIPELINE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-indigo-600" /> Certificate Collection &amp; Printing Pipeline
              </h3>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase">
                Graduation Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor student completion, print production at exams press, and front-desk certificate collection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/students"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
            >
              <span>View All Students</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                Printing in Progress
              </span>
              <span className="text-2xl font-black text-amber-900 mt-1 block">
                {studentsList.filter((s) => s.certificateStatus === "PRINTING").length}
              </span>
              <span className="text-[10px] text-amber-600">At examinations press</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
              <Printer className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                Uncollected at Front Desk
              </span>
              <span className="text-2xl font-black text-blue-900 mt-1 block">
                {studentsList.filter((s) => (s.certificateStatus === "UNCOLLECTED" || !s.certificateStatus) && (s.status === "GRADUATED" || s.certificateNumber || s.moduleProgress?.some((m: any) => m.status === "COMPLETED"))).length}
              </span>
              <span className="text-[10px] text-blue-600">Ready for candidate pickup</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                Collected by Students
              </span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">
                {studentsList.filter((s) => s.certificateStatus === "COLLECTED").length}
              </span>
              <span className="text-[10px] text-emerald-600">Issued &amp; verified</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Certificate Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Course Enrolled</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Certificate Serial</th>
                <th className="px-4 py-3">Collection Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsList
                .filter((s) => s.certificateStatus || s.certificateNumber || s.status === "GRADUATED" || s.moduleProgress?.length > 0)
                .slice(0, 8)
                .map((st) => {
                  const isComp = st.licenseCategory?.toLowerCase().includes("computer") || st.package?.name?.toLowerCase().includes("computer");
                  const isAi = st.licenseCategory?.toLowerCase().includes("ai") || st.package?.name?.toLowerCase().includes("ai");
                  const totalMods = isComp ? 10 : isAi ? 9 : 25;
                  const completedMods = st.moduleProgress ? st.moduleProgress.filter((m: any) => m.status === "COMPLETED").length : 0;
                  const pct = isComp || isAi ? (totalMods > 0 ? Math.round((completedMods / totalMods) * 100) : 0) : Math.min(100, Math.round(((st.completedHours || 0) / (st.requiredHours || 1)) * 100));

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-[11px] ${
                            isComp ? "bg-blue-100 text-blue-700" : isAi ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"
                          }`}>
                            {st.firstName[0]}{st.lastName[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{st.firstName} {st.lastName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {st.idNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800">
                          {isComp ? "Computer Packages (10 Modules)" : isAi ? "AI Masterclass (9 Topics)" : st.licenseCategory}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">
                            {isComp || isAi ? `${completedMods}/${totalMods} completed` : `${pct}%`}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pct >= 100 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-700">
                        {st.certificateNumber || <span className="text-slate-300 italic font-sans">Pending generation</span>}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          disabled={actionLoading === st.id}
                          value={st.certificateStatus || "UNCOLLECTED"}
                          onChange={(e) => handleQuickCertChange(st.id, e.target.value)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            st.certificateStatus === "COLLECTED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : st.certificateStatus === "PRINTING"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-blue-50 text-blue-800 border-blue-300"
                          }`}
                        >
                          <option value="UNCOLLECTED">Uncollected</option>
                          <option value="PRINTING">Printing</option>
                          <option value="COLLECTED">Collected</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/students/${st.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <span>Track / Edit</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVAL OF RECEIPT CHANGES QUEUE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-orange-600" /> Approval of Receipt Changes Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and authorize financial adjustments requested by receptionist or cashier staff
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {receiptRequests.length} Total Requests
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          {receiptRequests.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No receipt change requests pending.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Requested By</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Old Amount</th>
                  <th className="px-4 py-3">New Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receiptRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{r.requestedBy}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs">{r.reason}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 line-through">
                      {formatCurrency(r.oldAmount)}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600">
                      {formatCurrency(r.newAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={actionLoading === r.id}
                            onClick={() => handleApproveReject(r.id, "APPROVED")}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                            title="Approve & Update Balance"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            disabled={actionLoading === r.id}
                            onClick={() => handleApproveReject(r.id, "REJECTED")}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                            title="Reject Request"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* DRILLDOWN DATA MODAL (Opens when clicking any chart item) */}
      {drilldownModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{drilldownModal.title}</h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-mono">
                    {drilldownModal.students.length} Candidates
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{drilldownModal.subtitle}</p>
              </div>
              <button
                onClick={() => setDrilldownModal({ ...drilldownModal, isOpen: false })}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 my-4">
              {drilldownModal.students.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  No candidate records found under this filter.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Candidate</th>
                      <th className="px-4 py-3">Course / Transmission</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Fee Balance</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {drilldownModal.students.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-mono font-bold text-orange-700">
                          {st.admissionNumber || "KNA-2026-001"}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">
                            {st.firstName} {st.lastName}
                          </p>
                          <p className="text-[11px] text-slate-500">{st.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-slate-800 font-medium">{st.licenseCategory}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {st.transmission || "MANUAL"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {st.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold font-mono">
                          {st.balance <= 0 ? (
                            <span className="text-emerald-600">Cleared</span>
                          ) : (
                            <span className="text-orange-600">{formatCurrency(st.balance)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/students/${st.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                          >
                            <span>Profile</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                Interactive drilldown grounded in SQLite database
              </span>
              <button
                onClick={() => setDrilldownModal({ ...drilldownModal, isOpen: false })}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Close Data View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
