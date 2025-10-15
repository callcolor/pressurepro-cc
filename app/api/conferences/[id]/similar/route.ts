import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Conference } from '@prisma/client';
import { transformConference } from '../../transformConference';

// GET /api/conferences/[id]/similar - Get similar conferences
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const conference = await prisma.conference.findUnique({
            where: { id },
            select: { embeddingId: true }
        });

        if (!conference) {
            return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
        }

        const similarConferences = await prisma.$queryRaw<Conference[]>`
            select 
                c.*,
                e.ab_text_embedding_v3 <=> (select ab_text_embedding_v3 from "embedding"  where id = ${conference.embeddingId}) as cosin
            from conferences c
            left join embedding e on c."embeddingId" = e.id
            where e.ab_text_embedding_v3 is not null
                and e.id != ${conference.embeddingId}
            order by cosin 
            limit 3
        `;

        const transformed = similarConferences.map(transformConference);

        return NextResponse.json(transformed);
    } catch (error) {
        console.error('Error fetching conference:', error);
        return NextResponse.json({ error: 'Failed to fetch conference' }, { status: 500 });
    }
}