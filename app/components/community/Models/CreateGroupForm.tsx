import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface GroupFormData {
  name: string;
  description: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
  banner?: File;
  logo?: File;
  isPinned: boolean;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    privacy: 'PUBLIC',
    isPinned: false
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const createSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.name || !formData.description) {
        setError("Please fill in all required fields");
        return;
      }

      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSubmit.append(key, value);
        } else {
          formDataToSubmit.append(key, String(value));
        }
      });

      // Add placeholder images if not provided
      if (!formData.banner) {
        const bannerResponse = await fetch('https://placehold.co/1200x400');
        const bannerBlob = await bannerResponse.blob();
        formDataToSubmit.append('banner', bannerBlob, 'placeholder-banner.jpg');
      }

      if (!formData.logo) {
        const logoResponse = await fetch('https://placehold.co/300x300');
        const logoBlob = await logoResponse.blob();
        formDataToSubmit.append('logo', logoBlob, 'placeholder-logo.jpg');
      }

      // Add slug to form data
      formDataToSubmit.append('slug', createSlug(formData.name));

      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
      const response = await fetch(`${NextUrl}/api/community/group`, {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create group');
      }

      toast.success("Group created successfully");
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
          <h2 className="text-2xl font-bold">Create a New Group</h2>
          <p className="text-gray-600 mt-1">Fill in the details to create your group.</p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Group Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
              required
            />
          </div>

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

          <div className="space-y-2">
            <label htmlFor="privacy" className="block text-sm font-medium">
              Privacy
            </label>
            <select
              id="privacy"
              name="privacy"
              value={formData.privacy}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="RESTRICTED">Restricted</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="banner" className="block text-sm font-medium">
              Banner Image (Optional)
            </label>
            <input
              type="file"
              id="banner"
              name="banner"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
            />
            <p className="text-sm text-gray-500">A placeholder will be used if no image is provided</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="logo" className="block text-sm font-medium">
              Logo (Optional)
            </label>
            <input
              type="file"
              id="logo"
              name="logo"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
            />
            <p className="text-sm text-gray-500">A placeholder will be used if no image is provided</p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPinned"
              name="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="isPinned" className="text-sm font-medium">
              Pin this group
            </label>
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
            className={`px-4 py-2 rounded-[6px] bg-black text-white hover:bg-gray-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;