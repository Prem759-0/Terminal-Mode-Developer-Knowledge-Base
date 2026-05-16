import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'KB // KNOWLEDGE BASE',
  description: 'Terminal-mode personal knowledge management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
