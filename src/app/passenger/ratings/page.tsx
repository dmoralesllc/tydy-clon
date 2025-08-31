'use client';

import { Star, MessageSquare } from 'lucide-react';

const userRatings = [
  {
    id: 1,
    driverName: 'Carlos R.',
    tripDate: '2024-07-20',
    rating: 5,
    comment: 'Excelente servicio, muy amable y profesional.',
  },
  {
    id: 2,
    driverName: 'Laura G.',
    tripDate: '2024-07-18',
    rating: 4,
    comment: 'El viaje fue bueno, pero el aire acondicionado no funcionaba bien.',
  },
  {
    id: 3,
    driverName: 'Pedro M.',
    tripDate: '2024-07-15',
    rating: 5,
    comment: '¡El mejor conductor que he tenido! Muy recomendado.',
  },
];

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        size={20}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}
      />
    );
  }
  return <div className="flex">{stars}</div>;
};

export default function RatingsPage() {
  return (
    <div className="text-white p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tus Calificaciones</h1>
      <div className="space-y-6">
        {userRatings.map((rating) => (
          <div key={rating.id} className="bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{rating.driverName}</h3>
              <StarRating rating={rating.rating} />
            </div>
            <p className="text-sm text-gray-400 mb-3">{rating.tripDate}</p>
            {rating.comment && (
              <div className="flex items-start gap-3 text-gray-300">
                <MessageSquare size={18} className="mt-1 flex-shrink-0" />
                <p>"{rating.comment}"</p>
              </div>
            )}
          </div>
        ))}

        {userRatings.length === 0 && (
          <div className="text-center py-10">
            <Star size={48} className="mx-auto text-gray-500" />
            <p className="mt-4 text-gray-400">Aún no has calificado ningún viaje.</p>
          </div>
        )}
      </div>
    </div>
  );
}
