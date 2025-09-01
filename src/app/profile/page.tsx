'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottomNavBar from '../../components/BottomNavBar';
import { UserPlus, Menu, Lock, Tag, Heart, Edit2, Camera, User, Settings, X, ChevronRight, BarChart3, QrCode, DollarSign } from 'lucide-react';

// --- Sub-componentes para un UI más limpio ---

const ProfileHeader = ({ onMenuClick }: { onMenuClick: () => void }) => (
    <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-4">
            <button className="p-2">
                <UserPlus size={24} className="text-white"/>
            </button>
            <div className="flex items-center">
                <span className="text-white font-bold text-lg mr-2">@danielmorales4192</span>
            </div>
            <button onClick={onMenuClick} className="p-2">
                <Menu size={24} className="text-white"/>
            </button>
        </div>
    </div>
);

const ProfileStats = () => (
    <div className="flex flex-col items-center text-white mt-6">
        <div className="relative w-28 h-28">
            <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center text-5xl font-bold text-white">
                d
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">+</div>
            </div>
        </div>
        <div className="flex items-center mt-4">
             <h1 className="text-xl font-bold mr-2">+ Agregar nombre</h1>
             <Edit2 size={16} />
        </div>
        <div className="flex justify-around w-full max-w-sm mt-6 text-center">
            <div>
                <span className="font-bold text-xl">1</span>
                <p className="text-gray-400 text-sm">Siguiendo</p>
            </div>
            <div>
                <span className="font-bold text-xl">0</span>
                <p className="text-gray-400 text-sm">Seguidores</p>
            </div>
            <div>
                <span className="font-bold text-xl">0</span>
                <p className="text-gray-400 text-sm">Me gusta</p>
            </div>
        </div>
        <div className="mt-4">
             <p className="text-gray-400">+ Agregar descripción</p>
        </div>
    </div>
);

const ProfileTabs = () => (
    <div className="flex justify-around items-center border-t border-b border-gray-700 mt-6">
        <div className="p-4 border-b-2 border-white flex-1 text-center">
            <User size={24} className="text-white mx-auto"/>
        </div>
        <div className="p-4 flex-1 text-center">
            <Lock size={24} className="text-gray-400 mx-auto"/>
        </div>
        <div className="p-4 flex-1 text-center">
            <Heart size={24} className="text-gray-400 mx-auto"/>
        </div>
    </div>
);

const CompleteProfile = () => (
    <div className="px-4 mt-6">
        <h2 className="text-white font-bold text-lg">Completa tu perfil</h2>
        <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
                <Camera size={32} className="mx-auto text-white mb-2" />
                <p className="text-white text-sm font-semibold">Comparte tu rutina diaria</p>
                <button className="bg-red-600 text-white font-bold text-sm py-2 px-4 rounded-md mt-3">Cargar</button>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
                <Edit2 size={32} className="mx-auto text-white mb-2" />
                <p className="text-white text-sm font-semibold">Agrega un nombre</p>
                <button className="bg-red-600 text-white font-bold text-sm py-2 px-4 rounded-md mt-3">Agregar nombre</button>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
                 <User size={32} className="mx-auto text-white mb-2" />
                <p className="text-white text-sm font-semibold">Agrega descripción</p>
                <button className="bg-red-600 text-white font-bold text-sm py-2 px-4 rounded-md mt-3">Agregar</button>
            </div>
        </div>
    </div>
);

const MenuPanel = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl p-4 z-50 animate-slide-up">
                <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4"></div>
                 <Link href="/studio" legacyBehavior>
                    <a className="flex items-center justify-between w-full p-3 text-white text-lg hover:bg-gray-800 rounded-lg">
                        <div className="flex items-center">
                            <BarChart3 className="mr-4"/>
                            <span>Creator Studio</span>
                        </div>
                        <ChevronRight />
                    </a>
                </Link>
                <a className="flex items-center justify-between w-full p-3 text-white text-lg hover:bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                        <DollarSign className="mr-4"/>
                        <span>Balance</span>
                    </div>
                    <ChevronRight />
                </a>
                <a className="flex items-center justify-between w-full p-3 text-white text-lg hover:bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                        <QrCode className="mr-4"/>
                        <span>Mi código QR</span>
                    </div>
                    <ChevronRight />
                </a>
                <a className="flex items-center justify-between w-full p-3 text-white text-lg hover:bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                        <Settings className="mr-4"/>
                        <span>Ajustes y Privacidad</span>
                    </div>
                    <ChevronRight />
                </a>
            </div>
        </div>
    );
};


// --- Página Principal del Perfil ---
export default function ProfilePage() {
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-black min-h-screen text-white">
            <ProfileHeader onMenuClick={() => setMenuOpen(true)} />
            <ProfileStats />
            <CompleteProfile />
            <ProfileTabs />
            <div className="p-1">
                 <p className="text-center text-gray-400 mt-8">El contenido que te gusta es visible solo para ti</p>
            </div>
            <div className="pb-20"></div> {/* Padding for bottom nav bar */}
            <BottomNavBar />
            <MenuPanel isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
        </div>
    );
}

