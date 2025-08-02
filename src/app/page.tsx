
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngTuple } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Menu, ChevronDown, HelpCircle, Layers, Crosshair, Shield, Settings, Settings2, Zap, User, Edit, Plus, Minus, X, Eye, Wallet } from 'lucide-react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Map } from 'leaflet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

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
    const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isReferralCardVisible, setIsReferralCardVisible] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState("https://placehold.co/100x100.png");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const mapRef = useRef<Map>(null);

    useEffect(() => {
        // Fallback to a default location in Resistencia, Chaco
        setCurrentPosition([-27.45, -58.983333]);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleAvatarUpdate = () => {
        if (selectedFile) {
            setAvatarUrl(URL.createObjectURL(selectedFile));
        }
    };

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

    const zoomIn = () => {
        mapRef.current?.zoomIn();
    }
    
    const zoomOut = () => {
        mapRef.current?.zoomOut();
    }
    
    if (!currentPosition) {
        return <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">Cargando...</div>;
    }
    
    const MenuItem = ({ icon, label, badge, dialogTitle, dialogDescription }: { icon: React.ElementType, label: string, badge?: string, dialogTitle: string, dialogDescription: string }) => (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center p-3 text-white hover:bg-gray-700 rounded-md w-full text-left">
                    <div className="p-2 bg-gray-600 rounded-full mr-4">
                        {React.createElement(icon, { className: "h-5 w-5" })}
                    </div>
                    <span className="flex-grow font-medium">{label}</span>
                    {badge && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{badge}</span>
                    )}
                    <ChevronDown className="h-5 w-5 text-gray-500 -rotate-90 ml-2" />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-gray-700">
                 <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="h-screen w-screen bg-gray-900 text-white relative">
            <div className="absolute inset-0 z-0">
                <MapContainer ref={mapRef} center={currentPosition} zoom={14} scrollWheelZoom={true} zoomControl={false} className="h-full w-full">
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
            </div>

            {/* UI Overlay */}
            <div className="absolute inset-0 flex flex-col pointer-events-none">
                {/* Top Bar */}
                <div className="p-4 flex justify-between items-center z-10 pointer-events-auto">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full shadow-lg relative bg-gray-800/80 hover:bg-gray-700/80">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full max-w-sm bg-gray-800 text-white border-gray-700 p-0 flex flex-col">
                            <SheetHeader className="p-4 space-y-4 text-left">
                                <div className="flex items-center space-x-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="relative cursor-pointer">
                                                <Avatar className="h-16 w-16">
                                                    <AvatarImage src={avatarUrl} alt="Driver" />
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute bottom-0 right-0 bg-gray-600 p-1 rounded-full border-2 border-gray-800">
                                                    <Edit className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="bg-gray-800 text-white border-gray-700">
                                             <DialogHeader>
                                                <DialogTitle>Actualizar foto de perfil</DialogTitle>
                                                <DialogDescription>
                                                    Sube una nueva foto para tu perfil.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label htmlFor="picture">Foto</Label>
                                                <Input id="picture" type="file" className="text-white" onChange={handleFileChange}/>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" onClick={handleAvatarUpdate}>Guardar Cambios</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <div>
                                        <SheetTitle className="text-xl">Conductor</SheetTitle>
                                        <p className="text-gray-400">Nivel: Oro</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                    <div>
                                        <p className="font-bold">100%</p>
                                        <p className="text-xs text-gray-400">Tasa de aceptación</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">5.0</p>
                                        <p className="text-xs text-gray-400">Calificación</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">0%</p>
                                        <p className="text-xs text-gray-400">Tasa de cancelación</p>
                                    </div>
                                </div>
                            </SheetHeader>
                            <Separator className="bg-gray-700" />
                            <div className="flex-grow overflow-y-auto p-4 space-y-2">
                                <MenuItem icon={Zap} label="Ganancias" dialogTitle="Ganancias" dialogDescription="Aquí se mostrará el historial de ganancias." />
                                <MenuItem icon={User} label="Premios" dialogTitle="Premios" dialogDescription="Aquí se mostrarán los premios disponibles." />
                                <MenuItem icon={Menu} label="Notificaciones" badge="3" dialogTitle="Notificaciones" dialogDescription="Aquí se mostrará la lista de notificaciones." />
                                <MenuItem icon={Wallet} label="Mi Billetera" dialogTitle="Mi Billetera" dialogDescription="Aquí se mostrará la información de la billetera." />
                                <MenuItem icon={Settings2} label="Preferencias de viaje" dialogTitle="Preferencias de Viaje" dialogDescription="Aquí se podrán configurar las preferencias de viaje." />
                                <MenuItem icon={HelpCircle} label="Ayuda" dialogTitle="Ayuda" dialogDescription="Aquí se mostrará el centro de ayuda." />
                                <MenuItem icon={Settings} label="Configuración" dialogTitle="Configuración" dialogDescription="Aquí se mostrarán las opciones de configuración de la cuenta." />
                            </div>
                            <Separator className="bg-gray-700" />
                            <div className="p-4">
                                <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700">Cerrar Sesión</Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" className="rounded-full shadow-lg h-10 px-4 bg-gray-800/80 hover:bg-gray-700/80 flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                <span className="text-lg font-semibold">$0,00</span>
                                <ChevronDown className="h-5 w-5 ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
                             <Dialog>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Ver historial de ganancias</DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                    <DialogHeader>
                                        <DialogTitle>Historial de Ganancias</DialogTitle>
                                        <DialogDescription>Aquí se mostrará el historial detallado.</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                             <Dialog>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Configurar pagos</DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                     <DialogHeader>
                                        <DialogTitle>Configurar Pagos</DialogTitle>
                                        <DialogDescription>Aquí podrás configurar tus métodos de pago.</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80">
                        <HelpCircle className="h-6 w-6" />
                    </Button>
                </div>
                
                {/* Map Controls Area */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 z-10 pointer-events-auto">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={() => currentPosition && mapRef.current?.setView(currentPosition, 14)}>
                        <Crosshair className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80">
                        <Layers className="h-6 w-6" />
                    </Button>
                </div>

                {/* Custom Zoom Controls */}
                <div className="absolute bottom-52 right-4 flex flex-col gap-2 z-10 pointer-events-auto">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={zoomIn}>
                        <Plus className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={zoomOut}>
                        <Minus className="h-6 w-6" />
                    </Button>
                </div>
                
                {/* Google Shield */}
                <div className="absolute bottom-28 left-4 flex items-center gap-2 z-10 bg-gray-800/80 rounded-full px-3 py-1 shadow-lg pointer-events-auto">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-sm">Google</span>
                </div>

                {/* Bottom Sheet Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-auto">
                    <div className="bg-gray-900 rounded-t-2xl shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.3)] p-4">
                        {isReferralCardVisible && (
                            <Card className="bg-gradient-to-r from-orange-500 to-pink-500 border-0 mb-4 relative">
                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-white/70 hover:text-white" onClick={() => setIsReferralCardVisible(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">Referí y generá $50.000</h3>
                                        <p className="text-sm">Invitá amigos a registrarse y conducir con la app de TyDy</p>
                                        <Button variant="secondary" size="sm" className="mt-2 h-8 rounded-full bg-white/30 text-white hover:bg-white/40">
                                            Conocé más
                                        </Button>
                                    </div>
                                    <Image src="https://placehold.co/80x60.png" data-ai-hint="logo illustration" alt="TyDy logos" width={80} height={60} />
                                </CardContent>
                            </Card>
                        )}
                        <div className="flex items-center justify-between">
                            <Dialog>
                                <DialogTrigger asChild>
                                     <Button variant="ghost" className="relative pointer-events-auto">
                                        <Settings2 className="h-7 w-7" />
                                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                    <DialogHeader>
                                        <DialogTitle>Preferencias de Viaje</DialogTitle>
                                        <DialogDescription>Aquí se podrán configurar las preferencias de viaje.</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            <Button 
                                size="lg" 
                                className={`w-full max-w-xs text-xl h-14 rounded-full font-bold transition-colors pointer-events-auto ${isConnected ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                                onClick={() => setIsConnected(!isConnected)}
                            >
                                {isConnected ? 'Desconectarse' : 'Conectarse'}
                            </Button>
                            <div className="w-12"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

    