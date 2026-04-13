import { NextRequest, NextResponse } from "next/server";
import { uploadFile, deleteFile, getFileUrl } from "@/app/lib/s3/s3Service";

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
  const { action } = params;

  try {
    if (action === "upload") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Generate a unique key for the file
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const key = `documents/${timestamp}-${randomStr}-${file.name}`;

      // Convert File to Buffer for S3 upload
      const buffer = await file.arrayBuffer();
      const url = await uploadFile(buffer, key);

      return NextResponse.json({ url, key }, { status: 200 });
    }

    if (action === "get") {
      const { searchParams } = new URL(req.url);
      const key = searchParams.get("key");
      
      if (!key) {
        return NextResponse.json({ error: "No key provided" }, { status: 400 });
      }

      const url = await getFileUrl(key);
      return NextResponse.json({ url }, { status: 200 });
    }

    if (action === "delete") {
      const { searchParams } = new URL(req.url);
      const key = searchParams.get("key");
      
      if (!key) {
        return NextResponse.json({ error: "No key provided" }, { status: 400 });
      }

      await deleteFile(key);
      return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { action: string } }) {
  const { action } = params;

  try {
    if (action === "get") {
      const { searchParams } = new URL(req.url);
      const key = searchParams.get("key");
      
      if (!key) {
        return NextResponse.json({ error: "No key provided" }, { status: 400 });
      }

      const url = await getFileUrl(key);
      return NextResponse.json({ url }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { action: string } }) {
  const { action } = params;

  try {
    if (action === "delete") {
      const { searchParams } = new URL(req.url);
      const key = searchParams.get("key");
      
      if (!key) {
        return NextResponse.json({ error: "No key provided" }, { status: 400 });
      }

      await deleteFile(key);
      return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
