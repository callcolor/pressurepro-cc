'use client';

import React, { useState } from 'react';
import { Conference } from '@/types/conference';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useUser } from '@/context/UserContext';

interface RegistrationFormProps {
  conference: Conference;
  onSuccess: () => void;
}

export function RegistrationForm({ conference, onSuccess }: RegistrationFormProps) {
  const { registerForConference } = useUser();
  const [formData, setFormData] = useState({
    attendeeName: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.attendeeName.trim()) {
      newErrors.attendeeName = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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
      const response = await fetch(`/api/conferences/${conference.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      // Save registration to user context
      registerForConference({
        conferenceId: conference.id,
        attendeeName: formData.attendeeName,
        email: formData.email,
        registeredAt: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Registration Successful!</h3>
        <p className="text-green-700">
          You're all set for {conference.name}. Check your email for confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        value={formData.attendeeName}
        onChange={(e) => setFormData({ ...formData, attendeeName: e.target.value })}
        error={errors.attendeeName}
        required
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Registering...' : 'Register Now'}
      </Button>
    </form>
  );
}
