import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category.toUpperCase();
    }

    const items = await db.courseContent.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Content GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, contentType, url, description, fileSize } = body;

    if (!title || !category || !contentType || !url) {
      return NextResponse.json(
        { error: "Title, category, content type, and URL are required" },
        { status: 400 }
      );
    }

    const item = await db.courseContent.create({
      data: {
        title,
        category: category.toUpperCase(),
        contentType: contentType.toUpperCase(),
        url,
        description: description || null,
        fileSize: fileSize || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Content POST error:", error);
    return NextResponse.json(
      { error: "Failed to create course content" },
      { status: 500 }
    );
  }
}
