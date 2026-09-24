"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Check, ArrowLeft, Car, Award, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
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
  const [errorField, setErrorField] = useState<string | null>(null);
  const [suggestedAdm, setSuggestedAdm] = useState("");
  const [loadingAdm, setLoadingAdm] = useState(false);
  const [success, setSuccess] = useState(false);

  // Separated Course Selections
  const [drivingPackageId, setDrivingPackageId] = useState("");
  const [collegeTrack, setCollegeTrack] = useState<"" | "COMPUTER" | "AI" | "BOTH">("");
  const [collegeTutorId, setCollegeTutorId] = useState("");

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
    licenseCategory: "B2 - Light Manual Vehicle",
    transmission: "MANUAL",
    customTuitionFee: "14500",
    instructorId: "",
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinRelation: "Parent",
    referralSource: "Google",
    notes: "",
  });

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

  const computerPkg = packages.find((pkg) =>
    pkg.name.toLowerCase().includes("computer")
  );

  const aiPkg = packages.find(
    (pkg) =>
      pkg.name.toLowerCase().includes("artificial intelligence") ||
      pkg.name.toLowerCase().includes("creative media") ||
      pkg.name.toLowerCase().includes("modern ai")
  );

  const fetchNextAdm = async () => {
    try {
      setLoadingAdm(true);
      const res = await fetch("/api/students/next-admission");
      const json = await res.json();
      if (json.nextAdmissionNumber) {
        setSuggestedAdm(json.nextAdmissionNumber);
        setForm((prev) => {
          if (!prev.admissionNumber || prev.admissionNumber.startsWith("KNA-")) {
            return { ...prev, admissionNumber: json.nextAdmissionNumber };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Failed to fetch next admission number:", err);
    } finally {
      setLoadingAdm(false);
    }
  };

  useEffect(() => {
    fetchNextAdm();
    Promise.all([
      fetch("/api/billing").then((r) => r.json()),
      fetch("/api/instructors").then((r) => r.json()),
    ]).then(([billingData, instData]) => {
      const pkgs = billingData.packages || [];
      setPackages(pkgs);
      setInstructors(Array.isArray(instData) ? instData : []);
      if (pkgs.length > 0) {
        const sortedDriving = pkgs
          .filter(
            (pkg: any) =>
              !pkg.name.toLowerCase().includes("computer") &&
              !pkg.name.toLowerCase().includes("artificial intelligence") &&
              !pkg.name.toLowerCase().includes("creative media") &&
              !pkg.name.toLowerCase().includes("modern ai")
          )
          .sort((a: any, b: any) => {
            const idxA = DRIVING_CLASSES_ORDER.findIndex((title) => a.name.startsWith(title) || a.name === title);
            const idxB = DRIVING_CLASSES_ORDER.findIndex((title) => b.name.startsWith(title) || b.name === title);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.name.localeCompare(b.name);
          });

        const initial =
          sortedDriving.find((p: any) => p.name.startsWith("B2") || p.name.includes("B2")) ||
          sortedDriving[0];

        if (initial) {
          setDrivingPackageId(initial.id);
          setForm((prev) => ({
            ...prev,
            customTuitionFee: String(initial.price),
            licenseCategory: initial.name,
          }));
        }
      }
    });
  }, []);

  const recalculateFee = (newDrivingId: string, newCollegeTrack: "" | "COMPUTER" | "AI" | "BOTH") => {
    const selectedDriving = drivingPackages.find((p) => p.id === newDrivingId);
    const drivingFee = selectedDriving ? selectedDriving.price : 0;
    const compFee = newCollegeTrack === "COMPUTER" || newCollegeTrack === "BOTH" ? (computerPkg?.price || 6000) : 0;
    const aiFee = newCollegeTrack === "AI" || newCollegeTrack === "BOTH" ? (aiPkg?.price || 10000) : 0;
    const total = drivingFee + compFee + aiFee;

    setForm((prev) => ({
      ...prev,
      customTuitionFee: String(total),
    }));
  };

  const handleDrivingChange = (newDrivingId: string) => {
    setDrivingPackageId(newDrivingId);
    recalculateFee(newDrivingId, collegeTrack);
  };

  const handleCollegeChange = (newCollegeTrack: "" | "COMPUTER" | "AI" | "BOTH") => {
    setCollegeTrack(newCollegeTrack);
    recalculateFee(drivingPackageId, newCollegeTrack);
  };

  const selectedDrivingPkg = drivingPackages.find((p) => p.id === drivingPackageId);
  const hasDriving = Boolean(drivingPackageId);
  const hasComputer = collegeTrack === "COMPUTER" || collegeTrack === "BOTH";
  const hasAI = collegeTrack === "AI" || collegeTrack === "BOTH";
  const hasCollege = hasComputer || hasAI;
  const isComputerOrAIOnly = !hasDriving && hasCollege;

  const drivingFee = selectedDrivingPkg ? selectedDrivingPkg.price : 0;
  const compFee = hasComputer ? (computerPkg?.price || 6000) : 0;
  const aiFee = hasAI ? (aiPkg?.price || 10000) : 0;
  const catalogueSum = drivingFee + compFee + aiFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasDriving && !hasCollege) {
      setError("Please select at least one course: a Driving Course Package, or a Computer / AI College Track.");
      return;
    }

    setSubmitting(true);
    setError("");
    setErrorField(null);

    try {
      // Build composite category name
      let fullCategory = "";
      if (hasDriving && hasCollege) {
        const collegeName =
          collegeTrack === "BOTH"
            ? "Computer Packages & AI Masterclasses"
            : collegeTrack === "COMPUTER"
            ? "Computer Packages Certification"
            : "Artificial Intelligence Masterclasses";
        fullCategory = `${selectedDrivingPkg?.name || "Driving"} + ${collegeName}`;
      } else if (hasDriving) {
        fullCategory = selectedDrivingPkg?.name || "Driving";
      } else {
        fullCategory =
          collegeTrack === "BOTH"
            ? "Computer Packages Certification + AI Masterclasses"
            : collegeTrack === "COMPUTER"
            ? "Computer Packages Certification (10 Modules)"
            : "Artificial Intelligence masterclasses";
      }

      const collegePackageId =
        collegeTrack === "COMPUTER" || collegeTrack === "BOTH"
          ? computerPkg?.id
          : collegeTrack === "AI"
          ? aiPkg?.id
          : null;

      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          drivingPackageId: drivingPackageId || null,
          collegePackageId,
          collegeTrack,
          collegeTutorId: collegeTutorId || null,
          licenseCategory: fullCategory,
          packageId: drivingPackageId || collegePackageId || null,
          transmission: hasDriving ? form.transmission : "NONE",
          pdlNumber: hasDriving ? form.pdlNumber : null,
          eCitizenRef: hasDriving ? form.eCitizenRef : null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.field) {
          setErrorField(json.field);
          if (json.field === "admissionNumber") {
            fetchNextAdm();
          }
        }
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
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900">Registration Conflict</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
          {errorField === "admissionNumber" && suggestedAdm && (
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, admissionNumber: suggestedAdm }));
                setError("");
                setErrorField(null);
              }}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Use Available Number ({suggestedAdm})
            </button>
          )}
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
            <span className="text-[11px] text-slate-400 font-mono">Sequential or Manual Ledger</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">
                  Admission Number *
                </label>
                <button
                  type="button"
                  onClick={fetchNextAdm}
                  disabled={loadingAdm}
                  className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingAdm ? "animate-spin" : ""}`} />
                  {loadingAdm ? "Checking..." : "Auto-Generate"}
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. KNA-2026-010"
                value={form.admissionNumber}
                onChange={(e) => {
                  setForm({ ...form, admissionNumber: e.target.value });
                  if (errorField === "admissionNumber") setErrorField(null);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-mono font-bold focus:outline-none transition-colors ${
                  errorField === "admissionNumber"
                    ? "bg-rose-50 border-2 border-rose-500 text-rose-900"
                    : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-orange-500"
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Suggested sequential: <span className="font-mono font-bold text-slate-600">{suggestedAdm || "KNA-..."}</span> (or enter manual book ledger number)
              </p>
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
                onChange={(e) => {
                  setForm({ ...form, idNumber: e.target.value });
                  if (errorField === "idNumber") setErrorField(null);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none transition-colors ${
                  errorField === "idNumber"
                    ? "bg-rose-50 border-2 border-rose-500 text-rose-900"
                    : "bg-slate-50 border border-slate-200 focus:border-orange-500"
                }`}
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
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errorField === "email") setErrorField(null);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none transition-colors ${
                  errorField === "email"
                    ? "bg-rose-50 border-2 border-rose-500 text-rose-900"
                    : "bg-slate-50 border border-slate-200 focus:border-orange-500"
                }`}
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

        {/* SECTION 2: SEPARATED COURSE PACKAGES & INDEPENDENT TUITION FEE */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              2. Select Course Packages &amp; Independent Tuition Fee
            </h3>
            <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Manual Offer / Custom Price Entry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* DROPDOWN 1: DRIVING COURSE PACKAGE */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-orange-600" />
                  <span>Driving Course Package</span>
                </label>
                <span className="text-[10px] font-medium text-slate-400">14 NTSA Classes</span>
              </div>
              <select
                value={drivingPackageId}
                onChange={(e) => handleDrivingChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-orange-500"
              >
                <option value="">-- None / Not Enrolled in Driving Lessons --</option>
                <optgroup label="🚗 Official NTSA Driving Classes (A1 to D4)">
                  {drivingPackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — {formatCurrency(pkg.price)}
                    </option>
                  ))}
                </optgroup>
              </select>
              {selectedDrivingPkg ? (
                <p className="text-[11px] text-slate-500 mt-1">
                  Driving: <span className="font-semibold text-slate-700">{selectedDrivingPkg.name}</span> ({formatCurrency(selectedDrivingPkg.price)})
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  No driving lessons selected for this candidate.
                </p>
              )}
            </div>

            {/* DROPDOWN 2: COMPUTER PACKAGES & AI MASTERCLASSES */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Computer Packages &amp; AI Masterclasses</span>
                </label>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  College Track
                </span>
              </div>
              <select
                value={collegeTrack}
                onChange={(e) => handleCollegeChange(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-orange-500"
              >
                <option value="">-- None (No Computer or AI Enrolment) --</option>
                <option value="COMPUTER">
                  💻 Computer Packages Certification (10 Modules) — KSh 6,000
                </option>
                <option value="AI">
                  🤖 Artificial Intelligence Masterclasses — KSh 10,000
                </option>
                <option value="BOTH">
                  🚀 Both: Computer Packages &amp; AI Masterclasses (Dual Certification) — KSh 16,000
                </option>
              </select>
              {hasCollege ? (
                <p className="text-[11px] text-blue-700 font-medium mt-1">
                  {collegeTrack === "BOTH"
                    ? "Enrolled in both 10 Computer Modules + 9 AI Masterclass Topics"
                    : collegeTrack === "COMPUTER"
                    ? "Enrolled in 10 Computer Modules Certification (KSh 6,000)"
                    : "Enrolled in 9 AI Masterclass Topics Certification (KSh 10,000)"}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  No computer or AI college courses selected.
                </p>
              )}
            </div>
          </div>

          {/* INDEPENDENT TUITION FEE FIELD */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs items-center">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tuition Fee (KSh) * <span className="text-orange-600 font-extrabold">[Feed Manually]</span>
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
                    className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-slate-900 font-black text-sm focus:outline-none focus:border-orange-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="text-xs">
                <span className="text-slate-500 font-medium block mb-1">Catalogue Standard Reference:</span>
                {hasDriving && hasCollege ? (
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-slate-700">
                    <span className="font-bold text-slate-900 block text-xs">
                      Standard Sum: {formatCurrency(catalogueSum)}
                    </span>
                    <span>
                      Driving ({formatCurrency(selectedDrivingPkg?.price || 0)}) +{" "}
                      {collegeTrack === "BOTH"
                        ? "Computer (KSh 6,000) & AI (KSh 10,000)"
                        : collegeTrack === "COMPUTER"
                        ? "Computer Packages (KSh 6,000)"
                        : "AI Masterclasses (KSh 10,000)"}
                    </span>
                  </div>
                ) : hasDriving ? (
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-slate-700">
                    <span className="font-bold text-slate-900 block text-xs">
                      Standard Fee: {formatCurrency(selectedDrivingPkg?.price || 0)}
                    </span>
                    <span>{selectedDrivingPkg?.name}</span>
                  </div>
                ) : hasCollege ? (
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-slate-700">
                    <span className="font-bold text-slate-900 block text-xs">
                      Standard Fee: {formatCurrency(catalogueSum)}
                    </span>
                    <span>
                      {collegeTrack === "BOTH"
                        ? "Computer Packages (KSh 6,000) + AI Masterclasses (KSh 10,000)"
                        : collegeTrack === "COMPUTER"
                        ? "Computer Packages Certification (10 Modules)"
                        : "Artificial Intelligence Masterclasses"}
                    </span>
                  </div>
                ) : (
                  <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200 text-[11px] text-rose-600 font-medium">
                    ⚠️ Select a Driving course or Computer/AI package above.
                  </div>
                )}
                <p className="text-[10px] text-slate-400 mt-1">
                  Adjust figures manually per institutional promotions, student discounts, or special group offers.
                </p>
              </div>
            </div>
          </div>

          {/* GEAR TRANSMISSION: VISIBLE ONLY IF DRIVING IS ENROLLED */}
          {hasDriving ? (
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
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 flex items-center gap-2">
              <span>ℹ️</span>
              <span>
                <strong>Non-driving Enrolment:</strong> Vehicle gear transmission configuration is omitted for Computer Packages and AI Masterclasses.
              </span>
            </div>
          )}

          {/* INSTRUCTOR / TUTOR ASSIGNMENT & NTSA CREDENTIALS */}
          {hasDriving ? (
            // Student is taking Driving (or Driving + College)
            hasCollege ? (
              // Dual / Triple Enrollment: show Driving Instructor + College Tutor + NTSA fields
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Assigned Driving Instructor
                    </label>
                    <select
                      value={form.instructorId}
                      onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="">-- Assign Later --</option>
                      <optgroup label="🚗 Driving Instructors">
                        {instructors
                          .filter((inst) => inst.category === "DRIVING" || !inst.category)
                          .map((inst) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.firstName} {inst.lastName} ({inst.specializations || "Driving"})
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Assigned Computer / AI Tutor
                    </label>
                    <select
                      value={collegeTutorId}
                      onChange={(e) => setCollegeTutorId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="">-- Assign Later --</option>
                      {(collegeTrack === "COMPUTER" || collegeTrack === "BOTH") && (
                        <optgroup label="💻 Computer Tutors">
                          {instructors
                            .filter((inst) => inst.category === "COMPUTER")
                            .map((inst) => (
                              <option key={inst.id} value={inst.id}>
                                {inst.firstName} {inst.lastName} ({inst.labStation || "Computer Lab"})
                              </option>
                            ))}
                        </optgroup>
                      )}
                      {(collegeTrack === "AI" || collegeTrack === "BOTH") && (
                        <optgroup label="🤖 AI Tutors">
                          {instructors
                            .filter((inst) => inst.category === "AI")
                            .map((inst) => (
                              <option key={inst.id} value={inst.id}>
                                {inst.firstName} {inst.lastName} ({inst.labStation || "AI Suite"})
                              </option>
                            ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                    <p className="text-[10px] text-slate-400 mt-0.5">Applies to the Driving component only.</p>
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
                    <p className="text-[10px] text-slate-400 mt-0.5">Applies to the Driving component only.</p>
                  </div>
                </div>
              </div>
            ) : (
              // Driving Only: show Driving Instructor + NTSA fields
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned Driving Instructor
                  </label>
                  <select
                    value={form.instructorId}
                    onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Assign Later --</option>
                    <optgroup label="🚗 Driving Instructors">
                      {instructors
                        .filter((inst) => inst.category === "DRIVING" || !inst.category)
                        .map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {inst.firstName} {inst.lastName} ({inst.specializations || "Driving"})
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
            )
          ) : (
            // Non-driving Enrolment (Computer / AI only):
            // NTSA PDL and eCitizen Ref are NOT REQUIRED and are completely omitted!
            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Non-driving Enrolment:</strong> The section for <strong>NTSA PDL Number</strong> and <strong>eCitizen Application Ref</strong> is <strong>not required</strong> for Computer Packages and AI Masterclasses.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {collegeTrack === "COMPUTER"
                      ? "Assigned Computer Tutor"
                      : collegeTrack === "AI"
                      ? "Assigned AI Tutor"
                      : "Assigned College Lead Tutor"}
                  </label>
                  <select
                    value={collegeTutorId || form.instructorId}
                    onChange={(e) => {
                      setCollegeTutorId(e.target.value);
                      setForm({ ...form, instructorId: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Assign Later --</option>
                    {(collegeTrack === "COMPUTER" || collegeTrack === "BOTH") && (
                      <optgroup label="💻 Computer Tutors">
                        {instructors
                          .filter((inst) => inst.category === "COMPUTER")
                          .map((inst) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.firstName} {inst.lastName} ({inst.labStation || "Computer Lab"})
                            </option>
                          ))}
                      </optgroup>
                    )}
                    {(collegeTrack === "AI" || collegeTrack === "BOTH") && (
                      <optgroup label="🤖 Modern AI Tutors">
                        {instructors
                          .filter((inst) => inst.category === "AI")
                          .map((inst) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.firstName} {inst.lastName} ({inst.labStation || "AI Suite"})
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}
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
