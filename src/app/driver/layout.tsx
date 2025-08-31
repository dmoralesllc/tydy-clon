
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="bg-gray-800 p-4 flex items-center shadow-md">
        <Link href="/" legacyBehavior>
          <a className="flex items-center gap-2 text-white hover:text-red-400 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">Volver al Inicio</span>
          </a>
        </Link>
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
