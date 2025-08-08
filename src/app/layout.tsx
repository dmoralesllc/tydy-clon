// === COPIA Y PEGA ESTE CÓDIGO COMPLETO EN src/app/layout.tsx ===

import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: 'TyDy - Tu viaje, a tu manera', // <-- He mejorado el título para que sea más descriptivo
  description: 'La forma más rápida y económica de moverte por Chaco y Corrientes.', // <-- He mejorado la descripción
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark"> {/* <-- Cambiado a "es" para español */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* === AÑADE ESTAS DOS LÍNEAS AQUÍ === */}
        <meta name="theme-color" content="#FF0000" />
        <link rel="manifest" href="/manifest.json" />
        {/* === FIN DE LAS LÍNEAS AÑADIDAS === */}
        
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}