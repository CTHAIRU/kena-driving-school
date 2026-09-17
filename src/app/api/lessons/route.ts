import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const instructorId = searchParams.get("instructorId");
    const vehicleId = searchParams.get("vehicleId");
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (instructorId) where.instructorId = instructorId;
    if (vehicleId) where.vehicleId = vehicleId;

    if (dateStr) {
      const dayStart = new Date(dateStr);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      where.startTime = {
        gte: dayStart,
        lt: dayEnd,
      };
    }

    const lessons = await db.lesson.findMany({
      where,
      include: {
        student: true,
        instructor: true,
        vehicle: true,
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Lessons GET error:", error);
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      instructorId,
      vehicleId,
      lessonType = "PRACTICAL_DRIVING",
      startTime,
      durationHours = 1.5,
      pickupLocation,
      skillsCovered,
    } = body;

    if (!studentId || !instructorId || !startTime) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + Number(durationHours) * 60 * 60 * 1000);

    // 1. Conflict Check: Instructor availability
    const instructorConflict = await db.lesson.findFirst({
      where: {
        instructorId,
        status: { notIn: ["CANCELLED"] },
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
      include: { instructor: true },
    });

    if (instructorConflict) {
      return NextResponse.json(
        {
          error: `Instructor ${instructorConflict.instructor.firstName} ${instructorConflict.instructor.lastName} is already scheduled for another lesson during this time window.`,
        },
        { status: 409 }
      );
    }

    // 2. Conflict Check: Vehicle availability (if a vehicle is specified)
    if (vehicleId) {
      const vehicleConflict = await db.lesson.findFirst({
        where: {
          vehicleId,
          status: { notIn: ["CANCELLED"] },
          AND: [
            { startTime: { lt: end } },
            { endTime: { gt: start } },
          ],
        },
        include: { vehicle: true },
      });

      if (vehicleConflict && vehicleConflict.vehicle) {
        return NextResponse.json(
          {
            error: `Vehicle ${vehicleConflict.vehicle.make} ${vehicleConflict.vehicle.model} (${vehicleConflict.vehicle.registrationPlate}) is already reserved for another lesson at this time.`,
          },
          { status: 409 }
        );
      }
    }

    const lesson = await db.lesson.create({
      data: {
        studentId,
        instructorId,
        vehicleId: vehicleId || null,
        lessonType,
        startTime: start,
        endTime: end,
        durationHours: Number(durationHours),
        status: "SCHEDULED",
        pickupLocation: pickupLocation || null,
        skillsCovered: skillsCovered || null,
      },
      include: {
        student: true,
        instructor: true,
        vehicle: true,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Lessons POST error:", error);
    return NextResponse.json({ error: "Failed to schedule lesson" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, instructorFeedback, rating, skillsCovered } = body;

    if (!id) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
    }

    const existing = await db.lesson.findUnique({
      where: { id },
      include: { student: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (instructorFeedback !== undefined) updateData.instructorFeedback = instructorFeedback;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (skillsCovered !== undefined) updateData.skillsCovered = skillsCovered;

    const updatedLesson = await db.lesson.update({
      where: { id },
      data: updateData,
    });

    // If lesson was transitioned from non-completed to COMPLETED, credit student's hours
    if (existing.status !== "COMPLETED" && status === "COMPLETED") {
      const newCompletedHours = existing.student.completedHours + existing.durationHours;
      const willBeTestReady =
        newCompletedHours >= existing.student.requiredHours &&
        existing.student.status === "IN_TRAINING";

      await db.student.update({
        where: { id: existing.studentId },
        data: {
          completedHours: newCompletedHours,
          status: willBeTestReady ? "TEST_READY" : undefined,
        },
      });
    }

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error("Lessons PATCH error:", error);
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}
