import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinguaLens Greek — Applied Linguistics Diagnostic",
  description: "Understand Modern Greek through linguistic diagnosis. Analyze errors and cross-linguistic transfer for Spanish and English speakers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
