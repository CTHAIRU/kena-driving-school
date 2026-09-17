import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const requests = await db.receiptChangeRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Receipt approvals GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch receipt change requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, requestedBy, oldAmount, newAmount, reason } = body;

    if (!paymentId || !requestedBy || newAmount === undefined || !reason) {
      return NextResponse.json(
        { error: "Missing required fields for receipt change request" },
        { status: 400 }
      );
    }

    const item = await db.receiptChangeRequest.create({
      data: {
        paymentId,
        requestedBy,
        oldAmount: Number(oldAmount),
        newAmount: Number(newAmount),
        reason,
        status: "PENDING",
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Receipt approvals POST error:", error);
    return NextResponse.json(
      { error: "Failed to create receipt change request" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, reviewedBy = "Admin / Superadmin" } = body;

    if (!id || !status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Valid ID and status (APPROVED or REJECTED) required" },
        { status: 400 }
      );
    }

    const changeReq = await db.receiptChangeRequest.findUnique({
      where: { id },
    });

    if (!changeReq) {
      return NextResponse.json(
        { error: "Change request not found" },
        { status: 404 }
      );
    }

    // If approved, update payment amount and adjust student balance
    if (status === "APPROVED") {
      const payment = await db.payment.findUnique({
        where: { id: changeReq.paymentId },
      });

      if (payment) {
        const diff = changeReq.newAmount - payment.amount;
        await db.payment.update({
          where: { id: payment.id },
          data: { amount: changeReq.newAmount },
        });

        // Reduce student balance if payment increased, or vice versa
        const student = await db.student.findUnique({
          where: { id: payment.studentId },
        });
        if (student) {
          await db.student.update({
            where: { id: student.id },
            data: { balance: Math.max(0, student.balance - diff) },
          });
        }
      }
    }

    const updated = await db.receiptChangeRequest.update({
      where: { id },
      data: {
        status,
        reviewedBy,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Receipt approvals PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to process receipt change request" },
      { status: 500 }
    );
  }
}
