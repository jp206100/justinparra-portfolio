import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://justinparra-portfolio.vercel.app"),
  title: {
    default: "Justin Parra | UX Leader & Digital Strategist",
    template: "%s | Justin Parra",
  },
  description:
    "18+ years leading design, development, and strategy teams across private and public sectors. From Toyota to the US EPA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interTight.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
