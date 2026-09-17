"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Receipt,
  User,
  Calendar,
  Users,
  ClipboardCheck,
  CreditCard,
  BarChart3,
  FileCheck2,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { role } = useRole();

  const getTabs = () => {
    if (role === "STUDENT") {
      return [
        { label: "Home", href: "/portal/student", icon: LayoutDashboard },
        { label: "Practicals", href: "/portal/student/practical-sheet", icon: FileCheck2 },
        { label: "Topics", href: "/practical-topics", icon: Compass },
        { label: "M-Pesa", href: "/portal/student/payments", icon: Receipt },
        { label: "Profile", href: "/portal/student/profile", icon: User },
      ];
    }

    if (role === "INSTRUCTOR") {
      return [
        { label: "Home", href: "/portal/instructor", icon: LayoutDashboard },
        { label: "Practicals", href: "/portal/instructor/gradebook?tab=practical-sheet", icon: FileCheck2 },
        { label: "Topics", href: "/practical-topics", icon: Compass },
        { label: "Students", href: "/portal/instructor/students", icon: Users },
        { label: "Profile", href: "/portal/instructor/profile", icon: User },
      ];
    }

    // Default: ADMIN / SUPERADMIN
    return [
      { label: "Dashboard", href: "/portal/admin", icon: LayoutDashboard },
      { label: "Students", href: "/students", icon: Users },
      { label: "Practicals", href: "/practical-topics", icon: FileCheck2 },
      { label: "Reports", href: "/portal/admin/reports", icon: BarChart3 },
      { label: "Billing", href: "/billing", icon: CreditCard },
    ];
  };

  const tabs = getTabs();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-area-pb shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href + "/"));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all select-none min-w-[56px]",
                isActive
                  ? "text-orange-500 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-lg transition-transform",
                  isActive && "bg-orange-950/50 scale-110 text-orange-500"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
