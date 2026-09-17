import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await db.vehicle.findUnique({
      where: { id: params.id },
      include: {
        assignedInstructors: true,
        lessons: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
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
    const updated = await db.vehicle.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ success: true, vehicle: updated });
  } catch (error: any) {
    console.error("Vehicle PATCH error:", error);
    return NextResponse.json({ error: error.message || "Failed to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Unlink assigned instructors
    await db.instructor.updateMany({
      where: { assignedVehicleId: params.id },
      data: { assignedVehicleId: null },
    });

    // Unlink lessons
    await db.lesson.updateMany({
      where: { vehicleId: params.id },
      data: { vehicleId: null },
    });

    await db.vehicle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Vehicle DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete vehicle" }, { status: 500 });
  }
}
