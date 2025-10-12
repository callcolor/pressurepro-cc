# Prisma + PostgreSQL Setup Guide

This guide will help you set up Prisma with PostgreSQL for the Tech Conference Explorer application.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install PostgreSQL

If you don't have PostgreSQL installed:

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run the installer
- Remember your postgres user password

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE tech_conference_db;

# Exit psql
\q
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/tech_conference_db?schema=public"
```

Replace `your_password` with your PostgreSQL password.

### 4. Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma Client based on your schema.

### 5. Run Database Migrations

```bash
npm run db:migrate
```

This will:
- Create all database tables
- Apply the schema to your database
- Automatically run the seed script to populate sample data

Alternatively, you can use `db:push` for development (doesn't create migration files):

```bash
npm run db:push
```

### 6. Seed the Database (if needed)

If migrations didn't automatically seed, run:

```bash
npm run db:seed
```

This will populate your database with:
- 21 category records
- 8 sample conferences with speakers
- All conference-category relationships

### 7. Verify Setup

Open Prisma Studio to view your data:

```bash
npm run db:studio
```

This opens a visual database editor at `http://localhost:5555`

## 📚 Database Schema

### Models

**User**
- Manages user accounts
- Links to registrations and favorites

**Conference**
- Main conference entity
- Includes name, description, date, location, price, capacity
- Links to speakers, categories, registrations, favorites

**Speaker**
- Conference speaker information
- Links to specific conference

**Category**
- Conference topics/tags (React, AI/ML, etc.)
- Many-to-many relationship with conferences

**ConferenceCategory**
- Join table for Conference ↔ Category relationship

**UserRegistration**
- Tracks which users registered for which conferences
- Prevents duplicate registrations

**UserFavorite**
- User's favorited conferences
- For quick access on dashboard

## 🛠 Available Scripts

### Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations (creates migration history)
npm run db:migrate

# Push schema directly (development only, no migrations)
npm run db:push

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (visual database editor)
npm run db:studio
```

## 🔧 Prisma Schema Location

The Prisma schema is located at:
```
prisma/schema.prisma
```

## 📝 Making Schema Changes

When you modify the schema:

1. Edit `prisma/schema.prisma`
2. Run migration:
   ```bash
   npm run db:migrate
   ```
3. Give your migration a descriptive name
4. The Prisma Client will be regenerated automatically

## 🗃️ Database Structure

```
tech_conference_db
├── users
│   ├── id (cuid, primary key)
│   ├── email (unique)
│   ├── name
│   ├── createdAt
│   └── updatedAt
├── conferences
│   ├── id (cuid, primary key)
│   ├── name
│   ├── description
│   ├── date
│   ├── location
│   ├── price
│   ├── imageUrl
│   ├── maxAttendees
│   ├── currentAttendees
│   ├── isFeatured
│   ├── createdAt
│   └── updatedAt
├── speakers
│   ├── id (cuid, primary key)
│   ├── name
│   ├── title
│   ├── company
│   ├── bio
│   ├── avatarUrl
│   └── conferenceId (foreign key)
├── categories
│   ├── id (cuid, primary key)
│   ├── name (unique)
│   └── slug (unique)
├── conference_categories
│   ├── conferenceId (foreign key)
│   └── categoryId (foreign key)
├── user_registrations
│   ├── id (cuid, primary key)
│   ├── userId (foreign key)
│   ├── conferenceId (foreign key)
│   ├── attendeeName
│   ├── email
│   └── registeredAt
└── user_favorites
    ├── id (cuid, primary key)
    ├── userId (foreign key)
    ├── conferenceId (foreign key)
    └── createdAt
```

## 🔐 Security Notes

- Never commit your `.env` file
- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template
- In production, use environment-specific secrets

## 🌐 Using Different PostgreSQL Hosts

### Local PostgreSQL
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/tech_conference_db"
```

### Docker PostgreSQL
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/tech_conference_db"
```

Docker Compose example:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: tech_conference_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Cloud PostgreSQL (Heroku, Railway, Neon, etc.)

Your provider will give you a connection string. Add it to your `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

## 🐛 Troubleshooting

### Connection Error: "Can't reach database server"

- Ensure PostgreSQL is running: `pg_isready -U postgres`
- Check your DATABASE_URL credentials
- Verify PostgreSQL is listening on port 5432

### Migration Error: "Database does not exist"

Create the database first:
```bash
psql -U postgres -c "CREATE DATABASE tech_conference_db;"
```

### Seed Error: "Unique constraint failed"

Reset the database:
```bash
npm run db:push -- --force-reset
npm run db:seed
```

### Prisma Client Not Found

Regenerate the client:
```bash
npm run db:generate
```

## 📖 Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

## ✨ Features Implemented

### Prisma Integration

- ✅ Full schema with relationships
- ✅ User management (auto-created on registration)
- ✅ Conference CRUD operations
- ✅ Speaker associations
- ✅ Category many-to-many relationships
- ✅ Registration tracking with duplicate prevention
- ✅ Favorite conferences
- ✅ Proper indexing for performance
- ✅ Cascade deletes for data integrity
- ✅ Transaction support for atomicity
- ✅ Seed script with sample data

### API Updates

All API routes have been updated to use Prisma:

- `GET /api/conferences` - Paginated list with filtering
- `GET /api/conferences/[id]` - Single conference with relations
- `POST /api/conferences` - Create with categories and speakers
- `PUT /api/conferences/[id]` - Update with category management
- `DELETE /api/conferences/[id]` - Delete with cascades
- `POST /api/conferences/[id]/register` - Registration with duplicate check

### Data Persistence

- All conference data persists in PostgreSQL
- User registrations are saved to the database
- Categories are managed centrally
- No more mock data limitations!

## 🚀 Next Steps

After setup, you can:

1. Start the development server: `npm run dev`
2. Access the app at: `http://localhost:3000`
3. Open Prisma Studio: `npm run db:studio`
4. Create/edit conferences through the admin panel
5. Register for conferences and see data persist
6. View all data relationships in Prisma Studio

Enjoy your fully functional database-backed conference application!
