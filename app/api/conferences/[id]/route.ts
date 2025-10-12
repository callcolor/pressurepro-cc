import { NextRequest, NextResponse } from 'next/server';
import { mockConferences } from '@/lib/mockData';
import { Conference } from '@/types/conference';

// GET /api/conferences/[id] - Get a single conference
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conference = mockConferences.find((c) => c.id === id);

    if (!conference) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    return NextResponse.json(conference);
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
    const body: Partial<Conference> = await request.json();

    const index = mockConferences.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    // Update the conference
    const updatedConference = {
      ...mockConferences[index],
      ...body,
      id, // Ensure ID doesn't change
    };

    mockConferences[index] = updatedConference;

    return NextResponse.json(updatedConference);
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
    const index = mockConferences.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
    }

    // Remove the conference
    mockConferences.splice(index, 1);

    return NextResponse.json({ message: 'Conference deleted successfully' });
  } catch (error) {
    console.error('Error deleting conference:', error);
    return NextResponse.json({ error: 'Failed to delete conference' }, { status: 500 });
  }
}
