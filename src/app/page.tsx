'use client';

import Link from 'next/link';
import { Car, User } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
          TyDy
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-md">
          La plataforma que conecta conductores y pasajeros de forma rápida y segura.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Opción para Pasajero */}
        <Link href="/passenger" legacyBehavior>
          <a className="group bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-700/80 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-red-500">
            <User size={64} className="mb-6 text-red-400 group-hover:text-red-500 transition-colors" />
            <h2 className="text-3xl font-bold mb-2">Soy Pasajero</h2>
            <p className="text-gray-400 mb-6">Encuentra un viaje, llega a tu destino y califica tu experiencia. Todo en un solo lugar.</p>
            <span className="font-semibold text-red-500 group-hover:underline">
              Ir a la App de Pasajero &rarr;
            </span>
          </a>
        </Link>

        {/* Opción para Conductor */}
        <Link href="/driver" legacyBehavior>
          <a className="group bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-700/80 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-red-500">
            <Car size={64} className="mb-6 text-red-400 group-hover:text-red-500 transition-colors" />
            <h2 className="text-3xl font-bold mb-2">Soy Conductor</h2>
            <p className="text-gray-400 mb-6">Conduce, gana dinero, gestiona tus viajes y accede a recompensas exclusivas.</p>
            <span className="font-semibold text-red-500 group-hover:underline">
              Ir a la App de Conductor &rarr;
            </span>
          </a>
        </Link>
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} TyDy Clon. Un proyecto de demostración.</p>
        <p>Creado con Next.js, Tailwind CSS y mucho ❤️</p>
      </footer>
    </div>
  );
}
