
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'TyDy | Mototaxis al Instante en Chaco y Corrientes',
  description: 'Pide tu mototaxi en Resistencia, Barranqueras y Corrientes con TyDy. La app de viajes más rápida, segura y económica de la región. ¡Descarga y viaja!',
  keywords: ['mototaxi', 'moto mandado', 'TyDy', 'viajes en moto', 'transporte Chaco', 'transporte Corrientes', 'app de transporte', 'Resistencia', 'Barranqueras'],
  authors: [{ name: 'TyDy' }],
  creator: 'TyDy',
  publisher: 'TyDy',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'TyDy | Tu Mototaxi en el NEA',
    description: 'La forma más rápida y económica de moverte por Chaco y Corrientes.',
    url: 'https://tydy.lat',
    siteName: 'TyDy',
    images: [
      {
        url: 'https://tydy.lat/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Logo de TyDy',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TyDy | Mototaxis al Instante en Chaco y Corrientes',
    description: 'La app de viajes más rápida, segura y económica de la región. ¡Descarga y viaja!',
    images: ['https://tydy.lat/icons/icon-512x512.png'],
  },
  manifest: '/manifest.json',
  themeColor: '#FF0000',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${roboto.className} antialiased bg-gray-900 text-white`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
