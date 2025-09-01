'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Star,
  Award,
  Bell,
  MapPin,
  CreditCard,
  LifeBuoy,
  Settings,
  FileText
} from 'lucide-react';

const sidebarItems = [
  { href: '/passenger/profile', label: 'Perfil', icon: User },
  { href: '/passenger/documents', label: 'Documentos', icon: FileText },
  { href: '/passenger/history', label: 'Historial', icon: Clock },
  { href: '/passenger/ratings', label: 'Calificaciones', icon: Star },
  { href: '/passenger/rewards', label: 'Recompensas', icon: Award },
  { href: '/passenger/requests', label: 'Solicitudes', icon: Bell },
  { href: '/passenger/locations', label: 'Ubicaciones', icon: MapPin },
  { href: '/passenger/payment', label: 'Pago', icon: CreditCard },
  { href: '/passenger/preferences', label: 'Preferencias', icon: Settings },
  { href: '/passenger/help', label: 'Ayuda', icon: LifeBuoy },
];

export default function PassengerSidebar({ isOpen, setOpen }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white p-4 flex flex-col gap-4 transition-all duration-300 ${
        isOpen ? 'w-60' : 'w-20'
      }`}>
      <div className="flex items-center justify-between mb-6">
        {isOpen && <div className="text-2xl font-bold text-red-500">TyDy</div>}
        <button onClick={() => setOpen(!isOpen)} className="text-white">
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 p-2 rounded ${
              pathname === item.href ? 'bg-red-600' : 'hover:bg-gray-700'
            }`}>
            <Icon />
            {isOpen && <span>{item.label}</span>}
          </Link>
        );
      })}
    </aside>
  );
}
