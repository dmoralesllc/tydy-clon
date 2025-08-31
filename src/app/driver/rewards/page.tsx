'use client';

import { Award, Star } from 'lucide-react';

const driverRewards = {
  points: 2500,
  level: 'Gold',
};

const levelInfo = {
  Bronze: {
    color: '#cd7f32',
    nextLevel: 'Silver',
    pointsToNext: 1000,
  },
  Silver: {
    color: '#c0c0c0',
    nextLevel: 'Gold',
    pointsToNext: 2000,
  },
  Gold: {
    color: '#ffd700',
    nextLevel: 'Platinum',
    pointsToNext: 5000,
  },
  Platinum: {
    color: '#e5e4e2',
    nextLevel: null,
    pointsToNext: null,
  },
};

export default function RewardsPage() {
  const currentLevelInfo = levelInfo[driverRewards.level];
  const progress = currentLevelInfo.nextLevel ? (driverRewards.points / currentLevelInfo.pointsToNext) * 100 : 100;

  return (
    <div className="text-white p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Programa de Recompensas para Conductores</h1>

      <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg">
        <Award size={64} className="mx-auto mb-4" style={{ color: currentLevelInfo.color }} />
        <p className="text-xl">Nivel Actual</p>
        <h2 className="text-4xl font-bold" style={{ color: currentLevelInfo.color }}>{driverRewards.level}</h2>
        <p className="text-lg mt-2">Tienes <span className="font-bold">{driverRewards.points}</span> puntos</p>

        {currentLevelInfo.nextLevel && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>{driverRewards.level}</span>
              <span>{currentLevelInfo.nextLevel}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-yellow-400 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Te faltan {currentLevelInfo.pointsToNext - driverRewards.points} puntos para el siguiente nivel.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Beneficios del nivel {driverRewards.level}</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Reducción de la comisión de la app en un 15%.</li>
          <li>Soporte prioritario 24/7.</li>
          <li>Acceso a desafíos exclusivos con mayores recompensas.</li>
          <li>Distintivo de conductor Gold en tu perfil.</li>
        </ul>
      </div>
    </div>
  );
}
