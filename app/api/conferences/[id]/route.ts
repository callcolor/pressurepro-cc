import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateConferenceEmbedding } from '@/lib/embeddings';

// GET /api/conferences/[id] - Get a single conference
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conference = await prisma.conference.findUnique({
      where: { id },
      include: {
        speakers: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!conference) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    // Transform data to match frontend interface
    const transformed = {
      id: conference.id,
      name: conference.name,
      description: conference.description,
      date: conference.date.toISOString().split('T')[0],
      location: conference.location,
      price: conference.price,
      category: conference.categories.map((c) => c.category.name),
      imageUrl: conference.imageUrl,
      speakers: conference.speakers,
      maxAttendees: conference.maxAttendees,
      currentAttendees: conference.currentAttendees,
      isFeatured: conference.isFeatured,
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Error fetching conference:', error);
    return NextResponse.json({ error: 'Failed to fetch conference' }, { status: 500 });
  }
}

// PUT /api/conferences/[id] - Update a conference (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Update categories if provided
    if (body.category) {
      const categoryNames = body.category;
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

      // Delete existing category associations
      await prisma.conferenceCategory.deleteMany({
        where: { conferenceId: id },
      });

      // Create new associations
      await prisma.conferenceCategory.createMany({
        data: categories.map((category) => ({
          conferenceId: id,
          categoryId: category.id,
        })),
      });
    }

    // Update conference
    const conference = await prisma.conference.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        location: body.location,
        price: body.price,
        imageUrl: body.imageUrl,
        maxAttendees: body.maxAttendees,
        currentAttendees: body.currentAttendees,
        isFeatured: body.isFeatured,
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

    return NextResponse.json(conference);
  } catch (error) {
    console.error('Error updating conference:', error);
    return NextResponse.json({ error: 'Failed to update conference' }, { status: 500 });
  }
}

// DELETE /api/conferences/[id] - Delete a conference (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.conference.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Conference deleted successfully' });
  } catch (error) {
    console.error('Error deleting conference:', error);
    return NextResponse.json({ error: 'Failed to delete conference' }, { status: 500 });
  }
}
