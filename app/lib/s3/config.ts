// lib/s3/config.ts
import { S3Client } from '@aws-sdk/client-s3';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
  throw new Error('Missing required AWS credentials in environment variables');
}

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';

if (!BUCKET_NAME) {
  throw new Error('Missing AWS_BUCKET_NAME in environment variables');
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});