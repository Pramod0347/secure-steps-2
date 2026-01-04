import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  eventType: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  registrationType: 'FREE' | 'PAID' | 'INVITE_ONLY';
  totalSlots: number;
  ticketPrice?: number;
  currency?: string;
  address?: string;
  virtualLink?: string;
  image?: File;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    location: '',
    eventType: 'OFFLINE',
    registrationType: 'FREE',
    totalSlots: 0,
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

  const createSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const getGroupIdFromUrl = () => {
    // Extract groupId from URL path
    const pathParts = window.location.pathname.split('/');
    const groupIdIndex = pathParts.findIndex(part => part === 'group') + 1;
    return pathParts[groupIdIndex] || '';
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.title || !formData.description || !formData.date || !formData.startTime) {
        setError("Please fill in all required fields");
        return;
      }

      const groupId = getGroupIdFromUrl();
      if (!groupId) {
        setError("Group ID not found in URL");
        return;
      }


      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSubmit.append(key, value);
        } else if (value !== undefined) {
          formDataToSubmit.append(key, String(value));
        }
      });

      // Add groupId and slug to form data
      formDataToSubmit.append('groupId', groupId);
      formDataToSubmit.append('slug', createSlug(formData.title));

      const response = await fetch('/api/community/group/event', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      toast.success("Event created successfully");
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
          <h2 className="text-2xl font-bold">Create a New Event</h2>
          <p className="text-gray-600 mt-1">Fill in the details to create your event.</p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Event Title
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full rounded-[6px] border border-gray-300 p-2"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="startTime" className="block text-sm font-medium">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full rounded-[6px] border border-gray-300 p-2"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="endTime" className="block text-sm font-medium">
              End Time (Optional)
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="eventType" className="block text-sm font-medium">
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="registrationType" className="block text-sm font-medium">
              Registration Type
            </label>
            <select
              id="registrationType"
              name="registrationType"
              value={formData.registrationType}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
            >
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
              <option value="INVITE_ONLY">Invite Only</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="totalSlots" className="block text-sm font-medium">
              Total Slots
            </label>
            <input
              type="number"
              id="totalSlots"
              name="totalSlots"
              value={formData.totalSlots}
              onChange={handleInputChange}
              className="w-full rounded-[6px] border border-gray-300 p-2"
              required
            />
          </div>

          {formData.registrationType === 'PAID' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="ticketPrice" className="block text-sm font-medium">
                  Ticket Price
                </label>
                <input
                  type="number"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  className="w-full rounded-[6px] border border-gray-300 p-2"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="currency" className="block text-sm font-medium">
                  Currency
                </label>
                <input
                  type="text"
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full rounded-[6px] border border-gray-300 p-2"
                  required
                />
              </div>
            </div>
          )}

          {(formData.eventType === 'OFFLINE' || formData.eventType === 'HYBRID') && (
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-[6px] border border-gray-300 p-2"
                required
              />
            </div>
          )}

          {(formData.eventType === 'ONLINE' || formData.eventType === 'HYBRID') && (
            <div className="space-y-2">
              <label htmlFor="virtualLink" className="block text-sm font-medium">
                Virtual Link
              </label>
              <input
                type="url"
                id="virtualLink"
                name="virtualLink"
                value={formData.virtualLink}
                onChange={handleInputChange}
                className="w-full rounded-[6px] border border-gray-300 p-2"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium">
              Event Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
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
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;

