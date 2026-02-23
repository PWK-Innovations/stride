import { createClient } from "./client";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
}

export async function uploadPhoto(
  userId: string,
  file: File,
): Promise<string> {
  const supabase = createClient();

  const ext = MIME_TO_EXT[file.type] || "jpg";
  const fileName = `${userId}/${generateId()}.${ext}`;

  const { error } = await supabase.storage
    .from("task-photos")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Photo upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from("task-photos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
