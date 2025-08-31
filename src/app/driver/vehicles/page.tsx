'use client';

import { useState } from 'react';
import { Car, Plus, Trash2, Edit } from 'lucide-react';

const initialVehicles = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    plate: 'AB123CD',
    isActive: true,
  },
  {
    id: 2,
    brand: 'Chevrolet',
    model: 'Onix',
    year: 2021,
    plate: 'CD456EF',
    isActive: false,
  },
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(initialVehicles);

  const setActiveVehicle = (id) => {
    const updatedVehicles = vehicles.map(v => ({ ...v, isActive: v.id === id }));
    setVehicles(updatedVehicles);
  };

  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="text-white p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Vehículos</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center">
          <Plus size={18} className="mr-2" />
          <span>Agregar Vehículo</span>
        </button>
      </div>

      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className={`p-4 rounded-lg shadow-md border-2 ${vehicle.isActive ? 'border-red-500 bg-gray-800' : 'border-transparent bg-gray-800'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Car size={32} className={vehicle.isActive ? 'text-red-400' : 'text-gray-400'} />
                <div>
                  <p className="font-bold text-lg">{vehicle.brand} {vehicle.model}</p>
                  <p className="text-sm text-gray-400">{vehicle.plate} - {vehicle.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 {!vehicle.isActive && (
                  <button 
                    onClick={() => setActiveVehicle(vehicle.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-md">
                    Activar
                  </button>
                )}
                <button className="p-2 hover:bg-gray-700 rounded-full">
                  <Edit size={18} />
                </button>
                <button 
                    onClick={() => deleteVehicle(vehicle.id)}
                    className="p-2 hover:bg-red-900/50 rounded-full">
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
             {vehicle.isActive && <p className="text-sm text-green-400 mt-3 font-semibold">Vehículo activo</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
