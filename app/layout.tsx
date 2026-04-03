import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'DMWT Betting',
  description: 'Prediction market game with fake money, Discord login, and admin-managed markets.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
