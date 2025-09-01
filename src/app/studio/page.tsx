'use client';

import { ArrowLeft, Settings, Star, Zap, Gem, PlusCircle, X, TrendingUp, BarChart, ChevronDown, Bookmark } from 'lucide-react';
import Link from 'next/link';

const StudioHeader = () => (
    <div className="flex justify-between items-center p-4 bg-black sticky top-0 z-10">
        <Link href="/profile">
            <ArrowLeft size={24} className="text-white cursor-pointer"/>
        </Link>
        <h1 className="text-xl font-bold text-white">Creator Studio</h1>
        <Settings size={24} className="text-white"/>
    </div>
);

const StatsCard = () => (
    <div className="bg-gray-800 rounded-lg p-4 m-4">
        <div className="flex justify-between items-center text-white mb-4">
            <h2 className="font-bold">Estadísticas</h2>
            <span className="text-sm text-gray-400">Ver todo ></span>
        </div>
        <div className="flex justify-around text-center text-white">
            <div>
                <p className="text-gray-400 text-sm">Visualizaciones</p>
                <p className="font-bold text-2xl">0</p>
                <p className="text-gray-500 text-xs">0% 7 d</p>
            </div>
            <div>
                <p className="text-gray-400 text-sm">Seguidores netos</p>
                <p className="font-bold text-2xl">0</p>
                <p className="text-gray-500 text-xs">0% 7 d</p>
            </div>
            <div>
                <p className="text-gray-400 text-sm">Me gusta</p>
                <p className="font-bold text-2xl">0</p>
                <p className="text-gray-500 text-xs">0% 7 d</p>
            </div>
        </div>
    </div>
);

const DownloadAppCard = () => (
    <div className="bg-gray-800 rounded-lg p-4 m-4 flex items-center justify-between">
        <div className="flex items-center">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4">
                 <BarChart size={32} className="text-white"/>
            </div>
            <div>
                <h3 className="font-bold text-white">Descarga Studio App</h3>
                <p className="text-gray-400 text-sm">Ahora puedes hacer publicaciones programadas.</p>
                 <span className="text-red-500 font-bold text-sm cursor-pointer">Descargar</span>
            </div>
        </div>
        <X size={20} className="text-gray-500"/>
    </div>
);

const CreatorTools = () => (
    <div className="flex justify-around items-center p-4 m-4 text-white text-center">
        <div className="flex flex-col items-center">
            <Star size={24} className="mb-1"/>
            <span className="text-xs">Academia</span>
        </div>
        <div className="flex flex-col items-center">
            <Zap size={24} className="mb-1"/>
            <span className="text-xs">Promocionar</span>
        </div>
        <div className="flex flex-col items-center">
            <Gem size={24} className="mb-1"/>
            <span className="text-xs">Ventajas</span>
        </div>
        <div className="flex flex-col items-center">
            <PlusCircle size={24} className="mb-1"/>
            <span className="text-xs">Ahora tú</span>
        </div>
    </div>
);

const InspirationSection = () => (
    <div className="px-4">
        <div className="flex border-b-2 border-gray-700">
            <div className="flex-1 text-center p-3 border-b-2 border-white">
                <span className="font-bold text-white">Inspiración</span>
            </div>
            <div className="flex-1 text-center p-3">
                <span className="font-semibold text-gray-400">Monetización</span>
            </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
            <span className="px-4 py-2 bg-gray-700 text-white rounded-full text-sm font-semibold">Trending</span>
            <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold">Recomendado</span>
        </div>
         <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
            <span>Posts <ChevronDown className="inline"/></span>
            <span>Todas las categorias <ChevronDown className="inline"/></span>
            <span>Todas las regiones <ChevronDown className="inline"/></span>
        </div>
        <div className="mt-4 space-y-4">
            {/* Placeholder for trending posts */}
            <div className="flex items-start space-x-4">
                <div className="w-24 h-32 bg-gray-700 rounded-lg"></div>
                <div className="flex-1 text-white">
                    <p className="font-semibold">#aicat #aicats #kitten #cat</p>
                    <div className="flex items-center text-gray-400 text-sm mt-2">
                        <TrendingUp size={16} className="mr-2"/>
                        <span>173.5M</span>
                        <BarChart size={16} className="ml-4 mr-2"/>
                        <span>6.1M</span>
                    </div>
                </div>
                <Bookmark size={24} className="text-white" />
            </div>
        </div>
    </div>
);

export default function StudioPage() {
    return (
        <div className="bg-black min-h-screen text-white">
            <StudioHeader />
            <StatsCard />
            <DownloadAppCard />
            <CreatorTools />
            <InspirationSection />
            <div className="pb-20"></div>
        </div>
    );
}
