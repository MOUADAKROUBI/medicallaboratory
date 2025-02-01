import './ui/global.css';
import { inter } from '@/app/ui/fonts';
import type { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: "%s | nome de l'aboratoire",
    default: 'tableau de borde',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
};

export const experimental_ppr = true;

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
