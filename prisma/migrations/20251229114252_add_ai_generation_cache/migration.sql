-- CreateTable
CREATE TABLE "AIGeneration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIGeneration_userId_type_date_idx" ON "AIGeneration"("userId", "type", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AIGeneration_userId_type_date_cacheKey_key" ON "AIGeneration"("userId", "type", "date", "cacheKey");

-- AddForeignKey
ALTER TABLE "AIGeneration" ADD CONSTRAINT "AIGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
