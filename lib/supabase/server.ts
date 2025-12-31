import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const isProduction = process.env.NODE_ENV === "production";
              cookieStore.set(name, value, {
                ...options,
                httpOnly: options?.httpOnly ?? true,
                secure: options?.secure ?? isProduction,
                sameSite: (options?.sameSite as "lax" | "strict" | "none") ?? "lax",
                path: options?.path ?? "/",
              });
            });
          } catch (error) {
            if (error instanceof Error && error.message.includes("cookies()")) {
            } else {
              console.error("Error setting cookies:", error);
            }
          }
        },
      },
    }
  );
}
