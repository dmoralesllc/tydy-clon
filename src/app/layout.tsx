// === COPIA Y PEGA ESTE CÓDIGO COMPLETO EN src/app/layout.tsx ===

import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import 'leaflet/dist/leaflet.css';

// Objeto de Metadatos optimizado para SEO
export const metadata: Metadata = {
  // Título: Lo más importante para Google. Nombre + Servicio + Ubicación principal.
  title: 'TyDy | Mototaxis al Instante en Chaco y Corrientes',
  
  // Descripción: El "anuncio" que aparece en los resultados de Google. Debe ser atractivo.
  description: 'Pide tu mototaxi en Resistencia, Barranqueras y Corrientes con TyDy. La app de viajes más rápida, segura y económica de la región. ¡Descarga y viaja!',
  
  // Palabras Clave: Ayudan a Google a entender los temas principales de tu sitio.
  keywords: ['mototaxi', 'moto mandado', 'TyDy', 'viajes en moto', 'transporte Chaco', 'transporte Corrientes', 'app de transporte', 'Resistencia', 'Barranqueras'],
  
  // Autor y Copyright
  authors: [{ name: 'TyDy' }],
  creator: 'TyDy',
  publisher: 'TyDy',

  // Metadatos para Robots de Búsqueda
  robots: {
    index: true, // Permite que Google indexe esta página
    follow: true, // Permite que Google siga los enlaces de esta página
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph (OG): Cómo se ve tu sitio al compartirlo en redes sociales (Facebook, WhatsApp, etc.)
  openGraph: {
    title: 'TyDy | Tu Mototaxi en el NEA',
    description: 'La forma más rápida y económica de moverte por Chaco y Corrientes.',
    url: 'https://tydy.lat',
    siteName: 'TyDy',
    images: [
      {
        url: 'https://tydy.lat/icons/icon-512x512.png', // URL a tu logo principal
        width: 512,
        height: 512,
        alt: 'Logo de TyDy',
      },
    ],
    locale: 'es_AR', // Idioma y región
    type: 'website',
  },

  // Twitter Card: Cómo se ve tu sitio al compartirlo en Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'TyDy | Mototaxis al Instante en Chaco y Corrientes',
    description: 'La app de viajes más rápida, segura y económica de la región. ¡Descarga y viaja!',
    images: ['https://tydy.lat/icons/icon-512x512.png'], // URL a tu logo principal
  },
  
  // Metadatos de la PWA
  manifest: '/manifest.json',
  themeColor: '#FF0000',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png', // Icono para dispositivos Apple
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        {/* Next.js maneja la mayoría de los metadatos desde el objeto de arriba. */}
        {/* Aquí solo dejamos las fuentes y otros enlaces que no se pueden poner en 'metadata'. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}