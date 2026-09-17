import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OFFICIAL_PRACTICAL_TOPICS } from "@/lib/practicalTopics";

export const dynamic = "force-dynamic";

const db = new PrismaClient();

// GET /api/practical-sheet?studentId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let studentId = searchParams.get("studentId");

    if (!studentId) {
      // Default to first active student
      const firstStudent = await db.student.findFirst({
        orderBy: { createdAt: "asc" },
      });
      if (!firstStudent) {
        return NextResponse.json({ error: "No students found" }, { status: 404 });
      }
      studentId = firstStudent.id;
    }

    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        assignedInstructor: true,
        package: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Fetch practical sheet entries
    let entries = await db.practicalSheetEntry.findMany({
      where: { studentId },
      include: {
        instructor: true,
      },
      orderBy: { praNo: "asc" },
    });

    // If entries do not exist for this student, auto-populate the 25 official lessons
    if (entries.length < 25) {
      const existingPraNos = new Set(entries.map((e) => e.praNo));
      const toCreate: any[] = [];

      for (const topic of OFFICIAL_PRACTICAL_TOPICS) {
        if (!existingPraNos.has(topic.praNo)) {
          toCreate.push({
            studentId,
            praNo: topic.praNo,
            lessonTitle: topic.title,
            status: "PENDING",
            studentSign: false,
            instructorSign: false,
            officialSign: false,
          });
        }
      }

      if (toCreate.length > 0) {
        await db.practicalSheetEntry.createMany({
          data: toCreate,
        });

        entries = await db.practicalSheetEntry.findMany({
          where: { studentId },
          include: {
            instructor: true,
          },
          orderBy: { praNo: "asc" },
        });
      }
    }

    const completed = entries.filter((e) => e.status === "COMPLETED" || e.instructorSign).length;
    const inProgress = entries.filter((e) => e.status === "IN_PROGRESS").length;
    const pending = 25 - completed - inProgress;
    const progressPct = Math.round((completed / 25) * 100);

    return NextResponse.json({
      student,
      entries,
      summary: {
        total: 25,
        completed,
        inProgress,
        pending: Math.max(0, pending),
        progressPct,
        isTestReady: completed >= 22,
      },
    });
  } catch (error: any) {
    console.error("Error fetching practical sheet:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/practical-sheet
// Body: { id?: string, studentId?: string, praNo?: number, studentSign?: boolean, instructorSign?: boolean, instructorId?: string, date?: string, tov?: string, officialSign?: boolean, officialName?: string, status?: string, remarks?: string }
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      studentId,
      praNo,
      studentSign,
      instructorSign,
      instructorId,
      date,
      tov,
      officialSign,
      officialName,
      status,
      remarks,
    } = body;

    let targetId = id;

    if (!targetId && studentId && praNo) {
      const existing = await db.practicalSheetEntry.findUnique({
        where: {
          studentId_praNo: {
            studentId,
            praNo: Number(praNo),
          },
        },
      });
      if (existing) {
        targetId = existing.id;
      }
    }

    if (!targetId) {
      return NextResponse.json(
        { error: "Entry ID or studentId + praNo is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (studentSign !== undefined) {
      updateData.studentSign = Boolean(studentSign);
      if (studentSign) updateData.studentSignDate = new Date();
    }

    if (instructorSign !== undefined) {
      updateData.instructorSign = Boolean(instructorSign);
      if (instructorSign) {
        updateData.instructorSignDate = new Date();
        if (instructorId) updateData.instructorId = instructorId;
        if (!status) updateData.status = "COMPLETED";
      }
    }

    if (officialSign !== undefined) {
      updateData.officialSign = Boolean(officialSign);
      if (officialSign) {
        updateData.officialSignDate = new Date();
        updateData.officialName = officialName || "Chief Inspector / Tabby House Desk";
      }
    }

    if (date !== undefined) {
      updateData.date = date ? new Date(date) : null;
    }

    if (tov !== undefined) {
      updateData.tov = tov;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    const updated = await db.practicalSheetEntry.update({
      where: { id: targetId },
      data: updateData,
      include: {
        instructor: true,
      },
    });

    return NextResponse.json({ success: true, entry: updated });
  } catch (error: any) {
    console.error("Error updating practical sheet entry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
