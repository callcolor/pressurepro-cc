'use client';

import { useState, useEffect, use } from 'react';
import { Conference } from '@/types/conference';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RegistrationForm } from '@/components/RegistrationForm';
import { useUser } from '@/context/UserContext';
import { useConferenceValidator, getRegistrationStatus } from '@/hooks/useConferenceValidator';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ConferenceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const { isFavorite, addFavorite, removeFavorite, isRegistered } = useUser();
  const validation = useConferenceValidator(conference);
  const status = conference ? getRegistrationStatus(conference) : 'Closed';

  useEffect(() => {
    fetchConference();
  }, [resolvedParams.id]);

  const fetchConference = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/conferences/${resolvedParams.id}`);

      if (!response.ok) {
        throw new Error('Conference not found');
      }

      const data = await response.json();
      setConference(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (!conference) return;
    if (isFavorite(conference.id)) {
      removeFavorite(conference.id);
    } else {
      addFavorite(conference.id);
    }
  };

  const handleShare = async (platform: string) => {
    if (!conference) return;

    const url = window.location.href;
    const text = `Check out ${conference.name}!`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !conference) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Conference Not Found</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link href="/">
          <Button>Back to Conferences</Button>
        </Link>
      </div>
    );
  }

  const statusVariant = {
    Open: 'success' as const,
    Closed: 'default' as const,
    'Sold Out': 'danger' as const,
  };

  const userIsRegistered = isRegistered(conference.id);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <span className="mr-2">←</span> Back to Conferences
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card>
              <div className="relative h-80 bg-gray-200">
                {conference.imageUrl ? (
                  <img
                    src={conference.imageUrl}
                    alt={conference.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-6xl">📊</span>
                  </div>
                )}
                {conference.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="warning">⭐ Featured</Badge>
                  </div>
                )}
              </div>

              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{conference.name}</h1>
                    <Badge variant={statusVariant[status]}>{status}</Badge>
                    {validation.isTechMeet2024 && (
                      <Badge variant="info" className="ml-2">
                        🎉 TechMeet 2024 Special
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={handleFavoriteToggle}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={isFavorite(conference.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <span className="text-2xl">{isFavorite(conference.id) ? '❤️' : '🤍'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <span className="text-xl mr-2">📅</span>
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-medium">{formatDate(conference.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-xl mr-2">📍</span>
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium">{conference.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-xl mr-2">💰</span>
                    <div>
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="font-medium text-2xl text-blue-600">${conference.price}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">About This Conference</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{conference.description}</p>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {conference.category.map((cat) => (
                      <Badge key={cat} variant="info">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Capacity</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">👥</span>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {conference.currentAttendees} / {conference.maxAttendees}
                      </div>
                      <div className="text-sm text-gray-600">attendees registered</div>
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{
                        width: `${Math.min((conference.currentAttendees / conference.maxAttendees) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Speakers */}
            {conference.speakers.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">Featured Speakers</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    {conference.speakers.map((speaker) => (
                      <div key={speaker.id} className="flex gap-4">
                        <div className="flex-shrink-0">
                          {speaker.avatarUrl ? (
                            <img
                              src={speaker.avatarUrl}
                              alt={speaker.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                              {speaker.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{speaker.name}</h3>
                          <p className="text-sm text-gray-600">
                            {speaker.title} at {speaker.company}
                          </p>
                          <p className="text-gray-700 mt-2">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Social Sharing */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Share This Conference</h2>
              </CardHeader>
              <CardBody>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
                    🐦 Twitter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>
                    📘 Facebook
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShare('linkedin')}>
                    💼 LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShare('copy')}>
                    🔗 Copy Link
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar - Registration */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900">
                    {userIsRegistered ? 'Already Registered' : 'Register Now'}
                  </h2>
                </CardHeader>
                <CardBody>
                  {userIsRegistered ? (
                    <div className="text-center py-4">
                      <div className="text-4xl mb-3">✅</div>
                      <p className="text-green-700 font-medium mb-4">
                        You're registered for this conference!
                      </p>
                      <Link href="/dashboard">
                        <Button fullWidth>View Dashboard</Button>
                      </Link>
                    </div>
                  ) : status === 'Open' ? (
                    showRegistrationForm ? (
                      <RegistrationForm
                        conference={conference}
                        onSuccess={() => {
                          setShowRegistrationForm(false);
                          fetchConference();
                        }}
                      />
                    ) : (
                      <>
                        <div className="text-center mb-4">
                          <div className="text-4xl font-bold text-blue-600 mb-2">
                            ${conference.price}
                          </div>
                          <p className="text-sm text-gray-600">Registration fee</p>
                        </div>
                        <Button fullWidth onClick={() => setShowRegistrationForm(true)}>
                          Register for Conference
                        </Button>
                      </>
                    )
                  ) : (
                    <div className="text-center py-4">
                      <Badge variant={statusVariant[status]} className="mb-3">
                        {status}
                      </Badge>
                      <p className="text-gray-600">
                        {status === 'Sold Out'
                          ? 'This conference has reached maximum capacity.'
                          : 'Registration for this conference has closed.'}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
