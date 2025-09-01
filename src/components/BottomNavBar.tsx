'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, MessageCircle, User as ProfileIcon } from 'lucide-react';

// Hook para simplificar el link y el estado activo
const NavLink = ({ href, children, exact = false }: { href: string, children: React.ReactNode, exact?: boolean }) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  const activeClass = isActive ? 'text-white' : 'text-gray-400';

  return (
    <Link href={href} legacyBehavior>
      <a className={`flex flex-col items-center justify-center transition-colors hover:text-white ${activeClass}`}>
        {children}
      </a>
    </Link>
  );
};

export default function BottomNavBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black z-20 px-4">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <NavLink href="/feed">
          <Home size={28} strokeWidth={isActive('/feed', true) ? 2.5 : 2} />
          {/* <span className="text-xs font-semibold mt-1">Inicio</span> */}
        </NavLink>
        
        <NavLink href="/friends">
          <Users size={28} strokeWidth={isActive('/friends') ? 2.5 : 2} />
          {/* <span className="text-xs font-semibold mt-1">Amigos</span> */}
        </NavLink>

        {/* Botón central para Subir Video */}
        <Link href="/upload" legacyBehavior>
          <a className="flex items-center justify-center -mt-2">
            <div className="w-[70px] h-[38px] bg-white rounded-xl flex items-center justify-center text-black text-3xl font-bold">
              +
            </div>
          </a>
        </Link>

        <NavLink href="/messages">
          <MessageCircle size={28} strokeWidth={isActive('/messages') ? 2.5 : 2} />
          {/* <span className="text-xs font-semibold mt-1">Mensajes</span> */}
        </NavLink>

        <NavLink href="/profile">
          <ProfileIcon size={28} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          {/* <span className="text-xs font-semibold mt-1">Perfil</span> */}
        </NavLink>
      </div>
    </div>
  );
}

// Helper function to check active state for styling icons
function isActive(pathname: string, path: string, exact = false) {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
}
