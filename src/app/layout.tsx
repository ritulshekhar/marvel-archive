import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Marvel Archive — Every Universe. Every Timeline. Every Story.',
  description: 'A cinematic, local-first archive for exploring and tracking Marvel screen stories.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
