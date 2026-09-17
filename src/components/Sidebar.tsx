"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Car,
  Calendar,
  CreditCard,
  ChevronRight,
  MessageSquare,
  MapPin,
  BookOpen,
  FileText,
  Receipt,
  UserCheck,
  ClipboardCheck,
  BarChart3,
  FileUp,
  UserPlus,
  FileCheck2,
  Compass,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { role, authUser, isAuthenticated, logout } = useRole();

  // Dynamic Navigation Menus tailored to each quotation role
  const getNavItems = () => {
    if (role === "STUDENT") {
      return [
        { name: "My Dashboard", href: "/portal/student", icon: LayoutDashboard },
        { name: "Practical Sheet (25)", href: "/portal/student/practical-sheet", icon: FileCheck2 },
        { name: "Practical Topics", href: "/practical-topics", icon: Compass },
        { name: "My Courses", href: "/portal/student/courses", icon: BookOpen },
        { name: "Course Content", href: "/portal/student/content", icon: FileText },
        { name: "Payments & Invoices", href: "/portal/student/payments", icon: Receipt },
        { name: "Profile & Password", href: "/portal/student/profile", icon: UserCheck },
      ];
    }

    if (role === "INSTRUCTOR") {
      return [
        { name: "Instructor Dashboard", href: "/portal/instructor", icon: LayoutDashboard },
        { name: "Sign Practical Sheet", href: "/portal/instructor/gradebook?tab=practical-sheet", icon: FileCheck2 },
        { name: "25 Lesson Guides", href: "/practical-topics", icon: Compass },
        { name: "All Students", href: "/portal/instructor/students", icon: Users },
        { name: "Practical Gradebook", href: "/portal/instructor/gradebook", icon: ClipboardCheck },
        { name: "Profile & Password", href: "/portal/instructor/profile", icon: UserCheck },
      ];
    }

    // Default: ADMIN / SUPERADMIN
    return [
      { name: "Admin Dashboard", href: "/portal/admin", icon: LayoutDashboard },
      { name: "All Students", href: "/students", icon: Users },
      { name: "Add Student", href: "/portal/admin/add-student", icon: UserPlus },
      { name: "25 Practical Topics", href: "/practical-topics", icon: FileCheck2 },
      { name: "Add Instructor", href: "/instructors", icon: GraduationCap },
      { name: "Manage Content", href: "/portal/admin/content", icon: FileUp },
      { name: "Payments & Approvals", href: "/billing", icon: CreditCard },
      { name: "School Reports (4)", href: "/portal/admin/reports", icon: BarChart3 },
      { name: "Fleet & Vehicles", href: "/vehicles", icon: Car },
      { name: "Lesson Schedule", href: "/schedule", icon: Calendar },
    ];
  };

  const navigation = getNavItems();

  const getPortalLabel = () => {
    switch (role) {
      case "STUDENT":
        return "Student Portal";
      case "INSTRUCTOR":
        return "Instructor Portal";
      default:
        return "Superadmin Portal";
    }
  };

  return (
    <aside className="hidden md:flex w-64 bg-slate-950 text-white flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800/80 bg-slate-900/60">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 font-black text-lg">
          K
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-wide text-white leading-tight">
            KENA <span className="text-orange-500">DRIVING</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium leading-tight">
            &amp; Computer College
          </p>
          <p className="text-[9px] text-orange-400/90 font-semibold tracking-wider uppercase mt-0.5">
            Thika Campus
          </p>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-orange-950/40 border border-orange-800/40 text-[11px]">
          <span className="font-bold text-orange-400 uppercase tracking-wider">{getPortalLabel()}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                isActive
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/25"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-orange-400"
                )}
              />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-orange-200" />}
            </Link>
          );
        })}

        {/* Location & WhatsApp Help Card */}
        <div className="pt-4 px-3">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Tabby House, 4th Flr, Rm 72</span>
            </div>
            <a
              href="https://wa.me/254713449911"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] transition-colors shadow-sm"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp Official Help</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Compliance / Status footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3">
        {isAuthenticated && (
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer shadow-xs group"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 transition-colors" />
            <span>Sign Out ({authUser?.name?.split(" ")[0] || role})</span>
          </button>
        )}

        <div className="flex items-center gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-xs">
            <p className="text-slate-200 font-medium">NTSA Verified</p>
            <p className="text-[10px] text-slate-400">eCitizen TIMS Ready</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
