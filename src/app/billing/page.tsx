"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  FileText,
  Printer,
  X,
  Package as PackageIcon,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BillingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Record Payment Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [payStudentId, setPayStudentId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("MOBILE_MONEY");
  const [payRef, setPayRef] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState("");

  // Printable Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  const fetchBilling = async () => {
    try {
      const res = await fetch("/api/billing");
      const json = await res.json();
      setData(json);

      const stRes = await fetch("/api/students");
      const stJson = await stRes.json();
      setStudents(Array.isArray(stJson) ? stJson : []);
      if (stJson.length > 0 && !payStudentId) {
        setPayStudentId(stJson[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setPayError("");

    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: payStudentId,
          amount: parseFloat(payAmount),
          paymentMethod: payMethod,
          transactionRef: payRef,
          notes: payNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to process payment");
      }

      setIsPayModalOpen(false);
      setPayAmount("");
      setPayRef("");
      setPayNotes("");
      fetchBilling();
    } catch (err: any) {
      setPayError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, packages = [], payments = [], students: billingStudents = [] } = data || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Accounts</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Track student course invoices, deposits, installment balances, and printable receipts.
          </p>
        </div>

        <button
          onClick={() => setIsPayModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Student Payment</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Collected Revenue</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {formatCurrency(stats?.totalCollected || 0)}
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Confirmed payments</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Outstanding Balances</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {formatCurrency(stats?.totalOutstanding || 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Across active enrollments</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Course Packages</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">{packages.length}</p>
          <p className="text-xs text-blue-600 font-medium mt-1">Class A, B, & Refresher</p>
        </div>
      </div>

      {/* Course Packages Tier Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-100">
          <PackageIcon className="w-5 h-5 text-blue-600" /> Standard Course Packages
        </h3>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg: any) => (
            <div key={pkg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {pkg.category}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">{pkg.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-900">{formatCurrency(pkg.price)}</span>
                <span className="text-xs text-slate-500 font-medium">{pkg.totalHours} hours total</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Student Invoices & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Invoices / Balances */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <DollarSign className="w-5 h-5 text-amber-600" /> Student Account Balances
          </h3>

          <div className="space-y-3">
            {billingStudents.map((st: any) => (
              <div
                key={st.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">
                    {st.firstName} {st.lastName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Package: {st.package?.name || "Standard Course"}
                  </p>
                </div>

                <div className="text-right">
                  {st.balance > 0 ? (
                    <div>
                      <p className="font-bold text-amber-600">{formatCurrency(st.balance)}</p>
                      <button
                        onClick={() => {
                          setPayStudentId(st.id);
                          setPayAmount(st.balance.toString());
                          setIsPayModalOpen(true);
                        }}
                        className="text-[11px] font-semibold text-blue-600 hover:underline mt-0.5"
                      >
                        Settle Balance
                      </button>
                    </div>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      Fully Settled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions & Receipts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-emerald-600" /> Payment Transaction Log
          </h3>

          <div className="space-y-3">
            {payments.slice(0, 8).map((pay: any) => (
              <div
                key={pay.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    {pay.student?.firstName} {pay.student?.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {pay.paymentMethod.replace("_", " ")} • Ref: {pay.transactionRef}
                  </p>
                  <p className="text-[10px] text-slate-400">{formatDate(pay.createdAt)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{formatCurrency(pay.amount)}</span>
                  <button
                    onClick={() => setSelectedReceipt(pay)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-slate-200 transition-colors"
                    title="Print Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Record Student Payment</h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {payError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {payError}
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Student *</label>
                <select
                  required
                  value={payStudentId}
                  onChange={(e) => {
                    setPayStudentId(e.target.value);
                    const found = students.find((s) => s.id === e.target.value);
                    if (found && found.balance > 0) {
                      setPayAmount(found.balance.toString());
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (Bal: {formatCurrency(s.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment Amount (KSh) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="MOBILE_MONEY">Mobile Money (M-Pesa / Airtel)</option>
                  <option value="CREDIT_CARD">Credit / Debit Card</option>
                  <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                  <option value="CASH">Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Transaction Reference</label>
                <input
                  type="text"
                  placeholder="e.g. TXN-998822 or blank for auto-generate"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 2nd Installment payment"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-slate-800">
            <div className="text-center pb-6 border-b border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
                NTSA Approved Driving School
              </span>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide mt-2">
                KENA DRIVING SCHOOL &amp; COMPUTER COLLEGE
              </h2>
              <p className="text-xs text-slate-600 font-medium">Tabby House, 4th Floor, Room 72, Thika</p>
              <p className="text-[11px] text-slate-500">Tel: +254 713 449 911 • kenadrivingschool13@gmail.com</p>
              <div className="mt-2 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Receipt: #{selectedReceipt.id.slice(-6).toUpperCase()}</span>
                <span>M-Pesa Ref: {selectedReceipt.transactionRef}</span>
              </div>
            </div>

            <div className="py-6 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold">{formatDate(selectedReceipt.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-semibold">
                  {selectedReceipt.student?.firstName} {selectedReceipt.student?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold">{selectedReceipt.paymentMethod.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-bold">
                <span>Amount Paid:</span>
                <span className="text-emerald-600">{formatCurrency(selectedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Remaining Balance:</span>
                <span>{formatCurrency(selectedReceipt.student?.balance || 0)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Close
              </button>
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
