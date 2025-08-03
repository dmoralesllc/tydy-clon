

'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression, LatLngTuple, Map } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Menu, ChevronDown, Layers, Crosshair, Shield, Settings2, Zap, Edit, Plus, Minus, X, Eye, Wallet, Star, Bell, LogOut, ChevronRight, FileText, Smartphone, Lock, Languages, Info, MapPin, ChevronUp, Upload, CheckCircle2, Car, Map as MapIcon, Trash2, Settings, Trophy, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useMapEvents } from 'react-leaflet';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';


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
    html: `<div class="w-6 h-6 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg></div>`,
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

const DocumentUploader = ({ label, docKey, uploadedDocs, onFileSelect }: { label: string, docKey: string, uploadedDocs: any, onFileSelect: (docKey: string, file: File | null) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const file = uploadedDocs[docKey];

    return (
        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
            <span className="text-white">{label}</span>
            <div className="flex items-center gap-2">
                {file ? (
                    <>
                        <span className="text-sm text-green-400 truncate max-w-xs">{file.name}</span>
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                    </>
                ) : (
                    <span className="text-sm text-gray-400">No subido</span>
                )}
                <Button variant="ghost" size="icon" onClick={() => inputRef.current?.click()}>
                    <Upload className="h-5 w-5" />
                </Button>
                <Input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    onChange={(e) => onFileSelect(docKey, e.target.files ? e.target.files[0] : null)}
                />
            </div>
        </div>
    );
};

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

const chartData = [
    { day: "Lun", earnings: 450 },
    { day: "Mar", earnings: 580 },
    { day: "Mié", earnings: 720 },
    { day: "Jue", earnings: 610 },
    { day: "Vie", earnings: 890 },
    { day: "Sáb", earnings: 1100 },
    { day: "Dom", earnings: 950 },
];

const chartConfig = {
    earnings: {
        label: "Ganancias",
        color: "hsl(var(--primary))",
    },
};

const initialEarningsHistory = [
    { id: 1, type: "Viaje", amount: 250.50, time: "hace 10 min" },
    { id: 2, type: "Bono", amount: 150.00, time: "hace 2 horas" },
    { id: 3, type: "Viaje", amount: 320.00, time: "hace 3 horas" },
    { id: 4, type: "Viaje", amount: 180.20, time: "hace 5 horas" },
];

const mapTypes = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};


