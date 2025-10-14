import OpenAI from 'openai';
import prisma from './prisma';
import { Conference } from '@prisma/client';

const embeddingModel = new OpenAI({
    apiKey: process.env.ALI_API_KEY,
    baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1', // alibaba embedding API base URL
});

export const getTextEmbedding = async (input: string): Promise<number[]> => {
    const response = await embeddingModel.embeddings.create({
        dimensions: 1024,
        encoding_format: 'float',
        input,
        model: 'text-embedding-v3',
    });

    return response.data[0].embedding;
};

export const updateConferenceEmbedding = async (conference: Conference) => {
    try {
        const text = 'Conference details. ' +
            `Name: ${conference.name}. ` +
            `Description: ${conference.description}. ` +
            `Location: ${conference.location}. ` +
            `Price: ${conference.price}. `
            ;
        const textEmbedding = await getTextEmbedding(text);

        if (!conference.embeddingId) {
            const embedding = await prisma.embedding.create({
                data: { Conference: { connect: { id: conference.id } } }
            });
            conference.embeddingId = embedding.id;
        }

        await prisma.$queryRaw`
        update "embedding" set ab_text_embedding_v3 = ${textEmbedding} where id = ${conference.embeddingId}
      `;
    } catch (e) {
        console.error(e);
    }
}
