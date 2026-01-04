import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.S3_BUCKET_NAME!;

export const uploadFile = async (file: File, key: string): Promise<string> => {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: file,
    };
    await s3.putObject(uploadParams);
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file in s3:", error);
    throw new Error("File upload failed");
  }
};

export const getFileUrl = async (key: string): Promise<string> => {
  try {
    const getObjectParams = { Bucket: bucketName, Key: key };
    return await getSignedUrl(s3, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });
  } catch (error) {
    console.error("Error generating file URL in s3:", error);
    throw new Error("Failed to get file URL");
  }
};

export const deleteFile = async (key: string): Promise<void> => {
  try {
    const deleteParams = { Bucket: bucketName, Key: key };
    await s3.deleteObject(deleteParams);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("File deletion failed");
  }
};
