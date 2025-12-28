-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "birthTime" TIMESTAMP(3) NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthLatitude" DOUBLE PRECISION NOT NULL,
    "birthLongitude" DOUBLE PRECISION NOT NULL,
    "birthTimezone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
