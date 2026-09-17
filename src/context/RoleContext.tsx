"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  admissionNumber?: string;
  licenseNumber?: string;
}

interface RoleContextType {
  role: Role | null;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, redirectUrl?: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  activeStudentId: string;
  activeInstructorId: string;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  authUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  setRole: () => {},
  activeStudentId: "",
  activeInstructorId: "",
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUserState] = useState<AuthUser | null>(null);
  const [role, setRoleState] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStudentId, setActiveStudentId] = useState("");
  const [activeInstructorId, setActiveInstructorId] = useState("");
  const router = useRouter();

  // On mount, load active authenticated session from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("kena_auth_user");
      if (storedUser) {
        const parsed: AuthUser = JSON.parse(storedUser);
        if (parsed && parsed.role && ["ADMIN", "INSTRUCTOR", "STUDENT"].includes(parsed.role)) {
          setAuthUserState(parsed);
          setRoleState(parsed.role);
          if (parsed.role === "STUDENT" && parsed.id) {
            setActiveStudentId(parsed.id);
          } else if (parsed.role === "INSTRUCTOR" && parsed.id) {
            setActiveInstructorId(parsed.id);
          }
          document.cookie = `kena_auth_role=${parsed.role}; path=/; max-age=604800; SameSite=Lax`;
        }
      } else {
        // Check legacy kena_user_role if present
        const savedRole = localStorage.getItem("kena_user_role") as Role;
        if (savedRole && ["ADMIN", "INSTRUCTOR", "STUDENT"].includes(savedRole)) {
          // Construct fallback user
          const fallbackUser: AuthUser = {
            id: savedRole === "STUDENT" ? "cmtr1130i000jo33dmbf958dc" : "default-id",
            name: savedRole === "STUDENT" ? "Alice Wanjiru" : savedRole === "INSTRUCTOR" ? "Marcus Kariuki" : "Admin Desk",
            email: savedRole === "STUDENT" ? "alice.wanjiru@gmail.com" : savedRole === "INSTRUCTOR" ? "marcus.k@kenadrivingschool.com" : "admin@kenadrivingschool.com",
            role: savedRole,
          };
          setAuthUserState(fallbackUser);
          setRoleState(savedRole);
          localStorage.setItem("kena_auth_user", JSON.stringify(fallbackUser));
        }
      }
    } catch (e) {
      console.error("Failed to load auth user session:", e);
    } finally {
      setIsLoading(false);
    }

    // Fetch default student and instructor IDs for simulation if needed
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0 && !activeStudentId) {
          setActiveStudentId(data[0].id);
        }
      })
      .catch(() => {});

    fetch("/api/instructors")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0 && !activeInstructorId) {
          setActiveInstructorId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const login = (user: AuthUser, redirectUrl?: string) => {
    setAuthUserState(user);
    setRoleState(user.role);
    localStorage.setItem("kena_auth_user", JSON.stringify(user));
    localStorage.setItem("kena_user_role", user.role);
    document.cookie = `kena_auth_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;

    if (user.role === "STUDENT" && user.id) {
      setActiveStudentId(user.id);
    } else if (user.role === "INSTRUCTOR" && user.id) {
      setActiveInstructorId(user.id);
    }

    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (user.role === "STUDENT") {
      router.push("/portal/student");
    } else if (user.role === "INSTRUCTOR") {
      router.push("/portal/instructor");
    } else {
      router.push("/portal/admin");
    }
  };

  const logout = () => {
    setAuthUserState(null);
    setRoleState(null);
    localStorage.removeItem("kena_auth_user");
    localStorage.removeItem("kena_user_role");
    document.cookie = "kena_auth_role=; path=/; max-age=0; SameSite=Lax";
    router.push("/login");
  };

  // Backwards compatibility helper
  const setRole = (newRole: Role) => {
    const mockUser: AuthUser = {
      id: newRole === "STUDENT" ? "cmtr1130i000jo33dmbf958dc" : "admin-id",
      name: newRole === "STUDENT" ? "Alice Wanjiru" : newRole === "INSTRUCTOR" ? "Marcus Kariuki" : "Admin Desk",
      email: newRole === "STUDENT" ? "alice.wanjiru@gmail.com" : newRole === "INSTRUCTOR" ? "marcus.k@kenadrivingschool.com" : "admin@kenadrivingschool.com",
      role: newRole,
    };
    login(mockUser);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        authUser,
        isAuthenticated: !!authUser,
        isLoading,
        login,
        logout,
        setRole,
        activeStudentId,
        activeInstructorId,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
