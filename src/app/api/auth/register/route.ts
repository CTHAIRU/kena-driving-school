import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role } = body;

    if (role === "ADMIN") {
      const { name, email, phone, password } = body;
      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "Name, email, and password are required for admin registration" },
          { status: 400 }
        );
      }

      const cleanEmail = email.toLowerCase().trim();
      const existing = await db.admin.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        return NextResponse.json(
          { error: "An admin account with this email already exists" },
          { status: 400 }
        );
      }

      const admin = await db.admin.create({
        data: {
          name,
          email: cleanEmail,
          phone: phone || null,
          password,
          role: "SUPERADMIN",
        },
      });

      return NextResponse.json({
        success: true,
        user: { id: admin.id, name: admin.name, email: admin.email, role: "ADMIN" },
        redirectUrl: "/portal/admin",
      });
    } else if (role === "INSTRUCTOR") {
      const { firstName, lastName, email, phone, licenseNumber, category, password } = body;
      if (!firstName || !lastName || !email || !password) {
        return NextResponse.json(
          { error: "Full name, email, and password are required" },
          { status: 400 }
        );
      }

      const cleanEmail = email.toLowerCase().trim();
      const existing = await db.instructor.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        return NextResponse.json(
          { error: "An instructor with this email already exists" },
          { status: 400 }
        );
      }

      const instructor = await db.instructor.create({
        data: {
          firstName,
          lastName,
          email: cleanEmail,
          phone: phone || "+254 700 000 000",
          licenseNumber: licenseNumber || `NTSA-INS-${Date.now().toString().slice(-4)}`,
          category: category || "Category B - Light Vehicle",
          specializations: "Standard Instruction",
          password,
          status: "ACTIVE",
        },
      });

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
      // Default: STUDENT
      const {
        firstName,
        lastName,
        email,
        phone,
        idNumber,
        admissionNumber,
        dateOfBirth,
        licenseCategory,
        transmission,
        password,
        nextOfKinName,
        nextOfKinPhone,
        nextOfKinRelation,
        referralSource,
      } = body;

      if (!firstName || !lastName || !email || !password) {
        return NextResponse.json(
          { error: "First name, last name, email, and password are required" },
          { status: 400 }
        );
      }

      const cleanEmail = email.toLowerCase().trim();
      const existing = await db.student.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        return NextResponse.json(
          { error: "A student with this email already exists" },
          { status: 400 }
        );
      }

      const genAdm = admissionNumber || `KNA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const student = await db.student.create({
        data: {
          firstName,
          lastName,
          email: cleanEmail,
          phone: phone || "+254 700 000 000",
          idNumber: idNumber || `ID-${Date.now().toString().slice(-6)}`,
          admissionNumber: genAdm,
          dateOfBirth: dateOfBirth || null,
          licenseCategory: licenseCategory || "Category B - Light Vehicle",
          transmission: transmission || "MANUAL",
          password,
          nextOfKinName: nextOfKinName || null,
          nextOfKinPhone: nextOfKinPhone || null,
          nextOfKinRelation: nextOfKinRelation || null,
          referralSource: referralSource || "Google",
          status: "ENROLLED",
          balance: 14500.0,
        },
      });

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
    console.error("Registration API error:", e);
    return NextResponse.json(
      { error: e.message || "Registration failed" },
      { status: 500 }
    );
  }
}
