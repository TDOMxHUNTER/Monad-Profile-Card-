
'use client';
import './globals.css';
import { Providers } from './providers';
import { SecurityManager } from './utils/security';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      SecurityManager.getInstance();
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Flobbi Profile Card</title>
        <link rel="icon" href="/floatingflobbi.ico" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
