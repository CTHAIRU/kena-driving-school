import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const timeframe = searchParams.get("timeframe") || "all"; // day, week, month, year, all

    // Calculate timeframe boundary
    const now = new Date();
    let startDate: Date | undefined;
    if (timeframe === "day") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (timeframe === "week") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeframe === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const dateFilter = startDate ? { gte: startDate } : undefined;

    // Fetch Base Data
    const [students, payments, packages, exams, grades] = await Promise.all([
      db.student.findMany({
        where: dateFilter ? { createdAt: dateFilter } : undefined,
        include: { package: true, assignedInstructor: true },
      }),
      db.payment.findMany({
        where: dateFilter ? { createdAt: dateFilter } : undefined,
        include: { student: true },
        orderBy: { createdAt: "desc" },
      }),
      db.package.findMany({
        include: { students: true },
      }),
      db.exam.findMany({
        where: dateFilter ? { scheduledDate: dateFilter } : undefined,
        include: { student: true },
      }),
      db.gradebookEntry.findMany({
        where: dateFilter ? { gradedAt: dateFilter } : undefined,
        include: { student: true, instructor: true },
      }),
    ]);

    // 1. Report: Student Distribution
    const categoryCount: Record<string, number> = { DRIVING: 0, COMPUTER: 0, AI: 0 };
    const statusCount: Record<string, number> = {};
    const transmissionCount: Record<string, number> = {};

    students.forEach((s) => {
      const cat = s.licenseCategory.toLowerCase();
      if (cat.includes("computer")) categoryCount.COMPUTER++;
      else if (cat.includes("ai")) categoryCount.AI++;
      else categoryCount.DRIVING++;

      statusCount[s.status] = (statusCount[s.status] || 0) + 1;
      transmissionCount[s.transmission] = (transmissionCount[s.transmission] || 0) + 1;
    });

    // 2. Report: Payments & Revenue
    const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalOutstanding = students.reduce((acc, s) => acc + s.balance, 0);
    const methodBreakdown: Record<string, number> = {};
    payments.forEach((p) => {
      methodBreakdown[p.paymentMethod] = (methodBreakdown[p.paymentMethod] || 0) + p.amount;
    });

    // 3. Report: Packages Performance
    const packageStats = packages.map((pkg) => {
      const enrolled = pkg.students.length;
      const revenue = enrolled * pkg.price;
      return {
        id: pkg.id,
        name: pkg.name,
        category: pkg.category,
        price: pkg.price,
        totalHours: pkg.totalHours,
        enrolledCount: enrolled,
        revenue,
      };
    });

    // 4. Report: Student Performance & NTSA Exams
    const passedExams = exams.filter((e) => e.result === "PASSED").length;
    const failedExams = exams.filter((e) => e.result === "FAILED").length;
    const pendingExams = exams.filter((e) => e.result === "PENDING").length;
    const passRate = exams.length > 0 ? Math.round((passedExams / (passedExams + failedExams || 1)) * 100) : 100;

    const topicScores: Record<string, { total: number; count: number }> = {};
    grades.forEach((g) => {
      if (!topicScores[g.topic]) topicScores[g.topic] = { total: 0, count: 0 };
      topicScores[g.topic].total += g.score;
      topicScores[g.topic].count++;
    });

    const topicAverages = Object.entries(topicScores).map(([topic, data]) => ({
      topic,
      averageScore: Math.round(data.total / data.count),
      evaluationsCount: data.count,
    }));

    return NextResponse.json({
      timeframe,
      summary: {
        totalStudents: students.length,
        totalRevenue: totalCollected,
        totalOutstanding,
        examsConducted: exams.length,
        passRate,
      },
      reports: {
        studentDistribution: {
          categories: categoryCount,
          statuses: statusCount,
          transmissions: transmissionCount,
          studentsList: students,
        },
        payments: {
          totalCollected,
          totalOutstanding,
          methodBreakdown,
          transactions: payments,
        },
        packages: packageStats,
        studentPerformance: {
          passRate,
          examStats: { passed: passedExams, failed: failedExams, pending: pendingExams },
          topicAverages,
          gradesList: grades,
        },
      },
    });
  } catch (error: any) {
    console.error("Reports API error:", error);
    return NextResponse.json(
      { error: "Failed to generate school reports" },
      { status: 500 }
    );
  }
}
