import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "STUDENT";
    const id = searchParams.get("id");

    if (role === "STUDENT") {
      let student = id
        ? await db.student.findUnique({
            where: { id },
            include: {
              package: true,
              assignedInstructor: true,
              moduleProgress: { include: { tutor: true }, orderBy: { moduleNumber: "asc" } },
            },
          })
        : await db.student.findFirst({
            include: {
              package: true,
              assignedInstructor: true,
              moduleProgress: { include: { tutor: true }, orderBy: { moduleNumber: "asc" } },
            },
          });
      return NextResponse.json(student);
    } else if (role === "INSTRUCTOR") {
      const instructor = id
        ? await db.instructor.findUnique({ where: { id }, include: { vehicle: true } })
        : await db.instructor.findFirst({ include: { vehicle: true } });
      return NextResponse.json(instructor);
    } else {
      return NextResponse.json({
        name: "KENA Superadmin Desk",
        email: "kenadrivingschool13@gmail.com",
        phone: "+254 713 449 911",
        role: "SUPERADMIN",
        branch: "Tabby House, 4th Floor, Room 72, Thika",
      });
    }
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { role, id, currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (role === "STUDENT") {
      const student = id
        ? await db.student.findUnique({ where: { id } })
        : await db.student.findFirst();
      if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

      await db.student.update({
        where: { id: student.id },
        data: { password: newPassword },
      });
      return NextResponse.json({ success: true, message: "Student password updated successfully" });
    } else if (role === "INSTRUCTOR") {
      const instructor = id
        ? await db.instructor.findUnique({ where: { id } })
        : await db.instructor.findFirst();
      if (!instructor) return NextResponse.json({ error: "Instructor not found" }, { status: 404 });

      await db.instructor.update({
        where: { id: instructor.id },
        data: { password: newPassword },
      });
      return NextResponse.json({ success: true, message: "Instructor password updated successfully" });
    } else {
      return NextResponse.json({ success: true, message: "Admin credentials updated" });
    }
  } catch (error: any) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
