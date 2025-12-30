import { DateTime } from "luxon";
import { prisma } from "@/lib/db/client";

export type AIGenerationType =
  | "daily"
  | "ask"
  | "self"
  | "social-life"
  | "thinking-creativity"
  | "routine"
  | "sex-love"
  | "spirituality"
  | "new-year";

export async function getCachedGeneration(
  userId: string,
  type: AIGenerationType,
  date: DateTime,
  cacheKey?: string
): Promise<any | null> {
  const dateOnly = date.startOf("day").toJSDate();
  const key = cacheKey || "";

  const cached = await prisma.aIGeneration.findUnique({
    where: {
      userId_type_date_cacheKey: {
        userId,
        type,
        date: dateOnly,
        cacheKey: key,
      },
    },
  });

  if (cached) {
    return cached.content;
  }

  return null;
}

export async function setCachedGeneration(
  userId: string,
  type: AIGenerationType,
  date: DateTime,
  content: any,
  cacheKey?: string
): Promise<void> {
  const dateOnly = date.startOf("day").toJSDate();
  const key = cacheKey || "";

  await prisma.aIGeneration.upsert({
    where: {
      userId_type_date_cacheKey: {
        userId,
        type,
        date: dateOnly,
        cacheKey: key,
      },
    },
    create: {
      userId,
      type,
      date: dateOnly,
      cacheKey: key,
      content,
    },
    update: {
      content,
      updatedAt: new Date(),
    },
  });
}
