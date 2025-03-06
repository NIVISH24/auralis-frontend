import type { Metadata } from "next";
import "./globals.css";
import SplashProvider from "@/components/SplashProvider";
import { powerGrotesk } from "@/fonts/font";

export const metadata: Metadata = {
  title: "Auralis",
  description:
    "Revolutionize learning with AI-powered real-time feedback, where students teach the AI and receive personalized, adaptive tutoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${powerGrotesk.variable} ${powerGrotesk.variable} antialiased`}
      >
        <SplashProvider>{children}</SplashProvider>
      </body>
    </html>
  );
}
