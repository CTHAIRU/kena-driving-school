import { NextResponse } from "next/server";
import { getNextAdmissionNumber } from "@/lib/admissionNumber";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const nextAdmissionNumber = await getNextAdmissionNumber();
    return NextResponse.json({ nextAdmissionNumber });
  } catch (error) {
    console.error("Error fetching next admission number:", error);
    return NextResponse.json(
      { error: "Failed to generate next admission number" },
      { status: 500 }
    );
  }
}
