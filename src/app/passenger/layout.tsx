
'use client';

import { useState } from 'react';
import PassengerSidebar from '@/components/passenger/PassengerSidebar';

export default function PassengerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <PassengerSidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <main
        className={`flex-1 p-8 transition-all duration-300 ${
          isSidebarOpen ? 'ml-60' : 'ml-20'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
