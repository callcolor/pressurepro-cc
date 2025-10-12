# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the "Tech Conference Explorer" - a full-stack NextJS application for discovering and managing tech conferences. It's a take-home project implementing an event management platform with conference listings, user dashboards, and admin functionality.

## Key Requirements from README.md

### Must-Have Custom Implementation
- **`useConferenceValidator` hook**: A custom hook that validates conference dates and returns a "TechMeet 2024" status for events in December. This is specifically called out in the requirements.

### Data Structure
The application uses a `Conference` interface with fields: id, name, description, date, location, price, category[], imageUrl, speakers (Speaker[]), maxAttendees, currentAttendees, isFeatured.

The `Speaker` interface includes: id, name, title, company, bio, avatarUrl.

### Core Feature Pages
1. `/` - Conference listings with search/filtering (name, date range, category, price) and pagination
2. `/conference/[id]` - Dynamic detail page with full description, speakers, registration form, social sharing
3. `/dashboard` - User's registered/favorited conferences with countdown timers
4. `/admin` - CRUD interface for conference management

## Technology Stack

- **NextJS 14+** with App Router (required)
- **TypeScript** (required)
- **Tailwind CSS** or styled-components for styling
- **API Routes** in NextJS for backend functionality
- State management via Context API, Zustand, or Redux Toolkit
- Client-side caching for performance
- Local storage/cookies for user preferences

## Development Commands

Once the project is set up, standard NextJS commands will apply:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Notes

### State Management Strategy
- Use appropriate state management (Context API for simple state, Zustand/Redux for complex)
- Implement client-side caching for conference data
- Handle loading and error states consistently across components

### API Routes Structure
API routes should be created in the NextJS `app/api/` directory:
- Conference CRUD operations
- Form handling with validation
- User preferences/favorites management

### Component Architecture
- Build reusable component library with consistent design system
- Implement error boundaries for graceful error handling
- Separate business logic into custom hooks (especially `useConferenceValidator`)
- Keep components focused and composable

### Forms and Validation
- Registration forms need proper validation
- Admin panel CRUD forms require error handling
- File upload capability for conference images (optional)

### Routing
Use NextJS App Router with file-based routing:
- Dynamic routes for conference details: `/conference/[id]`
- Protected routes for dashboard and admin areas
- Proper meta tags for SEO on all pages

## Important Constraints

- **Time Target**: 4-6 hours of development, maximum 8 hours
- **Original Implementation**: Avoid solely using AI to generate code - show problem-solving approach
- **Quality Over Quantity**: Well-implemented core features are better than many incomplete ones
- **Responsive Design**: Must work on mobile and desktop
- **Accessibility**: Include ARIA labels and keyboard navigation

## Evaluation Criteria Focus

The project will be evaluated on:
- React/NextJS proficiency and best practices
- TypeScript usage and type safety
- Component architecture and reusability
- State management and data flow
- Clean, maintainable code with proper error handling
- Accessibility and responsive design
- Git commit history showing development process
