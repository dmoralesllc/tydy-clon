
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Shield } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-2 text-red-600 tracking-tighter">TyDy</h1>
        <p className="text-xl text-gray-400">Tu viaje, a tu manera.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-sm">
        <Link href="/passenger" passHref className="w-full">
          <Button
            size="lg"
            className="w-full h-24 text-2xl bg-blue-600 hover:bg-blue-700"
          >
            <User className="mr-4 h-8 w-8" />
            Pasajero
          </Button>
        </Link>
        <Link href="/driver" passHref className="w-full">
          <Button
            size="lg"
            className="w-full h-24 text-2xl bg-orange-600 hover:bg-orange-700"
          >
            <Shield className="mr-4 h-8 w-8" />
            Conductor
          </Button>
        </Link>
      </div>
    </div>
  );
}
