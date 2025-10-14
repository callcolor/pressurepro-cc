import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { updateConferenceEmbedding } from '@/lib/embeddings';

// GET /api/conferences - Get all conferences with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build where clause for filtering
    const where: Prisma.ConferenceWhereInput = {};

    // Search filter
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { location: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Date range filter
    const dateStart = searchParams.get('dateStart');
    const dateEnd = searchParams.get('dateEnd');
    if (dateStart || dateEnd) {
      where.date = {};
      if (dateStart) where.date.gte = new Date(dateStart);
      if (dateEnd) where.date.lte = new Date(dateEnd);
    }

    // Category filter
    const categoriesParam = searchParams.get('categories');
    if (categoriesParam) {
      const categoryNames = categoriesParam.split(',').filter(Boolean);
      where.categories = {
        some: {
          category: {
            name: { in: categoryNames },
          },
        },
      };
    }

    // Price range filter
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = Number(priceMin);
      if (priceMax) where.price.lte = Number(priceMax);
    }

    // Pagination
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    // Fetch conferences with relations
    const [conferences, total] = await Promise.all([
      prisma.conference.findMany({
        where,
        include: {
          speakers: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { date: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.conference.count({ where }),
    ]);

    // Transform data to match frontend interface
    const transformedConferences = conferences.map((conf) => ({
      id: conf.id,
      name: conf.name,
      description: conf.description,
      date: conf.date.toISOString().split('T')[0],
      location: conf.location,
      price: conf.price,
      category: conf.categories.map((c) => c.category.name),
      imageUrl: conf.imageUrl,
      speakers: conf.speakers,
      maxAttendees: conf.maxAttendees,
      currentAttendees: conf.currentAttendees,
      isFeatured: conf.isFeatured,
    }));

    return NextResponse.json({
      conferences: transformedConferences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.date || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields: name, date, location' },
        { status: 400 }
      );
    }

    // Get or create categories
    const categoryNames = body.category || [];
    const categories = await Promise.all(
      categoryNames.map(async (name: string) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return prisma.category.upsert({
          where: { slug },
          update: {},
          create: { name, slug },
        });
      })
    );

    // Create conference with speakers and categories
    const conference = await prisma.conference.create({
      data: {
        name: body.name,
        description: body.description,
        date: new Date(body.date),
        location: body.location,
        price: body.price,
        imageUrl: body.imageUrl,
        maxAttendees: body.maxAttendees,
        currentAttendees: body.currentAttendees || 0,
        isFeatured: body.isFeatured || false,
        speakers: body.speakers
          ? {
            create: body.speakers.map((speaker: Prisma.SpeakerCreateInput) => ({
              name: speaker.name,
              title: speaker.title,
              company: speaker.company,
              bio: speaker.bio,
              avatarUrl: speaker.avatarUrl,
            })),
          }
          : undefined,
        categories: {
          create: categories.map((category) => ({
            categoryId: category.id,
          })),
        },
      },
      include: {
        speakers: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    updateConferenceEmbedding(conference);

    return NextResponse.json(conference, { status: 201 });
  } catch (error) {
    console.error('Error creating conference:', error);
    return NextResponse.json({ error: 'Failed to create conference' }, { status: 500 });
  }
}
