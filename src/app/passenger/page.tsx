
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngTuple, Map } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Menu, Layers, Crosshair, MapPin, Plus, Minus, LogOut, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { useMapEvents } from 'react-leaflet';
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/lib/database.types';

type Trip = Database['public']['Tables']['trips']['Row'];

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
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
    html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
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


const MapClickHandler = ({ onMapClick }: { onMapClick: (latlng: LatLngTuple) => void }) => {
    useMapEvents({
        click(e) {
            onMapClick([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

const mapTypes = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};


export default function PassengerHomePage() {
    const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>(null);
    const [viewPosition, setViewPosition] = useState<LatLngTuple | null>(null);
    const mapRef = useRef<Map>(null);

    const [startPoint, setStartPoint] = useState<LatLngTuple | null>(null);
    const [endPoint, setEndPoint] = useState<LatLngTuple | null>(null);
    const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);
    const [tripDetails, setTripDetails] = useState<{distance: number; cost: number; duration: number;} | null>(null);
    const [mapType, setMapType] = useState<keyof typeof mapTypes>('dark');
    const [route, setRoute] = useState<LatLngTuple[]>([]);

    const [trip, setTrip] = useState<Trip | null>(null);
    const passengerId = 'passenger_456'; // Static passenger ID for demo


    // Listen for trip updates
    useEffect(() => {
        if (!trip) return;

        const channel = supabase
            .channel(`trip-updates-${trip.id}`)
            .on<Trip>(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'trips', filter: `id=eq.${trip.id}` },
                (payload) => {
                    console.log('Trip updated:', payload.new);
                    const updatedTrip = payload.new as Trip;
                    setTrip(updatedTrip);
                    if (updatedTrip.status === 'accepted') {
                        toast({ title: '¡Viaje Aceptado!', description: 'Tu conductor está en camino.' });
                    }
                    if (updatedTrip.status === 'completed') {
                         toast({ title: 'Viaje Finalizado', description: 'Gracias por viajar con nosotros.' });
                         resetTrip();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [trip]);


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

    const handleRequestTrip = async () => {
        if (!startPoint || !endPoint || !tripDetails) {
            toast({ variant: 'destructive', title: 'Error', description: 'Por favor selecciona un origen y destino.' });
            return;
        }

        const { data, error } = await supabase
            .from('trips')
            .insert({
                passenger_id: passengerId,
                status: 'requested',
                pickup_lat: startPoint[0],
                pickup_lng: startPoint[1],
                dest_lat: endPoint[0],
                dest_lng: endPoint[1],
                distance: tripDetails.distance,
                fare: tripDetails.cost,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating trip:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo solicitar el viaje.' });
        } else {
            setTrip(data);
            toast({ title: 'Buscando Conductor...', description: 'Hemos enviado tu solicitud a los conductores cercanos.' });
        }
    };


    const toggleMapType = () => {
        const types = Object.keys(mapTypes) as (keyof typeof mapTypes)[];
        const currentIndex = types.indexOf(mapType);
        const nextIndex = (currentIndex + 1) % types.length;
        setMapType(types[nextIndex]);
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
                    if (!viewPosition) {
                      setCurrentPosition(defaultPos);
                      setViewPosition(defaultPos);
                    }
                },
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
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
    
    const zoomIn = () => mapRef.current?.zoomIn();
    const zoomOut = () => mapRef.current?.zoomOut();

    const resetTrip = () => {
        setStartPoint(null);
        setEndPoint(null);
        setSelecting(null);
        setRoute([]);
        setTrip(null);
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

                {currentPosition && <UserLocationMarker position={currentPosition} />}
                
                {startPoint && <LocationMarker position={startPoint} type="start" />}
                {endPoint && <LocationMarker position={endPoint} type="end" />}
                {route.length > 0 && <Polyline positions={route} color="white" weight={5} opacity={0.8} />}

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
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="https://placehold.co/100x100.png" alt="Passenger" />
                                        <AvatarFallback>P</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <SheetTitle className="text-xl">Pasajero</SheetTitle>
                                    </div>
                                    <div className="bg-red-600 p-1 rounded-md flex items-center justify-center h-8 w-16 text-white font-bold text-lg tracking-tighter">
                                        <span>TyDy</span>
                                    </div>
                                </div>
                            </SheetHeader>
                            <Separator className="bg-gray-700" />
                            <div className="flex-grow overflow-y-auto p-4 space-y-1">
                                {/* Passenger Menu Items Here */}
                            </div>
                            <Separator className="bg-gray-700" />
                            <div className="p-4">
                                <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700 flex items-center justify-center gap-2">
                                  <LogOut className="h-5 w-5"/> Cerrar Sesión
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={() => currentPosition && mapRef.current?.setView(currentPosition, 15)}>
                        <Crosshair className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={toggleMapType}>
                        <Layers className="h-6 w-6" />
                    </Button>
                </div>

                <div className="absolute bottom-4 left-4 flex flex-col gap-2 pointer-events-auto">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={zoomIn}>
                        <Plus className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-gray-800/80 hover:bg-gray-700/80" onClick={zoomOut}>
                        <Minus className="h-6 w-6" />
                    </Button>
                </div>

                 <div className="absolute bottom-0 w-full flex justify-center p-4 pointer-events-auto">
                   {trip ? (
                       <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border-gray-700 text-white">
                           <CardHeader>
                               <CardTitle>
                                   {trip.status === 'requested' && 'Buscando conductor...'}
                                   {trip.status === 'accepted' && 'Conductor en camino...'}
                                   {trip.status === 'in_progress' && 'Viaje en curso'}
                                   {trip.status === 'completed' && 'Viaje finalizado'}
                               </CardTitle>
                               <CardDescription>
                                   {trip.status === 'requested' && 'Estamos buscando el conductor más cercano para ti.'}
                                   {trip.status === 'accepted' && 'Tu conductor llegará en breve. Puedes ver su ubicación en el mapa.'}
                               </CardDescription>
                           </CardHeader>
                           {trip.status === 'accepted' && (
                               <CardContent>
                                   <div className="flex items-center space-x-4">
                                       <Avatar>
                                           <AvatarImage src="https://placehold.co/100x100.png" />
                                           <AvatarFallback>DR</AvatarFallback>
                                       </Avatar>
                                       <div>
                                           <p className="font-semibold">Nombre del Conductor</p>
                                           <p className="text-sm text-gray-400">Toyota Corolla - ABC 123</p>
                                       </div>
                                   </div>
                               </CardContent>
                           )}
                           <CardFooter>
                               <Button variant="destructive" className="w-full" onClick={resetTrip}>Cancelar Viaje</Button>
                           </CardFooter>
                       </Card>
                   ) : (
                    <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle>¿A dónde vamos hoy?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-start h-12 text-left bg-gray-800/80 border-gray-700 hover:bg-gray-800/80" onClick={() => setSelecting('start')}>
                                <MapPin className="mr-3 h-5 w-5 text-blue-400" />
                                {startPoint ? <span className="text-white">{`Desde: ${startPoint[0].toFixed(4)}, ${startPoint[1].toFixed(4)}`}</span> : <span className="text-gray-400">Punto de partida</span>}
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12 text-left bg-gray-800/80 border-gray-700 hover:bg-gray-800/80" onClick={() => setSelecting('end')}>
                                <MapPin className="mr-3 h-5 w-5 text-orange-400" />
                                {endPoint ? <span className="text-white">{`Hasta: ${endPoint[0].toFixed(4)}, ${endPoint[1].toFixed(4)}`}</span> : <span className="text-gray-400">¿Hacia dónde?</span>}
                            </Button>

                            {tripDetails && (
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
                            )}

                        </CardContent>
                        <CardFooter>
                            <Button 
                                size="lg" 
                                className="w-full text-lg h-14 rounded-lg font-bold bg-orange-600 hover:bg-orange-700" 
                                onClick={handleRequestTrip}
                                disabled={!startPoint || !endPoint}
                            >
                                Solicitar Viaje
                            </Button>
                        </CardFooter>
                    </Card>
                   )}
                </div>
            </div>
        </div>
    );
}

