// src/lib/s3/constants.ts
import type { S3FoldersType, UniversityContentType } from '../types/s3';

export const S3_FOLDERS: S3FoldersType = {
  UNIVERSITY: {
    banner: 'university/banners/',
    logo: 'university/logos/',
    gallery: 'university/gallery/',
  },
  STAY: {
    PROFILE: 'stay/profiles/',
    DOCUMENT: 'stay/documents/',
    IMAGE: 'stay/images/',
  },
  LENDERS: {
    PROFILE: 'lenders/profiles/',
    DOCUMENT: 'lenders/documents/',
    ATTACHMENT: 'lenders/attachments/',
  },
  CONNECT: {
    PROFILE: 'connect/profiles/',
    IMAGE: 'connect/images/',
    VIDEO: 'connect/videos/',
  },
  COMMUNITY: {
    PROFILE: 'community/profiles/',
    IMAGE: 'community/images/',
    VIDEO: 'community/videos/',
  },
} as const;

// Add type-safe helper functions
export const isUniversityContentType = (type: string): type is UniversityContentType => {
  return ['banner', 'logo', 'gallery'].includes(type);
};