export default function DriverHomePage() {
    const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>(null);
    const [viewPosition, setViewPosition] = useState<LatLngTuple | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isReferralCardVisible, setIsReferralCardVisible] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState("https://placehold.co/100x100.png");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const mapRef = useRef<Map>(null);

    const [startPoint, setStartPoint] = useState<LatLngTuple | null>(null);
    const [endPoint, setEndPoint] = useState<LatLngTuple | null>(null);
    const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);
    const [tripDetails, setTripDetails] = useState<{distance: number; cost: number; duration: number;} | null>(null);
    const [isTripDetailsVisible, setIsTripDetailsVisible] = useState(true);
    const [isSearchMinimized, setIsSearchMinimized] = useState(false);
    const [uploadedDocs, setUploadedDocs] = useState<{[key: string]: File | null}>({});
    const [isParticipatingInWeekendChallenge, setIsParticipatingInWeekendChallenge] = useState(false);
    const [earningsHistory, setEarningsHistory] = useState(initialEarningsHistory);
    const [editingEarning, setEditingEarning] = useState<any | null>(null);
    const [mapType, setMapType] = useState<keyof typeof mapTypes>('dark');
    const [route, setRoute] = useState<LatLngTuple[]>([]);
    const [isTripInProgress, setIsTripInProgress] = useState(false);

    const getRoute = async (start: LatLngTuple, end: LatLngTuple) => {
        try {
            const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`);
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                const routeGeometry = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as LatLngTuple);
                setRoute(routeGeometry);

                const distance = data.routes[0].distance / 1000; // in km
                const duration = data.routes[0].duration / 60; // in minutes
                
                const costPerKm = 500;
                const baseFare = 200;
                const cost = baseFare + distance * costPerKm;

                setTripDetails({ distance: parseFloat(distance.toFixed(1)), cost: parseFloat(cost.toFixed(0)), duration: parseFloat(duration.toFixed(0)) });
                setIsTripDetailsVisible(true);
            } else {
                 toast({ variant: "destructive", title: "Error de ruta", description: "No se pudo encontrar una ruta." });
                 setTripDetails(null);
                 setRoute([]);
            }
        } catch (error) {
            console.error("Error fetching route:", error);
            toast({ variant: "destructive", title: "Error de red", description: "No se pudo conectar al servicio de enrutamiento." });
            setTripDetails(null);
            setRoute([]);
        }
    };

    const toggleMapType = () => {
        const types = Object.keys(mapTypes) as (keyof typeof mapTypes)[];
        const currentIndex = types.indexOf(mapType);
        const nextIndex = (currentIndex + 1) % types.length;
        setMapType(types[nextIndex]);
    };

    const handleSaveEarning = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const updatedEarning = {
            id: editingEarning.id,
            type: formData.get('type') as string,
            amount: parseFloat(formData.get('amount') as string),
            time: formData.get('time') as string,
        };

        if (editingEarning.isNew) {
             setEarningsHistory(prev => [updatedEarning, ...prev.filter(item => item.id !== editingEarning.id)]);
             toast({ title: "Registro añadido", description: "El nuevo registro de ganancia ha sido añadido." });
        } else {
            setEarningsHistory(prev => prev.map(item => item.id === updatedEarning.id ? updatedEarning : item));
            toast({ title: "Registro actualizado", description: "El registro de ganancia ha sido actualizado." });
        }

        setEditingEarning(null);
    };

    const handleAddNewEarning = () => {
        setEditingEarning({ id: Date.now(), type: 'Viaje', amount: 0, time: 'Ahora', isNew: true });
    };

    const handleDeleteEarning = (id: number) => {
        setEarningsHistory(prev => prev.filter(item => item.id !== id));
        toast({
            variant: "destructive",
            title: "Registro Eliminado",
            description: "El registro de ganancia ha sido eliminado.",
        });
    };

     useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPos: LatLngTuple = [latitude, longitude];
                    setCurrentPosition(newPos);
                    if (!viewPosition) {
                        setViewPosition(newPos);
                    }
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                    const defaultPos: LatLngTuple = [-27.45, -58.983333];
                    setCurrentPosition(defaultPos);
                    if (!viewPosition) {
                        setViewPosition(defaultPos);
                    }
                    toast({
                        variant: "destructive",
                        title: "Error de Geolocalización",
                        description: "No se pudo obtener tu ubicación. Mostrando una ubicación por defecto.",
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );

            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        } else {
            const defaultPos: LatLngTuple = [-27.45, -58.983333];
            setCurrentPosition(defaultPos);
            setViewPosition(defaultPos);
            toast({
                variant: "destructive",
                title: "Geolocalización no soportada",
                description: "Tu navegador no soporta geolocalización. Mostrando una ubicación por defecto.",
            });
        }
    }, [viewPosition]);
    
    useEffect(() => {
      if (startPoint && endPoint) {
        getRoute(startPoint, endPoint);
      } else {
        setTripDetails(null);
        setRoute([]);
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
    
    const handleFileSelect = (docKey: string, file: File | null) => {
        if (file) {
            setUploadedDocs(prev => ({ ...prev, [docKey]: file }));
        }
    };
    
    const handleSubmitDocs = () => {
        toast({
            title: "Documentos enviados",
            description: "Tus documentos han sido enviados para revisión.",
        });
    };

    const handleSaveVehicle = () => {
        toast({
            title: "Vehículo guardado",
            description: "El nuevo vehículo se ha añadido a tu perfil.",
        });
    }

    const handleDeleteVehicle = () => {
        toast({
            variant: "destructive",
            title: "Vehículo Eliminado",
            description: "El vehículo ha sido eliminado de tu perfil.",
        });
    };

    const handleParticipate = () => {
        setIsParticipatingInWeekendChallenge(true);
        toast({
            title: "¡Inscrito!",
            description: "Ya estás participando en el Desafío Fin de Semana.",
        });
    };

    const handleConfirmTrip = () => {
      if (!route.length) return;
      setIsTripInProgress(true);
      toast({
          title: "Viaje en Progreso",
          description: "Sigue la ruta marcada en el mapa."
      });
  };

  const handleFinishTrip = () => {
      setIsTripInProgress(false);
      toast({ title: "Viaje Finalizado", description: "Has llegado a tu destino." });
      resetTrip();
  }

    const surgeZones: { pos: LatLngTuple, rate: string, value: number }[] = [
        { pos: [-27.445, -58.99], rate: "2.9~3.0x", value: 2.95 },
        { pos: [-27.452, -59.00], rate: "2.7~2.9x", value: 2.8 },
        { pos: [-27.46, -59.01], rate: "1.8~2.9x", value: 2.35 },
        { pos: [-27.47, -59.005], rate: "1.3~3.0x", value: 2.15 },
        { pos: [-27.475, -58.995], rate: "1.7~1.9x", value: 1.8 },
        { pos: [-27.485, -59.015], rate: "1.1~1.9x", value: 1.5 },
        { pos: [-27.49, -59.00], rate: "2.1~3.0x", value: 2.55 },
        { pos: [-27.46, -58.97], rate: "3.0x", value: 3.0 },
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
        setRoute([]);
        setIsTripInProgress(false);
    }
    
    if (!viewPosition) {
        return <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">Obteniendo ubicación GPS...</div>;
    }

    return (
        <div className="h-screen w-screen bg-gray-900 text-white relative">
             <MapContainer 
                ref={mapRef} 
                center={viewPosition} 
                zoom={15} 
                scrollWheelZoom={true} 
                zoomControl={false} 
                className="h-full w-full absolute inset-0 z-0"
            >
                <TileLayer
                    url={mapTypes[mapType]}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                <MapClickHandler onMapClick={handleMapClick} />

                {surgeZones.map((zone, i) => (
                    <SurgePolygon key={`poly-${i}`} center={zone.pos} rate={zone.value} />
                ))}

                {currentPosition && <UserLocationMarker position={currentPosition} />}
                
                {startPoint && <LocationMarker position={startPoint} type="start" />}
                {endPoint && <LocationMarker position={endPoint} type="end" />}
                {route.length > 0 && <Polyline positions={route} color="white" weight={5} opacity={0.8} />}

                
                {surgeZones.map((zone, i) => (
                    <SurgePricingMarker key={`marker-${i}`} position={zone.pos} rate={zone.rate} />
                ))}
            </MapContainer>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="p-4 pointer-events-auto">
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
                                    <div className="flex-grow">
                                        <SheetTitle className="text-xl">Conductor</SheetTitle>
                                        <p className="text-gray-400">Nivel: Oro</p>
                                    </div>
                                    <div className="bg-red-600 p-1 rounded-md flex items-center justify-center h-8 w-16 text-white font-bold text-lg tracking-tighter">
                                        <span>TyDy</span>
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
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full bg-gray-700 hover:bg-gray-600">Ver ganancias detalladas</Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Ganancias Detalladas</DialogTitle>
                                                    <DialogDescription>Un resumen de tus ganancias y viajes de la semana.</DialogDescription>
                                                </DialogHeader>
                                                <Tabs defaultValue="overview" className="w-full pt-4">
                                                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                                                        <TabsTrigger value="overview">Resumen</TabsTrigger>
                                                        <TabsTrigger value="history">Historial de Viajes</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="overview" className="mt-4 space-y-6">
                                                        <Card className="bg-gray-800 border-gray-700">
                                                            <CardHeader>
                                                                <CardTitle>Ganancias Diarias</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="h-[250px] w-full">
                                                                <ChartContainer config={chartConfig} className="h-full w-full">
                                                                    <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                                                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                                                                        <YAxis strokeDasharray="3 3" tickLine={false} axisLine={false} tickMargin={8} />
                                                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                                        <Bar dataKey="earnings" fill="var(--color-earnings)" radius={8} />
                                                                    </BarChart>
                                                                </ChartContainer>
                                                            </CardContent>
                                                        </Card>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <Card className="bg-gray-800 border-gray-700">
                                                                <CardHeader>
                                                                    <CardTitle>Viajes Totales</CardTitle>
                                                                    <CardDescription>Esta semana</CardDescription>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <p className="text-3xl font-bold">18</p>
                                                                </CardContent>
                                                            </Card>
                                                            <Card className="bg-gray-800 border-gray-700">
                                                                <CardHeader>
                                                                    <CardTitle>Horas Online</CardTitle>
                                                                    <CardDescription>Esta semana</CardDescription>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <p className="text-3xl font-bold">12h 2m</p>
                                                                </CardContent>
                                                            </Card>
                                                             <Card className="bg-gray-800 border-gray-700">
                                                                <CardHeader>
                                                                    <CardTitle>Ganancia Prom./Viaje</CardTitle>
                                                                    <CardDescription>Esta semana</CardDescription>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <p className="text-3xl font-bold">$215.60</p>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </TabsContent>
                                                     <TabsContent value="history" className="mt-4">
                                                        <div className="flex justify-end mb-4">
                                                            <Button size="sm" onClick={handleAddNewEarning}><Plus className="mr-2 h-4 w-4" />Añadir Registro</Button>
                                                        </div>
                                                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                                            {earningsHistory.map(item => (
                                                                <div key={item.id} className="group flex items-center justify-between p-3 bg-gray-800 rounded-md hover:bg-gray-700/80">
                                                                    <div>
                                                                        <p className="font-semibold">{item.type}</p>
                                                                        <p className="text-xs text-gray-400">{item.time}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className={`font-bold ${item.type === 'Viaje' ? 'text-green-400' : 'text-blue-400'}`}>
                                                                            +${item.amount.toFixed(2)}
                                                                        </p>
                                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingEarning(item)}>
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger asChild>
                                                                                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-500/20">
                                                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                                                    </Button>
                                                                                </AlertDialogTrigger>
                                                                                 <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                                        <AlertDialogDescription>Esta acción es permanente y eliminará el registro de ganancia.</AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                        <AlertDialogAction onClick={() => handleDeleteEarning(item.id)} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                            </DialogContent>
                                        </Dialog>
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
                                    <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle>Programa de Premios</DialogTitle>
                                            <DialogDescription>Participa en desafíos, gana puntos y canjea recompensas.</DialogDescription>
                                        </DialogHeader>
                                        <Tabs defaultValue="challenges" className="w-full pt-4">
                                            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                                                <TabsTrigger value="challenges">Desafíos Actuales</TabsTrigger>
                                                <TabsTrigger value="progress">Mi Progreso</TabsTrigger>
                                                <TabsTrigger value="history">Historial</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="challenges" className="mt-4 space-y-4">
                                                <Card className="bg-gray-800 border-gray-700">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2"><Trophy className="text-yellow-400"/>Desafío Fin de Semana</CardTitle>
                                                        <CardDescription>Completa 20 viajes entre el sábado y el domingo.</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-lg font-bold text-green-400">Recompensa: $500 extra</p>
                                                    </CardContent>
                                                    <CardFooter>
                                                        <Button 
                                                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600"
                                                            onClick={handleParticipate}
                                                            disabled={isParticipatingInWeekendChallenge}
                                                        >
                                                            {isParticipatingInWeekendChallenge ? 'Participando' : 'Participar'}
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                                <Card className="bg-gray-800 border-gray-700">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2"><Zap className="text-blue-400"/>Racha de 5 viajes</CardTitle>
                                                        <CardDescription>Completa 5 viajes seguidos sin cancelar.</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-lg font-bold text-green-400">Recompensa: +$150</p>
                                                    </CardContent>
                                                     <CardFooter>
                                                        <Button className="w-full" disabled>Activo</Button>
                                                    </CardFooter>
                                                </Card>
                                            </TabsContent>
                                            <TabsContent value="progress" className="mt-4 space-y-6">
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <Label>Desafío Fin de Semana</Label>
                                                        <span className="text-sm font-medium">8 / 20 Viajes</span>
                                                    </div>
                                                    <Progress value={40} className="h-3" />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <Label>Lealtad Mensual</Label>
                                                        <span className="text-sm font-medium">65 / 100 Viajes</span>
                                                    </div>
                                                    <Progress value={65} className="h-3" />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <Label>Conductor Estrella</Label>
                                                        <span className="text-sm font-medium">4.95 / 5.00 Calificación</span>
                                                    </div>
                                                    <Progress value={99} className="h-3" />
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="history" className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
                                                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                                    <div>
                                                        <p className="font-semibold">Bono Nocturno</p>
                                                        <p className="text-xs text-gray-400">15 de Marzo, 2024</p>
                                                    </div>
                                                    <p className="text-green-400 font-bold">+$250</p>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                                    <div>
                                                        <p className="font-semibold">Racha de 5 viajes</p>
                                                        <p className="text-xs text-gray-400">14 de Marzo, 2024</p>
                                                    </div>
                                                    <p className="text-green-400 font-bold">+$150</p>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                                    <div>
                                                        <p className="font-semibold">Desafío Semanal</p>
                                                        <p className="text-xs text-gray-400">12 de Marzo, 2024</p>
                                                    </div>
                                                    <p className="text-green-400 font-bold">+$800</p>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
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
                                <MenuItem icon={Settings} label="Configuración">
                                    <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Configuración</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-2 flex flex-col">
                                            <SettingsItem icon={FileText} label="Documentos">
                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>Subir Documentación</DialogTitle>
                                                        <DialogDescription>Sube los documentos requeridos para verificar tu cuenta de conductor.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="py-4 space-y-3">
                                                        <DocumentUploader label="DNI (Frente)" docKey="dniFront" uploadedDocs={uploadedDocs} onFileSelect={handleFileSelect} />
                                                        <DocumentUploader label="DNI (Dorso)" docKey="dniBack" uploadedDocs={uploadedDocs} onFileSelect={handleFileSelect} />
                                                        <DocumentUploader label="Licencia de Conducir (Frente)" docKey="licenseFront" uploadedDocs={uploadedDocs} onFileSelect={handleFileSelect} />
                                                        <DocumentUploader label="Licencia de Conducir (Dorso)" docKey="licenseBack" uploadedDocs={uploadedDocs} onFileSelect={handleFileSelect} />
                                                        <DocumentUploader label="Seguro del Vehículo" docKey="insurance" uploadedDocs={uploadedDocs} onFileSelect={handleFileSelect} />
                                                        <DocumentUploader label="Antecedentes Penales" docKey="criminalRecord" uploadedDocs={uploadedDocs} onFileSelect={handleFileSelect} />
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogTrigger asChild>
                                                            <Button onClick={handleSubmitDocs}>Enviar para revisión</Button>
                                                        </DialogTrigger>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </SettingsItem>
                                            <SettingsItem icon={FileText} label="Términos y Condiciones">
                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>TÉRMINOS Y CONDICIONES DE USO DEL SERVICIO</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="py-4 space-y-4 text-sm text-gray-300 max-h-[60vh] overflow-y-auto">
                                                        <h3 className="font-bold text-base text-white">1. ACEPTACIÓN DEL USUARIO</h3>
                                                        <p>Al acceder, registrarse o utilizar esta plataforma (en adelante, "la Plataforma"), el usuario, ya sea conductor o pasajero (en adelante, "el Usuario"), declara haber leído, comprendido y aceptado todos los términos y condiciones aquí expuestos.</p>

                                                        <h3 className="font-bold text-base text-white">2. NATURALEZA DEL SERVICIO</h3>
                                                        <p>La Plataforma funciona exclusivamente como medio de contacto entre particulares: un conductor ofrece un traslado y un pasajero decide si acepta o no dicha oferta. No existe relación laboral, societaria, comercial, de representación, ni asociación alguna entre la Plataforma y los Usuarios.</p>

                                                        <h3 className="font-bold text-base text-white">3. LIMITACIÓN DE RESPONSABILIDAD</h3>
                                                        <p>El creador, desarrollador y/u operador de la Plataforma no será en ningún caso responsable, directa ni indirectamente, por:</p>
                                                        <ul className="list-disc list-inside space-y-1 pl-4">
                                                            <li>Cualquier incidente, accidente, daño, lesión, pérdida, conflicto o perjuicio derivado del uso del servicio por parte de los Usuarios.</li>
                                                            <li>El estado, vigencia, legalidad o idoneidad del vehículo o licencia de conducir de los conductores.</li>
                                                            <li>La validez, vigencia o veracidad de los certificados de antecedentes penales u otros documentos requeridos.</li>
                                                            <li>La falta de seguro obligatorio, vencimiento del mismo, o ausencia de cobertura ante terceros.</li>
                                                            <li>Cualquier situación derivada del comportamiento, acciones u omisiones del conductor o pasajero.</li>
                                                            <li>Similitud de software, diseño o funcionalidades con otras plataformas existentes, por tratarse de un desarrollo independiente basado en principios de oferta y demanda.</li>
                                                        </ul>

                                                        <h3 className="font-bold text-base text-white">4. CONDICIÓN DE INDEPENDENCIA ENTRE USUARIOS</h3>
                                                        <p>Los usuarios aceptan que toda interacción, viaje, pago o acuerdo realizado entre ellos se da en un marco de completa autonomía e independencia, sin intervención, intermediación ni garantía alguna por parte de la Plataforma.</p>

                                                        <h3 className="font-bold text-base text-white">5. ÁMBITO DE APLICACIÓN LEGAL</h3>
                                                        <p>Este documento se rige por las leyes de la República Argentina, pero sus principios son aplicables en cualquier jurisdicción del mundo, en la medida permitida por los tratados internacionales de reciprocidad y reconocimiento de normas contractuales entre partes.</p>

                                                        <h3 className="font-bold text-base text-white">6. EXENCIÓN DE RECLAMOS LEGALES</h3>
                                                        <p>El Usuario renuncia expresamente a realizar cualquier tipo de reclamo, demanda, denuncia, o acción judicial o extrajudicial contra el creador, operador o responsable de la Plataforma, por cualquier causa o motivo, conocido o desconocido, presente o futuro, derivado directa o indirectamente del uso del servicio.</p>

                                                        <h3 className="font-bold text-base text-white">7. MODIFICACIONES</h3>
                                                        <p>La Plataforma se reserva el derecho de modificar los presentes Términos y Condiciones sin previo aviso. El uso continuado del servicio implica la aceptación de los cambios realizados.</p>
                                                    </div>
                                                </DialogContent>
                                            </SettingsItem>
                                            <SettingsItem icon={Smartphone} label="App del conductor">
                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>App del Conductor</DialogTitle>
                                                        <DialogDescription>
                                                            Configura tus preferencias para la aplicación.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="py-4 space-y-6">
                                                        <div className="space-y-2">
                                                            <Label>Navegación</Label>
                                                            <RadioGroup defaultValue="app" className="p-3 bg-gray-900 rounded-md">
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="app" id="r1" />
                                                                    <Label htmlFor="r1">Navegación de la App</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="google" id="r2" />
                                                                    <Label htmlFor="r2">Google Maps</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="waze" id="r3" />
                                                                    <Label htmlFor="r3">Waze</Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Vehículo</Label>
                                                            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-md">
                                                                <div className="flex items-center gap-3">
                                                                    <Car className="h-6 w-6 text-gray-400" />
                                                                    <div>
                                                                        <p className="font-medium">Toyota Corolla</p>
                                                                        <p className="text-sm text-gray-400">Patente AB 123 CD</p>
                                                                    </div>
                                                                </div>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="ghost">Cambiar</Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                                        <DialogHeader>
                                                                            <DialogTitle>Seleccionar Vehículo</DialogTitle>
                                                                            <DialogDescription>
                                                                                Elige el vehículo que quieres usar o añade uno nuevo.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="py-4 space-y-4">
                                                                            <RadioGroup defaultValue="corolla" className="space-y-2">
                                                                                <Label className="flex items-center justify-between p-3 bg-gray-900 rounded-md cursor-pointer hover:bg-gray-700 group">
                                                                                    <div className="flex items-center">
                                                                                        <RadioGroupItem value="corolla" id="v1" className="mr-3" />
                                                                                        <div>
                                                                                            <p className="font-medium">Toyota Corolla</p>
                                                                                            <p className="text-sm text-gray-400">Patente AB 123 CD</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <AlertDialog>
                                                                                        <AlertDialogTrigger asChild>
                                                                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={(e) => e.preventDefault()}>
                                                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                                                            </Button>
                                                                                        </AlertDialogTrigger>
                                                                                        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                                                                                            <AlertDialogHeader>
                                                                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                                                <AlertDialogDescription>
                                                                                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el vehículo de tu perfil.
                                                                                                </AlertDialogDescription>
                                                                                            </AlertDialogHeader>
                                                                                            <AlertDialogFooter>
                                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                                <AlertDialogAction onClick={handleDeleteVehicle} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                                                                                            </AlertDialogFooter>
                                                                                        </AlertDialogContent>
                                                                                    </AlertDialog>
                                                                                </Label>
                                                                                <Label className="flex items-center justify-between p-3 bg-gray-900 rounded-md cursor-pointer hover:bg-gray-700 group">
                                                                                    <div className="flex items-center">
                                                                                        <RadioGroupItem value="onix" id="v2" className="mr-3" />
                                                                                        <div>
                                                                                            <p className="font-medium">Chevrolet Onix</p>
                                                                                            <p className="text-sm text-gray-400">Patente XY 456 ZZ</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <AlertDialog>
                                                                                        <AlertDialogTrigger asChild>
                                                                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={(e) => e.preventDefault()}>
                                                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                                                            </Button>
                                                                                        </AlertDialogTrigger>
                                                                                        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                                                                                            <AlertDialogHeader>
                                                                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                                                <AlertDialogDescription>
                                                                                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el vehículo de tu perfil.
                                                                                                </AlertDialogDescription>
                                                                                            </AlertDialogHeader>
                                                                                            <AlertDialogFooter>
                                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                                <AlertDialogAction onClick={handleDeleteVehicle} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                                                                                            </AlertDialogFooter>
                                                                                        </AlertDialogContent>
                                                                                    </AlertDialog>
                                                                                </Label>
                                                                            </RadioGroup>
                                                                            <Dialog>
                                                                                <DialogTrigger asChild>
                                                                                    <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                                                                                        <Plus className="mr-2 h-4 w-4" /> Agregar vehículo nuevo
                                                                                    </Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                                                    <DialogHeader>
                                                                                        <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
                                                                                        <DialogDescription>
                                                                                            Ingresa los datos del nuevo vehículo.
                                                                                        </DialogDescription>
                                                                                    </DialogHeader>
                                                                                    <div className="py-4 space-y-4">
                                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                                            <Label htmlFor="marca" className="text-right">Marca</Label>
                                                                                            <Input id="marca" placeholder="Ej: Toyota" className="col-span-3 text-white" />
                                                                                        </div>
                                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                                            <Label htmlFor="modelo" className="text-right">Modelo</Label>
                                                                                            <Input id="modelo" placeholder="Ej: Corolla" className="col-span-3 text-white" />
                                                                                        </div>
                                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                                            <Label htmlFor="patente" className="text-right">Patente</Label>
                                                                                            <Input id="patente" placeholder="Ej: AB 123 CD" className="col-span-3 text-white" />
                                                                                        </div>
                                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                                            <Label htmlFor="color" className="text-right">Color</Label>
                                                                                            <Input id="color" placeholder="Ej: Negro" className="col-span-3 text-white" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <DialogFooter>
                                                                                        <DialogClose asChild>
                                                                                            <Button variant="ghost">Cancelar</Button>
                                                                                        </DialogClose>
                                                                                        <Button type="submit" onClick={handleSaveVehicle}>Guardar Vehículo</Button>
                                                                                    </DialogFooter>
                                                                                </DialogContent>
                                                                            </Dialog>
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-md">
                                                          <div className="space-y-1">
                                                              <Label htmlFor="night-mode">Modo nocturno automático</Label>
                                                              <p className="text-xs text-gray-400">El mapa cambiará a modo oscuro por la noche.</p>
                                                          </div>
                                                          <Switch id="night-mode" defaultChecked />
                                                      </div>
                                                    </div>
                                                </DialogContent>
                                            </SettingsItem>
                                            <SettingsItem icon={Lock} label="Privacidad">
                                                <DialogContent className="bg-gray-900 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>Privacidad</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="py-4 space-y-4">
                                                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                                            <div className="space-y-1">
                                                                <Label htmlFor="location-sharing">Compartir datos de ubicación</Label>
                                                                <p className="text-xs text-gray-400">Permitir el acceso a la ubicación cuando la app no está en uso.</p>
                                                            </div>
                                                            <Switch id="location-sharing" defaultChecked />
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                                            <div className="space-y-1">
                                                                <Label htmlFor="promotional-notifications">Notificaciones promocionales</Label>
                                                                <p className="text-xs text-gray-400">Recibir ofertas, encuestas y novedades.</p>
                                                            </div>
                                                            <Switch id="promotional-notifications" />
                                                        </div>
                                                        <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">Gestionar mis datos</Button>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="link" className="w-full text-center text-gray-400">Ver Política de Privacidad</Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                                <DialogHeader>
                                                                    <DialogTitle>POLÍTICAS DE PRIVACIDAD</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="py-4 space-y-4 text-sm text-gray-300 max-h-[60vh] overflow-y-auto">
                                                                    <p className="text-xs text-gray-400">Última actualización: 02/08/2025</p>
                                                                    <p>Esta aplicación/sitio web/plataforma (en adelante, “la Plataforma”) ofrece un servicio de contacto entre conductores y pasajeros, regido por un modelo de oferta y demanda, sin intermediación directa, sin garantía ni responsabilidad de ningún tipo por parte de los administradores, desarrolladores o cualquier persona vinculada a la creación, publicación, edición o mantenimiento de la Plataforma.</p>
                                                                    <h3 className="font-bold text-base text-white">1. ACEPTACIÓN DE LAS POLÍTICAS</h3>
                                                                    <p>Al acceder o utilizar la Plataforma, usted acepta de forma libre, voluntaria e informada estas Políticas de Privacidad. Si no está de acuerdo, deberá abstenerse de utilizar la Plataforma.</p>
                                                                    <h3 className="font-bold text-base text-white">2. TIPO DE INFORMACIÓN RECOPILADA</h3>
                                                                    <p>La Plataforma no recopila información sensible ni realiza tratamiento automatizado de datos con fines comerciales, publicitarios ni estadísticos. Cualquier dato personal que se ingrese es estrictamente voluntario y utilizado únicamente para efectos de funcionamiento técnico (como geolocalización, contacto entre partes o verificación básica de identidad).</p>
                                                                    <h3 className="font-bold text-base text-white">3. USO DE LA INFORMACIÓN</h3>
                                                                    <p>Toda información proporcionada por los usuarios será utilizada exclusivamente para la correcta operación del servicio entre conductor y pasajero. No se utilizará con fines comerciales, ni será cedida, vendida o compartida con terceros.</p>
                                                                    <h3 className="font-bold text-base text-white">4. DESCARGO DE RESPONSABILIDAD</h3>
                                                                    <p>Los administradores y desarrolladores no serán responsables por ningún tipo de daño, perjuicio, incidente, delito, accidente, fraude, negligencia, estafa, omisión u otra situación derivada del uso de la Plataforma o del vínculo entre las partes usuarias (pasajero y conductor).</p>
                                                                    <p>Asimismo, no se garantiza la validez ni vigencia de seguros, licencias, antecedentes penales, certificados sanitarios o cualquier otro requisito legal o documental que pudiera ser exigido por autoridades locales, nacionales o internacionales.</p>
                                                                    <h3 className="font-bold text-base text-white">5. COMPATIBILIDAD INTERNACIONAL</h3>
                                                                    <p>Estas Políticas se basan en principios generales del derecho, en normas de protección de datos y privacidad reconocidas internacionalmente, y en tratados multilaterales suscritos por la República Argentina, siendo aplicables en todos los países del mundo en los que no contradigan normas de orden público local.</p>
                                                                    <h3 className="font-bold text-base text-white">6. RECLAMOS</h3>
                                                                    <p>No se aceptarán reclamos ni demandas de ningún tipo vinculadas al uso de la Plataforma, ya sea por conductores, pasajeros, empresas, gobiernos u otros actores, siendo el uso del sistema completamente voluntario y bajo la exclusiva responsabilidad de quien decide utilizarlo.</p>
                                                                    <h3 className="font-bold text-base text-white">7. PROPIEDAD INTELECTUAL Y SIMILITUDES</h3>
                                                                    <p>El software, interfaz y modelo de funcionamiento podrían coincidir de forma parcial o incidental con otras plataformas disponibles en el mercado. Dicha similitud no implica copia ni infracción, sino una coincidencia funcional genérica dentro de un ecosistema digital amplio. No se asume responsabilidad alguna por similitudes con otras plataformas o sistemas.</p>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
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
                                            <SettingsItem icon={Info} label="Acerca de">
                                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle>Acerca de dmoralesllc</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="py-4 space-y-4 text-sm text-gray-300 max-h-[60vh] overflow-y-auto">
                                                        <p>dmoralesllc es un nombre de fantasía utilizado para el desarrollo y publicación de soluciones tecnológicas orientadas a facilitar el vínculo entre oferta y demanda de servicios, sin que ello implique responsabilidad directa, intermediación formal ni vinculación legal alguna entre las partes intervinientes. Todas las plataformas, herramientas y productos desarrollados bajo esta identidad tienen como único propósito brindar un canal funcional, tecnológico y automatizado para el contacto directo entre usuarios, prestadores de servicios, y potenciales clientes, sin que exista ningún tipo de relación laboral, societaria ni contractual con dmoralesllc.</p>
                                                        <p>Las funcionalidades implementadas, el diseño del sistema y el modelo operativo están basados en principios de neutralidad tecnológica, y no suponen respaldo, verificación, ni control de los antecedentes, habilitaciones, seguros o condiciones legales de los usuarios que se registren o utilicen los servicios, ya sean conductores, pasajeros, prestadores o consumidores. La veracidad de los datos, documentos y declaraciones cargados en la plataforma es exclusiva responsabilidad de quienes los proveen.</p>
                                                        <p>dmoralesllc no asume ningún tipo de responsabilidad por daños, perjuicios, reclamos o conflictos que pudieran derivarse de relaciones, contratos, actividades u omisiones entre usuarios, conductores, proveedores o terceros que hayan accedido o interactuado a través de las plataformas desarrolladas. Cualquier controversia deberá ser resuelta exclusively entre las partes intervinientes, conforme la legislación aplicable en su jurisdicción.</p>
                                                        <p>Asimismo, si bien dmoralesllc aplica las medidas de seguridad informática consideradas razonables según los estándares de la industria (como cifrado, control de accesos y protocolos de protección de datos), no garantiza ni se responsabiliza por eventuales accesos no autorizados, filtraciones, robo de datos, ataques cibernéticos, pérdidas de información ni otras formas de vulneración de la seguridad que pudieran afectar al sistema o a sus usuarios, más allá del control razonable del desarrollador.</p>
                                                        <p>Toda interacción dentro de las herramientas desarrolladas supone la aceptación plena de estos términos, reconociendo que el uso de tecnologías en entornos abiertos o conectados a internet conlleva riesgos inherentes que deben ser asumidos por el usuario.</p>
                                                        <p>Este proyecto ha sido concebido conforme los principios del libre comercio, la autonomía de la voluntad de las partes, y el uso responsable de tecnologías digitales, conforme las leyes de la República Argentina y tratados internacionales vigentes.</p>
                                                    </div>
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
                    
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
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
                                    <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Ganancias Detalladas</DialogTitle>
                                            <DialogDescription>Un resumen de tus ganancias y viajes de la semana.</DialogDescription>
                                        </DialogHeader>
                                        <Tabs defaultValue="overview" className="w-full pt-4">
                                            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                                                <TabsTrigger value="overview">Resumen</TabsTrigger>
                                                <TabsTrigger value="history">Historial de Viajes</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="overview" className="mt-4 space-y-6">
                                                <Card className="bg-gray-800 border-gray-700">
                                                    <CardHeader>
                                                        <CardTitle>Ganancias Diarias</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="h-[250px] w-full">
                                                        <ChartContainer config={chartConfig} className="h-full w-full">
                                                            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                                                                <YAxis strokeDasharray="3 3" tickLine={false} axisLine={false} tickMargin={8} />
                                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                                <Bar dataKey="earnings" fill="var(--color-earnings)" radius={8} />
                                                            </BarChart>
                                                        </ChartContainer>
                                                    </CardContent>
                                                </Card>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <Card className="bg-gray-800 border-gray-700">
                                                        <CardHeader>
                                                            <CardTitle>Viajes Totales</CardTitle>
                                                            <CardDescription>Esta semana</CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-3xl font-bold">18</p>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-gray-800 border-gray-700">
                                                        <CardHeader>
                                                            <CardTitle>Horas Online</CardTitle>
                                                            <CardDescription>Esta semana</CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-3xl font-bold">12h 2m</p>
                                                        </CardContent>
                                                    </Card>
                                                        <Card className="bg-gray-800 border-gray-700">
                                                        <CardHeader>
                                                            <CardTitle>Ganancia Prom./Viaje</CardTitle>
                                                            <CardDescription>Esta semana</CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-3xl font-bold">$215.60</p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </TabsContent>
                                                <TabsContent value="history" className="mt-4">
                                                <div className="flex justify-end mb-4">
                                                    <Button size="sm" onClick={handleAddNewEarning}><Plus className="mr-2 h-4 w-4" />Añadir Registro</Button>
                                                </div>
                                                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                                    {earningsHistory.map(item => (
                                                        <div key={item.id} className="group flex items-center justify-between p-3 bg-gray-800 rounded-md hover:bg-gray-700/80">
                                                            <div>
                                                                <p className="font-semibold">{item.type}</p>
                                                                <p className="text-xs text-gray-400">{item.time}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <p className={`font-bold ${item.type === 'Viaje' ? 'text-green-400' : 'text-blue-400'}`}>
                                                                    +${item.amount.toFixed(2)}
                                                                </p>
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingEarning(item)}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-500/20">
                                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                                            </Button>
                                                                        </AlertDialogTrigger>
                                                                            <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                                <AlertDialogDescription>Esta acción es permanente y eliminará el registro de ganancia.</AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction onClick={() => handleDeleteEarning(item.id)} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Configurar pagos</DropdownMenuItem>
                                    </DialogTrigger>
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
                                </Dialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
                
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={() => currentPosition && mapRef.current?.setView(currentPosition, 15)}>
                        <Crosshair className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={toggleMapType}>
                        <Layers className="h-6 w-6" />
                    </Button>
                </div>

                <div className="absolute bottom-[220px] left-4 flex flex-col gap-2 pointer-events-auto">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={zoomIn}>
                        <Plus className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={zoomOut}>
                        <Minus className="h-6 w-6" />
                    </Button>
                </div>
                
                <div className="absolute bottom-4 flex items-center gap-2 rounded-full px-3 py-1 shadow-lg pointer-events-auto left-1/2 -translate-x-1/2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-sm">Google</span>
                </div>

                 <div className="absolute bottom-0 w-full flex justify-center p-4 pointer-events-auto">
                    {tripDetails && !isTripInProgress ? (
                         <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl w-full max-w-md shadow-2xl border-t border-gray-700/50 transition-all duration-300">
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
                                               <p className="text-lg font-bold">~{tripDetails.duration} min</p>
                                               <p className="text-xs text-gray-400">Tiempo</p>
                                           </div>
                                           <Separator orientation="vertical" className="h-8 bg-gray-700" />
                                           <div>
                                               <p className="text-lg font-bold">${tripDetails.cost}</p>
                                               <p className="text-xs text-gray-400">Costo</p>
                                           </div>
                                       </div>
                                        <Button size="lg" className="w-full text-lg h-14 mt-4 rounded-lg font-bold bg-orange-600 hover:bg-orange-700" onClick={handleConfirmTrip}>
                                           Confirmar Viaje
                                        </Button>
                                   </div>
                               )}
                            </div>
                         </div>
                    ) : isTripInProgress ? (
                         <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl w-full max-w-md shadow-2xl border-t border-gray-700/50 transition-all duration-300 p-4 space-y-3">
                             <h3 className="text-lg font-semibold text-center">Viaje en progreso...</h3>
                             <p className="text-center text-gray-400">Sigue la ruta hacia el destino.</p>
                             <Button size="lg" className="w-full text-lg h-14 mt-2 rounded-lg font-bold bg-red-600 hover:bg-red-700" onClick={handleFinishTrip}>
                                Finalizar Viaje
                             </Button>
                         </div>
                    ) : (
                    <div className="w-full max-w-xl">
                       { isConnected ? (
                           <div className="text-center py-4">
                               <p className="text-lg font-semibold">Buscando viajes...</p>
                               <p className="text-sm text-gray-400">Estás conectado y listo para recibir solicitudes.</p>
                           </div>
                       ) : (
                        <div className="transition-all duration-300">
                             <div className="flex justify-end mb-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSearchMinimized(!isSearchMinimized)}>
                                    {isSearchMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                </Button>
                            </div>
                           
                            {!isSearchMinimized && (
                                <div className="space-y-2 mb-4">
                                    <Button variant="outline" className="w-full justify-start h-12 text-left bg-gray-800/80 border-gray-700 hover:bg-gray-800/80" onClick={() => setSelecting('start')}>
                                        <MapPin className="mr-3 h-5 w-5 text-blue-400" />
                                        {startPoint ? <span className="text-white">{`Desde: ${startPoint[0].toFixed(4)}, ${startPoint[1].toFixed(4)}`}</span> : <span className="text-gray-400">¿Desde dónde?</span>}
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start h-12 text-left bg-gray-800/80 border-gray-700 hover:bg-gray-800/80" onClick={() => setSelecting('end')}>
                                        <MapPin className="mr-3 h-5 w-5 text-orange-400" />
                                        {endPoint ? <span className="text-white">{`Hasta: ${endPoint[0].toFixed(4)}, ${endPoint[1].toFixed(4)}`}</span> : <span className="text-gray-400">¿Hacia dónde?</span>}
                                    </Button>
                                </div>
                            )}

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
                                    className={`w-full max-w-xs text-xl h-14 rounded-full font-bold transition-colors ${isConnected ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
                                    onClick={() => setIsConnected(!isConnected)}
                                >
                                    {isConnected ? 'Desconectarse' : 'Conectarse'}
                                </Button>
                                <div className="w-12"></div>
                            </div>
                        </div>
                       )}
                    </div>
                    )}
                </div>
            </div>

            {/* Dialog for editing an earning */}
            {editingEarning && (
                <Dialog open={!!editingEarning} onOpenChange={() => setEditingEarning(null)}>
                    <DialogContent className="bg-gray-800 text-white border-gray-700">
                        <DialogHeader>
                            <DialogTitle>{editingEarning.isNew ? 'Añadir Nuevo Registro' : 'Editar Registro de Ganancia'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveEarning}>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo</Label>
                                    <Input id="type" name="type" defaultValue={editingEarning.type} className="text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Monto</Label>
                                    <Input id="amount" name="amount" type="number" step="0.01" defaultValue={editingEarning.amount} className="text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Fecha/Hora</Label>
                                    <Input id="time" name="time" defaultValue={editingEarning.time} className="text-white" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setEditingEarning(null)}>Cancelar</Button>
                                <Button type="submit">Guardar Cambios</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

