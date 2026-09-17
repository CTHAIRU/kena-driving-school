"use client";

import { useEffect, useState } from "react";
import { Receipt, Download, Printer, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function StudentPaymentsPage() {
  const [student, setStudent] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile?role=STUDENT").then((r) => r.json()),
      fetch("/api/billing").then((r) => r.json()),
    ])
      .then(([studentData, billingData]) => {
        setStudent(studentData);
        const myPayments = (billingData.payments || []).filter(
          (p: any) => p.studentId === studentData?.id
        );
        setPayments(myPayments);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const balance = student?.balance || 0;
  const packagePrice = (student?.package?.price || totalPaid + balance);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Tuition Ledger &amp; Official Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Download your M-Pesa receipts, view billing statements, and check tuition clearance.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print Statement
        </button>
      </div>

      {/* Account Balance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Package Tuition
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatCurrency(packagePrice)}</p>
          <p className="text-xs text-slate-400 mt-1">{student?.package?.name || "Driving Package"}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Paid to Date
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-2">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-emerald-600/80 mt-1 font-semibold">{payments.length} Verified Payments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Outstanding Balance
          </span>
          <p className="text-2xl font-black text-orange-600 mt-2">{formatCurrency(balance)}</p>
          <p className="text-xs text-slate-400 mt-1">
            {balance === 0 ? "Account Fully Cleared" : "Pay via M-Pesa Till: 713449"}
          </p>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Payment History</h3>
          <span className="text-xs text-slate-400 font-mono">KENA / Thika Tabby House</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading ledger records...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No payments recorded yet. Record deposits at Tabby House reception or via M-Pesa.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Receipt / Date</th>
                  <th className="px-5 py-3">M-Pesa Reference</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">Receipt #{p.id.slice(-6).toUpperCase()}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(p.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {p.transactionRef}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {p.paymentMethod.replace("_", " ")}
                    </td>
                    <td className="px-5 py-3.5 font-black text-slate-900">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> COMPLETED
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedInvoice(p)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Downloadable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2.5 py-0.5 rounded-full">
                NTSA Approved Driving Institution
              </span>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide mt-2">
                KENA DRIVING SCHOOL &amp; COMPUTER COLLEGE
              </h2>
              <p className="text-xs text-slate-600 font-medium">Tabby House, 4th Floor, Room 72, Thika</p>
              <p className="text-[11px] text-slate-500">Tel: +254 713 449 911 • kenadrivingschool13@gmail.com</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Official Receipt:</span>
                <span className="font-mono font-bold text-slate-900">
                  #{selectedInvoice.id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">
                  {student?.firstName} {student?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student National ID:</span>
                <span className="font-mono text-slate-800">{student?.idNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">M-Pesa Reference:</span>
                <span className="font-mono font-bold text-emerald-700">{selectedInvoice.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course / Program:</span>
                <span className="text-slate-800">{student?.package?.name || "Driving Training"}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-3">
                <span className="font-bold text-slate-700 text-sm">Amount Paid:</span>
                <span className="font-black text-slate-900 text-base">
                  {formatCurrency(selectedInvoice.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Balance:</span>
                <span className="font-bold text-orange-600">{formatCurrency(balance)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 shadow-sm"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
