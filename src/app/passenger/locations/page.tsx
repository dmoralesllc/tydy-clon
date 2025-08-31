'use client';

import { useState } from 'react';
import { Home, Briefcase, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';

const initialLocations = [
  {
    id: 1,
    name: 'Casa',
    address: '123 Calle Falsa, Springfield',
    icon: Home,
  },
  {
    id: 2,
    name: 'Trabajo',
    address: '456 Avenida Siempreviva, Shelbyville',
    icon: Briefcase,
  },
];

export default function LocationsPage() {
  const [locations, setLocations] = useState(initialLocations);
  const [isAdding, setIsAdding] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');

  const handleAddLocation = () => {
    if (newLocationName && newLocationAddress) {
      const newLocation = {
        id: Date.now(),
        name: newLocationName,
        address: newLocationAddress,
        icon: Plus, // Default icon
      };
      setLocations([...locations, newLocation]);
      setIsAdding(false);
      setNewLocationName('');
      setNewLocationAddress('');
    }
  };

  return (
    <div className="text-white p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ubicaciones Guardadas</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
        >
          <Plus />
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6 space-y-4">
          <input
            type="text"
            placeholder="Nombre (ej. Casa, Trabajo)"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-red-500"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={newLocationAddress}
            onChange={(e) => setNewLocationAddress(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-red-500"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="p-2 rounded hover:bg-gray-700">Cancelar</button>
            <button onClick={handleAddLocation} className="bg-red-600 p-2 rounded hover:bg-red-700">Guardar</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {locations.map((location) => {
          const Icon = location.icon;
          return (
            <div key={location.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Icon size={24} className="text-gray-400" />
                <div>
                  <p className="font-semibold">{location.name}</p>
                  <p className="text-sm text-gray-400">{location.address}</p>
                </div>
              </div>
              {/* Dropdown for Edit/Delete actions can be added here */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
