import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const vehicles = await db.vehicle.findMany({
      include: {
        assignedInstructors: true,
        _count: {
          select: { lessons: true },
        },
      },
      orderBy: { make: "asc" },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Vehicles GET error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      make,
      model,
      year,
      registrationPlate,
      transmission,
      category,
      mileage = 0,
      insuranceExpiry,
      inspectionExpiry,
    } = body;

    if (!make || !model || !registrationPlate || !transmission || !insuranceExpiry || !inspectionExpiry) {
      return NextResponse.json({ error: "Missing required vehicle fields" }, { status: 400 });
    }

    const vehicle = await db.vehicle.create({
      data: {
        make,
        model,
        year: Number(year) || new Date().getFullYear(),
        registrationPlate: registrationPlate.toUpperCase(),
        transmission,
        category: category || "Hatchback",
        mileage: Number(mileage) || 0,
        insuranceExpiry: new Date(insuranceExpiry),
        inspectionExpiry: new Date(inspectionExpiry),
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    console.error("Vehicles POST error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A vehicle with this registration plate already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to register vehicle" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, mileage, lastServiceDate, insuranceExpiry, inspectionExpiry } = body;

    if (!id) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (mileage !== undefined) updateData.mileage = Number(mileage);
    if (lastServiceDate) updateData.lastServiceDate = new Date(lastServiceDate);
    if (insuranceExpiry) updateData.insuranceExpiry = new Date(insuranceExpiry);
    if (inspectionExpiry) updateData.inspectionExpiry = new Date(inspectionExpiry);

    const updated = await db.vehicle.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Vehicles PATCH error:", error);
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}
