
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngTuple } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { suggestDestination, SuggestDestinationOutput } from '@/ai/flows/suggest-destination';
import { Car, CircleDot, LoaderCircle, MapPin, Search, ArrowLeft } from 'lucide-react';

// Dynamically import Leaflet and Map components with SSR disabled
const L = dynamic(() => import('leaflet'), { ssr: false });

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });


const FARE_PER_KM = 1.5;

export default function RideHailPage() {
  const [initialPosition, setInitialPosition] = useState<LatLngTuple | null>(null);
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null);
  
  const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>(null);
  const [destination, setDestination] = useState<LatLngTuple | null>(null);
  const [destinationName, setDestinationName] = useState('');
  const [fare, setFare] = useState<string | null>(null);
  const [appState, setAppState] = useState<'initial' | 'searching' | 'preview' | 'confirmed'>('initial');

  useEffect(() => {
    import('leaflet').then(leafletModule => {
      delete (leafletModule.Icon.Default.prototype as any)._getIconUrl;
      leafletModule.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setLeaflet(leafletModule);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: LatLngTuple = [position.coords.latitude, position.coords.longitude];
          setInitialPosition(pos);
          setCurrentPosition(pos);
        },
        (error) => {
          console.error("Geolocation error:", error);
          const fallbackPos: LatLngTuple = [37.7749, -122.4194];
          setInitialPosition(fallbackPos);
          setCurrentPosition(fallbackPos);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const resetState = () => {
    setDestination(null);
    setDestinationName('');
    setFare(null);
    setAppState('initial');
  };
  
  const handleDestinationSelect = (place: { lat: number, lon: number, display_name: string } | null, name?: string) => {
    if (place) {
      const dest: LatLngTuple = [parseFloat(String(place.lat)), parseFloat(String(place.lon))];
      setDestination(dest);
      setDestinationName(name || place.display_name);
      setAppState('preview');
    }
  };

  const handleConfirmRide = () => {
    if (destinationName) {
      try {
        const history = JSON.parse(localStorage.getItem('locationHistory') || '[]');
        if (!history.includes(destinationName)) {
          history.unshift(destinationName);
          localStorage.setItem('locationHistory', JSON.stringify(history.slice(0, 10)));
        }
      } catch (e) {
        console.error("Failed to update location history:", e);
      }
    }
    setAppState('confirmed');
  };

  if (!initialPosition || !leaflet) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <LoaderCircle className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <RideHailApp
      L={leaflet}
      initialPosition={initialPosition}
      currentPosition={currentPosition}
      destination={destination}
      destinationName={destinationName}
      fare={fare}
      setFare={setFare}
      appState={appState}
      setAppState={setAppState}
      onDestinationSelect={handleDestinationSelect}
      onConfirmRide={handleConfirmRide}
      onReset={resetState}
    />
  );
}

type RideHailAppProps = {
  L: typeof import('leaflet');
  initialPosition: LatLngTuple;
  currentPosition: LatLngTuple | null;
  destination: LatLngTuple | null;
  destinationName: string;
  fare: string | null;
  setFare: (fare: string | null) => void;
  appState: 'initial' | 'searching' | 'preview' | 'confirmed';
  setAppState: (state: 'initial' | 'searching' | 'preview' | 'confirmed') => void;
  onDestinationSelect: (place: any, name?: string) => void;
  onConfirmRide: () => void;
  onReset: () => void;
};

function RideHailApp({
  L,
  initialPosition,
  currentPosition,
  destination,
  destinationName,
  fare,
  setFare,
  appState,
  setAppState,
  onDestinationSelect,
  onConfirmRide,
  onReset,
}: RideHailAppProps) {
  
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapContainer center={initialPosition} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {currentPosition && <Marker position={currentPosition}><Popup>You are here</Popup></Marker>}
        {destination && <Marker position={destination}><Popup>{destinationName}</Popup></Marker>}
        {currentPosition && destination && <Routing L={L} origin={currentPosition} destination={destination} setFare={setFare} />}
      </MapContainer>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent z-[1000]">
        <Card className="max-w-md mx-auto shadow-2xl bg-background/80 backdrop-blur-sm border-2 border-border">
          {appState === 'initial' && (
            <CardHeader>
              <Button size="lg" className="w-full text-lg" onClick={() => setAppState('searching')}>
                Where to?
              </Button>
            </CardHeader>
          )}

          {appState === 'searching' && (
            <DestinationSearch 
              onSelect={onDestinationSelect}
              onBack={() => setAppState('initial')}
              currentPosition={currentPosition}
            />
          )}
          
          {appState === 'preview' && (
            <RidePreview
              fare={fare}
              destinationName={destinationName}
              onConfirm={onConfirmRide}
              onBack={onReset}
            />
          )}

          {appState === 'confirmed' && (
            <RideConfirmed onNewRide={onReset} />
          )}
        </Card>
      </div>
    </div>
  );
}

function Routing({ L, origin, destination, setFare }: { L: typeof import('leaflet'), origin: LatLngTuple, destination: LatLngTuple, setFare: (fare: string | null) => void }) {
  const map = useMap();
  const routingLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !origin || !destination || !L) return;

    if (routingLayerRef.current) {
        map.removeLayer(routingLayerRef.current);
    }

    const polyline = L.polyline([origin, destination], { color: 'red' });
    routingLayerRef.current = polyline;
    polyline.addTo(map);

    map.fitBounds(polyline.getBounds());

    const calculateFare = () => {
        const R = 6371; // Radius of the earth in km
        const dLat = (destination[0] - origin[0]) * Math.PI / 180;
        const dLon = (destination[1] - origin[1]) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(origin[0] * Math.PI / 180) * Math.cos(destination[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceInKm = R * c; // Distance in km
        const calculatedFare = distanceInKm * FARE_PER_KM;
        setFare(calculatedFare.toFixed(2));
    }
    
    calculateFare();

    return () => {
      if (routingLayerRef.current && map.hasLayer(routingLayerRef.current)) {
        map.removeLayer(routingLayerRef.current);
      }
    };
  }, [map, origin, destination, setFare, L]);

  return null;
}


