"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRole, type Role } from "@/context/RoleContext";
import {
  Shield,
  GraduationCap,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useRole();

  const queryRole = (searchParams.get("role")?.toUpperCase() as Role) || "STUDENT";
  const [selectedRole, setSelectedRole] = useState<Role>(queryRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    // Shared
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Student fields
    admissionNumber: "",
    dateOfBirth: "",
    idNumber: "",
    licenseCategory: "Category B - Light Vehicle",
    transmission: "MANUAL",
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinRelation: "Parent",
    referralSource: "Google",

    // Instructor fields
    licenseNumber: "",
    category: "Category B - Light Vehicle",
  });

  useEffect(() => {
    if (queryRole) setSelectedRole(queryRole);
  }, [queryRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(`Account for ${selectedRole} created successfully! Redirecting...`);
      if (data.user) {
        login(data.user, data.redirectUrl || `/portal/${selectedRole.toLowerCase()}`);
      } else {
        setTimeout(() => {
          router.push(data.redirectUrl || `/portal/${selectedRole.toLowerCase()}`);
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const isDrivingCategory =
    formData.licenseCategory.includes("Category B") ||
    formData.licenseCategory.includes("Category A");

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-xl w-full p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create KENA School Account
          </h1>
          <p className="text-xs text-slate-500">
            Register as a Student, Certified Instructor, or Academy Administrator.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
          {(
            [
              { key: "STUDENT", label: "Student", icon: User },
              { key: "INSTRUCTOR", label: "Instructor", icon: GraduationCap },
              { key: "ADMIN", label: "Admin", icon: Shield },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedRole(key as Role);
                setError("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all ${
                selectedRole === key
                  ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* ADMIN FORM */}
          {selectedRole === "ADMIN" && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Administrator Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Mwangi (Director Desk)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Staff Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@kenadrivingschool.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Direct Phone</label>
                  <input
                    type="tel"
                    placeholder="+254 713 449 911"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* INSTRUCTOR FORM */}
          {selectedRole === "INSTRUCTOR" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Kariuki"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="marcus@kenadrivingschool.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 722 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NTSA License Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NTSA-INS-8842"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, licenseNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teaching Stream</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="Category B - Light Vehicle">Category B (Light Vehicle)</option>
                    <option value="Category A - Motorcycle">Category A (Motorcycle)</option>
                    <option value="Computer & AI Packages">Computer &amp; AI Packages</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STUDENT FORM */}
          {selectedRole === "STUDENT" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Alice"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Wanjiru"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Manual Admission Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KNA-2026-081"
                    value={formData.admissionNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, admissionNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="alice@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 701 112 233"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">National ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="38291044"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              {/* Course Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Program *</label>
                <select
                  value={formData.licenseCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseCategory: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="Category B - Light Vehicle">Category B (Light Vehicle)</option>
                  <option value="Category A - Motorcycle">Category A (Motorcycle)</option>
                  <option value="Computer College Packages">Computer College Packages</option>
                  <option value="Modern AI Tools">Modern AI Tools &amp; Automation</option>
                </select>
              </div>

              {/* Transmission (Hidden for Computer / AI only) */}
              {isDrivingCategory && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gear Transmission Option *
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) =>
                      setFormData({ ...formData, transmission: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="MANUAL">Manual Dual-Control</option>
                    <option value="AUTOMATIC">Automatic Dual-Control</option>
                    <option value="BOTH">Both: Automatic &amp; Manual</option>
                  </select>
                </div>
              )}

              {/* Next of Kin & Contacts */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Next of Kin &amp; Emergency Contacts
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Next of Kin Name *"
                    value={formData.nextOfKinName}
                    onChange={(e) =>
                      setFormData({ ...formData, nextOfKinName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Contact Phone *"
                    value={formData.nextOfKinPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, nextOfKinPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs"
                  />
                  <select
                    value={formData.nextOfKinRelation}
                    onChange={(e) =>
                      setFormData({ ...formData, nextOfKinRelation: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs"
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

              {/* How You Found Us Dropdown */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  How you found us *
                </label>
                <select
                  value={formData.referralSource}
                  onChange={(e) =>
                    setFormData({ ...formData, referralSource: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="Google">Google Search</option>
                  <option value="Former student">Former student</option>
                  <option value="Friend">Friend</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Tiktok">Tiktok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="x">x (Twitter)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-4"
          >
            {loading ? "Creating Account..." : `Complete ${selectedRole} Registration`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400">Loading registration...</div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
