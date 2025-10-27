// types/s3.ts
export type S3FoldersType = {
  UNIVERSITY: {
    banner: string;
    logo: string;
    gallery: string;
  };
  STAY: {
    PROFILE: string;
    DOCUMENT: string;
    IMAGE: string;
  };
  LENDERS: {
    PROFILE: string;
    DOCUMENT: string;
    ATTACHMENT: string;
  };
  CONNECT: {
    PROFILE: string;
    IMAGE: string;
    VIDEO: string;
  };
  COMMUNITY: {
    PROFILE: string;
    IMAGE: string;
    VIDEO: string;
  };
};

export type UniversityContentType = keyof S3FoldersType['UNIVERSITY'];
export type ContentCategory = keyof S3FoldersType;
export type ContentTypeMap = S3FoldersType;

export interface FileMetadata {
  contentType: string;
  size: number;
  lastModified: number;
  userId: string;
  category: string;
}

export interface UploadResponse {
  uploadUrl: string;
  fileUrl: string;
}

export interface FileInfo {
  key: string;
  size: number;
  lastModified: number;
  fileUrl: string;
}

export interface S3Response {
  success: boolean;
  message: string;
  data?: {
    uploadUrl?: string;
    fileUrl?: string;
    files?: FileInfo[];
    metadata?: FileMetadata;
  };
  error?: Error;
}