import { NextApiRequest, NextApiResponse } from "next";
import { S3, HeadBucketCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.S3_BUCKET_NAME!;
const testKey = "test-file.txt";
const testFilePath = path.join(process.cwd(), "test-file.txt");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create a test file
  if (!fs.existsSync(testFilePath)) {
    fs.writeFileSync(testFilePath, "This is a test file for S3 operations.");
  }

  try {
    // Step 1: Check if the S3 bucket is available
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));

    // Step 2: Upload a test file
    const uploadParams = {
      Bucket: bucketName,
      Key: testKey,
      Body: fs.createReadStream(testFilePath),
    };
    await s3.putObject(uploadParams);

    // Step 3: Generate a signed URL for the uploaded file
    const getObjectParams = { Bucket: bucketName, Key: testKey };
    const signedUrl = await getSignedUrl(s3, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });

    // Step 4: Delete the test file
    await s3.deleteObject({ Bucket: bucketName, Key: testKey });

    res.status(200).json({ message: "S3 operations succeeded", signedUrl });
  } catch (error) {
    console.error("Error during S3 operations:", error);
    res.status(500).json({ message: "Error during S3 operations", error });
  } finally {
    // Clean up the test file locally
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}
