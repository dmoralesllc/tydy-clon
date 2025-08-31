'use client';

import { Clock } from 'lucide-react';

const tripHistory = [
  {
    id: 1,
    origin: 'Centro Comercial',
    destination: 'Estación de Tren',
    date: '2024-07-20',
    cost: 15.50,
  },
  {
    id: 2,
    origin: 'Aeropuerto',
    destination: 'Hotel Central',
    date: '2024-07-18',
    cost: 35.00,
  },
  {
    id: 3,
    origin: 'Parque Principal',
    destination: 'Museo de Arte',
    date: '2024-07-15',
    cost: 10.25,
  },
];

export default function HistoryPage() {
  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Historial de Viajes</h1>
      <div className="space-y-4">
        {tripHistory.map((trip) => (
          <div key={trip.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">{trip.origin} → {trip.destination}</p>
              <p className="text-sm text-gray-400">{trip.date}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">${trip.cost.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
