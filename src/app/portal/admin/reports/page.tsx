"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  Users,
  CreditCard,
  Package,
  Award,
  Filter,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

type ReportType = "distribution" | "payments" | "packages" | "performance";
type Timeframe = "day" | "week" | "month" | "year" | "all";

export default function AdminReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>("distribution");
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?type=${activeReport}&timeframe=${timeframe}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeReport, timeframe]);

  const exportCSV = () => {
    if (!data) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    const reportTitle = `KENA_${activeReport.toUpperCase()}_REPORT_${timeframe.toUpperCase()}`;

    if (activeReport === "distribution") {
      csvContent += "Student Name,National ID,NTSA PDL,License Category,Transmission,Status,Created At\n";
      data.reports.studentDistribution.studentsList.forEach((s: any) => {
        csvContent += `"${s.firstName} ${s.lastName}","${s.idNumber}","${s.pdlNumber || ""}","${s.licenseCategory}","${s.transmission}","${s.status}","${s.createdAt}"\n`;
      });
    } else if (activeReport === "payments") {
      csvContent += "Receipt Ref,Student Name,Payment Method,Amount,Status,Date\n";
      data.reports.payments.transactions.forEach((p: any) => {
        csvContent += `"${p.transactionRef}","${p.student?.firstName || ""} ${p.student?.lastName || ""}","${p.paymentMethod}","${p.amount}","${p.status}","${p.createdAt}"\n`;
      });
    } else if (activeReport === "packages") {
      csvContent += "Package Name,Category,Price,Required Hours,Enrolled Students,Total Revenue\n";
      data.reports.packages.forEach((pkg: any) => {
        csvContent += `"${pkg.name}","${pkg.category}","${pkg.price}","${pkg.totalHours}","${pkg.enrolledCount}","${pkg.revenue}"\n`;
      });
    } else if (activeReport === "performance") {
      csvContent += "Practical Topic,Average Score,Evaluations Count\n";
      data.reports.studentPerformance.topicAverages.forEach((t: any) => {
        csvContent += `"${t.topic}","${t.averageScore}%","${t.evaluationsCount}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { summary, reports } = data || {};

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            KENA School Reports Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and export the 4 official institutional reports with custom time-filtering.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Filter per quotation: per day, week, month, year */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {(
              [
                { key: "day", label: "Per Day" },
                { key: "week", label: "Per Week" },
                { key: "month", label: "Per Month" },
                { key: "year", label: "Per Year" },
                { key: "all", label: "All Time" },
              ] as const
            ).map((tf) => (
              <button
                key={tf.key}
                onClick={() => setTimeframe(tf.key)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                  timeframe === tf.key
                    ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-orange-600" /> Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
        </div>
      </div>

      {/* 4 Report Tabs per quotation: Student Distribution, Payments, Packages, Student Performance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        {(
          [
            { id: "distribution", label: "1. Student Distribution", icon: Users },
            { id: "payments", label: "2. Payments & Revenue", icon: CreditCard },
            { id: "packages", label: "3. Packages & Enrolment", icon: Package },
            { id: "performance", label: "4. Student Performance", icon: Award },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveReport(id)}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${
              activeReport === id
                ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Report Content Container */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Compiling {activeReport.toUpperCase()} report...
        </div>
      ) : !data ? (
        <div className="p-12 text-center text-xs text-slate-400">Unable to load report data.</div>
      ) : (
        <div className="space-y-6">
          {/* Summary Metric Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Students</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{summary.totalStudents}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue Collected</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outstanding Debt</span>
              <p className="text-2xl font-black text-orange-600 mt-1">{formatCurrency(summary.totalOutstanding)}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Exam Pass Rate</span>
              <p className="text-2xl font-black text-purple-600 mt-1">{summary.passRate}%</p>
            </div>
          </div>

          {/* REPORT 1: STUDENT DISTRIBUTION */}
          {activeReport === "distribution" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Student Enrollment Breakdown</h3>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  Timeframe: {timeframe.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100">
                  <h4 className="text-xs font-bold text-orange-950">Driving Students</h4>
                  <p className="text-3xl font-black text-orange-600 mt-1">
                    {reports.studentDistribution.categories.DRIVING || 0}
                  </p>
                  <p className="text-[11px] text-orange-800/80 mt-1">Class B &amp; Motorcycle</p>
                </div>
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <h4 className="text-xs font-bold text-blue-950">Computer College</h4>
                  <p className="text-3xl font-black text-blue-600 mt-1">
                    {reports.studentDistribution.categories.COMPUTER || 0}
                  </p>
                  <p className="text-[11px] text-blue-800/80 mt-1">MS Office &amp; Accounting</p>
                </div>
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <h4 className="text-xs font-bold text-purple-950">Modern AI Training</h4>
                  <p className="text-3xl font-black text-purple-600 mt-1">
                    {reports.studentDistribution.categories.AI || 0}
                  </p>
                  <p className="text-[11px] text-purple-800/80 mt-1">Video &amp; Image Generation</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Candidate Name</th>
                      <th className="px-4 py-2.5">National ID</th>
                      <th className="px-4 py-2.5">NTSA PDL</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Campus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.studentDistribution.studentsList.map((s: any) => (
                      <tr key={s.id}>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {s.firstName} {s.lastName}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">{s.idNumber}</td>
                        <td className="px-4 py-3 font-mono text-emerald-700 font-bold">
                          {s.pdlNumber || "-"}
                        </td>
                        <td className="px-4 py-3">{s.licenseCategory}</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{s.branch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORT 2: PAYMENTS */}
          {activeReport === "payments" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Payments &amp; Revenue Collections</h3>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  Timeframe: {timeframe.toUpperCase()}
                </span>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(reports.payments.methodBreakdown).map(([method, amt]) => (
                  <div key={method} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {method.replace("_", " ")}
                    </span>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      {formatCurrency(amt as number)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">M-Pesa Reference</th>
                      <th className="px-4 py-2.5">Student</th>
                      <th className="px-4 py-2.5">Payment Method</th>
                      <th className="px-4 py-2.5">Amount</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.payments.transactions.map((p: any) => (
                      <tr key={p.id}>
                        <td className="px-4 py-3 text-slate-500">{formatDate(p.createdAt)}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">{p.transactionRef}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {p.student?.firstName} {p.student?.lastName}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{p.paymentMethod.replace("_", " ")}</td>
                        <td className="px-4 py-3 font-black text-slate-900">{formatCurrency(p.amount)}</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORT 3: PACKAGES */}
          {activeReport === "packages" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Packages Enrollment &amp; Yield</h3>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  Timeframe: {timeframe.toUpperCase()}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Package Program</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Tuition Fee</th>
                      <th className="px-4 py-2.5">Curriculum Hours</th>
                      <th className="px-4 py-2.5">Enrolled Candidates</th>
                      <th className="px-4 py-2.5 font-bold">Total Gross Yield</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.packages.map((pkg: any) => (
                      <tr key={pkg.id}>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{pkg.name}</td>
                        <td className="px-4 py-3.5 text-slate-600">{pkg.category}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">{formatCurrency(pkg.price)}</td>
                        <td className="px-4 py-3.5 text-slate-500">{pkg.totalHours} hrs</td>
                        <td className="px-4 py-3.5 font-bold text-orange-600">{pkg.enrolledCount} learners</td>
                        <td className="px-4 py-3.5 font-black text-slate-900">{formatCurrency(pkg.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORT 4: STUDENT PERFORMANCE */}
          {activeReport === "performance" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Student Performance &amp; Practical Competencies</h3>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  Timeframe: {timeframe.toUpperCase()}
                </span>
              </div>

              {/* Topic Averages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {reports.studentPerformance.topicAverages.map((t: any) => (
                  <div key={t.topic} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{t.topic}</h4>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-orange-600">{t.averageScore}%</span>
                      <span className="text-[11px] text-slate-400">({t.evaluationsCount} tests)</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Evaluation Log */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Candidate</th>
                      <th className="px-4 py-2.5">Practical Topic</th>
                      <th className="px-4 py-2.5">Score</th>
                      <th className="px-4 py-2.5">Result</th>
                      <th className="px-4 py-2.5">Examiner Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.studentPerformance.gradesList.map((g: any) => (
                      <tr key={g.id}>
                        <td className="px-4 py-3 text-slate-400">{formatDate(g.gradedAt)}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {g.student?.firstName} {g.student?.lastName}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">{g.topic}</td>
                        <td className="px-4 py-3 font-black text-slate-900">{g.score}%</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              g.status === "EXCELLENT"
                                ? "bg-purple-100 text-purple-800"
                                : g.status === "PASS"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {g.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs">{g.remarks || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
