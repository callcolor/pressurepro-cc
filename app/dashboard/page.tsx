'use client';

import { useState, useEffect } from 'react';
import { Conference } from '@/types/conference';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { preferences, unregisterFromConference, removeFavorite } = useUser();
  const [registeredConferences, setRegisteredConferences] = useState<Conference[]>([]);
  const [favoriteConferences, setFavoriteConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserConferences();
  }, [preferences]);

  const fetchUserConferences = async () => {
    try {
      setLoading(true);

      // Fetch all conferences
      const response = await fetch('/api/conferences?limit=100');
      const data = await response.json();
      const allConferences: Conference[] = data.conferences;

      // Filter registered conferences
      const registered = allConferences.filter((conf) =>
        preferences.registeredConferences.some((reg) => reg.conferenceId === conf.id)
      );

      // Filter favorite conferences
      const favorites = allConferences.filter((conf) =>
        preferences.favoriteConferences.includes(conf.id)
      );

      setRegisteredConferences(registered);
      setFavoriteConferences(favorites);
    } catch (error) {
      console.error('Error fetching conferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCountdown = (dateString: string): string => {
    const now = new Date();
    const conferenceDate = new Date(dateString);
    const diff = conferenceDate.getTime() - now.getTime();

    if (diff < 0) {
      return 'Event has passed';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} away`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} away`;
    } else {
      return 'Starting soon!';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleUnregister = (conferenceId: string) => {
    if (confirm('Are you sure you want to unregister from this conference?')) {
      unregisterFromConference(conferenceId);
    }
  };

  const handleRemoveFavorite = (conferenceId: string) => {
    removeFavorite(conferenceId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your conference registrations and favorites</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎟️</div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {registeredConferences.length}
                  </div>
                  <div className="text-sm text-gray-600">Registered Conferences</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-4">
                <div className="text-4xl">❤️</div>
                <div>
                  <div className="text-3xl font-bold text-red-600">
                    {favoriteConferences.length}
                  </div>
                  <div className="text-sm text-gray-600">Favorite Conferences</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-4">
                <div className="text-4xl">📅</div>
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {
                      registeredConferences.filter(
                        (conf) => new Date(conf.date) > new Date()
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Upcoming Events</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Registered Conferences */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Registered Conferences</h2>

          {registeredConferences.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-gray-600 mb-4">You haven't registered for any conferences yet.</p>
                <Link href="/">
                  <Button>Browse Conferences</Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredConferences.map((conference) => {
                const registration = preferences.registeredConferences.find(
                  (reg) => reg.conferenceId === conference.id
                );
                const isPast = new Date(conference.date) < new Date();

                return (
                  <Card key={conference.id} hover>
                    <div className="relative h-40 bg-gray-200">
                      {conference.imageUrl ? (
                        <img
                          src={conference.imageUrl}
                          alt={conference.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-4xl">📊</span>
                        </div>
                      )}
                      {!isPast && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="success" size="sm">
                            {getCountdown(conference.date)}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardBody>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {conference.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📅</span>
                          <span>{formatDate(conference.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📍</span>
                          <span>{conference.location}</span>
                        </div>
                        {registration && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">👤</span>
                            <span>{registration.attendeeName}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/conference/${conference.id}`} className="flex-1">
                          <Button size="sm" fullWidth>
                            View Details
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnregister(conference.id)}
                        >
                          ✕
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Favorite Conferences */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Favorite Conferences</h2>

          {favoriteConferences.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <div className="text-4xl mb-4">🤍</div>
                <p className="text-gray-600 mb-4">You haven't added any favorites yet.</p>
                <Link href="/">
                  <Button>Browse Conferences</Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteConferences.map((conference) => (
                <Card key={conference.id} hover>
                  <div className="relative h-40 bg-gray-200">
                    {conference.imageUrl ? (
                      <img
                        src={conference.imageUrl}
                        alt={conference.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📊</span>
                      </div>
                    )}
                  </div>

                  <CardBody>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {conference.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📅</span>
                        <span>{formatDate(conference.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📍</span>
                        <span>{conference.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">💰</span>
                        <span className="font-bold text-blue-600">${conference.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/conference/${conference.id}`} className="flex-1">
                        <Button size="sm" fullWidth>
                          View Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFavorite(conference.id)}
                      >
                        💔
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
