'use client';

import { Bell, X } from 'lucide-react';

const activeRequests = [
  {
    id: 1,
    status: 'Buscando conductor',
    origin: 'Tu ubicación actual',
    destination: 'Restaurante La Esquina',
  },
  {
    id: 2,
    status: 'Conductor en camino',
    origin: 'Oficina',
    destination: 'Gimnasio',
  },
];

export default function RequestsPage() {
  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Solicitudes de Viaje</h1>
      <div className="space-y-4">
        {activeRequests.map((request) => (
          <div key={request.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-yellow-400">{request.status}</p>
                <p className="text-lg">{request.origin} → {request.destination}</p>
              </div>
              <button className="p-2 text-red-500 hover:text-red-400 hover:bg-gray-700 rounded-full">
                <X size={20} />
              </button>
            </div>
          </div>
        ))}

        {activeRequests.length === 0 && (
          <div className="text-center py-10">
            <Bell size={48} className="mx-auto text-gray-500" />
            <p className="mt-4 text-gray-400">No tienes solicitudes de viaje activas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
