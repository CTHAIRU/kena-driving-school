import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    if (role === "ADMIN") {
      const admin = await db.admin.findUnique({
        where: { email: cleanEmail },
      });

      if (!admin || admin.password !== password) {
        return NextResponse.json(
          { error: "Invalid admin credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "ADMIN",
        },
        redirectUrl: "/portal/admin",
      });
    } else if (role === "INSTRUCTOR") {
      const instructor = await db.instructor.findUnique({
        where: { email: cleanEmail },
      });

      if (!instructor || instructor.password !== password) {
        return NextResponse.json(
          { error: "Invalid instructor credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: instructor.id,
          name: `${instructor.firstName} ${instructor.lastName}`,
          email: instructor.email,
          role: "INSTRUCTOR",
        },
        redirectUrl: "/portal/instructor",
      });
    } else {
      // Default or STUDENT
      const student = await db.student.findUnique({
        where: { email: cleanEmail },
      });

      if (!student || student.password !== password) {
        return NextResponse.json(
          { error: "Invalid student credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          role: "STUDENT",
        },
        redirectUrl: "/portal/student",
      });
    }
  } catch (e: any) {
    console.error("Login API error:", e);
    return NextResponse.json(
      { error: e.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
