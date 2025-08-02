'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { APIProvider, Map, useMapsLibrary, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { suggestDestination, SuggestDestinationOutput } from '@/ai/flows/suggest-destination';
import { Car, CircleDot, Dot, LoaderCircle, MapPin, Search, ArrowLeft, X } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
const MAP_ID = 'RIDEHAIL_LITE_MAP_ID';
const FARE_PER_KM = 1.5; // Simple fare rate

type LatLngLiteral = google.maps.LatLngLiteral;

export default function RideHailPage() {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground p-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuración Requerida</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Falta la clave de API de Google Maps.</p>
            <p className="mt-2">
              Por favor, añade tu clave al fichero <code className="bg-muted p-1 rounded-sm">.env.local</code> y reinicia la aplicación.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <RideHailApp />
    </APIProvider>
  );
}

function RideHailApp() {
  const [currentPosition, setCurrentPosition] = useState<LatLngLiteral | null>(null);
  const [destination, setDestination] = useState<LatLngLiteral | null>(null);
  const [destinationName, setDestinationName] = useState('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [fare, setFare] = useState<string | null>(null);
  const [appState, setAppState] = useState<'initial' | 'searching' | 'preview' | 'confirmed'>('initial');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const resetState = () => {
    setDestination(null);
    setDestinationName('');
    setDirections(null);
    setFare(null);
    setAppState('initial');
  };
  
  const handleDestinationSelect = (place: google.maps.places.PlaceResult | null, name?: string) => {
    if (place && place.geometry && place.geometry.location) {
      const dest = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setDestination(dest);
      setDestinationName(place.name || name || 'Selected location');
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

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Map
        defaultCenter={currentPosition || { lat: 37.7749, lng: -122.4194 }}
        defaultZoom={15}
        mapId={MAP_ID}
        disableDefaultUI={true}
        className="h-full w-full"
      >
        {currentPosition && <AdvancedMarker position={currentPosition} title="You are here"><UserPin /></AdvancedMarker>}
        {destination && <AdvancedMarker position={destination} title="Destination"><MapPin className="text-primary" size={36} /></AdvancedMarker>}
        {directions && <DirectionsRenderer directions={directions} />}
      </Map>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
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
              onSelect={handleDestinationSelect}
              onBack={() => setAppState('initial')}
              currentPosition={currentPosition}
            />
          )}

          {appState === 'preview' && directions && (
            <RidePreview
              directions={directions}
              fare={fare}
              destinationName={destinationName}
              onConfirm={handleConfirmRide}
              onBack={resetState}
              setDirections={setDirections}
              setFare={setFare}
              origin={currentPosition}
              destination={destination}
            />
          )}

          {appState === 'confirmed' && (
            <RideConfirmed onNewRide={resetState} />
          )}
        </Card>
      </div>
    </div>
  );
}

function UserPin() {
    return (
        <div className="relative">
            <div className="absolute inset-0 bg-primary/50 rounded-full animate-ping"></div>
            <div className="relative w-4 h-4 bg-primary rounded-full border-2 border-background shadow-md"></div>
        </div>
    );
}

