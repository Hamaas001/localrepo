-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Warranty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "carMake" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "carRegistration" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    CONSTRAINT "Warranty_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "warrantyId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    CONSTRAINT "Note_warrantyId_fkey" FOREIGN KEY ("warrantyId") REFERENCES "Warranty" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Warranty_customerEmail_idx" ON "Warranty"("customerEmail");

-- CreateIndex
CREATE INDEX "Warranty_carRegistration_idx" ON "Warranty"("carRegistration");

-- CreateIndex
CREATE INDEX "Warranty_createdAt_idx" ON "Warranty"("createdAt");

-- CreateIndex
CREATE INDEX "Note_warrantyId_idx" ON "Note"("warrantyId");

-- CreateIndex
CREATE INDEX "Note_createdAt_idx" ON "Note"("createdAt");
