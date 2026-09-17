import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { RoleProvider } from "@/context/RoleContext";
import { RouteGuard } from "@/components/RouteGuard";

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "KENA Driving School & Computer College - Mobile App",
  description: "Official Android and Apple iOS mobile app for students, instructors, and academy administration.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KENA App",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KENA App" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="flex min-h-screen bg-slate-50 antialiased selection:bg-orange-600 selection:text-white">
        <RoleProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
              <RouteGuard>{children}</RouteGuard>
            </main>
          </div>
          <MobileBottomNav />
        </RoleProvider>
      </body>
    </html>
  );
}
