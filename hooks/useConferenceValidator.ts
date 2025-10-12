import { Conference } from '@/types/conference';

export interface ConferenceValidationResult {
  isValid: boolean;
  isTechMeet2024: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Custom hook that validates conference dates and returns a "TechMeet 2024"
 * status for events in December.
 *
 * This hook checks:
 * - Whether the conference date is valid
 * - Whether the conference is in December (TechMeet 2024 special)
 * - Whether the conference is in the future
 * - Whether attendee capacity is valid
 */
export function useConferenceValidator(conference: Conference | null): ConferenceValidationResult {
  if (!conference) {
    return {
      isValid: false,
      isTechMeet2024: false,
      errors: ['No conference data provided'],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate date format and check if it's a valid date
  const conferenceDate = new Date(conference.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day for comparison

  if (isNaN(conferenceDate.getTime())) {
    errors.push('Invalid date format');
  }

  // Check if the conference is in December (TechMeet 2024 special)
  const month = conferenceDate.getMonth(); // 0-indexed (11 = December)
  const year = conferenceDate.getFullYear();
  const isTechMeet2024 = month === 11 && year === 2024;

  // Check if conference is in the past
  if (conferenceDate < today) {
    warnings.push('Conference date is in the past');
  }

  // Validate attendee capacity
  if (conference.currentAttendees > conference.maxAttendees) {
    errors.push('Current attendees exceed maximum capacity');
  }

  if (conference.maxAttendees <= 0) {
    errors.push('Maximum attendees must be greater than zero');
  }

  if (conference.currentAttendees < 0) {
    errors.push('Current attendees cannot be negative');
  }

  // Check if conference is sold out
  if (conference.currentAttendees >= conference.maxAttendees) {
    warnings.push('Conference is sold out');
  }

  // Validate price
  if (conference.price < 0) {
    errors.push('Price cannot be negative');
  }

  // Validate required fields
  if (!conference.name || conference.name.trim() === '') {
    errors.push('Conference name is required');
  }

  if (!conference.location || conference.location.trim() === '') {
    errors.push('Conference location is required');
  }

  if (!conference.category || conference.category.length === 0) {
    warnings.push('No categories specified');
  }

  return {
    isValid: errors.length === 0,
    isTechMeet2024,
    errors,
    warnings,
  };
}

/**
 * Helper function to get registration status based on conference data
 */
export function getRegistrationStatus(conference: Conference): 'Open' | 'Closed' | 'Sold Out' {
  const conferenceDate = new Date(conference.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (conferenceDate < today) {
    return 'Closed';
  }

  if (conference.currentAttendees >= conference.maxAttendees) {
    return 'Sold Out';
  }

  return 'Open';
}
