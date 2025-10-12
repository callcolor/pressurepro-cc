'use client';

import React from 'react';
import Link from 'next/link';
import { Conference } from '@/types/conference';
import { Card, CardBody, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useUser } from '@/context/UserContext';
import { getRegistrationStatus } from '@/hooks/useConferenceValidator';

interface ConferenceCardProps {
  conference: Conference;
}

export function ConferenceCard({ conference }: ConferenceCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useUser();
  const isConferenceFavorite = isFavorite(conference.id);
  const status = getRegistrationStatus(conference);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isConferenceFavorite) {
      removeFavorite(conference.id);
    } else {
      addFavorite(conference.id);
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

  const statusVariant = {
    Open: 'success' as const,
    Closed: 'default' as const,
    'Sold Out': 'danger' as const,
  };

  return (
    <Link href={`/conference/${conference.id}`}>
      <Card hover className="h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
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
          {conference.isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge variant="warning" size="sm">
                ⭐ Featured
              </Badge>
            </div>
          )}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label={isConferenceFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="text-xl">{isConferenceFavorite ? '❤️' : '🤍'}</span>
          </button>
        </div>

        <CardBody className="flex-1 flex flex-col">
          <div className="mb-2">
            <Badge variant={statusVariant[status]} size="sm">
              {status}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{conference.name}</h3>

          <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{conference.description}</p>

          <div className="mt-auto space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">📅</span>
              <span>{formatDate(conference.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">📍</span>
              <span>{conference.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">👥</span>
              <span>
                {conference.currentAttendees} / {conference.maxAttendees} attendees
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {conference.category.slice(0, 3).map((cat) => (
              <Badge key={cat} variant="info" size="sm">
                {cat}
              </Badge>
            ))}
            {conference.category.length > 3 && (
              <Badge variant="default" size="sm">
                +{conference.category.length - 3}
              </Badge>
            )}
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${conference.price}</span>
          <Button size="sm" variant="primary">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
