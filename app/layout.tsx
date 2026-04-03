import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMWT Markets',
  description: 'Sleek demo prediction market landing page with animated odds and Discord login.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
