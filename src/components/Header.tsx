"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import {
  Search,
  Calendar,
  Phone,
  Globe,
  Shield,
  GraduationCap,
  User,
  Smartphone,
  X,
  QrCode,
  Wifi,
  ExternalLink,
  LogOut,
} from "lucide-react";

export function Header() {
  const { role, authUser, isAuthenticated, logout } = useRole();
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [currentHost, setCurrentHost] = useState("192.168.100.15");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      setCurrentHost(window.location.hostname);
    }
  }, []);

  const mobileUrl = `http://${currentHost}:3000`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    mobileUrl
  )}`;

  const todayStr = new Date().toLocaleDateString("en-KE", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getPersonaLabel = () => {
    switch (role) {
      case "STUDENT":
        return { name: "Alice Wanjiru", sub: "Student • Class B & AI" };
      case "INSTRUCTOR":
        return { name: "Marcus Kariuki", sub: "Instructor • Manual Fleet" };
      default:
        return { name: "Admin Desk", sub: "Superadmin • Tabby House" };
    }
  };

  const persona = getPersonaLabel();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Bar / Context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              role === "STUDENT"
                ? "Search your courses, materials, or receipts..."
                : role === "INSTRUCTOR"
                ? "Search assigned students or practical topics..."
                : "Search students, NTSA PDL, ID, or instructors..."
            }
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Right Side Tools & Contacts */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Phone Connect / QR Code Button */}
        <button
          onClick={() => setIsMobileModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1.5 rounded-xl transition-all shadow-xs"
          title="Open KENA App on Android or iPhone"
        >
          <Smartphone className="w-4 h-4 text-orange-600" />
          <span className="hidden sm:inline">Connect Phone</span>
        </button>

        {/* Support Hotline */}
        <a
          href="tel:+254713449911"
          className="hidden xl:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-orange-300 font-semibold transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>+254 713 449 911</span>
        </a>

        {/* Date Display */}
        <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayStr}</span>
        </div>

        {/* Authenticated User Status & Logout */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <Link
              href={
                role === "STUDENT"
                  ? "/portal/student"
                  : role === "INSTRUCTOR"
                  ? "/portal/instructor"
                  : "/portal/admin"
              }
              className="flex items-center gap-2 hover:opacity-85 transition-opacity"
              title={`View ${role} portal`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  role === "STUDENT"
                    ? "bg-emerald-100 text-emerald-700"
                    : role === "INSTRUCTOR"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {persona.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="hidden md:block text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{persona.name}</p>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border ${
                      role === "STUDENT"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : role === "INSTRUCTOR"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}
                  >
                    {role}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">{persona.sub}</p>
              </div>
            </Link>

            {/* Direct Logout Button */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shadow-2xs cursor-pointer ml-1"
              title="Sign out of current account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-xs"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Connect / QR Code Modal */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Open App on Android &amp; iPhone</h3>
                  <p className="text-xs text-slate-500">Scan QR or enter URL on your mobile browser</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
              {/* QR Code */}
              <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="Scan QR code to open KENA App on Phone"
                  className="w-40 h-40 rounded-lg object-contain"
                />
                <span className="text-[10px] font-bold text-slate-500 mt-2 flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-orange-600" /> Point Phone Camera
                </span>
              </div>

              {/* Instructions */}
              <div className="space-y-3 text-xs flex-1">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-2">
                  <Wifi className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Make sure your phone is connected to the <strong>same Wi-Fi network</strong> as this computer.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Direct Mobile URL
                  </label>
                  <div className="mt-1 flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-orange-700 select-all">
                    <span>{mobileUrl}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <p>
                    🍏 <strong>iPhone / iPad:</strong> Open Safari, go to <span className="font-mono text-orange-700 font-semibold">{mobileUrl}</span>, tap <em>Share</em> &rarr; <em>Add to Home Screen</em>.
                  </p>
                  <p>
                    🤖 <strong>Android:</strong> Open Chrome, go to <span className="font-mono text-orange-700 font-semibold">{mobileUrl}</span>, tap <em>Menu</em> &rarr; <em>Install App</em>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setIsMobileModalOpen(false)}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
