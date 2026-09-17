"use client";

import { useEffect, useState } from "react";
import { GraduationCap, KeyRound, ShieldCheck, Check, AlertCircle, Car } from "lucide-react";

export default function InstructorProfilePage() {
  const [instructor, setInstructor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile?role=INSTRUCTOR")
      .then((r) => r.json())
      .then((data) => {
        setInstructor(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (password.length < 6) {
      setStatusMsg({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    if (password !== confirmPassword) {
      setStatusMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "INSTRUCTOR",
          id: instructor?.id,
          newPassword: password,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "error", text: json.error || "Failed to update password." });
      } else {
        setStatusMsg({ type: "success", text: "Password updated successfully!" });
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Instructor Profile &amp; Credentials</h1>
        <p className="text-xs text-slate-500 mt-1">
          View your NTSA instructor accreditation, assigned dual-control vehicle, and manage portal security.
        </p>
      </div>

      {/* Read-Only Instructor Credentials */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-base">
            {instructor?.firstName?.[0]}
            {instructor?.lastName?.[0]}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {instructor?.firstName} {instructor?.lastName}
            </h3>
            <p className="text-xs text-slate-400">
              NTSA Certified Practical Examiner • KENA Driving School
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block font-medium">NTSA License Number</label>
            <p className="font-mono font-bold text-orange-600 mt-0.5">{instructor?.licenseNumber || "-"}</p>
          </div>
          <div>
            <label className="text-slate-400 block font-medium">Instructor Rating</label>
            <p className="font-bold text-slate-800 mt-0.5">⭐ {instructor?.rating || 4.9} / 5.0</p>
          </div>
          <div>
            <label className="text-slate-400 block font-medium">Email Address</label>
            <p className="font-bold text-slate-800 mt-0.5">{instructor?.email || "-"}</p>
          </div>
          <div>
            <label className="text-slate-400 block font-medium">Phone Number</label>
            <p className="font-bold text-slate-800 mt-0.5">{instructor?.phone || "-"}</p>
          </div>
          <div>
            <label className="text-slate-400 block font-medium">Specializations</label>
            <p className="font-bold text-slate-800 mt-0.5">{instructor?.specializations || "Manual & Highway"}</p>
          </div>
          <div>
            <label className="text-slate-400 block font-medium">Assigned Training Vehicle</label>
            <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
              {instructor?.vehicle
                ? `${instructor.vehicle.make} ${instructor.vehicle.model} (${instructor.vehicle.registrationPlate})`
                : "Toyota Yaris Dual-Control (KDA 102B)"}
            </p>
          </div>
        </div>
      </div>

      {/* Password Edit Section (Password Only requirement) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <KeyRound className="w-4 h-4 text-orange-600" />
          <h3 className="font-bold text-slate-900 text-sm">Update Instructor Password</h3>
        </div>

        {statusMsg && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {statusMsg.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
