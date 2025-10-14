/*
  Warnings:

  - A unique constraint covering the columns `[embeddingId]` on the table `conferences` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "conferences" ADD COLUMN "embeddingId" TEXT;

-- CreateTable
CREATE TABLE "embedding" (
    "id" TEXT NOT NULL,
    "ab_text_embedding_v3" public.vector(1024),

    CONSTRAINT "embedding_pkey" PRIMARY KEY ("id")
);

-- Create Indexes
CREATE UNIQUE INDEX "conferences_embeddingId_key" ON "conferences"("embeddingId");
CREATE INDEX ab_text_embedding_v3_idx ON embedding USING hnsw(ab_text_embedding_v3 public.vector_cosine_ops);

-- AddForeignKey
ALTER TABLE "conferences" ADD CONSTRAINT "conferences_embeddingId_fkey" FOREIGN KEY ("embeddingId") REFERENCES "embedding"("id") ON DELETE SET NULL ON UPDATE CASCADE;
