# Tech Conference Explorer

A full-stack NextJS application for discovering and managing tech conferences. Built as a take-home project showcasing modern React/NextJS development practices.

## 🚀 Features Implemented

### Core Features

1. **Conference Listings Page** (`/`)
   - Grid display of tech conferences with complete information
   - Advanced search and filtering:
     - Search by name, location, or description
     - Filter by date range
     - Filter by categories (React, AI/ML, DevOps, etc.)
     - Filter by price range
   - Pagination for large datasets
   - Responsive design for mobile and desktop
   - Featured conference badges
   - Favorite/unfavorite functionality

2. **Conference Detail Page** (`/conference/[id]`)
   - Full conference information with detailed description
   - Speaker profiles with bio and company info
   - Registration form with validation
   - Social sharing buttons (Twitter, Facebook, LinkedIn, Copy Link)
   - Visual capacity indicator
   - Dynamic routing using NextJS App Router
   - Shows "TechMeet 2024" badge for December conferences

3. **User Dashboard** (`/dashboard`)
   - View all registered conferences
   - Manage favorite conferences
   - Countdown timers for upcoming events
   - Statistics overview (registered, favorites, upcoming)
   - Quick unregister and remove favorite actions
   - Empty state guidance

4. **Admin Panel** (`/admin`)
   - Full CRUD interface for conference management
   - Create new conferences with comprehensive form
   - Edit existing conferences
   - Delete conferences with confirmation
   - Form validation and error handling
   - Category management with tag interface
   - Featured conference toggle

### Technical Implementation

#### Custom Hook: `useConferenceValidator`
- ✅ **Required custom implementation** as specified in requirements
- Validates conference dates and data
- Returns "TechMeet 2024" status for events in December
- Checks for valid dates, capacity, pricing, and required fields
- Provides detailed validation errors and warnings
- Helper function for registration status (Open/Closed/Sold Out)

#### State Management
- Context API for user preferences (favorites, registrations)
- LocalStorage persistence for user data
- Client-side caching for conference data
- Consistent loading and error states across all pages

#### API Routes
- `GET /api/conferences` - List conferences with filtering and pagination
- `GET /api/conferences/[id]` - Get single conference
- `POST /api/conferences` - Create conference (admin)
- `PUT /api/conferences/[id]` - Update conference (admin)
- `DELETE /api/conferences/[id]` - Delete conference (admin)
- `POST /api/conferences/[id]/register` - Register for conference

#### UI Components
Reusable component library with consistent design:
- `Button` - Multiple variants (primary, secondary, outline, ghost, danger)
- `Card` - Composable card with Header, Body, Footer
- `Input` - Form input with validation and error display
- `Badge` - Status indicators
- `LoadingSpinner` - Loading states
- `ConferenceCard` - Conference display component
- `ConferenceFilters` - Advanced filtering interface
- `RegistrationForm` - Registration with validation

#### Error Handling
- Error boundaries for graceful error recovery
- Custom error pages (404, 500)
- Loading states with spinners
- Validation feedback on forms
- API error handling with user-friendly messages

## 🛠 Technology Stack

- **NextJS 15.5.4** with App Router
- **React 19** with modern hooks
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Context API** for state management
- **LocalStorage** for data persistence

## 📁 Project Structure

```
pressurepro-cc/
├── app/
│   ├── api/
│   │   └── conferences/         # API routes for CRUD operations
│   ├── conference/[id]/         # Dynamic conference detail pages
│   ├── dashboard/               # User dashboard
│   ├── admin/                   # Admin panel
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page with listings
│   ├── error.tsx                # Error boundary page
│   ├── not-found.tsx            # 404 page
│   └── loading.tsx              # Loading state
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── admin/                   # Admin-specific components
│   ├── ConferenceCard.tsx       # Conference display card
│   ├── ConferenceFilters.tsx    # Filtering interface
│   ├── RegistrationForm.tsx     # Registration form
│   └── ErrorBoundary.tsx        # Error boundary component
├── context/
│   └── UserContext.tsx          # User state management
├── hooks/
│   └── useConferenceValidator.ts # Custom validation hook
├── lib/
│   └── mockData.ts              # Sample conference data
└── types/
    └── conference.ts            # TypeScript interfaces
```

## 🎯 Key Design Decisions

### 1. State Management
- Used Context API for simplicity and to avoid over-engineering
- LocalStorage for persistence without backend database
- Suitable for the scale of this project

### 2. Mock Data
- Created 8 diverse sample conferences covering various tech topics
- Includes conferences in different dates (past, present, future)
- December conference to showcase TechMeet 2024 feature
- Realistic speaker profiles and descriptions

