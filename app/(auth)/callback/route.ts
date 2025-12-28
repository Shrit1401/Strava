import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signupUser } from "@/lib/db/login.server";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const getMonthNumber = (monthName: string): number => {
  const monthIndex = MONTHS.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase()
  );
  return monthIndex >= 0 ? monthIndex + 1 : 1;
};

const parseTime = (timeStr: string): { hour: number; minute: number } => {
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1], 10);
    const minute = parseInt(timeMatch[2], 10);
    return { hour, minute };
  }
  return { hour: 12, minute: 0 };
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const cookieStore = await cookies();
        const birthDataCookie = cookieStore.get("pending_birth_data");

        if (birthDataCookie) {
          try {
            const birthData = JSON.parse(birthDataCookie.value);

            const { hour, minute } = parseTime(birthData.birthTime);
            const month = getMonthNumber(birthData.birthMonth);
            const year = parseInt(birthData.birthYear, 10);
            const day = parseInt(birthData.birthDay, 10);

            const birthDate = new Date(year, month - 1, day);
            const birthTime = new Date(year, month - 1, day, hour, minute);

            const result = await signupUser(
              user.email || "",
              user.user_metadata?.full_name || user.user_metadata?.name || "",
              birthDate,
              birthTime,
              birthData.birthPlace,
              birthData.latitude || 0,
              birthData.longitude || 0,
              Intl.DateTimeFormat().resolvedOptions().timeZone
            );

            if (result) {
              cookieStore.delete("pending_birth_data");
            }
          } catch (error) {
            console.error("Error creating user:", error);
          }
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/signup?error=auth_failed`);
}
