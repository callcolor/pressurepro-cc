'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, UserRegistration } from '@/types/conference';

interface UserContextType {
  preferences: UserPreferences;
  addFavorite: (conferenceId: string) => void;
  removeFavorite: (conferenceId: string) => void;
  isFavorite: (conferenceId: string) => boolean;
  registerForConference: (registration: UserRegistration) => void;
  unregisterFromConference: (conferenceId: string) => void;
  isRegistered: (conferenceId: string) => boolean;
  getRegistration: (conferenceId: string) => UserRegistration | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'tech_conference_user_prefs';

export function UserProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteConferences: [],
    registeredConferences: [],
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      } catch (error) {
        console.error('Failed to parse user preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const addFavorite = (conferenceId: string) => {
    setPreferences((prev) => {
      if (prev.favoriteConferences.includes(conferenceId)) {
        return prev;
      }
      return {
        ...prev,
        favoriteConferences: [...prev.favoriteConferences, conferenceId],
      };
    });
  };

  const removeFavorite = (conferenceId: string) => {
    setPreferences((prev) => ({
      ...prev,
      favoriteConferences: prev.favoriteConferences.filter((id) => id !== conferenceId),
    }));
  };

  const isFavorite = (conferenceId: string): boolean => {
    return preferences.favoriteConferences.includes(conferenceId);
  };

  const registerForConference = (registration: UserRegistration) => {
    setPreferences((prev) => {
      // Check if already registered
      const existingIndex = prev.registeredConferences.findIndex(
        (r) => r.conferenceId === registration.conferenceId
      );

      if (existingIndex !== -1) {
        // Update existing registration
        const updated = [...prev.registeredConferences];
        updated[existingIndex] = registration;
        return {
          ...prev,
          registeredConferences: updated,
        };
      }

      // Add new registration
      return {
        ...prev,
        registeredConferences: [...prev.registeredConferences, registration],
      };
    });
  };

  const unregisterFromConference = (conferenceId: string) => {
    setPreferences((prev) => ({
      ...prev,
      registeredConferences: prev.registeredConferences.filter(
        (r) => r.conferenceId !== conferenceId
      ),
    }));
  };

  const isRegistered = (conferenceId: string): boolean => {
    return preferences.registeredConferences.some((r) => r.conferenceId === conferenceId);
  };

  const getRegistration = (conferenceId: string): UserRegistration | undefined => {
    return preferences.registeredConferences.find((r) => r.conferenceId === conferenceId);
  };

  return (
    <UserContext.Provider
      value={{
        preferences,
        addFavorite,
        removeFavorite,
        isFavorite,
        registerForConference,
        unregisterFromConference,
        isRegistered,
        getRegistration,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
