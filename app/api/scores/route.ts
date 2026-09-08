import { NextRequest, NextResponse } from "next/server";
import { submitScoreEntry } from "@/lib/storage/db";
import { ScoreSubmissionPayload } from "@/game/types";

export async function POST(req: NextRequest) {
  try {
    const body: ScoreSubmissionPayload = await req.json();

    // Validate payload
    if (!body || typeof body.score !== "number" || typeof body.shots !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid payload format" },
        { status: 400 }
      );
    }

    const result = submitScoreEntry(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      entry: result.entry,
      message: "Score submitted and verified successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to process score submission" },
      { status: 500 }
    );
  }
}

