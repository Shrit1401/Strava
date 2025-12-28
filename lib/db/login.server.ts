"use server";

import { prisma } from "./client";

export async function signupUser(
  email: string,
  name: string,
  birthDate: Date,
  birthTime: Date,
  birthPlace: string,
  birthLatitude: number,
  birthLongitude: number,
  birthTimezone: string
) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        birthDate,
        birthTime,
        birthPlace,
        birthLatitude,
        birthLongitude,
        birthTimezone,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
  }
}
