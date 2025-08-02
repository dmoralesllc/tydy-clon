
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngTuple } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Menu, ChevronDown, HelpCircle, Layers, Crosshair, Shield, Settings2, Zap, Star, Trophy, Users, AlertCircle, Car, User, Settings } from 'lucide-react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const DivIcon = dynamic(() => import('leaflet').then(mod => mod.divIcon), { ssr: false });

const UserLocationMarker = ({ position }: { position: LatLngTuple }) => {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then(leaflet => {
      setL(leaflet);
    });
  }, []);

  if (!L) return null;

  const icon = L.divIcon({
    html: `<div class="w-6 h-6 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg></div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return <Marker position={position} icon={icon} />;
};

const SurgePricingMarker = ({ position, rate }: { position: LatLngTuple, rate: string }) => {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then(leaflet => {
      setL(leaflet);
    });
  }, []);

  if (!L) return null;
    
  const icon = L.divIcon({
    html: `<div class="bg-black/70 text-white text-sm rounded-full px-3 py-1 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> ${rate}</div>`,
    className: '',
    iconSize: L.point(80, 26),
    iconAnchor: L.point(40, 13),
  });

  return <Marker position={position} icon={icon} />;
}

export default function DriverHomePage() {
    const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>([-27.45, -58.983333]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Fallback to a default location in Resistencia, Chaco
        setCurrentPosition([-27.45, -58.983333]);
    }, []);

    const surgeZones: { pos: LatLngTuple, rate: string }[] = [
        { pos: [-27.445, -58.99], rate: "2.9~3.0x" },
        { pos: [-27.452, -59.00], rate: "2.7~2.9x" },
        { pos: [-27.46, -59.01], rate: "1.8~2.9x" },
        { pos: [-27.47, -59.005], rate: "1.3~3.0x" },
        { pos: [-27.475, -58.995], rate: "1.7~1.9x" },
        { pos: [-27.485, -59.015], rate: "1.1~1.9x" },
        { pos: [-27.49, -59.00], rate: "2.1~3.0x" },
        { pos: [-27.46, -58.97], rate: "3.0x" },
    ];


    if (!currentPosition) {
        return <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">Cargando...</div>;
    }

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gray-900 text-white">
            <MapContainer center={currentPosition} zoom={14} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <UserLocationMarker position={currentPosition} />
                
                {surgeZones.map((zone, i) => (
                    <SurgePricingMarker key={i} position={zone.pos} rate={zone.rate} />
                ))}

                <Marker position={[-27.435, -58.985]}>
                  <Popup>Hipermercado Libertad Resistencia</Popup>
                </Marker>
            </MapContainer>

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-[1000]">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full shadow-lg relative bg-gray-800/80 hover:bg-gray-700/80">
                            <Menu className="h-6 w-6" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-gray-900 text-white border-gray-800 p-0">
                        <div className="flex flex-col h-full">
                            <div className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <Avatar className="w-24 h-24 mb-4">
                                        <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture" alt="Daniel" />
                                        <AvatarFallback>D</AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-xl font-bold">Daniel *******</h2>
                                </div>
                                <div className="flex justify-around my-6 text-center">
                                    <div>
                                        <p className="text-2xl font-bold">73%</p>
                                        <p className="text-xs text-gray-400">Tasa de aceptación</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">100%</p>
                                        <p className="text-xs text-gray-400">Tasa de viajes finalizados</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">5</p>
                                        <p className="text-xs text-gray-400">Calificación en estrellas</p>
                                    </div>
                                </div>
                                <Separator className="bg-gray-700" />
                            </div>
                            <nav className="flex-grow px-4">
                                <ul className="space-y-2">
                                    <li><Button variant="ghost" className="w-full justify-start text-lg h-12"><Zap className="mr-4 h-6 w-6" />Ganancias</Button></li>
                                    <li><Button variant="ghost" className="w-full justify-start text-lg h-12"><Trophy className="mr-4 h-6 w-6" />Premios</Button></li>
                                    <li><Button variant="ghost" className="w-full justify-start text-lg h-12"><Users className="mr-4 h-6 w-6" />Invita a tus amigos</Button></li>
                                    <li><Button variant="ghost" className="w-full justify-start text-lg h-12"><HelpCircle className="mr-4 h-6 w-6" />Ayuda</Button></li>
                                    <li>
                                        <Button variant="ghost" className="w-full justify-start text-lg h-12">
                                            <AlertCircle className="mr-4 h-6 w-6" />
                                            Notificaciones
                                            <Badge variant="destructive" className="ml-auto">103 no leída(s)</Badge>
                                        </Button>
                                    </li>
                                    <li><Button variant="ghost" className="w-full justify-start text-lg h-12"><Car className="mr-4 h-6 w-6" />Autos</Button></li>
                                    <li><Button variant="ghost" className="w-full justify-start text-lg h-12"><User className="mr-4 h-6 w-6" />Detalles de mi cuenta</Button></li>
                                    <li><Button variant="ghost" className="w-full justify-start text-lg h-12"><Settings className="mr-4 h-6 w-6" />Configuración</Button></li>
                                </ul>
                            </nav>
                        </div>
                    </SheetContent>
                </Sheet>
                <Button variant="secondary" className="rounded-full shadow-lg h-10 px-4 bg-gray-800/80 hover:bg-gray-700/80">
                    <span className="text-lg font-semibold">$0,00</span>
                    <ChevronDown className="h-5 w-5 ml-1" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80">
                    <HelpCircle className="h-6 w-6" />
                </Button>
            </div>
            
            {/* Map Controls */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 z-[1000]">
                 <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80">
                    <Crosshair className="h-6 w-6" />
                </Button>
                 <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80">
                    <Layers className="h-6 w-6" />
                </Button>
            </div>
            
            {/* Google Shield */}
            <div className="absolute bottom-[220px] left-4 flex items-center gap-2 z-[1000] bg-gray-800/80 rounded-full px-3 py-1 shadow-lg">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="font-semibold text-sm">Google</span>
            </div>

            {/* Bottom Sheet */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background z-[1000] rounded-t-2xl">
                <Card className="bg-gradient-to-r from-orange-500 to-pink-500 border-0 mb-4">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg">Referí y generá $50.000</h3>
                            <p className="text-sm">Invitá amigos a registrarse y conducir con la app de DiDi</p>
                             <Button variant="secondary" size="sm" className="mt-2 h-8 rounded-full bg-white/30 text-white hover:bg-white/40">
                                Conocé más
                            </Button>
                        </div>
                        <Image src="https://placehold.co/80x60.png" data-ai-hint="logo illustration" alt="DiDi logos" width={80} height={60} />
                    </CardContent>
                </Card>
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="relative">
                        <Settings2 className="h-7 w-7" />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
                    </Button>
                    <Button 
                        size="lg" 
                        className={`w-full max-w-xs text-xl h-14 rounded-full font-bold transition-colors ${isConnected ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                        onClick={() => setIsConnected(!isConnected)}
                    >
                        {isConnected ? 'Desconectarse' : 'Conectarse'}
                    </Button>
                    <div className="w-12"></div>
                </div>
            </div>
        </div>
    );
}

    