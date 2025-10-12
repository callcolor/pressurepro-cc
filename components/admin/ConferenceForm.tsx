'use client';

import React, { useState, useEffect } from 'react';
import { Conference, Speaker } from '@/types/conference';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ConferenceFormProps {
  conference?: Conference;
  onSubmit: (conference: Partial<Conference>) => Promise<void>;
  onCancel: () => void;
}

export function ConferenceForm({ conference, onSubmit, onCancel }: ConferenceFormProps) {
  const [formData, setFormData] = useState<Partial<Conference>>({
    name: '',
    description: '',
    date: '',
    location: '',
    price: 0,
    category: [],
    imageUrl: '',
    maxAttendees: 100,
    currentAttendees: 0,
    isFeatured: false,
    speakers: [],
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conference) {
      setFormData(conference);
    }
  }, [conference]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Conference name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.maxAttendees || formData.maxAttendees <= 0) {
      newErrors.maxAttendees = 'Max attendees must be greater than 0';
    }

    if (!formData.category || formData.category.length === 0) {
      newErrors.category = 'At least one category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save conference',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.category?.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        category: [...(formData.category || []), categoryInput.trim()],
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData({
      ...formData,
      category: formData.category?.filter((c) => c !== category) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Conference Name"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          required
        />

        <Input
          label="Location"
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          error={errors.location}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          error={errors.price}
          min="0"
          required
        />

        <Input
          label="Max Attendees"
          type="number"
          value={formData.maxAttendees}
          onChange={(e) => setFormData({ ...formData, maxAttendees: Number(e.target.value) })}
          error={errors.maxAttendees}
          min="1"
          required
        />
      </div>

      {conference && (
        <Input
          label="Current Attendees"
          type="number"
          value={formData.currentAttendees}
          onChange={(e) =>
            setFormData({ ...formData, currentAttendees: Number(e.target.value) })
          }
          min="0"
        />
      )}

      <Input
        label="Image URL"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        helperText="Enter a URL for the conference image"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            placeholder="Add category (e.g., React, AI/ML)"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCategory();
              }
            }}
          />
          <Button type="button" onClick={handleAddCategory} variant="outline">
            Add
          </Button>
        </div>
        {errors.category && <p className="text-sm text-red-600 mb-2">{errors.category}</p>}
        <div className="flex flex-wrap gap-2">
          {formData.category?.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {cat}
              <button
                type="button"
                onClick={() => handleRemoveCategory(cat)}
                className="hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Featured Conference</span>
        </label>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Saving...' : conference ? 'Update Conference' : 'Create Conference'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
