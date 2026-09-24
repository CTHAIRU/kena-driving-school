import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const student = await db.student.findUnique({
      where: { id: params.id },
      include: {
        package: true,
        assignedInstructor: {
          include: { vehicle: true },
        },
        lessons: {
          include: {
            instructor: true,
            vehicle: true,
          },
          orderBy: { startTime: "desc" },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
        skills: {
          orderBy: { updatedAt: "desc" },
        },
        exams: {
          orderBy: { scheduledDate: "desc" },
        },
        practicalSheetEntries: {
          orderBy: { praNo: "asc" },
        },
        moduleProgress: {
          include: { tutor: true },
          orderBy: { moduleNumber: "asc" },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Student detail GET error:", error);
    return NextResponse.json({ error: "Failed to fetch student details" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { skillUpdate, ...studentData } = body;

    // Handle updating a specific driving competency
    if (skillUpdate) {
      const { skillName, status } = skillUpdate;
      await db.studentSkill.upsert({
        where: {
          studentId_skillName: {
            studentId: params.id,
            skillName,
          },
        },
        update: { status },
        create: {
          studentId: params.id,
          skillName,
          status,
        },
      });
    }

    // Update main student fields if provided
    let updatedStudent = null;
    if (Object.keys(studentData).length > 0) {
      if (studentData.certificateIssueDate) {
        studentData.certificateIssueDate = new Date(studentData.certificateIssueDate);
      } else if (studentData.certificateIssueDate === "") {
        studentData.certificateIssueDate = null;
      }
      updatedStudent = await db.student.update({
        where: { id: params.id },
        data: studentData,
      });
    }

    return NextResponse.json({ success: true, updatedStudent });
  } catch (error) {
    console.error("Student PATCH error:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Clean up relations first for reliable foreign key deletion
    await db.gradebookEntry.deleteMany({ where: { studentId: params.id } }).catch(() => {});
    await db.studentSkill.deleteMany({ where: { studentId: params.id } }).catch(() => {});
    await db.exam.deleteMany({ where: { studentId: params.id } }).catch(() => {});
    await db.lesson.deleteMany({ where: { studentId: params.id } }).catch(() => {});
    await db.payment.deleteMany({ where: { studentId: params.id } }).catch(() => {});
    await db.studentModuleProgress.deleteMany({ where: { studentId: params.id } }).catch(() => {});
    await db.practicalSheetEntry.deleteMany({ where: { studentId: params.id } }).catch(() => {});

    await db.student.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Student DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete student" }, { status: 500 });
  }
}
