// Core TypeScript interfaces for the Tech Conference Explorer

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatarUrl?: string;
}

export interface Conference {
  id: string;
  name: string;
  description: string;
  date: string; // ISO 8601 date string
  location: string;
  price: number;
  category: string[];
  imageUrl?: string;
  speakers: Speaker[];
  maxAttendees: number;
  currentAttendees: number;
  isFeatured: boolean;
}

export type RegistrationStatus = 'Open' | 'Closed' | 'Sold Out';

export interface ConferenceFilters {
  searchTerm?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  categories?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface UserRegistration {
  conferenceId: string;
  registeredAt: string;
  attendeeName: string;
  email: string;
}

export interface UserPreferences {
  favoriteConferences: string[];
  registeredConferences: UserRegistration[];
}
