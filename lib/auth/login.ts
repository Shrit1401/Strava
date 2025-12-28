"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function login(birthData?: {
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  birthTime: string;
  birthPlace: string;
  latitude?: number;
  longitude?: number;
}) {
  if (birthData) {
    const cookieStore = await cookies();
    cookieStore.set("pending_birth_data", JSON.stringify(birthData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
    });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    console.error(error);
  }
}
