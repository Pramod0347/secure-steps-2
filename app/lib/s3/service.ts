import { 
    PutObjectCommand, 
    GetObjectCommand, 
    DeleteObjectCommand, 
    HeadObjectCommand,
    ListObjectsV2Command,
    type PutObjectCommandInput,
    CopyObjectCommand
  } from '@aws-sdk/client-s3';
  import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
  import { s3Client, BUCKET_NAME } from './config';
  import { isUniversityContentType, S3_FOLDERS } from './constants';
  import type { 
    ContentCategory, 
    ContentTypeMap,
    FileMetadata, 
    S3Response, 
    UniversityContentType
  } from '../types/s3';
  
  export class S3Service {
  private static instance: S3Service | null = null;

  private constructor() {}

  public static getInstance(): S3Service {
    if (!S3Service.instance) {
      S3Service.instance = new S3Service();
    }
    return S3Service.instance;
  }

  private getS3Key(
    category: ContentCategory,
    type: string,
    fileName: string
  ): string {
    const folders = S3_FOLDERS[category];
    const folder = folders[type as keyof typeof folders];
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9-.]/g, '-');
    return `${folder}${timestamp}-${sanitizedFileName}`;
  }

  public async generateUploadUrl(
    fileName: string,
    category: ContentCategory,
    type: UniversityContentType,
    metadata: FileMetadata
  ): Promise<S3Response> {
    try {
      if (!isUniversityContentType(type)) {
        throw new Error('Invalid content type');
      }

      const key = this.getS3Key(category, type, fileName);

      const commandInput: PutObjectCommandInput = {
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: metadata.contentType,
        Metadata: {
          userId: metadata.userId,
          category: metadata.category,
          contentType: metadata.contentType,
          size: metadata.size.toString(),
          lastModified: metadata.lastModified.toString(),
        },
      };

      const command = new PutObjectCommand(commandInput);
      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

      return {
        success: true,
        message: 'Upload URL generated successfully',
        data: { uploadUrl, fileUrl },
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        message: 'Failed to generate upload URL',
        error: err,
      };
    }
  }

  
    public async getFile(fileUrl: string): Promise<S3Response> {
      try {
        const key = fileUrl.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, '');
  
        const headCommand = new HeadObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        });
  
        const metadata = await s3Client.send(headCommand);
  
        const getCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        });
  
        const downloadUrl = await getSignedUrl(s3Client, getCommand, {
          expiresIn: 3600,
        });
  
        return {
          success: true,
          message: 'File retrieved successfully',
          data: {
            fileUrl: downloadUrl,
            metadata: {
              contentType: metadata.ContentType ?? '',
              size: metadata.ContentLength ?? 0,
              lastModified: metadata.LastModified?.getTime() ?? 0,
              userId: metadata.Metadata?.userId ?? '',
              category: metadata.Metadata?.category ?? '',
            },
          },
        };
      } catch (error) {
        const err = error as Error;
        return {
          success: false,
          message: 'Failed to retrieve file',
          error: err,
        };
      }
    }
  
    public async listFiles(
      category: ContentCategory,
      type: keyof ContentTypeMap[ContentCategory]
    ): Promise<S3Response> {
      try {
        const folders = S3_FOLDERS[category] as { [key: string]: string };
        const prefix = folders[type];
  
        const command = new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: prefix as string
        });
  
        const response = await s3Client.send(command);
        const files = response.Contents?.map((item) => ({
          key: item.Key ?? '',
          size: item.Size ?? 0,
          lastModified: item.LastModified?.getTime() ?? 0,
          fileUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${item.Key ?? ''}`,
        })) ?? [];
  
        return {
          success: true,
          message: 'Files listed successfully',
          data: { files },
        };
      } catch (error) {
        const err = error as Error;
        return {
          success: false,
          message: 'Failed to list files',
          error: err,
        };
      }
    }
  
    public async deleteFile(fileUrl: string): Promise<S3Response> {
      try {
        const key = fileUrl.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, '');
        
        const command = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        });
  
        await s3Client.send(command);
  
        return {
          success: true,
          message: 'File deleted successfully',
        };
      } catch (error) {
        const err = error as Error;
        return {
          success: false,
          message: 'Failed to delete file',
          error: err,
        };
      }
    }
  
    public async updateFileMetadata(
      fileUrl: string,
      metadata: Partial<FileMetadata>
    ): Promise<S3Response> {
      try {
        const key = fileUrl.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, '');
  
        const headCommand = new HeadObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        });
  
        const existingMetadata = await s3Client.send(headCommand);
  
        // First, copy the object with new metadata
        const copyCommand = new CopyObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          CopySource: `${BUCKET_NAME}/${key}`,
          ContentType: metadata.contentType ?? existingMetadata.ContentType ?? '',
          Metadata: {
            ...existingMetadata.Metadata,
            ...(metadata as Record<string, string>),
            size: metadata.size?.toString() ?? existingMetadata.Metadata?.size ?? '0',
            lastModified: metadata.lastModified?.toString() ?? existingMetadata.Metadata?.lastModified ?? Date.now().toString(),
          },
          MetadataDirective: 'REPLACE'
        });
  
        await s3Client.send(copyCommand);
  
        return {
          success: true,
          message: 'File metadata updated successfully',
        };
      } catch (error) {
        const err = error as Error;
        return {
          success: false,
          message: 'Failed to update file metadata',
          error: err,
        };
      }
    }
  }