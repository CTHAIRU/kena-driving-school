import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { STANDARD_DRIVING_SKILLS } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const transmission = searchParams.get("transmission");
    const certificateStatus = searchParams.get("certificateStatus");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (category && category !== "ALL") where.licenseCategory = category;
    if (transmission && transmission !== "ALL") where.transmission = transmission;
    if (certificateStatus && certificateStatus !== "ALL") where.certificateStatus = certificateStatus;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { idNumber: { contains: search } },
      ];
    }

    const students = await db.student.findMany({
      where,
      include: {
        package: true,
        assignedInstructor: true,
        moduleProgress: true,
        _count: {
          select: {
            lessons: true,
            skills: true,
            payments: true,
            exams: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Students GET error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
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
      idNumber,
      admissionNumber,
      dateOfBirth,
      customTuitionFee,
      licenseCategory,
      transmission = "MANUAL",
      packageId,
      instructorId,
      pdlNumber,
      eCitizenRef,
      nextOfKinName,
      nextOfKinPhone,
      nextOfKinRelation,
      referralSource,
      notes,
    } = body;

    if (!firstName || !lastName || !email || !phone || !idNumber || !licenseCategory) {
      return NextResponse.json(
        { error: "Missing required student information" },
        { status: 400 }
      );
    }

    // Lookup package for hours and default price
    let requiredHours = 20.0;
    let balance = 0.0;

    if (packageId) {
      const selectedPkg = await db.package.findUnique({
        where: { id: packageId },
      });
      if (selectedPkg) {
        requiredHours = selectedPkg.totalHours;
        balance = selectedPkg.price;
      }
    }

    // Independent manual fee override takes precedence per institutional offers
    if (customTuitionFee !== undefined && customTuitionFee !== null && customTuitionFee !== "") {
      const parsedFee = parseFloat(customTuitionFee);
      if (!isNaN(parsedFee)) {
        balance = parsedFee;
      }
    }

    const genAdm = admissionNumber?.trim() || `KNA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newStudent = await db.student.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        idNumber,
        admissionNumber: genAdm,
        dateOfBirth: dateOfBirth || null,
        customTuitionFee: balance,
        pdlNumber: pdlNumber || null,
        eCitizenRef: eCitizenRef || null,
        licenseCategory,
        transmission,
        status: "ENROLLED",
        packageId: packageId || null,
        instructorId: instructorId || null,
        requiredHours,
        completedHours: 0.0,
        balance,
        nextOfKinName: nextOfKinName || null,
        nextOfKinPhone: nextOfKinPhone || null,
        nextOfKinRelation: nextOfKinRelation || null,
        referralSource: referralSource || "Google",
        notes,
      },
    });

    // Populate standard competencies
    const skillData = STANDARD_DRIVING_SKILLS.map((skillName) => ({
      studentId: newStudent.id,
      skillName,
      status: "NOT_STARTED",
    }));

    await db.studentSkill.createMany({
      data: skillData,
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error("Students POST error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A student with this email or ID number already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to enroll student" }, { status: 500 });
  }
}
