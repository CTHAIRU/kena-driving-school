import { db } from "@/lib/db";

/**
 * Generates the next sequential institutional admission number.
 * Format: KNA-YYYY-XXX (e.g., KNA-2026-010)
 */
export async function getNextAdmissionNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `KNA-${currentYear}-`;

  try {
    const students = await db.student.findMany({
      where: {
        admissionNumber: {
          startsWith: prefix,
        },
      },
      select: {
        admissionNumber: true,
      },
    });

    let maxSeq = 0;
    for (const st of students) {
      if (st.admissionNumber) {
        const numPart = st.admissionNumber.replace(prefix, "");
        const parsed = parseInt(numPart, 10);
        if (!isNaN(parsed) && parsed > maxSeq) {
          maxSeq = parsed;
        }
      }
    }

    const nextSeq = maxSeq + 1;
    let candidate = `${prefix}${String(nextSeq).padStart(3, "0")}`;

    // Verify candidate does not collide with any custom record
    let exists = await db.student.findUnique({
      where: { admissionNumber: candidate },
    });

    let safetyCounter = nextSeq;
    while (exists && safetyCounter < nextSeq + 1000) {
      safetyCounter++;
      candidate = `${prefix}${String(safetyCounter).padStart(3, "0")}`;
      exists = await db.student.findUnique({
        where: { admissionNumber: candidate },
      });
    }

    return candidate;
  } catch (error) {
    console.error("Failed to calculate next admission number:", error);
    return `${prefix}${Math.floor(100 + Math.random() * 900)}`;
  }
}