### 3. Component Architecture
- Focused on reusability and composition
- Separated business logic into custom hooks
- Kept components focused and single-purpose
- Used TypeScript for type safety throughout

### 4. Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Semantic HTML structure
- Focus states on all interactive elements
- Screen reader friendly

### 5. Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interface elements
- Collapsible filters on mobile

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

### Run Linter

```bash
npm run lint
```

## 📝 Usage Guide

### Browsing Conferences
1. Visit the home page to see all conferences
2. Use filters on the left sidebar to narrow down results
3. Click on any conference card to view details

### Registering for a Conference
1. Navigate to a conference detail page
2. Click "Register for Conference"
3. Fill in your name and email
4. Submit the form

### Managing Your Dashboard
1. Click "Dashboard" in the navigation
2. View your registered and favorite conferences
3. See countdown timers for upcoming events
4. Unregister or remove favorites as needed

### Admin Functions
1. Navigate to `/admin`
2. Click "Create Conference" to add new conferences
3. Edit existing conferences by clicking "Edit"
4. Delete conferences with the "Delete" button

## ✨ Highlights

### Custom `useConferenceValidator` Hook
Located in `hooks/useConferenceValidator.ts`, this custom hook:
- Validates conference dates and returns validation results
- Identifies December conferences as "TechMeet 2024" special events
- Checks capacity constraints and date validity
- Provides detailed error and warning messages
- Used throughout the application for consistent validation

Example usage:
```typescript
const validation = useConferenceValidator(conference);
if (validation.isTechMeet2024) {
  // Show special TechMeet 2024 badge
}
```

### Featured Functionality
- Real-time countdown timers for upcoming events
- Social sharing integration
- Favorite/unfavorite with visual feedback
- Registration status indicators (Open/Closed/Sold Out)
- Visual capacity bars
- Responsive image handling

## 🧪 Testing Approach

The application has been tested for:
- Component rendering across different screen sizes
- Form validation and error handling
- API endpoint functionality
- State management and persistence
- Navigation and routing
- Error boundary behavior
- Loading states

## 🔮 Future Improvements

Given more time, I would add:

1. **Backend Integration**
   - Real database (PostgreSQL or MongoDB)
   - User authentication with JWT
   - Persistent conference data
   - Image upload to cloud storage

2. **Enhanced Features**
   - Email notifications for upcoming events
   - Calendar export (iCal format)
   - Advanced search with fuzzy matching
   - Conference recommendations
   - User profiles and reviews
   - Payment integration for registration fees

3. **Performance Optimizations**
   - Image optimization with next/image
   - Server-side rendering for SEO
   - Incremental static regeneration
   - Query caching with React Query
   - Virtual scrolling for large lists

4. **Testing**
   - Unit tests with Jest
   - Integration tests with React Testing Library
   - E2E tests with Playwright
   - Visual regression testing

5. **Accessibility**
   - Complete WCAG 2.1 AA compliance
   - Screen reader testing
   - Keyboard navigation improvements
   - High contrast mode

6. **Developer Experience**
   - Storybook for component documentation
   - Husky for pre-commit hooks
   - Conventional commits
   - Automated deployment pipeline

## 📊 Technical Considerations

### Performance
- Implemented pagination to handle large datasets
- Used React's built-in optimizations (keys, memoization where needed)
- Lazy loading for images
- Optimized bundle size by avoiding heavy dependencies

### Security
- Input validation on all forms
- XSS prevention with React's built-in escaping
- CSRF protection ready for backend integration
- Type-safe API routes

### Maintainability
- Clear file structure and naming conventions
- TypeScript for type safety
- Reusable components
- Comprehensive error handling
- Code comments where necessary

## 🤝 Contributing

This is a take-home project, but the code demonstrates:
- Clean, readable code with proper structure
- Component reusability and separation of concerns
- Error handling and edge case management
- Performance considerations
- TypeScript best practices
- Modern React patterns

## 📄 License

This project is created for demonstration purposes as part of a take-home assignment.

## 👨‍💻 Development Notes

**Time Spent**: ~6 hours
**Focus Areas**:
- Core functionality over bonus features
- Clean, maintainable code
- User experience and accessibility
- TypeScript type safety
- Component reusability

**Challenges Overcome**:
- Implementing robust filtering with multiple criteria
- Creating a reusable component library
- Managing state across multiple pages
- Handling edge cases in validation
- Building responsive layouts

---

Built with ❤️ using NextJS, React, and TypeScript
