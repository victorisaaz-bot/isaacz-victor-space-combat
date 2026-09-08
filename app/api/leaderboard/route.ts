import { NextRequest, NextResponse } from "next/server";
import { getLeaderboardEntries } from "@/lib/storage/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;
    const timeframe = (searchParams.get("timeframe") as any) || undefined;

    const entries = getLeaderboardEntries({
      mode,
      difficulty,
      timeframe,
    });

    return NextResponse.json({
      success: true,
      entries,
      total: entries.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to load leaderboard entries" },
      { status: 500 }
    );
  }
}

