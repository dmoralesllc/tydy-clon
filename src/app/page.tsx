
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression, LatLngTuple, Map } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Menu, ChevronDown, HelpCircle, Layers, Crosshair, Shield, Settings2, Zap, Edit, Plus, Minus, X, Eye, Wallet, Star, Bell, LogOut, ChevronRight, FileText, Smartphone, Lock, Languages, CircleHelp, Info, MapPin, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useMapEvents } from 'react-leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });


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

const LocationMarker = ({ position, type }: { position: LatLngTuple, type: 'start' | 'end' }) => {
    const [L, setL] = useState<any>(null);

    useEffect(() => {
        import('leaflet').then(leaflet => {
            setL(leaflet);
        });
    }, []);

    if (!L) return null;

    const color = type === 'start' ? '#2563eb' : '#f97316';
    const icon = L.divIcon({
        html: `<div style="background-color: ${color};" class="w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M12 20s-7-9-7-12a7 7 0 0 1 14 0c0 3-7 12-7 12z"/><circle cx="12" cy="8" r="3"/></svg></div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
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
    className: 'opacity-90',
    iconSize: L.point(80, 26),
    iconAnchor: L.point(40, 13),
  });

  return <Marker position={position} icon={icon} />;
}

const getSurgeColor = (rate: number): string => {
    if (rate >= 2.5) return 'red';
    if (rate >= 1.8) return 'orange';
    return 'yellow';
}

const SurgePolygon = ({ center, rate }: { center: LatLngTuple, rate: number }) => {
    const size = 0.003; // Size of the hexagon
    const hexCoords: LatLngExpression[] = Array.from({ length: 6 }).map((_, i) => {
        const angle_deg = 60 * i;
        const angle_rad = Math.PI / 180 * angle_deg;
        return [center[0] + size * Math.sin(angle_rad), center[1] + size * Math.cos(angle_rad)];
    });

    const color = getSurgeColor(rate);
    const pathOptions = {
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.2
    };

    return (
        <Polygon pathOptions={pathOptions} positions={hexCoords}>
            <Popup>Tarifa dinámica: {rate.toFixed(1)}x</Popup>
        </Polygon>
    );
};

const MenuItem = ({ icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
    <Dialog>
        <DialogTrigger asChild>
            <button className="flex items-center p-3 text-white hover:bg-gray-700 rounded-md w-full text-left">
                <div className="p-2 bg-gray-600 rounded-full mr-4">
                    {React.createElement(icon, { className: "h-5 w-5" })}
                </div>
                <span className="flex-grow font-medium">{label}</span>
                <ChevronRight className="h-5 w-5 text-gray-500 ml-2" />
            </button>
        </DialogTrigger>
        {children}
    </Dialog>
);

const SettingsItem = ({ icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="flex items-center p-3 text-white hover:bg-gray-700 rounded-md w-full text-left">
        {React.createElement(icon, { className: "mr-4 h-5 w-5" })}
        <span>{label}</span>
        <ChevronRight className="h-5 w-5 text-gray-500 ml-auto" />
      </button>
    </DialogTrigger>
    {children}
  </Dialog>
);

const MapClickHandler = ({ onMapClick }: { onMapClick: (latlng: LatLngTuple) => void }) => {
    useMapEvents({
        click(e) {
            onMapClick([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function DriverHomePage() {
    const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isReferralCardVisible, setIsReferralCardVisible] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState("https://placehold.co/100x100.png");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const mapRef = useRef<Map>(null);

    const [startPoint, setStartPoint] = useState<LatLngTuple | null>(null);
    const [endPoint, setEndPoint] = useState<LatLngTuple | null>(null);
    const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);
    const [tripDetails, setTripDetails] = useState<{distance: number, cost: number} | null>(null);
    const [isTripDetailsVisible, setIsTripDetailsVisible] = useState(true);

    useEffect(() => {
        setCurrentPosition([-27.45, -58.983333]);
    }, []);
    
    // Calculate trip details when both points are set
    useEffect(() => {
      if (startPoint && endPoint) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (endPoint[0] - startPoint[0]) * Math.PI / 180;
        const dLon = (endPoint[1] - startPoint[1]) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(startPoint[0] * Math.PI / 180) * Math.cos(endPoint[0] * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km

        const costPerKm = 500;
        const baseFare = 200;
        const cost = baseFare + distance * costPerKm;

        setTripDetails({ distance: parseFloat(distance.toFixed(1)), cost: parseFloat(cost.toFixed(0))});
        setIsTripDetailsVisible(true);
      } else {
        setTripDetails(null);
      }
    }, [startPoint, endPoint]);

    const handleMapClick = (latlng: LatLngTuple) => {
        if (selecting === 'start') {
            setStartPoint(latlng);
            setSelecting(null);
        } else if (selecting === 'end') {
            setEndPoint(latlng);
            setSelecting(null);
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleAvatarUpdate = () => {
        if (selectedFile) {
            const newAvatarUrl = URL.createObjectURL(selectedFile);
            setAvatarUrl(newAvatarUrl);
            toast({
                title: "Foto de perfil actualizada",
                description: "Tu nueva foto se ha guardado correctamente.",
            });
        }
    };

    const surgeZones: { pos: LatLngTuple, rate: string, value: number }[] = [
        { pos: [-27.445, -58.99], rate: "2.9~3.0x", value: 2.95 },
        { pos: [-27.452, -59.00], rate: "2.7~2.9x", value: 2.8 },
        { pos: [-27.46, -59.01], rate: "1.8~2.9x", value: 2.35 },
        { pos: [-27.47, -59.005], rate: "1.3~3.0x", value: 2.15 },
        { pos: [-27.475, -58.995], rate: "1.7~1.9x", value: 1.8 },
        { pos: [-27.485, -59.015], rate: "1.1~1.9x", value: 1.5 },
        { pos: [-27.49, -59.00], rate: "2.1~3.0x", value: 2.55 },
        { pos: [-27.46, -58.97], rate: "3.0x", value: 3.0 },
        // Adding more zones for hexagonal grid
        { pos: [-27.440, -58.995], rate: "2.5x", value: 2.5 },
        { pos: [-27.443, -58.985], rate: "2.8x", value: 2.8 },
        { pos: [-27.455, -58.992], rate: "2.6x", value: 2.6 },
        { pos: [-27.465, -59.003], rate: "2.2x", value: 2.2 },
        { pos: [-27.458, -58.980], rate: "2.9x", value: 2.9 },
    ];

    const zoomIn = () => mapRef.current?.zoomIn();
    const zoomOut = () => mapRef.current?.zoomOut();

    const resetTrip = () => {
        setStartPoint(null);
        setEndPoint(null);
        setSelecting(null);
    }
    
    if (!currentPosition) {
        return <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">Cargando...</div>;
    }

    return (
        <div className="h-screen w-screen bg-gray-900 text-white relative">
             <MapContainer 
                ref={mapRef} 
                center={currentPosition} 
                zoom={14} 
                scrollWheelZoom={true} 
                zoomControl={false} 
                className="h-full w-full absolute inset-0 z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                <MapClickHandler onMapClick={handleMapClick} />

                {surgeZones.map((zone, i) => (
                    <SurgePolygon key={`poly-${i}`} center={zone.pos} rate={zone.value} />
                ))}

                <UserLocationMarker position={currentPosition} />
                
                {startPoint && <LocationMarker position={startPoint} type="start" />}
                {endPoint && <LocationMarker position={endPoint} type="end" />}
                {startPoint && endPoint && <Polyline positions={[startPoint, endPoint]} color="white" dashArray="5, 10" />}

                
                {surgeZones.map((zone, i) => (
                    <SurgePricingMarker key={`marker-${i}`} position={zone.pos} rate={zone.rate} />
                ))}

                <Marker position={[-27.435, -58.985]}>
                    <Popup>Hipermercado Libertad Resistencia</Popup>
                </Marker>
            </MapContainer>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="p-4 flex justify-between items-center pointer-events-auto">
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
                                            <div className="grid w-full max-w-sm items-center gap-1.5 py-4">
                                                <Label htmlFor="picture">Foto</Label>
                                                <Input id="picture" type="file" className="text-white file:text-white" onChange={handleFileChange}/>
                                            </div>
                                            <DialogFooter>
                                                <DialogTrigger asChild>
                                                  <Button type="submit" onClick={handleAvatarUpdate}>Guardar Cambios</Button>
                                                </DialogTrigger>
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
                            <div className="flex-grow overflow-y-auto p-4 space-y-1">
                                <MenuItem icon={Zap} label="Ganancias">
                                   <DialogContent className="bg-gray-900 text-white border-gray-700">
                                      <DialogHeader>
                                        <DialogTitle>Ganancias de la semana</DialogTitle>
                                      </DialogHeader>
                                      <div className="py-4 space-y-6">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-400">Del 10 al 16 de mar</p>
                                            <p className="text-4xl font-bold">$3,880.80</p>
                                        </div>
                                        <Button className="w-full bg-gray-700 hover:bg-gray-600">Ver ganancias detalladas</Button>
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div>
                                                <p className="text-lg font-bold">18</p>
                                                <p className="text-sm text-gray-400">Viajes</p>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold">12h 2m</p>
                                                <p className="text-sm text-gray-400">Horas conectado</p>
                                            </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                </MenuItem>
                                <MenuItem icon={Star} label="Premios">
                                     <DialogContent className="bg-gray-800 text-white border-gray-700">
                                        <DialogHeader>
                                            <DialogTitle>Premios</DialogTitle>
                                            <DialogDescription>Aquí se mostrarán los premios disponibles.</DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </MenuItem>
                                <MenuItem icon={Bell} label="Notificaciones">
                                     <DialogContent className="bg-gray-800 text-white border-gray-700">
                                        <DialogHeader>
                                            <DialogTitle>Notificaciones</DialogTitle>
                                            <DialogDescription>Aquí se mostrará la lista de notificaciones.</DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </MenuItem>
                                <MenuItem icon={Wallet} label="Mi Billetera">
                                     <DialogContent className="bg-gray-900 text-white border-gray-700">
                                        <DialogHeader>
                                            <DialogTitle>Mi Billetera</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4 space-y-4">
                                            <Card className="bg-gray-800 border-gray-700">
                                                <CardContent className="p-4">
                                                    <p className="text-sm text-gray-400">Balance</p>
                                                    <p className="text-2xl font-bold">$1,500.00</p>
                                                </CardContent>
                                            </Card>
                                            <Button className="w-full bg-gray-700 hover:bg-gray-600">Transferir a mi cuenta</Button>
                                            <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">Agregar método de pago</Button>
                                        </div>
                                    </DialogContent>
                                </MenuItem>
                                <MenuItem icon={Settings2} label="Preferencias de viaje">
                                     <DialogContent className="bg-gray-900 text-white border-gray-700">
                                        <DialogHeader>
                                            <DialogTitle>Preferencias de viaje</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4 space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                                <Label htmlFor="accept-cash">Aceptar efectivo</Label>
                                                <Switch id="accept-cash" defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                                <Label htmlFor="auto-accept">Aceptación automática</Label>
                                                <Switch id="auto-accept" />
                                            </div>
                                        </div>
                                    </DialogContent>
                                </MenuItem>
                                <MenuItem icon={HelpCircle} label="Ayuda">
                                     <DialogContent className="bg-gray-800 text-white border-gray-700">
                                        <DialogHeader>
                                            <DialogTitle>Centro de Ayuda</DialogTitle>
                                            <DialogDescription>Aquí encontrarás respuestas a tus preguntas.</DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </MenuItem>
                                <MenuItem icon={Settings2} label="Configuración">
                                    <DialogContent className="bg-gray-900 text-white border-gray-700">
                                        <DialogHeader>
                                            <DialogTitle>Configuración</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-2 flex flex-col">
                                            <SettingsItem icon={FileText} label="Documentos">
                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>Documentos</DialogTitle>
                                                        <DialogDescription>Aquí se mostrará la información de tus documentos.</DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </SettingsItem>
                                            <SettingsItem icon={Smartphone} label="App del conductor">
                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>App del conductor</DialogTitle>
                                                        <DialogDescription>Aquí se mostrarán las opciones de la app.</DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </SettingsItem>
                                            <SettingsItem icon={Lock} label="Privacidad">
                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>Privacidad</DialogTitle>
                                                        <DialogDescription>Aquí se mostrarán las opciones de privacidad.</DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </SettingsItem>
                                            <SettingsItem icon={Languages} label="Idioma">
                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>Idioma</DialogTitle>
                                                        <DialogDescription>Aquí podrás cambiar el idioma de la app.</DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </SettingsItem>
                                            <SettingsItem icon={CircleHelp} label="Acerca de">
                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>Acerca de</DialogTitle>
                                                        <DialogDescription>Aquí se mostrará la información sobre la app.</DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </SettingsItem>
                                        </div>
                                    </DialogContent>
                                </MenuItem>
                            </div>
                            <Separator className="bg-gray-700" />
                            <div className="p-4">
                                <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700 flex items-center justify-center gap-2">
                                  <LogOut className="h-5 w-5"/> Cerrar Sesión
                                </Button>
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

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80">
                                <HelpCircle className="h-6 w-6" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-white border-gray-700">
                            <DialogHeader>
                                <DialogTitle>Centro de Ayuda</DialogTitle>
                                <DialogDescription>Aquí encontrarás respuestas a tus preguntas.</DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={() => currentPosition && mapRef.current?.setView(currentPosition, 14)}>
                        <Crosshair className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80">
                        <Layers className="h-6 w-6" />
                    </Button>
                </div>

                <div className="absolute bottom-[220px] right-4 flex flex-col gap-2 pointer-events-auto">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={zoomIn}>
                        <Plus className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={zoomOut}>
                        <Minus className="h-6 w-6" />
                    </Button>
                </div>
                
                <div className="absolute bottom-40 left-4 flex items-center gap-2 bg-gray-800/80 rounded-full px-3 py-1 shadow-lg pointer-events-auto">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-sm">Google</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
                    {tripDetails ? (
                         <div className="bg-gray-900/90 backdrop-blur-sm rounded-t-2xl shadow-2xl border-t border-gray-700/50 transition-all duration-300">
                            <div className="p-4">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold">Detalles del Viaje</h3>
                                  <div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsTripDetailsVisible(!isTripDetailsVisible)}>
                                        {isTripDetailsVisible ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetTrip}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </div>
                               {isTripDetailsVisible && (
                                   <div className="mt-3">
                                       <div className="flex justify-around items-center text-center bg-gray-800/50 p-3 rounded-lg">
                                           <div>
                                               <p className="text-lg font-bold">{tripDetails.distance} km</p>
                                               <p className="text-xs text-gray-400">Distancia</p>
                                           </div>
                                           <Separator orientation="vertical" className="h-8 bg-gray-700" />
                                           <div>
                                               <p className="text-lg font-bold">~{Math.round(tripDetails.distance * 1.5)} min</p>
                                               <p className="text-xs text-gray-400">Tiempo</p>
                                           </div>
                                           <Separator orientation="vertical" className="h-8 bg-gray-700" />
                                           <div>
                                               <p className="text-lg font-bold">${tripDetails.cost}</p>
                                               <p className="text-xs text-gray-400">Costo</p>
                                           </div>
                                       </div>
                                        <Button size="lg" className="w-full text-lg h-14 mt-4 rounded-lg font-bold bg-orange-600 hover:bg-orange-700">
                                            Confirmar Viaje
                                        </Button>
                                   </div>
                               )}
                            </div>
                         </div>
                    ) : (
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-t-2xl shadow-2xl border-t border-gray-700/50 p-4">
                       { isConnected ? (
                           <div className="text-center py-4">
                               <p className="text-lg font-semibold">Buscando viajes...</p>
                               <p className="text-sm text-gray-400">Estás conectado y listo para recibir solicitudes.</p>
                           </div>
                       ) : (
                        <>
                        <div className="space-y-2 mb-4">
                            <Button variant="outline" className="w-full justify-start h-12 text-left bg-gray-800/50 border-gray-700 hover:bg-gray-800/80" onClick={() => setSelecting('start')}>
                                <MapPin className="mr-3 h-5 w-5 text-blue-400" />
                                {startPoint ? <span className="text-white">{`Desde: ${startPoint[0].toFixed(4)}, ${startPoint[1].toFixed(4)}`}</span> : <span className="text-gray-400">¿Desde dónde?</span>}
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12 text-left bg-gray-800/50 border-gray-700 hover:bg-gray-800/80" onClick={() => setSelecting('end')}>
                                <MapPin className="mr-3 h-5 w-5 text-orange-400" />
                                {endPoint ? <span className="text-white">{`Hasta: ${endPoint[0].toFixed(4)}, ${endPoint[1].toFixed(4)}`}</span> : <span className="text-gray-400">¿Hacia dónde?</span>}
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                             <Dialog>
                                <DialogTrigger asChild>
                                     <Button variant="ghost" className="relative">
                                        <Settings2 className="h-7 w-7" />
                                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-900 text-white border-gray-700">
                                    <DialogHeader>
                                        <DialogTitle>Preferencias de viaje</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4 space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                            <Label htmlFor="accept-cash-dialog">Aceptar efectivo</Label>
                                            <Switch id="accept-cash-dialog" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                            <Label htmlFor="auto-accept-dialog">Aceptación automática</Label>
                                            <Switch id="auto-accept-dialog" />
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button 
                                size="lg" 
                                className={`w-full max-w-xs text-xl h-14 rounded-full font-bold transition-colors ${isConnected ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                                onClick={() => setIsConnected(!isConnected)}
                            >
                                {isConnected ? 'Desconectarse' : 'Conectarse'}
                            </Button>
                            <div className="w-12"></div>
                        </div>
                        </>
                       )}
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}
