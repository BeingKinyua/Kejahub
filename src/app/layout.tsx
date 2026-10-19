import type { Metadata } from 'next';
import './globals.css';
import { PropertyProvider } from '../context/PropertyContext';

export const metadata: Metadata = {
  title: 'Kejahub - AI Property Agent',
  description: 'AI-native property management platform for Kenyan landlords with automated workflows, M-Pesa reconciliation, and WhatsApp communications.',
  openGraph: {
    title: 'Kejahub - AI Property Agent',
    description: 'AI-native property management platform for Kenyan landlords with automated workflows, M-Pesa reconciliation, and WhatsApp communications.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PropertyProvider>{children}</PropertyProvider>
      </body>
    </html>
  );
}
