import { db } from "@/lib/db";
import {
  COMPUTER_MODULES,
  AI_MODULES,
  detectCourseType,
  detectStudentCourses,
  generateCertificateNumber,
  CourseType,
  CertificateStatus,
} from "./courseProgressShared";

export {
  COMPUTER_MODULES,
  AI_MODULES,
  detectCourseType,
  detectStudentCourses,
  generateCertificateNumber,
};
export type { CourseType, CertificateStatus };

export async function ensureStudentModuleProgress(studentId: string, courseType: CourseType) {
  if (courseType === "DRIVING") return [];

  const templateModules = courseType === "COMPUTER" ? COMPUTER_MODULES : AI_MODULES;

  // Find existing progress
  const existing = await db.studentModuleProgress.findMany({
    where: { studentId, courseType },
    orderBy: { moduleNumber: "asc" },
  });

  const existingMap = new Map(existing.map((m) => [m.moduleNumber, m]));

  const missing = templateModules.filter((t) => !existingMap.has(t.moduleNumber));

  if (missing.length > 0) {
    await db.studentModuleProgress.createMany({
      data: missing.map((m) => ({
        studentId,
        courseType,
        moduleNumber: m.moduleNumber,
        moduleTitle: m.title,
        classwork: m.defaultClasswork,
        status: "NOT_STARTED",
      })),
    });
  }

  return db.studentModuleProgress.findMany({
    where: { studentId, courseType },
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
    orderBy: { moduleNumber: "asc" },
  });
}
