import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FormProps } from '@/app/lib/types/community';

interface ForumFormData {
  title: string;
  description: string;
  groupId: string;
  type: 'DISCUSSION' | 'Q_AND_A' | 'SUPPORT';
  privacy: 'GROUP' | 'MEMBERS_ONLY' | 'PRIVATE' | 'PUBLIC';
  tags: string[];
  isLocked: boolean;
}

const CreateForumForm: React.FC<FormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ForumFormData>({
    title: '',
    description: '',
    groupId: '',
    type: 'DISCUSSION',
    privacy: 'PUBLIC',
    tags: [],
    isLocked: false
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.title || !formData.description || !formData.groupId) {
        setError("Please fill in all required fields");
        return;
      }

      const response = await fetch('/api/forums/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create forum');
      }

      toast.success("Forum created successfully");
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
          <h2 className="text-2xl font-bold">Create a New Forum</h2>
          <p className="text-gray-600 mt-1">Fill in the details to create your forum.</p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Forum Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Forum Title
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

          {/* Group ID */}
          <div className="space-y-2">
            <label htmlFor="groupId" className="block text-sm font-medium">
              Group ID
            </label>
            <input
              type="text"
              id="groupId"
              name="groupId"
              value={formData.groupId}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
              required
            />
          </div>

          {/* Forum Type */}
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium">
              Forum Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
            >
              <option value="DISCUSSION">Discussion</option>
              <option value="Q_AND_A">Q&A</option>
              <option value="SUPPORT">Support</option>
            </select>
          </div>

          {/* Privacy */}
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
              <option value="GROUP">Group</option>
              <option value="MEMBERS_ONLY">Members Only</option>
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
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

          {/* Is Locked */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isLocked"
              name="isLocked"
              checked={formData.isLocked}
              onChange={(e) => setFormData(prev => ({ ...prev, isLocked: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="isLocked" className="text-sm font-medium">
              Lock this forum
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
            className={`px-4 py-2 rounded-[6px] bg-black text-white hover:bg-gray-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Creating...' : 'Create Forum'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForumForm;

