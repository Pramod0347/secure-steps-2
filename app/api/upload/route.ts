import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { Buffer } from "buffer";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_END_POINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY!,
  },
});

console.log("endpoint:", process.env.CLOUDFLARE_END_POINT!)

const UPLOAD_CONFIG = {
  maxSizeInMB: 15,
  allowedImageTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ],
  allowedPdfType: "application/pdf",
  maxPdfSizeInMB: 20, // Slightly larger limit for PDFs
};

function validateFile(file: File, fileType: string) {
  if (!file) {
    throw new Error("Please select a file")
  }
  
  if (fileType === "image") {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload only image files")
    }
    
    if (!UPLOAD_CONFIG.allowedImageTypes.includes(file.type)) {
      const allowedTypes = UPLOAD_CONFIG.allowedImageTypes.map((type) => type.split("/")[1]).join(", ")
      throw new Error(`Please upload one of these image types: ${allowedTypes}`)
    }
    
    if (file.size > UPLOAD_CONFIG.maxSizeInMB * 1024 * 1024) {
      throw new Error(`Image size should be less than ${UPLOAD_CONFIG.maxSizeInMB}MB`)
    }
  } else if (fileType === "pdf") {
    if (file.type !== UPLOAD_CONFIG.allowedPdfType) {
      throw new Error("Please upload a valid PDF file")
    }
    
    if (file.size > UPLOAD_CONFIG.maxPdfSizeInMB * 1024 * 1024) {
      throw new Error(`PDF size should be less than ${UPLOAD_CONFIG.maxPdfSizeInMB}MB`)
    }
  } else {
    throw new Error("Unsupported file type")
  }
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("type") as string // Expected to be either "image" or "pdf"
    
    validateFile(file, fileType)
    
    const fileBuffer = await file.arrayBuffer()
    const fileName = `${fileType}-${Date.now()}-${file.name}`
    
    const params = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME || 'secure-steps-db',
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    }
    
    const command = new PutObjectCommand(params)
    await r2Client.send(command)
    
    // Use the r2.dev public URL that's already active
    const fileUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`
    
    console.log("Generated file URL:", fileUrl)
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileType: fileType,
      fileName: file.name,
      contentType: file.type
    })
  } catch (error) {
    console.error("Error uploading to Cloudflare R2:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 })
  }
};

export async function DELETE(req: NextRequest) {
  try {
    const { fileUrl } = await req.json();
    
    const publicUrl = process.env.CLOUDFLARE_PUBLIC_URL!;
    if (!fileUrl.startsWith(publicUrl)) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }
    
    // Extract the key by removing the base URL
    const key = fileUrl.replace(publicUrl + "/", "");
    
    if (!key) {
      return NextResponse.json({ error: "File key not found in URL" }, { status: 400 });
    }
    
    const params = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME || 'secure-steps-db',
      Key: key,
    };
    
    const command = new DeleteObjectCommand(params);
    await r2Client.send(command);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting from Cloudflare R2:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}