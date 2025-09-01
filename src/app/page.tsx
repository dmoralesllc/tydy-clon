'use client';

import Link from 'next/link';
import { Car, User, Video } from 'lucide-react';

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
          TyDy
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
          Tu plataforma todo-en-uno. Conecta con conductores, pasajeros y una nueva comunidad de contenido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Opción para Pasajero */}
        <Link href="/passenger" legacyBehavior>
          <a className="group bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-700/80 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-red-500">
            <User size={56} className="mb-5 text-red-400 group-hover:text-red-500 transition-colors" />
            <h2 className="text-2xl font-bold mb-2">Soy Pasajero</h2>
            <p className="text-gray-400">Encuentra un viaje de forma rápida y segura.</p>
          </a>
        </Link>

        {/* Opción para Red Social */}
        <Link href="/feed" legacyBehavior>
          <a className="group bg-red-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-red-400 scale-105">
            <Video size={56} className="mb-5 text-white transition-transform group-hover:rotate-6" />
            <h2 className="text-2xl font-bold mb-2">Explorar Contenido</h2>
            <p className="text-red-200">Descubre videos, directos y más.</p>
          </a>
        </Link>

        {/* Opción para Conductor */}
        <Link href="/driver" legacyBehavior>
          <a className="group bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-700/80 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-red-500">
            <Car size={56} className="mb-5 text-red-400 group-hover:text-red-500 transition-colors" />
            <h2 className="text-2xl font-bold mb-2">Soy Conductor</h2>
            <p className="text-gray-400">Gana dinero conduciendo y gestiona tus viajes.</p>
          </a>
        </Link>
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} TyDy. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
