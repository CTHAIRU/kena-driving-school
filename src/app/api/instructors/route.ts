import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category) {
      where.category = category.toUpperCase();
    }

    const instructors = await db.instructor.findMany({
      where,
      include: {
        vehicle: true,
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
            completedHours: true,
            requiredHours: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            students: true,
          },
        },
      },
      orderBy: { firstName: "asc" },
    });

    return NextResponse.json(instructors);
  } catch (error) {
    console.error("Instructors GET error:", error);
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      specializations,
      category = "DRIVING",
      department,
      modulesTaught,
      labStation,
      certifications,
      assignedVehicleId,
      rating = 5.0,
    } = body;

    if (!firstName || !lastName || !email || !phone || !licenseNumber) {
      return NextResponse.json({ error: "Missing required instructor fields" }, { status: 400 });
    }

    const defaultDept =
      category === "COMPUTER"
        ? "Computer College"
        : category === "AI"
        ? "Modern AI Academy"
        : "Driving School";

    const instructor = await db.instructor.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        licenseNumber,
        specializations: specializations || (category === "COMPUTER" ? "Computer Packages" : category === "AI" ? "Modern AI Topics" : "Manual & Automatic"),
        category: category.toUpperCase(),
        department: department || defaultDept,
        modulesTaught: modulesTaught || null,
        labStation: labStation || null,
        certifications: certifications || null,
        assignedVehicleId: category === "DRIVING" && assignedVehicleId ? assignedVehicleId : null,
        rating: Number(rating),
      },
    });

    return NextResponse.json(instructor, { status: 201 });
  } catch (error: any) {
    console.error("Instructors POST error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "An instructor or tutor with this email or license/staff ID already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create instructor" }, { status: 500 });
  }
}
