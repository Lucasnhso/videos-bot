/*
  Warnings:

  - You are about to drop the column `sedDuration` on the `clip` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "videoId" TEXT NOT NULL,
    "cutlabsId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "viralityScore" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "clip_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_clip" ("created_at", "cutlabsId", "description", "id", "status", "title", "updated_at", "videoId", "viralityScore") SELECT "created_at", "cutlabsId", "description", "id", "status", "title", "updated_at", "videoId", "viralityScore" FROM "clip";
DROP TABLE "clip";
ALTER TABLE "new_clip" RENAME TO "clip";
CREATE UNIQUE INDEX "clip_cutlabsId_key" ON "clip"("cutlabsId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
