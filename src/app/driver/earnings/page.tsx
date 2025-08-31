'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronDown, Download } from 'lucide-react';

const weeklyData = {
  "Esta semana": [
    { day: "Lun", earnings: 120 },
    { day: "Mar", earnings: 150 },
    { day: "Mié", earnings: 200 },
    { day: "Jue", earnings: 180 },
    { day: "Vie", earnings: 250 },
    { day: "Sáb", earnings: 300 },
    { day: "Dom", earnings: 220 },
  ],
  "Semana pasada": [
    { day: "Lun", earnings: 110 },
    { day: "Mar", earnings: 160 },
    { day: "Mié", earnings: 190 },
    { day: "Jue", earnings: 170 },
    { day: "Vie", earnings: 260 },
    { day: "Sáb", earnings: 310 },
    { day: "Dom", earnings: 230 },
  ],
};

const recentTransactions = [
    { id: 1, type: "Viaje", date: "2024-07-22", amount: 25.50 },
    { id: 2, type: "Bono", date: "2024-07-21", amount: 50.00 },
    { id: 3, type: "Viaje", date: "2024-07-21", amount: 18.75 },
    { id: 4, type: "Viaje", date: "2024-07-20", amount: 32.00 },
    { id: 5, type: "Retiro", date: "2024-07-20", amount: -100.00 },
];

export default function EarningsPage() {
  const [selectedWeek, setSelectedWeek] = useState("Esta semana");

  const chartData = weeklyData[selectedWeek];
  const totalEarnings = chartData.reduce((acc, item) => acc + item.earnings, 0);

  return (
    <div className="text-white p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Ganancias</h1>
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg">
          <Download size={18} />
          Exportar
        </button>
      </div>

      {/* Resumen de Ganancias */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm text-gray-400">Ganancias Totales ({selectedWeek})</p>
                <p className="text-4xl font-bold">${totalEarnings.toFixed(2)}</p>
            </div>
            {/* Dropdown para seleccionar la semana */}
            <div className="relative">
                <select 
                    value={selectedWeek} 
                    onChange={(e) => setSelectedWeek(e.target.value)} 
                    className="bg-gray-700 text-white py-2 px-4 rounded-lg appearance-none cursor-pointer">
                    <option>Esta semana</option>
                    <option>Semana pasada</option>
                </select>
            </div>
        </div>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="day" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}/>
                    <Bar dataKey="earnings" fill="#F56565" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Transacciones Recientes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Transacciones Recientes</h2>
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                <div>
                    <p className={`font-semibold ${tx.type === 'Bono' ? 'text-blue-400' : ''}`}>{tx.type}</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                </div>
                <p className={`text-lg font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
