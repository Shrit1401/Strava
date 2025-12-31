import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default:
      "Strava - Astrology Website | Decipher Human Relations Through Real Data",
    template: "%s | Strava",
  },
  description:
    "The astrology website that deciphers the mystery of human relations through real data and biting truth. Get accurate birth chart readings and real-time astrological insights powered by NASA data.",
  keywords: [
    "astrology",
    "birth chart",
    "natal chart",
    "horoscope",
    "astrological predictions",
    "human relations",
    "zodiac",
    "planets",
    "astrology readings",
    "astrology website",
  ],
  authors: [{ name: "Shrit Shrivastava" }],
  creator: "Shrit Shrivastava",
  publisher: "Strava",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Strava",
    title:
      "Strava - Astrology Website | Decipher Human Relations Through Real Data",
    description:
      "The astrology website that deciphers the mystery of human relations through real data and biting truth. Get accurate birth chart readings and real-time astrological insights powered by NASA data.",
    images: [
      {
        url: "/meta.png",
        width: 1200,
        height: 630,
        alt: "Strava - The astrology website that deciphers the mystery of human relations through real data and biting truth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Strava - Astrology Website | Decipher Human Relations Through Real Data",
    description:
      "The astrology website that deciphers the mystery of human relations through real data and biting truth.",
    images: ["/meta.png"],
    creator: "@strava",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "astrology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
