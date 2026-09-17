import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const instructorId = searchParams.get("instructorId");

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (instructorId) where.instructorId = instructorId;

    const entries = await db.gradebookEntry.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            idNumber: true,
            licenseCategory: true,
            status: true,
          },
        },
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { gradedAt: "desc" },
    });

    return NextResponse.json(entries);
  } catch (error: any) {
    console.error("Gradebook GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gradebook entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, instructorId, topic, score, remarks } = body;

    if (!studentId || !instructorId || !topic || score === undefined) {
      return NextResponse.json(
        { error: "Missing required gradebook fields" },
        { status: 400 }
      );
    }

    const numericScore = Number(score);
    let status = "PASS";
    if (numericScore >= 90) status = "EXCELLENT";
    else if (numericScore < 75) status = "NEEDS_WORK";

    const entry = await db.gradebookEntry.create({
      data: {
        studentId,
        instructorId,
        topic,
        score: numericScore,
        status,
        remarks: remarks || null,
      },
      include: {
        student: true,
        instructor: true,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    console.error("Gradebook POST error:", error);
    return NextResponse.json(
      { error: "Failed to submit gradebook entry" },
      { status: 500 }
    );
  }
}
