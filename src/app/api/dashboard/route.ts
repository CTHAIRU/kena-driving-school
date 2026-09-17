import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalStudents,
      activeStudents,
      testReadyStudents,
      graduatedStudents,
      instructors,
      vehicles,
      todayLessons,
      payments,
      allStudents,
      upcomingExams,
    ] = await Promise.all([
      db.student.count(),
      db.student.count({ where: { status: "IN_TRAINING" } }),
      db.student.count({ where: { status: "TEST_READY" } }),
      db.student.count({ where: { status: "GRADUATED" } }),
      db.instructor.findMany({
        include: { vehicle: true, _count: { select: { students: true, lessons: true } } },
      }),
      db.vehicle.findMany(),
      db.lesson.findMany({
        where: {
          startTime: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          student: true,
          instructor: true,
          vehicle: true,
        },
        orderBy: { startTime: "asc" },
      }),
      db.payment.findMany({
        where: { status: "COMPLETED" },
        select: { amount: true },
      }),
      db.student.findMany({
        select: { balance: true },
      }),
      db.exam.findMany({
        where: { result: "PENDING" },
        include: { student: true },
        orderBy: { scheduledDate: "asc" },
        take: 5,
      }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalOutstanding = allStudents.reduce((sum, s) => sum + s.balance, 0);

    // Fleet breakdown
    const availableVehicles = vehicles.filter((v) => v.status === "AVAILABLE").length;
    const inMaintenanceVehicles = vehicles.filter((v) => v.status === "MAINTENANCE").length;

    // Urgent compliance alerts (insurance or inspection expiring in < 60 days)
    const alertThreshold = new Date();
    alertThreshold.setDate(alertThreshold.getDate() + 60);

    const fleetAlerts = vehicles
      .filter((v) => new Date(v.inspectionExpiry) <= alertThreshold || new Date(v.insuranceExpiry) <= alertThreshold)
      .map((v) => {
        const isInspectionExpiring = new Date(v.inspectionExpiry) <= alertThreshold;
        return {
          type: "VEHICLE_ALERT",
          vehicleId: v.id,
          title: `${v.make} ${v.model} (${v.registrationPlate})`,
          message: isInspectionExpiring
            ? `Inspection expires soon (${new Date(v.inspectionExpiry).toLocaleDateString()})`
            : `Insurance renewal required (${new Date(v.insuranceExpiry).toLocaleDateString()})`,
          severity: "warning",
        };
      });

    return NextResponse.json({
      stats: {
        totalStudents,
        activeStudents,
        testReadyStudents,
        graduatedStudents,
        activeInstructors: instructors.filter((i) => i.status === "ACTIVE").length,
        totalVehicles: vehicles.length,
        availableVehicles,
        inMaintenanceVehicles,
        totalRevenue,
        totalOutstanding,
      },
      todayLessons,
      instructors,
      vehicles,
      upcomingExams,
      alerts: fleetAlerts,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
