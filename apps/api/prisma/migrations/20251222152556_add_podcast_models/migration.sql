-- CreateEnum
CREATE TYPE "PodcastStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateTable
CREATE TABLE "podcast_series" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,

    CONSTRAINT "podcast_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcasts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "status" "PodcastStatus" NOT NULL DEFAULT 'DRAFT',
    "releaseDate" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "seriesId" TEXT,
    "episodeNumber" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "podcasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcast_reactions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ReactionType" NOT NULL,
    "podcastId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "podcast_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcast_comments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "podcastId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "podcast_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "podcast_series_title_idx" ON "podcast_series"("title");

-- CreateIndex
CREATE INDEX "podcasts_status_releaseDate_idx" ON "podcasts"("status", "releaseDate");

-- CreateIndex
CREATE INDEX "podcasts_seriesId_episodeNumber_idx" ON "podcasts"("seriesId", "episodeNumber");

-- CreateIndex
CREATE INDEX "podcast_reactions_podcastId_type_idx" ON "podcast_reactions"("podcastId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "podcast_reactions_podcastId_userId_key" ON "podcast_reactions"("podcastId", "userId");

-- CreateIndex
CREATE INDEX "podcast_comments_podcastId_createdAt_idx" ON "podcast_comments"("podcastId", "createdAt");

-- CreateIndex
CREATE INDEX "podcast_comments_parentId_idx" ON "podcast_comments"("parentId");

-- AddForeignKey
ALTER TABLE "podcasts" ADD CONSTRAINT "podcasts_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "podcast_series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_reactions" ADD CONSTRAINT "podcast_reactions_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "podcasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_reactions" ADD CONSTRAINT "podcast_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_comments" ADD CONSTRAINT "podcast_comments_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "podcasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_comments" ADD CONSTRAINT "podcast_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_comments" ADD CONSTRAINT "podcast_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "podcast_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
