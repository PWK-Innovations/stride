import { createClient } from "./client";

export async function uploadPhoto(
  userId: string,
  file: File,
): Promise<string> {
  const supabase = createClient();

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

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
