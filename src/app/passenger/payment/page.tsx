'use client';

import { useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

// SVG Logo for Mercado Pago
const MercadoPagoLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.393 10.372c-1.127-3.93-4.94-6.84-9.31-6.84-4.322 0-8.106 2.86-9.307 6.75l.006.018-2.782 8.22h6.143l2.843-8.384.004-.012c.045-.13.09-.25.14-.37.24-.58.6-1.08.97-1.5.38-.41.8-.75 1.25-1.02.4-.24.8-.4 1.25-.4.45 0 .84.16 1.24.4.45.27.86.61 1.23 1.02.38.42.73.92.97 1.5.05.12.1.24.14.37l.003.012 2.844 8.384h6.143l-2.78-8.22z" fill="#00B1EA"/>
  </svg>
);

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
    alert('Funcionalidad para agregar tarjeta próximamente.');
  };

  const handleDeleteCard = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };
  
  const handleMercadoPago = () => {
    alert('Redirigiendo a Mercado Pago...');
    // Aquí iría la lógica para iniciar el checkout de Mercado Pago
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
        {/* Sección de Tarjetas de Crédito/Débito */}
        <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2">Tarjetas</h2>
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
            <p className="mt-4 text-gray-400">No tienes tarjetas guardadas.</p>
            <button onClick={handleAddCard} className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
              Agregar Tarjeta
            </button>
          </div>
        )}

        {/* Sección de Otros Métodos de Pago */}
        <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mt-8">Otros Métodos</h2>
        <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MercadoPagoLogo />
            <div>
              <p className="font-semibold">Mercado Pago</p>
              <p className="text-sm text-gray-400">Paga de forma segura con tu cuenta.</p>
            </div>
          </div>
          <button onClick={handleMercadoPago} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors">
            Pagar
          </button>
        </div>

      </div>
    </div>
  );
}
