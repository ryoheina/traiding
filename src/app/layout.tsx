import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wolf Trading - Professional Trading Team",
  description: "Elite trading team providing professional market analysis, trading strategies, and investment insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