function DestinationSearch({ onSelect, onBack, currentPosition }: { onSelect: (place: google.maps.places.PlaceResult | null, name?: string) => void, onBack: () => void, currentPosition: LatLngLiteral | null }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<SuggestDestinationOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const places = useMapsLibrary('places');
  const service = useRef<google.maps.places.AutocompleteService | null>(null);
  const geoCoderService = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (places) {
      service.current = new places.AutocompleteService();
      geoCoderService.current = new places.Geocoder();
    }
  }, [places]);

  useEffect(() => {
    const fetchAiSuggestions = async () => {
      setLoading(true);
      try {
        const history = localStorage.getItem('locationHistory') || '[]';
        const locationStr = currentPosition ? `${currentPosition.lat}, ${currentPosition.lng}` : 'unknown';
        const result = await suggestDestination({ userLocation: locationStr, locationHistory: history });
        setAiSuggestions([result]);
      } catch (error) {
        console.error("AI suggestion error:", error);
      }
      setLoading(false);
    };
    fetchAiSuggestions();
  }, [currentPosition]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 2 && service.current) {
      service.current.getPlacePredictions({ input: value }, (preds) => {
        setSuggestions(preds || []);
      });
    } else {
      setSuggestions([]);
    }
  };

  const selectPlace = (placeId: string, name: string) => {
    if (!geoCoderService.current) return;
    geoCoderService.current.geocode({ placeId }, (results, status) => {
        if (status === 'OK' && results) {
            onSelect(results[0], name);
        }
    });
  }

  return (
    <div className="p-4">
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
        {loading && <div className="flex items-center justify-center p-4"><LoaderCircle className="animate-spin" /></div>}
        
        {input.length === 0 && aiSuggestions.map((s, i) => (
          <button key={i} className="w-full text-left p-3 flex items-center gap-4 hover:bg-secondary rounded-lg" onClick={() => {setInput(s.suggestedDestination); service.current?.getPlacePredictions({ input: s.suggestedDestination }, (preds) => { if(preds && preds[0]) { selectPlace(preds[0].place_id, preds[0].description) } });}}>
            <Car size={20} className="text-primary" />
            <div>
              <p className="font-medium">{s.suggestedDestination}</p>
              <p className="text-sm text-muted-foreground">Suggested destination</p>
            </div>
          </button>
        ))}

        {suggestions.map(p => (
            <button key={p.place_id} className="w-full text-left p-3 flex items-center gap-4 hover:bg-secondary rounded-lg" onClick={() => selectPlace(p.place_id, p.description)}>
                <MapPin size={20} className="text-muted-foreground" />
                <p>{p.description}</p>
            </button>
        ))}
      </div>
    </div>
  );
}

function RidePreview({ directions, fare, destinationName, onConfirm, onBack, setDirections, setFare, origin, destination }) {
  const routes = useMapsLibrary('routes');
  const { toast } = useToast();

  useEffect(() => {
    if (!routes || !origin || !destination) return;
    const directionsService = new routes.DirectionsService();

    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }).then(response => {
      setDirections(response);
      const distanceInKm = (response.routes[0].legs[0].distance?.value || 0) / 1000;
      const calculatedFare = distanceInKm * FARE_PER_KM;
      setFare(calculatedFare.toFixed(2));
    }).catch(e => {
        toast({
            variant: "destructive",
            title: "Error",
            description: `Could not find a route. ${e.message}`,
        });
        onBack();
    });
  }, [routes, origin, destination, setDirections, setFare, toast, onBack]);

  const duration = directions?.routes[0]?.legs[0]?.duration?.text;
  const distance = directions?.routes[0]?.legs[0]?.distance?.text;

  return (
    <div className="p-4">
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
          <p className="text-2xl font-bold">{duration || '...'}</p>
          <p className="text-muted-foreground">Duration</p>
        </div>
        <Separator orientation="vertical" className="h-12" />
        <div>
          <p className="text-2xl font-bold">{`$${fare || '...'}`}</p>
          <p className="text-muted-foreground">Est. Fare</p>
        </div>
        <Separator orientation="vertical" className="h-12" />
        <div>
          <p className="text-2xl font-bold">{distance || '...'}</p>
          <p className="text-muted-foreground">Distance</p>
        </div>
      </div>
      <Button size="lg" className="w-full text-lg" onClick={onConfirm}>
        Confirm Ride
      </Button>
    </div>
  );
}

function RideConfirmed({ onNewRide }) {
  return (
    <div className="p-6 text-center">
      <Car size={48} className="mx-auto text-primary animate-pulse" />
      <h2 className="text-2xl font-bold mt-4">Ride Confirmed!</h2>
      <p className="text-muted-foreground mt-2">Your driver is on the way.</p>
      <Button size="lg" className="w-full mt-6" onClick={onNewRide}>
        Book a New Ride
      </Button>
    </div>
  );
}

function DirectionsRenderer({ directions }: { directions: google.maps.DirectionsResult | null }) {
  const map = useMap();
  const routes = useMapsLibrary('routes');
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routes || !map) return;
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new routes.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#FF0000', // Red
            strokeOpacity: 0.8,
            strokeWeight: 6,
        },
      });
      directionsRendererRef.current.setMap(map);
    }
  }, [routes, map]);
  
  useEffect(() => {
    if (directionsRendererRef.current && directions) {
      directionsRendererRef.current.setDirections(directions);
    }
  }, [directions]);

  return null;
}
