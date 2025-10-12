import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RegistrationData {
  attendeeName: string;
  email: string;
  userId?: string; // Optional for now, can be added later with auth
}

// POST /api/conferences/[id]/register - Register for a conference
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: RegistrationData = await request.json();

    // Validate input
    if (!body.attendeeName || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: attendeeName, email' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const conference = await prisma.conference.findUnique({
      where: { id },
    });

    if (!conference) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    // Check if conference is sold out
    if (conference.currentAttendees >= conference.maxAttendees) {
      return NextResponse.json({ error: 'Conference is sold out' }, { status: 400 });
    }

    // Check if conference date has passed
    const conferenceDate = new Date(conference.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (conferenceDate < today) {
      return NextResponse.json({ error: 'Conference registration has closed' }, { status: 400 });
    }

    // Get or create user (for now, we'll use email as identifier)
    const user = await prisma.user.upsert({
      where: { email: body.email },
      update: { name: body.attendeeName },
      create: {
        email: body.email,
        name: body.attendeeName,
      },
    });

    // Check if already registered
    const existingRegistration = await prisma.userRegistration.findUnique({
      where: {
        userId_conferenceId: {
          userId: user.id,
          conferenceId: id,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this conference' }, { status: 400 });
    }

    // Create registration and increment attendee count
    const [registration] = await prisma.$transaction([
      prisma.userRegistration.create({
        data: {
          userId: user.id,
          conferenceId: id,
          attendeeName: body.attendeeName,
          email: body.email,
        },
      }),
      prisma.conference.update({
        where: { id },
        data: {
          currentAttendees: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Successfully registered for conference',
      registration: {
        conferenceId: id,
        conferenceName: conference.name,
        attendeeName: body.attendeeName,
        email: body.email,
        registeredAt: registration.registeredAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error registering for conference:', error);
    return NextResponse.json({ error: 'Failed to register for conference' }, { status: 500 });
  }
}
