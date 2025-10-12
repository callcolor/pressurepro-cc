'use client';

import { useState, useEffect } from 'react';
import { Conference } from '@/types/conference';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConferenceForm } from '@/components/admin/ConferenceForm';

type ViewMode = 'list' | 'create' | 'edit';

export default function AdminPage() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedConference, setSelectedConference] = useState<Conference | undefined>();

  useEffect(() => {
    if (viewMode === 'list') {
      fetchConferences();
    }
  }, [viewMode]);

  const fetchConferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/conferences?limit=100');
      const data = await response.json();
      setConferences(data.conferences);
    } catch (error) {
      console.error('Error fetching conferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (conferenceData: Partial<Conference>) => {
    const response = await fetch('/api/conferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conferenceData),
    });

    if (!response.ok) {
      throw new Error('Failed to create conference');
    }

    setViewMode('list');
  };

  const handleUpdate = async (conferenceData: Partial<Conference>) => {
    if (!selectedConference) return;

    const response = await fetch(`/api/conferences/${selectedConference.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conferenceData),
    });

    if (!response.ok) {
      throw new Error('Failed to update conference');
    }

    setViewMode('list');
    setSelectedConference(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conference?')) {
      return;
    }

    try {
      const response = await fetch(`/api/conferences/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete conference');
      }

      fetchConferences();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete conference');
    }
  };

  const handleEdit = (conference: Conference) => {
    setSelectedConference(conference);
    setViewMode('edit');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage tech conferences</p>
          </div>
          {viewMode === 'list' && (
            <Button onClick={() => setViewMode('create')}>+ Create Conference</Button>
          )}
        </div>

        {/* Create/Edit Form */}
        {(viewMode === 'create' || viewMode === 'edit') && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">
                {viewMode === 'create' ? 'Create New Conference' : 'Edit Conference'}
              </h2>
            </CardHeader>
            <CardBody>
              <ConferenceForm
                conference={selectedConference}
                onSubmit={viewMode === 'create' ? handleCreate : handleUpdate}
                onCancel={() => {
                  setViewMode('list');
                  setSelectedConference(undefined);
                }}
              />
            </CardBody>
          </Card>
        )}

        {/* Conference List */}
        {viewMode === 'list' && (
          <>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    Total: {conferences.length} conference{conferences.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-4">
                  {conferences.map((conference) => (
                    <Card key={conference.id}>
                      <CardBody>
                        <div className="flex gap-6">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                              {conference.imageUrl ? (
                                <img
                                  src={conference.imageUrl}
                                  alt={conference.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <span className="text-3xl">📊</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {conference.name}
                                </h3>
                                <div className="flex gap-2 flex-wrap">
                                  {conference.isFeatured && (
                                    <Badge variant="warning" size="sm">
                                      ⭐ Featured
                                    </Badge>
                                  )}
                                  {conference.category.slice(0, 3).map((cat) => (
                                    <Badge key={cat} variant="info" size="sm">
                                      {cat}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {conference.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div className="text-sm">
                                <span className="text-gray-500">Date:</span>
                                <div className="font-medium">{formatDate(conference.date)}</div>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Location:</span>
                                <div className="font-medium">{conference.location}</div>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Price:</span>
                                <div className="font-medium text-blue-600">
                                  ${conference.price}
                                </div>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Attendees:</span>
                                <div className="font-medium">
                                  {conference.currentAttendees} / {conference.maxAttendees}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(conference)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDelete(conference.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
