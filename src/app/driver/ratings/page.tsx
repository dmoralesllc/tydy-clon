'use client';

import { Star, MessageSquare, TrendingUp } from 'lucide-react';

const driverRatings = [
  {
    id: 1,
    passengerName: 'Ana P.',
    tripDate: '2024-07-20',
    rating: 5,
    comment: 'Viaje muy agradable y seguro. Conductor excelente.',
  },
  {
    id: 2,
    passengerName: 'Luis M.',
    tripDate: '2024-07-18',
    rating: 5,
    comment: null, // Sin comentario
  },
  {
    id: 3,
    passengerName: 'Elena F.',
    tripDate: '2024-07-15',
    rating: 4,
    comment: 'Buen conductor, aunque la ruta fue un poco larga.',
  },
];

const averageRating = driverRatings.reduce((acc, r) => acc + r.rating, 0) / driverRatings.length;

const StarRating = ({ rating, size = 20 }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        size={size}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}
      />
    );
  }
  return <div className="flex">{stars}</div>;
};

export default function RatingsPage() {
  return (
    <div className="text-white p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tus Calificaciones como Conductor</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8 text-center">
        <p className="text-lg text-gray-400">Calificación Promedio</p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <p className="text-5xl font-bold">{averageRating.toFixed(2)}</p>
          <Star size={36} className="text-yellow-400 fill-current" />
        </div>
      </div>

      <div className="space-y-6">
        {driverRatings.map((rating) => (
          <div key={rating.id} className="bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">Calificación de {rating.passengerName}</h3>
                <p className="text-sm text-gray-400">{rating.tripDate}</p>
              </div>
              <StarRating rating={rating.rating} />
            </div>
            {rating.comment && (
              <div className="flex items-start gap-3 text-gray-300 bg-gray-700/50 p-3 rounded-md mt-3">
                <MessageSquare size={18} className="mt-1 flex-shrink-0" />
                <p>"{rating.comment}"</p>
              </div>
            )}
          </div>
        ))}

        {driverRatings.length === 0 && (
          <div className="text-center py-10">
            <Star size={48} className="mx-auto text-gray-500" />
            <p className="mt-4 text-gray-400">Aún no has recibido ninguna calificación.</p>
          </div>
        )}
      </div>
    </div>
  );
}
