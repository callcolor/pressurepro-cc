import { NextRequest, NextResponse } from 'next/server';
import { mockConferences } from '@/lib/mockData';

interface RegistrationData {
  attendeeName: string;
  email: string;
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

    const conference = mockConferences.find((c) => c.id === id);

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

    // Increment attendee count
    conference.currentAttendees += 1;

    return NextResponse.json({
      message: 'Successfully registered for conference',
      registration: {
        conferenceId: id,
        conferenceName: conference.name,
        attendeeName: body.attendeeName,
        email: body.email,
        registeredAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error registering for conference:', error);
    return NextResponse.json({ error: 'Failed to register for conference' }, { status: 500 });
  }
}
