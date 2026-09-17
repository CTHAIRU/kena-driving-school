import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const exams = await db.exam.findMany({
      include: {
        student: {
          include: { assignedInstructor: true },
        },
      },
      orderBy: { scheduledDate: "desc" },
    });

    const passedCount = exams.filter((e) => e.result === "PASSED").length;
    const failedCount = exams.filter((e) => e.result === "FAILED").length;
    const totalDecided = passedCount + failedCount;
    const passRate = totalDecided > 0 ? Math.round((passedCount / totalDecided) * 100) : 100;

    return NextResponse.json({
      exams,
      stats: {
        totalExams: exams.length,
        passedCount,
        failedCount,
        pendingCount: exams.filter((e) => e.result === "PENDING").length,
        passRate,
      },
    });
  } catch (error) {
    console.error("Exams GET error:", error);
    return NextResponse.json({ error: "Failed to fetch exam records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, examType = "PRACTICAL", scheduledDate, testCenter, examinerName, notes } = body;

    if (!studentId || !scheduledDate || !testCenter) {
      return NextResponse.json({ error: "Missing required exam booking fields" }, { status: 400 });
    }

    const exam = await db.exam.create({
      data: {
        studentId,
        examType,
        scheduledDate: new Date(scheduledDate),
        testCenter,
        examinerName: examinerName || null,
        result: "PENDING",
        notes: notes || null,
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error("Exams POST error:", error);
    return NextResponse.json({ error: "Failed to book exam" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, result, score, examinerName, notes } = body;

    if (!id || !result) {
      return NextResponse.json({ error: "Exam ID and result status are required" }, { status: 400 });
    }

    const existing = await db.exam.findUnique({
      where: { id },
      include: { student: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Exam record not found" }, { status: 404 });
    }

    const updatedExam = await db.exam.update({
      where: { id },
      data: {
        result,
        score: score !== undefined ? Number(score) : undefined,
        examinerName: examinerName || undefined,
        notes: notes || undefined,
      },
    });

    // If practical driving test is passed, graduate the student!
    if (result === "PASSED" && existing.examType === "PRACTICAL") {
      await db.student.update({
        where: { id: existing.studentId },
        data: { status: "GRADUATED" },
      });
    }

    return NextResponse.json(updatedExam);
  } catch (error) {
    console.error("Exams PATCH error:", error);
    return NextResponse.json({ error: "Failed to update exam outcome" }, { status: 500 });
  }
}
