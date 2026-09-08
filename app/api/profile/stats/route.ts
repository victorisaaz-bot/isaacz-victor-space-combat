import { NextRequest, NextResponse } from "next/server";
import { getLeaderboardEntries } from "@/lib/storage/db";

export async function GET(req: NextRequest) {
  try {
    const allEntries = getLeaderboardEntries();

    return NextResponse.json({
      success: true,
      stats: {
        totalGlobalMatches: allEntries.length,
        highestGlobalScore: allEntries.length > 0 ? allEntries[0].score : 0,
        topPlayer: allEntries.length > 0 ? allEntries[0].displayName : "None",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to load profile statistics" },
      { status: 500 }
    );
  }
}

