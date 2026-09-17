import { NextResponse } from "next/server";
import { OFFICIAL_PRACTICAL_TOPICS } from "@/lib/practicalTopics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get("phase");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let topics = [...OFFICIAL_PRACTICAL_TOPICS];

    if (phase && phase !== "ALL") {
      topics = topics.filter((t) => t.phase.includes(phase));
    }

    if (category && category !== "ALL") {
      topics = topics.filter((t) => t.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      topics = topics.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.keySkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      topics,
      totalCount: topics.length,
      phases: [
        "PHASE 1: BASIC CONTROLS",
        "PHASE 2: ROAD DYNAMICS & ASSESSMENTS",
        "PHASE 3: ADVANCED DRILLS & NTSA EXAM",
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
