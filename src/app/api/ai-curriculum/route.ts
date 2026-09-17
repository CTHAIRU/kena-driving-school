import { NextResponse } from "next/server";
import { OFFICIAL_AI_TOPICS } from "@/lib/aiCurriculum";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level");
    const search = searchParams.get("search");

    let topics = [...OFFICIAL_AI_TOPICS];

    if (level && level !== "ALL") {
      topics = topics.filter((t) => t.level.toUpperCase() === level.toUpperCase());
    }

    if (search) {
      const q = search.toLowerCase();
      topics = topics.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.shortTitle.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.overview.toLowerCase().includes(q) ||
          t.keyTools.some((tool) => tool.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      topics,
      totalCount: topics.length,
      levels: ["Beginner", "Intermediate", "Advanced"],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
