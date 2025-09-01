'use client';

import { useState } from 'react';
import { Bell, EyeOff, Accessibility, Languages, Sun, Moon } from 'lucide-react';

const Toggle = ({ checked, onChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="relative w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
    </label>
  );
};

export default function PreferencesPage() {
  const [notifications, setNotifications] = useState({
    promotions: true,
    tripUpdates: true,
    news: false,
  });
  const [shareTripInfo, setShareTripInfo] = useState(true);
  const [needsWheelchair, setNeedsWheelchair] = useState(false);
  const [language, setLanguage] = useState('es');
  const [theme, setTheme] = useState('dark');

  return (
    <div className="text-white p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Preferencias</h1>

      <div className="space-y-8">
        {/* Notificaciones */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3"><Bell />Notificaciones</h2>
          <div className="space-y-3 pl-8">
            <div className="flex justify-between items-center">
              <span>Promociones y descuentos</span>
              <Toggle checked={notifications.promotions} onChange={() => setNotifications(prev => ({...prev, promotions: !prev.promotions}))} />
            </div>
            <div className="flex justify-between items-center">
              <span>Actualizaciones de viaje</span>
              <Toggle checked={notifications.tripUpdates} onChange={() => setNotifications(prev => ({...prev, tripUpdates: !prev.tripUpdates}))} />
            </div>
            <div className="flex justify-between items-center">
              <span>Noticias y novedades</span>
              <Toggle checked={notifications.news} onChange={() => setNotifications(prev => ({...prev, news: !prev.news}))} />
            </div>
          </div>
        </section>

        {/* Privacidad */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3"><EyeOff />Privacidad</h2>
          <div className="space-y-3 pl-8">
            <div className="flex justify-between items-center">
              <span>Compartir información de viaje</span>
              <Toggle checked={shareTripInfo} onChange={() => setShareTripInfo(!shareTripInfo)} />
            </div>
          </div>
        </section>

        {/* Accesibilidad */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3"><Accessibility />Accesibilidad</h2>
          <div className="space-y-3 pl-8">
            <div className="flex justify-between items-center">
              <span>Vehículo accesible para silla de ruedas</span>
              <Toggle checked={needsWheelchair} onChange={() => setNeedsWheelchair(!needsWheelchair)} />
            </div>
          </div>
        </section>

        {/* Idioma y Tema */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3"><Languages />Idioma</h2>
          <div className="pl-8">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-red-500">
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
                {theme === 'dark' ? <Moon /> : <Sun />}
                Tema
            </h2>
            <div className="pl-8">
                <div className="flex justify-between items-center">
                    <span>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</span>
                    <Toggle checked={theme === 'dark'} onChange={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}
