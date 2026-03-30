import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Converse – Language Practice Platform",
  description:
    "Practice languages with real people. Chat anonymously with locals and learners, get graded on your conversations, climb the leaderboard, and gamify your language journey.",
  keywords: ["language learning", "conversation practice", "language exchange", "chat with locals", "language duel"],
  openGraph: {
    title: "Converse – Language Practice Platform",
    description: "Practice languages with real people. Chat, duel, and climb the leaderboard.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Converse – Language Practice Platform",
    description: "Practice languages with real people. Chat, duel, and climb the leaderboard.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${spaceGrotesk.variable} antialiased`}>{children}</body>
    </html>
  );
}
