import { NextRequest, NextResponse } from 'next/server';
import { mockConferences } from '@/lib/mockData';
import { Conference, ConferenceFilters } from '@/types/conference';

// GET /api/conferences - Get all conferences with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filters from query parameters
    const filters: ConferenceFilters = {
      searchTerm: searchParams.get('search') || undefined,
      dateRange: {
        start: searchParams.get('dateStart') || undefined,
        end: searchParams.get('dateEnd') || undefined,
      },
      categories: searchParams.get('categories')?.split(',').filter(Boolean) || undefined,
      priceRange: {
        min: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
        max: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      },
    };

    let filtered = [...mockConferences];

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (conf) =>
          conf.name.toLowerCase().includes(term) ||
          conf.description.toLowerCase().includes(term) ||
          conf.location.toLowerCase().includes(term)
      );
    }

    // Apply date range filter
    if (filters.dateRange?.start) {
      filtered = filtered.filter((conf) => conf.date >= filters.dateRange!.start!);
    }
    if (filters.dateRange?.end) {
      filtered = filtered.filter((conf) => conf.date <= filters.dateRange!.end!);
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((conf) =>
        conf.category.some((cat) => filters.categories!.includes(cat))
      );
    }

    // Apply price range filter
    if (filters.priceRange?.min !== undefined) {
      filtered = filtered.filter((conf) => conf.price >= filters.priceRange!.min!);
    }
    if (filters.priceRange?.max !== undefined) {
      filtered = filtered.filter((conf) => conf.price <= filters.priceRange!.max!);
    }

    // Pagination
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedResults = filtered.slice(startIndex, endIndex);

    return NextResponse.json({
      conferences: paginatedResults,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching conferences:', error);
    return NextResponse.json({ error: 'Failed to fetch conferences' }, { status: 500 });
  }
}

// POST /api/conferences - Create a new conference (admin)
export async function POST(request: NextRequest) {
  try {
    const body: Conference = await request.json();

    // Validate required fields
    if (!body.name || !body.date || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields: name, date, location' },
        { status: 400 }
      );
    }

    // In a real app, this would save to a database
    // For now, we'll just return the created conference with a generated ID
    const newConference: Conference = {
      ...body,
      id: `conf-${Date.now()}`,
      currentAttendees: body.currentAttendees || 0,
      isFeatured: body.isFeatured || false,
    };

    // Simulate adding to our mock data (note: this won't persist in this implementation)
    mockConferences.push(newConference);

    return NextResponse.json(newConference, { status: 201 });
  } catch (error) {
    console.error('Error creating conference:', error);
    return NextResponse.json({ error: 'Failed to create conference' }, { status: 500 });
  }
}
