import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sora, Outfit } from 'next/font/google';
import "./globals.css";

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin']
})

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Vybe",
  description: "A Next.JS application using Spotify API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${outfit.variable} antialiased flex items-center justify-center`}>
        {children}
      </body>
    </html>
  );
}
