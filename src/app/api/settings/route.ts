import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ThemeSetting from "@/models/ThemeSetting";

// GET /api/settings — public (needed to inject CSS vars on public pages)
export async function GET() {
  try {
    await dbConnect();
    let settings = await ThemeSetting.findOne();
    if (!settings) {
      // Return defaults if no settings exist yet
      settings = {
        primaryColor: "#6366f1",
        secondaryColor: "#8b5cf6",
        accentColor: "#06b6d4",
        defaultMode: "dark",
      };
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings — admin only
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const settings = await ThemeSetting.findOneAndUpdate(
      {}, // match the single document
      body,
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
