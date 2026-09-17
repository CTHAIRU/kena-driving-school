"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRole, type Role } from "@/context/RoleContext";
import {
  Shield,
  GraduationCap,
  User,
  KeyRound,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  LogOut,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { authUser, isAuthenticated, login, logout } = useRole();

  const [selectedRole, setSelectedRole] = useState<Role>("ADMIN");
  const [email, setEmail] = useState("admin@kenadrivingschool.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setError("");
    if (role === "ADMIN") {
      setEmail("admin@kenadrivingschool.com");
      setPassword("admin123");
    } else if (role === "INSTRUCTOR") {
      setEmail("marcus.k@kenadrivingschool.com");
      setPassword("instructor123");
    } else {
      setEmail("alice.wanjiru@gmail.com");
      setPassword("student123");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Update active authenticated user context
      login(data.user, data.redirectUrl || `/portal/${selectedRole.toLowerCase()}`);
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (role: Role) => {
    const demoUser =
      role === "ADMIN"
        ? {
            id: "admin-master",
            name: "Tabby House Admin Desk",
            email: "admin@kenadrivingschool.com",
            role: "ADMIN" as Role,
          }
        : role === "INSTRUCTOR"
        ? {
            id: "ins-marcus",
            name: "Marcus Kariuki",
            email: "marcus.k@kenadrivingschool.com",
            role: "INSTRUCTOR" as Role,
            licenseNumber: "INS-2026-042",
          }
        : {
            id: "cmtr1130i000jo33dmbf958dc",
            name: "Alice Wanjiru",
            email: "alice.wanjiru@gmail.com",
            role: "STUDENT" as Role,
            admissionNumber: "KNA-2026-001",
          };

    login(demoUser);
  };

  // If already authenticated, show the active session barrier to prevent unauthorized switching
  if (isAuthenticated && authUser) {
    const portalUrl =
      authUser.role === "STUDENT"
        ? "/portal/student"
        : authUser.role === "INSTRUCTOR"
        ? "/portal/instructor"
        : "/portal/admin";

    return (
      <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Active Account Session
            </h1>
            <p className="text-xs text-slate-500">
              You are currently signed into an active {authUser.role.toLowerCase()} account.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">User:</span>
              <span className="font-bold text-slate-900">{authUser.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Email:</span>
              <span className="text-slate-700 font-mono text-[11px]">{authUser.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Role:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  authUser.role === "STUDENT"
                    ? "bg-emerald-100 text-emerald-800"
                    : authUser.role === "INSTRUCTOR"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {authUser.role}
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl text-left leading-relaxed">
            {authUser.role === "STUDENT" ? (
              <p>
                ⚠️ <strong>Security Notice:</strong> As a student, you cannot access Administrator or Instructor portals. To sign into an Admin or Instructor account, you must first log out of this student account.
              </p>
            ) : authUser.role === "INSTRUCTOR" ? (
              <p>
                ⚠️ <strong>Security Notice:</strong> As an instructor, you cannot access Administrator management pages. To switch accounts, please log out first.
              </p>
            ) : (
              <p>
                You are currently signed in as Administrator. To access instructor or student portals with candidate credentials, please log out.
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => router.push(portalUrl)}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to My {authUser.role === "STUDENT" ? "Student" : authUser.role === "INSTRUCTOR" ? "Instructor" : "Admin"} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Log Out of Current Session</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 mx-auto flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/20">
            K
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            KENA School Portals Login
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your student, instructor, or administrator account.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
          {(
            [
              { key: "ADMIN", label: "Admin", icon: Shield },
              { key: "INSTRUCTOR", label: "Instructor", icon: GraduationCap },
              { key: "STUDENT", label: "Student", icon: User },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleRoleChange(key as Role)}
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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address / Staff Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@kenadrivingschool.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <span className="text-[11px] text-slate-400">Default in seed: role123</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In to {selectedRole} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Create Account Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link
              href={`/register?role=${selectedRole}`}
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Create {selectedRole.toLowerCase()} account
            </Link>
          </p>
        </div>

        {/* 1-Click Instant Demo Access */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-2">
            Instant Test Access
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              onClick={() => quickDemoLogin("ADMIN")}
              className="p-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-700 font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              ⚡ Superadmin
            </button>
            <button
              onClick={() => quickDemoLogin("INSTRUCTOR")}
              className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              ⚡ Instructor
            </button>
            <button
              onClick={() => quickDemoLogin("STUDENT")}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              ⚡ Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
