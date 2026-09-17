"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { ShieldAlert, ArrowLeft, LogOut, Lock } from "lucide-react";

// Paths that any visitor (including unauthenticated) can view
const PUBLIC_PATHS = ["/login", "/register", "/practical-topics"];

// Exact prefixes strictly restricted to ADMIN
const ADMIN_ONLY_PREFIXES = [
  "/portal/admin",
  "/students",
  "/instructors",
  "/vehicles",
  "/billing",
  "/exams",
];

// Prefixes restricted to INSTRUCTOR (plus ADMIN)
const INSTRUCTOR_PREFIXES = ["/portal/instructor", "/schedule"];

// Prefixes restricted to STUDENT (plus ADMIN)
const STUDENT_PREFIXES = ["/portal/student"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { role, authUser, isAuthenticated, isLoading, logout } = useRole();
  const pathname = usePathname();
  const router = useRouter();
  const [deniedReason, setDeniedReason] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    // 1. Handle root path "/"
    if (pathname === "/") {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (role === "STUDENT") {
        router.replace("/portal/student");
      } else if (role === "INSTRUCTOR") {
        router.replace("/portal/instructor");
      }
      return;
    }

    // 2. Check if current path is public
    const isPublic = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    );

    if (isPublic) {
      setDeniedReason(null);
      return;
    }

    // 3. If not authenticated and trying to access a protected page
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 4. Role-based checks
    if (role === "STUDENT") {
      // Check if student is trying to access Admin or Instructor pages
      const isAdminRoute = ADMIN_ONLY_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
      );
      const isInstructorRoute = INSTRUCTOR_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
      );

      if (isAdminRoute) {
        setDeniedReason(
          "Student accounts are not authorized to access Academy Administration and management portals."
        );
        return;
      }

      if (isInstructorRoute) {
        setDeniedReason(
          "Student accounts are not authorized to access Instructor Gradebooks and teaching portals."
        );
        return;
      }
    }

    if (role === "INSTRUCTOR") {
      // Check if instructor is trying to access Admin pages
      const isAdminRoute = ADMIN_ONLY_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
      );
      const isStudentOnlyRoute = pathname.startsWith("/portal/student/payments") || pathname.startsWith("/portal/student/profile");

      if (isAdminRoute) {
        setDeniedReason(
          "Instructor accounts are not authorized to access Academy Administration or financial billing portals."
        );
        return;
      }

      if (isStudentOnlyRoute) {
        setDeniedReason(
          "Instructor accounts cannot access personal student financial and profile records."
        );
        return;
      }
    }

    // If authorized, clear any denial reason
    setDeniedReason(null);
  }, [pathname, role, isAuthenticated, isLoading, router]);

  // While checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // If access is denied, show the high-security barrier
  if (deniedReason) {
    const returnUrl =
      role === "STUDENT"
        ? "/portal/student"
        : role === "INSTRUCTOR"
        ? "/portal/instructor"
        : "/portal/admin";

    return (
      <div className="max-w-xl mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border-2 border-rose-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-rose-100 rounded-3xl mx-auto flex items-center justify-center text-rose-600 shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[11px] font-black tracking-wider uppercase text-rose-700">
            <Lock className="w-3.5 h-3.5" /> Access Restricted (403 Forbidden)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Unauthorized Portal Access
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            {deniedReason}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Active Account:</span>
            <span className="font-bold text-slate-800">{authUser?.name || "Candidate"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Account Role:</span>
            <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold uppercase text-[10px]">
              {role}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Attempted URL:</span>
            <span className="font-mono text-[11px] text-rose-600 truncate max-w-[240px]">
              {pathname}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setDeniedReason(null);
              router.push(returnUrl);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to My {role === "STUDENT" ? "Student" : role === "INSTRUCTOR" ? "Instructor" : "Admin"} Portal
          </button>
          <button
            onClick={() => {
              setDeniedReason(null);
              logout();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out of This Account
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
