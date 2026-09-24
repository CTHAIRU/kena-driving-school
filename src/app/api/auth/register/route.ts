import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getNextAdmissionNumber } from "@/lib/admissionNumber";

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

      const cleanEmail = String(email).toLowerCase().trim();
      const cleanId = idNumber ? String(idNumber).trim() : `ID-${Date.now().toString().slice(-6)}`;
      const cleanAdm = admissionNumber?.trim() ? String(admissionNumber).trim() : await getNextAdmissionNumber();

      const existing = await db.student.findFirst({
        where: {
          OR: [
            { email: cleanEmail },
            { idNumber: cleanId },
            { admissionNumber: cleanAdm },
          ],
        },
      });

      if (existing) {
        if (existing.admissionNumber === cleanAdm) {
          return NextResponse.json(
            { error: `Admission number "${cleanAdm}" is already assigned.` },
            { status: 400 }
          );
        }
        if (existing.email.toLowerCase() === cleanEmail) {
          return NextResponse.json(
            { error: `A student with email "${cleanEmail}" already exists` },
            { status: 400 }
          );
        }
        if (existing.idNumber === cleanId) {
          return NextResponse.json(
            { error: `A student with ID number "${cleanId}" already exists` },
            { status: 400 }
          );
        }
      }

      const student = await db.student.create({
        data: {
          firstName: String(firstName).trim(),
          lastName: String(lastName).trim(),
          email: cleanEmail,
          phone: phone ? String(phone).trim() : "+254 700 000 000",
          idNumber: cleanId,
          admissionNumber: cleanAdm,
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
    if (e.code === "P2002") {
      const targets = Array.isArray(e.meta?.target) ? e.meta.target : [e.meta?.target];
      if (targets.some((t: any) => String(t).includes("admissionNumber"))) {
        return NextResponse.json(
          { error: "This admission number is already taken. Please try again." },
          { status: 409 }
        );
      }
      if (targets.some((t: any) => String(t).includes("idNumber"))) {
        return NextResponse.json(
          { error: "A student with this ID number already exists." },
          { status: 409 }
        );
      }
      if (targets.some((t: any) => String(t).includes("email"))) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: e.message || "Registration failed" },
      { status: 500 }
    );
  }
}