function DestinationSearch({ onSelect, onBack, currentPosition }: { onSelect: (place: any, name?: string) => void, onBack: () => void, currentPosition: LatLngTuple | null }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<SuggestDestinationOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAiSuggestions = async () => {
      setLoadingAi(true);
      try {
        const history = localStorage.getItem('locationHistory') || '[]';
        const locationStr = currentPosition ? `${currentPosition[0]}, ${currentPosition[1]}` : 'unknown';
        const result = await suggestDestination({ userLocation: locationStr, locationHistory: history });
        if (result.suggestedDestination) {
          setAiSuggestions([result]);
        }
      } catch (error) {
        console.error("AI suggestion error:", error);
      }
      setLoadingAi(false);
    };
    fetchAiSuggestions();
  }, [currentPosition]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 2) {
      setLoading(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Geocoding error:", error);
        toast({
          title: "Search Error",
          description: "Could not fetch location suggestions. Please try again later.",
          variant: "destructive",
        })
      }
      setLoading(false);
    } else {
      setSuggestions([]);
    }
  };

  const handleAiSuggestionSelect = async (suggestion: SuggestDestinationOutput) => {
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${suggestion.suggestedDestination}`);
      const data = await response.json();
      if (data && data.length > 0) {
        onSelect(data[0], suggestion.suggestedDestination);
      } else {
         toast({
          title: "Location not found",
          description: `Could not find coordinates for ${suggestion.suggestedDestination}.`,
          variant: "destructive",
        })
      }
    } catch (error) {
       toast({
          title: "Search Error",
          description: "Could not fetch location details. Please try again later.",
          variant: "destructive",
        })
      console.error("Geocoding error:", error);
    }
    setLoading(false);
  };

  return (
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft /></Button>
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
                placeholder="Enter destination"
                className="pl-10 text-lg h-12"
                value={input}
                onChange={handleInputChange}
                autoFocus
            />
        </div>
      </div>
      <Separator />
      <div className="mt-4 max-h-60 overflow-y-auto">
        {(loading || loadingAi) && <div className="flex items-center justify-center p-4"><LoaderCircle className="animate-spin" /></div>}
        
        {input.length === 0 && !loadingAi && aiSuggestions.map((s, i) => (
          <button key={i} className="w-full text-left p-3 flex items-center gap-4 hover:bg-secondary rounded-lg" onClick={() => handleAiSuggestionSelect(s)}>
            <Car size={20} className="text-primary" />
            <div>
              <p className="font-medium">{s.suggestedDestination}</p>
              <p className="text-sm text-muted-foreground">Suggested destination</p>
            </div>
          </button>
        ))}

        {suggestions.map(p => (
            <button key={p.place_id} className="w-full text-left p-3 flex items-center gap-4 hover:bg-secondary rounded-lg" onClick={() => onSelect(p, p.display_name)}>
                <MapPin size={20} className="text-muted-foreground" />
                <p>{p.display_name}</p>
            </button>
        ))}
      </div>
    </CardContent>
  );
}

function RidePreview({ fare, destinationName, onConfirm, onBack }: { fare: string | null, destinationName: string, onConfirm: () => void, onBack: () => void }) {

  return (
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft /></Button>
        <h2 className="text-xl font-bold">Trip Details</h2>
      </div>
      <div className="bg-secondary p-3 rounded-lg">
          <div className="flex items-center gap-3">
              <CircleDot className="text-primary" />
              <p className="font-medium truncate">{destinationName}</p>
          </div>
      </div>
      <div className="flex justify-around my-4 text-center">
        <div>
          <p className="text-2xl font-bold">{`$${fare || '...'}`}</p>
          <p className="text-muted-foreground">Est. Fare</p>
        </div>
      </div>
      <Button size="lg" className="w-full text-lg" onClick={onConfirm}>
        Confirm Ride
      </Button>
    </CardContent>
  );
}

function RideConfirmed({ onNewRide }: { onNewRide: () => void }) {
  return (
    <CardContent className="p-6 text-center">
      <Car size={48} className="mx-auto text-primary animate-pulse" />
      <h2 className="text-2xl font-bold mt-4">Ride Confirmed!</h2>
      <p className="text-muted-foreground mt-2">Your driver is on the way.</p>
      <Button size="lg" className="w-full mt-6" onClick={onNewRide}>
        Book a New Ride
      </Button>
    </CardContent>
  );
}

    
