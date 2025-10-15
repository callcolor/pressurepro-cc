import { Conference } from '@/types/conference'
import { Prisma } from '@prisma/client'

export const transformConference = (conference: Prisma.ConferenceGetPayload<object>): Omit<Conference, 'speakers' | 'category'> => {
    return {
        id: conference.id,
        name: conference.name,
        description: conference.description,
        date: conference.date.toISOString().split('T')[0],
        location: conference.location,
        price: conference.price,
        imageUrl: conference.imageUrl ?? undefined,
        maxAttendees: conference.maxAttendees,
        currentAttendees: conference.currentAttendees,
        isFeatured: conference.isFeatured,
    };
}

export const transformConferenceDetail = (conference: Prisma.ConferenceGetPayload<{
    include: {
        speakers: true,
        categories: {
            include: {
                category: true,
            },
        },
    }
}>): Conference => {
    return {
        ...transformConference(conference),
        category: conference.categories.map((c) => c.category.name),
        speakers: conference.speakers.map(c => ({ ...c, avatarUrl: c.avatarUrl ?? undefined })),
    }
}
