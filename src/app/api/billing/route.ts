import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [packages, payments, students] = await Promise.all([
      db.package.findMany({
        include: {
          _count: { select: { students: true } },
        },
      }),
      db.payment.findMany({
        include: {
          student: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.student.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          balance: true,
          package: true,
        },
      }),
    ]);

    const totalCollected = payments
      .filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOutstanding = students.reduce((sum, s) => sum + s.balance, 0);

    return NextResponse.json({
      packages,
      payments,
      students,
      stats: {
        totalCollected,
        totalOutstanding,
        totalInvoices: students.length,
      },
    });
  } catch (error) {
    console.error("Billing GET error:", error);
    return NextResponse.json({ error: "Failed to fetch billing records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, amount, paymentMethod, transactionRef, notes } = body;

    if (!studentId || !amount || !paymentMethod) {
      return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
    }

    const payAmount = Number(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const ref =
      transactionRef ||
      `PAY-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await db.payment.create({
      data: {
        studentId,
        amount: payAmount,
        paymentMethod,
        transactionRef: ref,
        status: "COMPLETED",
        notes: notes || null,
      },
      include: { student: true },
    });

    // Update student's remaining balance
    const newBalance = Math.max(0, student.balance - payAmount);
    await db.student.update({
      where: { id: studentId },
      data: { balance: newBalance },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error("Billing POST error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A payment with this transaction reference already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
