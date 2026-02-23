import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await request.json();
    const { start_time, end_time } = body;

    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "start_time and end_time are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify the block belongs to the user
    const { data: block, error: fetchError } = await supabase
      .from("scheduled_blocks")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    if (block.user_id !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from("scheduled_blocks")
      .update({ start_time, end_time })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update block" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update block" },
      { status: 500 },
    );
  }
}
