"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Check, ArrowLeft, Car, Award, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

// Official 14 Driving Classes in required order
const DRIVING_CLASSES_ORDER = [
  "A1 - Light Motorcycle",
  "A2 - Motorcycle Taxi, Couriers and three-wheelers",
  "A3 -Motorcycle three-wheelers",
  "B1 - Light Automatic Vehicle",
  "B2 - Light Manual Vehicle",
  "B Professional",
  "C1 - Light Truck",
  "C - Medium Truck",
  "CE - Heavy Truck with trailer",
  "CD - Heavy Goods Vehicle for Transportation of Hazardous Materials",
  "D1 - Van (maximum of 14 passengers)",
  "D2 - Minibus (14 to 32 passengers)",
  "D3 - Large Bus (33 or more passengers)",
  "D4 - Articulated Bus",
];

export default function AdminAddStudentPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    admissionNumber: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    idNumber: "",
    pdlNumber: "",
    eCitizenRef: "",
    branch: "Tabby House, Thika",
    licenseCategory: "Category B - Light Vehicle",
    transmission: "MANUAL",
    packageId: "",
    customTuitionFee: "14500",
    instructorId: "",
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinRelation: "Parent",
    referralSource: "Google",
    notes: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/billing").then((r) => r.json()),
      fetch("/api/instructors").then((r) => r.json()),
    ]).then(([billingData, instData]) => {
      const pkgs = billingData.packages || [];
      setPackages(pkgs);
      setInstructors(Array.isArray(instData) ? instData : []);
      if (pkgs.length > 0) {
        const firstDriving = pkgs.find((p: any) => p.name === DRIVING_CLASSES_ORDER[0]);
        const initial = firstDriving || pkgs[0];
        setForm((prev) => ({
          ...prev,
          packageId: initial.id,
          customTuitionFee: String(initial.price),
          licenseCategory: initial.category,
        }));
      }
    });
  }, []);

  const handlePackageChange = (pkgId: string) => {
    const selected = packages.find((p) => p.id === pkgId);
    if (selected) {
      setForm((prev) => ({
        ...prev,
        packageId: pkgId,
        customTuitionFee: String(selected.price),
        licenseCategory: selected.category,
      }));
    } else {
      setForm((prev) => ({ ...prev, packageId: pkgId }));
    }
  };

  // Group and sort packages as requested
  const drivingPackages = packages
    .filter(
      (pkg) =>
        !pkg.name.toLowerCase().includes("computer") &&
        !pkg.name.toLowerCase().includes("artificial intelligence") &&
        !pkg.name.toLowerCase().includes("creative media") &&
        !pkg.name.toLowerCase().includes("modern ai")
    )
    .sort((a, b) => {
      const idxA = DRIVING_CLASSES_ORDER.findIndex((title) => a.name.startsWith(title) || a.name === title);
      const idxB = DRIVING_CLASSES_ORDER.findIndex((title) => b.name.startsWith(title) || b.name === title);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

  const computerPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes("computer")
  );

  const aiPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes("artificial intelligence") ||
      pkg.name.toLowerCase().includes("creative media") ||
      pkg.name.toLowerCase().includes("modern ai")
  );

  const selectedPkg = packages.find((p) => p.id === form.packageId);

  // Check if course is computer or AI only
  const isComputerOrAI =
    form.licenseCategory.toLowerCase().includes("computer") ||
    form.licenseCategory.toLowerCase().includes("ai") ||
    form.licenseCategory.toLowerCase().includes("artificial intelligence") ||
    (selectedPkg &&
      (selectedPkg.name.toLowerCase().includes("computer") ||
        selectedPkg.name.toLowerCase().includes("ai") ||
        selectedPkg.name.toLowerCase().includes("artificial intelligence")));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // If computer or AI only, transmission is NONE
          transmission: isComputerOrAI ? "NONE" : form.transmission,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to enroll student");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/students");
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/portal/admin"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Add Student &amp; Assign Course
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Register a candidate, feed custom offer fees, configure course &amp; transmission, and record emergency contacts.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Student enrolled successfully with admission number and ledger initialized! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* SECTION 1: CANDIDATE IDENTITY & ADMISSION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              1. Candidate Details &amp; Admission Number
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Manual Admission Allocation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Admission Number * (Fed Manually)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KNA-2026-089"
                value={form.admissionNumber}
                onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mary"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ndung'u"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">National ID / Passport No *</label>
              <input
                type="text"
                required
                placeholder="e.g. 38291044"
                value={form.idNumber}
                onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number (M-Pesa) *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +254 712 345 678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="candidate@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campus Location</label>
              <select
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              >
                <option value="Tabby House, Thika">Tabby House, Thika (Main)</option>
                <option value="Ananas Mall, Makongeni">Ananas Mall, Makongeni</option>
                <option value="Juja City Campus">Juja City Campus</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: SEPARATED COURSE PACKAGE & MANUAL FEE */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              2. Course Package &amp; Independent Tuition Fee
            </h3>
            <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Manual Offer / Custom Price Entry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Course Package *
              </label>
              <select
                value={form.packageId}
                onChange={(e) => handlePackageChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-orange-500"
              >
                {/* 1. Driving Classes in exact required order */}
                {drivingPackages.length > 0 && (
                  <optgroup label="🚗 Driving Classes">
                    {drivingPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* 2. Computer Packages */}
                {computerPackages.length > 0 && (
                  <optgroup label="💻 Computer College">
                    {computerPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* 3. Artificial Intelligence Masterclasses */}
                {aiPackages.length > 0 && (
                  <optgroup label="🤖 Artificial Intelligence">
                    {aiPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              {selectedPkg && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Catalogue standard: {formatCurrency(selectedPkg.price)} ({selectedPkg.category})
                </p>
              )}
            </div>

            {/* Independent Fee Field: Manually Fed */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tuition Fee (KSh) * <span className="text-orange-600 font-bold">[Feed Manually]</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                  KSh
                </span>
                <input
                  type="number"
                  step="100"
                  required
                  placeholder="e.g. 14500 (or custom offer price)"
                  value={form.customTuitionFee}
                  onChange={(e) => setForm({ ...form, customTuitionFee: e.target.value })}
                  className="w-full pl-12 pr-3.5 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-slate-900 font-black text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Adjust figures manually per institutional promotions, student discounts, or special group offers.
              </p>
            </div>
          </div>

          {/* GEAR TRANSMISSION: HIDDEN IF COMPUTER OR AI ONLY */}
          {!isComputerOrAI ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-800 text-xs">
                Gear Transmission Configuration *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "MANUAL", label: "Manual Dual-Control", sub: "Clutch & Stick Shift" },
                  { id: "AUTOMATIC", label: "Automatic Dual-Control", sub: "2-Pedal Drive" },
                  { id: "BOTH", label: "Both: Automatic & Manual", sub: "Dual Transmission Package" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm({ ...form, transmission: t.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.transmission === t.id
                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80"
                    }`}
                  >
                    <p className="font-bold text-xs">{t.label}</p>
                    <p
                      className={`text-[10px] mt-0.5 ${
                        form.transmission === t.id ? "text-orange-100" : "text-slate-400"
                      }`}
                    >
                      {t.sub}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-800">
              ℹ️ <strong>Computer / AI Enrolment:</strong> Vehicle gear transmission configuration is omitted for non-driving packages.
            </div>
          )}

          {/* Instructor & NTSA Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {selectedPkg?.category?.toUpperCase().includes("COMPUTER") || selectedPkg?.name?.toLowerCase().includes("computer")
                  ? "Assigned Computer Tutor"
                  : selectedPkg?.category?.toUpperCase().includes("AI") || selectedPkg?.name?.toLowerCase().includes("artificial intelligence") || selectedPkg?.name?.toLowerCase().includes("ai")
                  ? "Assigned AI Tutor"
                  : "Assigned Driving Instructor"}
              </label>
              <select
                value={form.instructorId}
                onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Assign Later --</option>
                
                {/* Driving Instructors */}
                <optgroup label="🚗 Driving Instructors">
                  {instructors
                    .filter((inst) => inst.category === "DRIVING" || !inst.category)
                    .map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.firstName} {inst.lastName} ({inst.specializations || "Driving"})
                      </option>
                    ))}
                </optgroup>

                {/* Computer Tutors */}
                <optgroup label="💻 Computer Tutors">
                  {instructors
                    .filter((inst) => inst.category === "COMPUTER")
                    .map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.firstName} {inst.lastName} ({inst.labStation || "Computer Lab"})
                      </option>
                    ))}
                </optgroup>

                {/* AI Tutors */}
                <optgroup label="🤖 Modern AI Tutors">
                  {instructors
                    .filter((inst) => inst.category === "AI")
                    .map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.firstName} {inst.lastName} ({inst.labStation || "AI Suite"})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NTSA PDL Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. PDL-2026-9901"
                value={form.pdlNumber}
                onChange={(e) => setForm({ ...form, pdlNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                eCitizen Application Ref
              </label>
              <input
                type="text"
                placeholder="e.g. EC-NTSA-88401"
                value={form.eCitizenRef}
                onChange={(e) => setForm({ ...form, eCitizenRef: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: NEXT OF KIN & HOW YOU FOUND US */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              3. Next of Kin, Contacts &amp; Referral Source
            </h3>
            <span className="text-[11px] text-slate-400">Emergency &amp; Marketing Tracking</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Next of Kin Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Grace Wanjiru"
                value={form.nextOfKinName}
                onChange={(e) => setForm({ ...form, nextOfKinName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Next of Kin Phone *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +254 722 000 000"
                value={form.nextOfKinPhone}
                onChange={(e) => setForm({ ...form, nextOfKinPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Relationship *</label>
              <select
                value={form.nextOfKinRelation}
                onChange={(e) => setForm({ ...form, nextOfKinRelation: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              >
                <option value="Parent">Parent</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Guardian">Guardian</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* HOW YOU FOUND US: DROPDOWN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                How you found us * (Referral Channel)
              </label>
              <select
                value={form.referralSource}
                onChange={(e) => setForm({ ...form, referralSource: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-orange-500"
              >
                <option value="Google">Google</option>
                <option value="Former student">Former student</option>
                <option value="Friend">Friend</option>
                <option value="Facebook">Facebook</option>
                <option value="Tiktok">Tiktok</option>
                <option value="Instagram">Instagram</option>
                <option value="x">x (Twitter)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
              <input
                type="text"
                placeholder="Any candidate requests, medical conditions, or shift preferences"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/portal/admin"
            className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? "Enrolling..." : "Enroll Student & Create Ledger"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
