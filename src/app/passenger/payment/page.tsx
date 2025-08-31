'use client';

import { useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

const initialPaymentMethods = [
  {
    id: 1,
    cardType: 'Visa',
    last4: '4242',
    expiry: '12/25',
  },
  {
    id: 2,
    cardType: 'Mastercard',
    last4: '5555',
    expiry: '08/26',
  },
];

export default function PaymentPage() {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);

  const handleAddCard = () => {
    // Logic to add a new card (e.g., open a modal or navigate to a form)
    alert('Funcionalidad para agregar tarjeta próximamente.');
  };

  const handleDeleteCard = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  return (
    <div className="text-white p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Métodos de Pago</h1>
        <button
          onClick={handleAddCard}
          className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
        >
          <Plus />
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CreditCard size={32} />
              <div>
                <p className="font-semibold">{method.cardType} terminada en {method.last4}</p>
                <p className="text-sm text-gray-400">Expira {method.expiry}</p>
              </div>
            </div>
            <button onClick={() => handleDeleteCard(method.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
            <CreditCard size={48} className="mx-auto text-gray-500" />
            <p className="mt-4 text-gray-400">No tienes métodos de pago guardados.</p>
            <button onClick={handleAddCard} className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
              Agregar Tarjeta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
