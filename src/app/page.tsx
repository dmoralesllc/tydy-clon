
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, User } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">TyDy</h1>
        <p className="text-lg text-gray-400">Tu viaje, a tu manera.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        <Link href="/driver" passHref>
          <Button 
            variant="outline" 
            className="w-full h-24 text-xl bg-gray-800/80 border-gray-700 hover:bg-gray-700/80 hover:text-white flex flex-col space-y-2"
          >
            <Car className="h-8 w-8" />
            <span>Conductor</span>
          </Button>
        </Link>
        <Link href="/passenger" passHref>
           <Button 
            variant="outline" 
            className="w-full h-24 text-xl bg-gray-800/80 border-gray-700 hover:bg-gray-700/80 hover:text-white flex flex-col space-y-2"
          >
            <User className="h-8 w-8" />
            <span>Pasajero</span>
          </Button>
        </Link>
      </div>

       <div className="absolute bottom-4 text-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} dmoralesllc. Todos los derechos reservados.</p>
          <p>Versión 1.0.0</p>
       </div>
    </div>
  );
}
