import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {  FormProps } from '@/app/lib/types/community';

interface ArticleFormData {
  title: string;
  description: string;
  content: string;
  type: 'COMMUNITY' | 'LENDERS';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tags: string[];
  groupId?: string;
  bannerImg?: File;
  images: File[];
}

const CreateArticleForm: React.FC<FormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    description: '',
    content: '',
    type: 'COMMUNITY',
    status: 'DRAFT',
    tags: [],
    images: []
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === 'bannerImg') {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      } else if (name === 'images') {
        setFormData(prev => ({ ...prev, images: Array.from(files) }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.title || !formData.description || !formData.content) {
        setError("Please fill in all required fields");
        return;
      }

      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((file: File) => {
            formDataToSubmit.append('images', file);
          });
        } else if (value instanceof File) {
          formDataToSubmit.append(key, value);
        } else if (Array.isArray(value)) {
          formDataToSubmit.append(key, JSON.stringify(value));
        } else {
          formDataToSubmit.append(key, String(value));
        }
      });

      const response = await fetch('/api/articles/create', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create article');
      }

      toast.success("Article created successfully");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[30px] w-full max-w-2xl mx-4 mt-20 max-h-[calc(100vh-160px)] flex flex-col">
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold">Create a New Article</h2>
          <p className="text-gray-600 mt-1">Fill in the details to create your article.</p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Article Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Article Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
              rows={3}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
              rows={10}
              required
            />
          </div>

          {/* Article Type */}
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium">
              Article Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
            >
              <option value="COMMUNITY">Community</option>
              <option value="LENDERS">Lenders</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
            />
          </div>

          {/* Group ID */}
          <div className="space-y-2">
            <label htmlFor="groupId" className="block text-sm font-medium">
              Group ID (Optional)
            </label>
            <input
              type="text"
              id="groupId"
              name="groupId"
              value={formData.groupId}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
            />
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <label htmlFor="bannerImg" className="block text-sm font-medium">
              Banner Image
            </label>
            <input
              type="file"
              id="bannerImg"
              name="bannerImg"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
            />
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <label htmlFor="images" className="block text-sm font-medium">
              Additional Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
              multiple
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-4 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[6px] border border-gray-300 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-[6px] bg-black text-white hover:bg-gray-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Creating...' : 'Create Article'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateArticleForm;

