import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch project" }, { status: 500 });
  }
}

// PUT /api/projects/[id] — admin only
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const project = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Revalidate public pages on update
    revalidatePath("/");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/projects/[slug]", "layout");

    return NextResponse.json({ success: true, data: project });
  } catch (error: unknown) {
    console.error("PUT /api/projects/[id] error:", error);
    const msg = error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

// DELETE /api/projects/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Revalidate public pages on delete
    revalidatePath("/");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/projects/[slug]", "layout");

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
