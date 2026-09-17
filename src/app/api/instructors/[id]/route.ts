import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const instructor = await db.instructor.findUnique({
      where: { id: params.id },
      include: {
        vehicle: true,
        students: true,
        lessons: true,
      },
    });

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    return NextResponse.json(instructor);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await db.instructor.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ success: true, instructor: updated });
  } catch (error: any) {
    console.error("Instructor PATCH error:", error);
    return NextResponse.json({ error: error.message || "Failed to update instructor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Unlink assigned students first
    await db.student.updateMany({
      where: { instructorId: params.id },
      data: { instructorId: null },
    });

    // Clean up lessons associated with this instructor
    await db.lesson.deleteMany({
      where: { instructorId: params.id },
    }).catch(() => {});

    // Clean up gradebook entries
    await db.gradebookEntry.deleteMany({
      where: { instructorId: params.id },
    }).catch(() => {});

    await db.instructor.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Instructor DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete instructor" }, { status: 500 });
  }
}
