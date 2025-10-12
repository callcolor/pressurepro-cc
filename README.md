# Tech Conference Explorer

A full-stack NextJS application for discovering and managing tech conferences, built with NextJS 15, React 19, TypeScript, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up PostgreSQL database:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE tech_conference_db;"
```

3. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/tech_conference_db?schema=public"
```

4. **Initialize database:**
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations and seed data
npm run db:migrate

# Or use push for development
npm run db:push
npm run db:seed
```

5. **Start development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[PRISMA_SETUP.md](PRISMA_SETUP.md)** - Detailed Prisma and PostgreSQL setup guide
- **[PROJECT_README.md](PROJECT_README.md)** - Original project documentation with technical details

## ✨ Features

### Core Functionality

**1. Conference Listings** (`/`)
- Grid display with search and filtering
- Filter by name, date range, categories, price
- Pagination support
- Favorite conferences
- Featured conference badges

**2. Conference Details** (`/conference/[id]`)
- Complete conference information
- Speaker profiles
- Registration form with validation
- Social sharing (Twitter, Facebook, LinkedIn)
- Capacity indicators
- TechMeet 2024 badge for December events

**3. User Dashboard** (`/dashboard`)
- View registered conferences
- Manage favorite conferences
- Countdown timers for upcoming events
- Statistics overview
- Quick actions

**4. Admin Panel** (`/admin`)
- Full CRUD interface for conferences
- Create/Edit/Delete conferences
- Category management
- Form validation
- Real-time updates

### Database Features (Prisma + PostgreSQL)

- ✅ Persistent data storage
- ✅ User management (auto-created on registration)
- ✅ Relational data (conferences, speakers, categories, users)
- ✅ Transaction support for data integrity
- ✅ Duplicate registration prevention
- ✅ Cascade deletes for cleanup
- ✅ Optimized queries with indexing
- ✅ Many-to-many category relationships

## 🛠 Technology Stack

### Frontend
- **NextJS 15** with App Router
- **React 19** with modern hooks
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Context API** for state management

### Backend
- **Prisma ORM** for database operations
- **PostgreSQL** for data persistence
- **NextJS API Routes** for serverless functions
- **Server-side validation** and error handling

### Development Tools
- **ESLint** for code quality
- **Prisma Studio** for database visualization
- **tsx** for TypeScript execution

## 📁 Project Structure

```
tech-conference-explorer/
├── app/
│   ├── api/
│   │   ├── conferences/      # Conference CRUD endpoints
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts
│   │   │   │   └── register/
│   │   │   └── route.ts
│   │   └── categories/       # Category endpoints
│   ├── conference/[id]/      # Dynamic conference pages
│   ├── dashboard/            # User dashboard
│   ├── admin/                # Admin panel
│   ├── layout.tsx            # Root layout with navigation
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── admin/                # Admin components
│   ├── ConferenceCard.tsx
│   ├── ConferenceFilters.tsx
│   ├── RegistrationForm.tsx
│   └── ErrorBoundary.tsx
├── context/
│   └── UserContext.tsx       # User state management
├── hooks/
│   └── useConferenceValidator.ts  # Custom validation hook
├── lib/
│   ├── prisma.ts             # Prisma client instance
│   └── mockData.ts           # Helper functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Sample data seeder
├── types/
│   └── conference.ts         # TypeScript interfaces
├── .env                      # Environment variables (not committed)
├── .env.example              # Environment template
└── package.json
```

## 🗄️ Database Schema

### Tables

- **users** - User accounts and authentication
- **conferences** - Conference information
- **speakers** - Conference speakers
- **categories** - Conference topics/tags
- **conference_categories** - Conference-Category junction table
- **user_registrations** - User conference registrations
- **user_favorites** - User favorite conferences

### Relationships

- User → UserRegistrations (1:many)
- User → UserFavorites (1:many)
- Conference → Speakers (1:many)
- Conference → Categories (many:many)
- Conference → UserRegistrations (1:many)
- Conference → UserFavorites (1:many)

See [PRISMA_SETUP.md](PRISMA_SETUP.md) for detailed schema documentation.

## 🎯 Key Features

### Custom `useConferenceValidator` Hook
Required custom implementation that:
- Validates conference dates and data integrity
- Returns "TechMeet 2024" status for December conferences
- Provides comprehensive validation errors and warnings
- Used throughout the application for consistent validation

### State Management
- Context API for user preferences (favorites, registrations)
- LocalStorage for client-side persistence
- Server-side data with Prisma for true persistence
- Optimistic UI updates with server reconciliation

### API Architecture
- RESTful endpoints with proper HTTP methods
- Server-side validation and error handling
- Transaction support for atomic operations
- Proper status codes and error messages

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations (recommended)
npm run db:push      # Push schema (development)
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio
```

## 🔧 Environment Variables

```env
# Database (Required)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"

# Development
NODE_ENV="development"
```

## 🧪 Sample Data

The seed script creates:
- **8 conferences** covering various tech topics
- **12 speakers** with diverse backgrounds
- **21 categories** (React, AI/ML, DevOps, etc.)
- Conferences with varying dates (past, present, future)
- Featured and sold-out conferences for testing

## 🚢 Deployment

### Prerequisites for Production
1. PostgreSQL database (Heroku, Railway, Neon, Supabase, etc.)
2. Node.js hosting (Vercel, Netlify, Railway, etc.)
3. Environment variables configured

### Deployment Steps

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add DATABASE_URL
```

**Railway:**
1. Create PostgreSQL database
2. Link GitHub repository
3. Add DATABASE_URL environment variable
4. Deploy automatically

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run db:generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready -U postgres

# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### Prisma Client Issues
```bash
# Regenerate client
npm run db:generate

# Reset database (⚠️ deletes all data)
npm run db:push -- --force-reset
npm run db:seed
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

## 🤝 Contributing

This is a take-home project demonstrating:
- Modern React/NextJS patterns
- Prisma ORM best practices
- TypeScript type safety
- RESTful API design
- Component architecture
- State management
- Database design

## 📄 License

This project is created for demonstration purposes.

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📞 Support

For detailed setup instructions:
- See [PRISMA_SETUP.md](PRISMA_SETUP.md) for database setup
- See [PROJECT_README.md](PROJECT_README.md) for project details

---

Built with ❤️ using NextJS, React, TypeScript, Prisma, and PostgreSQL
