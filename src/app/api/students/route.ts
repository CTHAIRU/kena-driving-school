import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { STANDARD_DRIVING_SKILLS } from "@/lib/utils";
import {
  COMPUTER_MODULES,
  AI_MODULES,
  detectStudentCourses,
} from "@/lib/courseProgressShared";
import { getNextAdmissionNumber } from "@/lib/admissionNumber";

export const dynamic = "force-dynamic";

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
        { admissionNumber: { contains: search } },
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
  let cleanAdmissionNumber = "";
  let cleanEmail = "";
  let cleanIdNumber = "";

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
      drivingPackageId,
      collegePackageId,
      collegeTrack,
      instructorId,
      collegeTutorId,
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
        { error: "Missing required student information (first name, last name, email, phone, ID number, and course category)." },
        { status: 400 }
      );
    }

    // Clean & normalize credentials
    cleanEmail = String(email).trim().toLowerCase();
    cleanIdNumber = String(idNumber).trim();
    const cleanFirstName = String(firstName).trim();
    const cleanLastName = String(lastName).trim();
    const cleanPhone = String(phone).trim();

    cleanAdmissionNumber = admissionNumber?.trim()
      ? String(admissionNumber).trim()
      : await getNextAdmissionNumber();

    // Proactively verify uniqueness across email, idNumber, and admissionNumber
    const conflictingRecord = await db.student.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { idNumber: cleanIdNumber },
          { admissionNumber: cleanAdmissionNumber },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        idNumber: true,
        admissionNumber: true,
      },
    });

    if (conflictingRecord) {
      if (conflictingRecord.admissionNumber === cleanAdmissionNumber) {
        return NextResponse.json(
          {
            error: `Admission Number "${cleanAdmissionNumber}" is already assigned to student ${conflictingRecord.firstName} ${conflictingRecord.lastName}. Please enter a unique admission number or click Auto-Generate.`,
            field: "admissionNumber",
            conflictingStudent: `${conflictingRecord.firstName} ${conflictingRecord.lastName}`,
          },
          { status: 409 }
        );
      }
      if (conflictingRecord.email.toLowerCase() === cleanEmail) {
        return NextResponse.json(
          {
            error: `A student with email "${cleanEmail}" is already registered (${conflictingRecord.firstName} ${conflictingRecord.lastName}).`,
            field: "email",
            conflictingStudent: `${conflictingRecord.firstName} ${conflictingRecord.lastName}`,
          },
          { status: 409 }
        );
      }
      if (conflictingRecord.idNumber === cleanIdNumber) {
        return NextResponse.json(
          {
            error: `A student with National ID / Passport Number "${cleanIdNumber}" is already registered (${conflictingRecord.firstName} ${conflictingRecord.lastName}).`,
            field: "idNumber",
            conflictingStudent: `${conflictingRecord.firstName} ${conflictingRecord.lastName}`,
          },
          { status: 409 }
        );
      }
    }

    // Determine course tracks from explicit inputs or licenseCategory
    const detected = detectStudentCourses(packageId, licenseCategory);
    const hasDriving = Boolean(drivingPackageId) || (detected.hasDriving && !collegeTrack);
    const hasComputer = collegeTrack === "COMPUTER" || collegeTrack === "BOTH" || detected.hasComputer;
    const hasAI = collegeTrack === "AI" || collegeTrack === "BOTH" || detected.hasAI;

    // Lookup packages for hours and default price calculation
    let calculatedHours = 0;
    let cataloguePrice = 0;

    const primaryPkgId = drivingPackageId || packageId || collegePackageId;
    if (primaryPkgId) {
      const selectedPkg = await db.package.findUnique({
        where: { id: primaryPkgId },
      });
      if (selectedPkg) {
        calculatedHours += selectedPkg.totalHours;
        cataloguePrice += selectedPkg.price;
      }
    }

    // If dual enrolled in college, add college hours if not already included
    if (hasComputer && primaryPkgId !== collegePackageId) {
      calculatedHours += 40;
    }
    if (hasAI && primaryPkgId !== collegePackageId) {
      calculatedHours += 20;
    }
    if (calculatedHours === 0) {
      calculatedHours = hasDriving ? 20.0 : hasComputer ? 40.0 : 20.0;
    }

    let balance = cataloguePrice;

    // Independent manual fee override takes precedence per institutional offers
    if (customTuitionFee !== undefined && customTuitionFee !== null && customTuitionFee !== "") {
      const parsedFee = parseFloat(customTuitionFee);
      if (!isNaN(parsedFee)) {
        balance = parsedFee;
      }
    }

    const newStudent = await db.student.create({
      data: {
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone,
        idNumber: cleanIdNumber,
        admissionNumber: cleanAdmissionNumber,
        dateOfBirth: dateOfBirth || null,
        customTuitionFee: balance,
        // NTSA PDL and eCitizen are only saved if driving is enrolled
        pdlNumber: hasDriving ? pdlNumber || null : null,
        eCitizenRef: hasDriving ? eCitizenRef || null : null,
        licenseCategory,
        transmission: hasDriving ? transmission : "NONE",
        status: "ENROLLED",
        packageId: primaryPkgId || null,
        instructorId: instructorId || collegeTutorId || null,
        requiredHours: calculatedHours,
        completedHours: 0.0,
        balance,
        nextOfKinName: nextOfKinName || null,
        nextOfKinPhone: nextOfKinPhone || null,
        nextOfKinRelation: nextOfKinRelation || null,
        referralSource: referralSource || "Google",
        notes,
      },
    });

    // Populate driving competencies ONLY if enrolled in driving
    if (hasDriving) {
      const skillData = STANDARD_DRIVING_SKILLS.map((skillName) => ({
        studentId: newStudent.id,
        skillName,
        status: "NOT_STARTED",
      }));

      await db.studentSkill.createMany({
        data: skillData,
      });
    }

    // Populate Computer Modules if enrolled in Computer
    if (hasComputer) {
      const assignedTutor = collegeTutorId || (!hasDriving ? instructorId : null);
      await db.studentModuleProgress.createMany({
        data: COMPUTER_MODULES.map((m) => ({
          studentId: newStudent.id,
          courseType: "COMPUTER",
          moduleNumber: m.moduleNumber,
          moduleTitle: m.title,
          classwork: m.defaultClasswork,
          status: "NOT_STARTED",
          tutorId: assignedTutor || undefined,
        })),
      });
    }

    // Populate AI Masterclass Modules if enrolled in AI
    if (hasAI) {
      const assignedTutor = collegeTutorId || (!hasDriving ? instructorId : null);
      await db.studentModuleProgress.createMany({
        data: AI_MODULES.map((m) => ({
          studentId: newStudent.id,
          courseType: "AI",
          moduleNumber: m.moduleNumber,
          moduleTitle: m.title,
          classwork: m.defaultClasswork,
          status: "NOT_STARTED",
          tutorId: assignedTutor || undefined,
        })),
      });
    }

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error("Students POST error:", error);
    if (error.code === "P2002") {
      const targets = Array.isArray(error.meta?.target)
        ? error.meta.target
        : typeof error.meta?.target === "string"
        ? [error.meta.target]
        : [];

      if (targets.some((t: string) => t.includes("admissionNumber"))) {
        return NextResponse.json(
          {
            error: `Admission Number "${cleanAdmissionNumber}" is already in use by another student. Please enter a different admission number or click Auto-Generate.`,
            field: "admissionNumber",
          },
          { status: 409 }
        );
      }
      if (targets.some((t: string) => t.includes("email"))) {
        return NextResponse.json(
          {
            error: `A student with email "${cleanEmail}" is already registered in the system.`,
            field: "email",
          },
          { status: 409 }
        );
      }
      if (targets.some((t: string) => t.includes("idNumber"))) {
        return NextResponse.json(
          {
            error: `A student with National ID / Passport Number "${cleanIdNumber}" is already registered in the system.`,
            field: "idNumber",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: `A student record with conflicting unique credentials (${targets.join(", ") || "field"}) already exists.`,
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to enroll student" }, { status: 500 });
  }
}
