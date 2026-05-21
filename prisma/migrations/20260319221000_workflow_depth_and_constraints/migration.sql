ALTER TABLE "User"
ADD COLUMN "bio" TEXT;

CREATE TYPE "ReviewPriority" AS ENUM ('low', 'medium', 'high');

ALTER TABLE "Entry"
ADD COLUMN "reviewPriority" "ReviewPriority" NOT NULL DEFAULT 'medium',
ADD COLUMN "reviewDueAt" TIMESTAMP(3),
ADD COLUMN "reviewStartedAt" TIMESTAMP(3),
ADD COLUMN "statusChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Entry"
SET "statusChangedAt" = COALESCE("updatedAt", CURRENT_TIMESTAMP);

ALTER TABLE "SavedSearch"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Notification"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "Favorite_userId_entryId_key" ON "Favorite"("userId", "entryId");
CREATE UNIQUE INDEX "CollectionEntry_collectionId_entryId_key" ON "CollectionEntry"("collectionId", "entryId");
