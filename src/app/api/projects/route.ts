import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

// GET /api/projects — public, returns only published projects (or all for admin)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const all = searchParams.get("all"); // admin-only param to get all including drafts

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (!session || all !== "true") {
      query.isPublished = true;
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .select("-contentHTML"); // Exclude heavy content from list

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects — admin only
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Auto-generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/projects error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
