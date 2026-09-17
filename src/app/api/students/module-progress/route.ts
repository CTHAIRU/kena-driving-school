import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  detectCourseType,
  ensureStudentModuleProgress,
  generateCertificateNumber,
} from "@/lib/courseProgress";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "studentId query parameter is required" }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        package: true,
        assignedInstructor: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const courseType = detectCourseType(student.package?.name, student.licenseCategory);
    const modules = await ensureStudentModuleProgress(studentId, courseType);

    const totalModules = courseType === "COMPUTER" ? 10 : courseType === "AI" ? 9 : 0;
    const completedModules = modules.filter((m) => m.status === "COMPLETED");
    const inProgressModules = modules.filter((m) => m.status === "IN_PROGRESS");
    const scoredModules = completedModules.filter((m) => m.score !== null && m.score !== undefined);
    const averageScore =
      scoredModules.length > 0
        ? Math.round(scoredModules.reduce((acc, m) => acc + (m.score || 0), 0) / scoredModules.length)
        : null;

    const progressPercentage = totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0;

    return NextResponse.json({
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        admissionNumber: student.admissionNumber,
        idNumber: student.idNumber,
        status: student.status,
        package: student.package,
        assignedInstructor: student.assignedInstructor,
        certificateStatus: student.certificateStatus || "UNCOLLECTED",
        certificateNumber: student.certificateNumber,
        certificateIssueDate: student.certificateIssueDate,
        certificateRemarks: student.certificateRemarks,
      },
      courseType,
      modules,
      summary: {
        totalModules,
        completedCount: completedModules.length,
        inProgressCount: inProgressModules.length,
        progressPercentage,
        averageScore,
        isCourseCompleted: totalModules > 0 && completedModules.length >= totalModules,
      },
    });
  } catch (error: any) {
    console.error("Module progress GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch module progress" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      moduleNumber,
      courseType,
      status = "COMPLETED",
      score,
      classwork,
      remarks,
      tutorId,
    } = body;

    if (!studentId || moduleNumber === undefined || !courseType) {
      return NextResponse.json(
        { error: "Missing required fields: studentId, moduleNumber, and courseType" },
        { status: 400 }
      );
    }

    const numericScore = score !== undefined && score !== null && score !== "" ? Number(score) : null;
    const completedAt = status === "COMPLETED" ? new Date() : null;

    const updatedModule = await db.studentModuleProgress.upsert({
      where: {
        studentId_courseType_moduleNumber: {
          studentId,
          courseType,
          moduleNumber: Number(moduleNumber),
        },
      },
      update: {
        status,
        score: numericScore,
        classwork: classwork !== undefined ? classwork : undefined,
        remarks: remarks !== undefined ? remarks : undefined,
        tutorId: tutorId || undefined,
        completedAt: completedAt || undefined,
      },
      create: {
        studentId,
        courseType,
        moduleNumber: Number(moduleNumber),
        moduleTitle: `Module ${moduleNumber}`,
        status,
        score: numericScore,
        classwork,
        remarks,
        tutorId,
        completedAt,
      },
      include: {
        tutor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            licenseNumber: true,
          },
        },
      },
    });

    // Check overall student course progress
    const allModules = await db.studentModuleProgress.findMany({
      where: { studentId, courseType },
    });

    const totalRequired = courseType === "COMPUTER" ? 10 : 9;
    const completedCount = allModules.filter((m) => m.status === "COMPLETED").length;

    let certificateNumberUpdate: string | undefined;
    let studentStatusUpdate: string | undefined;

    if (completedCount >= totalRequired) {
      const student = await db.student.findUnique({ where: { id: studentId } });
      if (student) {
        if (!student.certificateNumber) {
          certificateNumberUpdate = generateCertificateNumber(courseType, student.admissionNumber || student.id);
        }
        if (student.status !== "GRADUATED") {
          studentStatusUpdate = "GRADUATED";
        }

        await db.student.update({
          where: { id: studentId },
          data: {
            status: studentStatusUpdate || student.status,
            certificateNumber: certificateNumberUpdate || student.certificateNumber,
            certificateIssueDate: student.certificateIssueDate || new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      module: updatedModule,
      completedCount,
      totalRequired,
      isCourseCompleted: completedCount >= totalRequired,
      certificateNumber: certificateNumberUpdate,
    });
  } catch (error: any) {
    console.error("Module progress POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to update module progress" }, { status: 500 });
  }
}
