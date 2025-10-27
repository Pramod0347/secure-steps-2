import { NextResponse } from "next/server"
import { S3Client, ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

// Initialize the S3 client for Cloudflare R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_END_POINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY!,
  },
})

export async function GET() {
  try {
    // List all objects in the bucket
    const command = new ListObjectsV2Command({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME || "secure-steps-db",
      Prefix: "pdf-", // Only list objects with the pdf- prefix
    })

    const response = await r2Client.send(command)

    // Format the response
    const blogs =
      response.Contents?.map((item) => {
        // Extract the original filename from the key
        // Assuming format: pdf-timestamp-originalname.pdf
        const key = item.Key || ""
        const parts = key.split("-")
        let fileName = key

        // If the key follows our naming convention, extract the original filename
        if (parts.length >= 3) {
          // Remove the prefix and timestamp
          fileName = parts.slice(2).join("-")
        }

        return {
          url: `${process.env.CLOUDFLARE_PUBLIC_URL}/${key}`,
          fileName: fileName,
          uploadDate: item.LastModified?.toISOString() || new Date().toISOString(),
          size: item.Size || 0,
        }
      }) || []

    // Sort by upload date (newest first)
    blogs.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error listing objects from Cloudflare R2:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

// rename
export async function POST(req: Request) {
  try {
    const { currentUrl, newFileName } = await req.json()

    // Validate inputs
    if (!currentUrl || !newFileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Extract the current key from the URL
    const publicUrl = process.env.CLOUDFLARE_PUBLIC_URL!
    if (!currentUrl.startsWith(publicUrl)) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 })
    }

    const currentKey = currentUrl.replace(publicUrl + "/", "")

    // Create the new key with the same prefix but new filename
    // Assuming format: pdf-timestamp-originalname.pdf
    const parts = currentKey.split("-")
    if (parts.length < 3) {
      return NextResponse.json({ error: "Invalid file key format" }, { status: 400 })
    }

    // Keep the prefix and timestamp, replace the filename
    const newKey = `${parts[0]}-${parts[1]}-${newFileName}`

    // Copy the object with the new key
    const copyParams = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME || "secure-steps-db",
      CopySource: `${process.env.CLOUDFLARE_BUCKET_NAME || "secure-steps-db"}/${currentKey}`,
      Key: newKey,
    }

    await r2Client.send(new CopyObjectCommand(copyParams))

    // Delete the original object
    const deleteParams = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME || "secure-steps-db",
      Key: currentKey,
    }

    await r2Client.send(new DeleteObjectCommand(deleteParams))

    // Return the new URL
    const newUrl = `${publicUrl}/${newKey}`

    return NextResponse.json({
      success: true,
      url: newUrl,
      fileName: newFileName,
    })
  } catch (error) {
    console.error("Error renaming file in Cloudflare R2:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 })
  }
}
