import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corporate Brain — Decision memory grounded in evidence",
  description:
    "Turn organizational evidence into traceable decisions and durable corporate memory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
