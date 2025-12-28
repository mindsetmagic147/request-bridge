/*
  Warnings:

  - Added the required column `accessToken` to the `RequestPage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RequestPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "accessToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT,
    CONSTRAINT "RequestPage_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_RequestPage" ("createdAt", "id", "ownerId", "slug", "title") SELECT "createdAt", "id", "ownerId", "slug", "title" FROM "RequestPage";
DROP TABLE "RequestPage";
ALTER TABLE "new_RequestPage" RENAME TO "RequestPage";
CREATE UNIQUE INDEX "RequestPage_slug_key" ON "RequestPage"("slug");
CREATE UNIQUE INDEX "RequestPage_accessToken_key" ON "RequestPage"("accessToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
