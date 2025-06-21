import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dine-o-saur - Swipe-eat-repeat",
  description: "Discover the perfect restaurant together with your group. No login required, just swipe and decide where to eat!",
  keywords: "restaurant, discovery, group, food, dining, swipe, tinder, collaborative",
  authors: [{ name: "Dineosaur Team" }],
  openGraph: {
    title: "Dine-o-saur - Swipe-eat-repeat",
    description: "Discover the perfect restaurant together with your group. No login required, just swipe and decide where to eat!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dine-o-saur - Swipe-eat-repeat",
    description: "Discover the perfect restaurant together with your group. No login required, just swipe and decide where to eat!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
