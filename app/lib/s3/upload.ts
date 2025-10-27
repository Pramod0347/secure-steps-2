/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import { S3Service } from './service';
import type { ContentCategory, ContentTypeMap, FileMetadata } from '../types/s3';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseFileHandlerOptions {
  category: ContentCategory;
  type: keyof ContentTypeMap[ContentCategory];
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

interface FileHandlerResponse {
  fileUrl: string | null;
  error: string | null;
  isLoading: boolean;
  progress: UploadProgress | null;
}

export const useFileHandler = ({
  category,
  type,
  maxSizeInMB = 10,
  allowedTypes = ['image/*', 'application/pdf']
}: UseFileHandlerOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);


  const s3Service = S3Service.getInstance();

  const validateFile = (file: File): string | null => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      return `File size exceeds ${maxSizeInMB}MB limit`;
    }

    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(`${baseType}/`);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
    }

    return null;
  };

  const uploadFile = useCallback(async (
    file: File,
    additionalMetadata?: Partial<FileMetadata>
  ): Promise<FileHandlerResponse> => {
    setIsLoading(true);
    setError(null);
    setProgress(null);
    setFileUrl(null);
  
    try {
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }
  
      const metadata: FileMetadata = {
        contentType: file.type,
        size: file.size,
        lastModified: file.lastModified,
        userId: additionalMetadata?.userId ?? '',
        category: category,
        ...additionalMetadata
      };
  
      const response = await s3Service.generateUploadUrl(
        file.name,
        category,
        type,
        metadata
      );
  
      if (!response.success || !response.data || typeof response.data.fileUrl !== 'string') {
        throw new Error(response.message || 'Invalid response from S3 service');
      }
  
      const { uploadUrl, fileUrl } = response.data;
  
      if (!uploadUrl || typeof uploadUrl !== 'string') {
        throw new Error('Invalid upload URL');
      }
  
      // Upload file with progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
  
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setProgress({
              loaded: event.loaded,
              total: event.total,
              percentage
            });
          }
        };
  
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
  
        xhr.onerror = () => reject(new Error('Upload failed'));
  
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
  
      setFileUrl(fileUrl);
  
      return { fileUrl, error: null, isLoading: false, progress: null };
  
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return { fileUrl: null, error: errorMessage, isLoading: false, progress: null };
  
    } finally {
      setIsLoading(false);
    }
  }, [category, type, s3Service, validateFile]);
  

  const getFile = useCallback(async (fileUrl: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await s3Service.getFile(fileUrl);
      if (!response.success || !response.data) {
        throw new Error(response.message);
      }
      return response.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get file';
      setError(errorMessage);
      throw err;

    } finally {
      setIsLoading(false);
    }
  }, [s3Service]);

  const deleteFile = useCallback(async (fileUrl: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await s3Service.deleteFile(fileUrl);
      if (!response.success) {
        throw new Error(response.message);
      }
      setFileUrl(null);
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      return false;

    } finally {
      setIsLoading(false);
    }
  }, [s3Service]);

  const updateFileMetadata = useCallback(async (
    fileUrl: string,
    metadata: Partial<FileMetadata>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await s3Service.updateFileMetadata(fileUrl, metadata);
      if (!response.success) {
        throw new Error(response.message);
      }
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update metadata';
      setError(errorMessage);
      return false;

    } finally {
      setIsLoading(false);
    }
  }, [s3Service]);

  return {
    uploadFile,
    getFile,
    deleteFile,
    updateFileMetadata,
    isLoading,
    error,
    progress,
    fileUrl
  };
};