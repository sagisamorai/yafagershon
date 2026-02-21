import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const useVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "לא נבחר קובץ" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "סוג קובץ לא נתמך. יש להעלות תמונה (JPG, PNG, WebP, GIF)",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "הקובץ גדול מדי. גודל מקסימלי: 5MB" },
        { status: 400 }
      );
    }

    if (useVercelBlob) {
      const { put } = await import("@vercel/blob");
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `recipes/${randomUUID()}.${ext}`;
      const blob = await put(filename, file, { access: "public" });
      return NextResponse.json({ url: blob.url, filename });
    }

    const { writeFile, mkdir } = await import("fs/promises");
    const { existsSync } = await import("fs");
    const path = await import("path");

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${randomUUID()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}`, filename });
  } catch {
    return NextResponse.json(
      { error: "שגיאה בהעלאת הקובץ" },
      { status: 500 }
    );
  }
}
