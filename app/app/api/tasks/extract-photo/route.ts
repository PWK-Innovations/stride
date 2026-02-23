import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractTasksFromPhoto } from "@/lib/openai/extractTasksFromPhoto";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:extract-photo");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const photo = formData.get("photo");

    if (!photo || !(photo instanceof File)) {
      return NextResponse.json(
        { error: "No photo provided" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(photo.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP" },
        { status: 400 },
      );
    }

    if (photo.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await photo.arrayBuffer());
    const base64 = buffer.toString("base64");

    logger.info("Extracting tasks from photo", {
      userId: user.id,
      fileType: photo.type,
      fileSize: photo.size,
    });

    const tasks = await extractTasksFromPhoto(base64, photo.type);

    return NextResponse.json({ tasks });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    logger.error("Photo extraction failed", { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
