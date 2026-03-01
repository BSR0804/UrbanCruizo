
import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { MapPin, Navigation, Fuel, Clock, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '1.5rem'
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
        }
    ]
};

const TripPlanner = ({ vehicle }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [response, setResponse] = useState(null);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [fuelEstimation, setFuelEstimation] = useState(null);
    const [error, setError] = useState(null);

    const originRef = useRef();
    const destRef = useRef();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    const directionsCallback = (res) => {
        if (res !== null) {
            if (res.status === 'OK') {
                setResponse(res);
                const route = res.routes[0].legs[0];
                setDistance(route.distance.text);
                setDuration(route.duration.text);

                // Calculate Fuel Consumption
                // distance value is in meters
                const distanceInKm = route.distance.value / 1000;
                const mileage = vehicle.mileage || 15;
                const fuelNeeded = (distanceInKm / mileage).toFixed(2);
                setFuelEstimation(fuelNeeded);
                setError(null);
            } else {
                setError('Could not calculate route. Please check your locations.');
                setResponse(null);
            }
        }
    };

    const handleCalculate = () => {
        if (!originRef.current.value || !destRef.current.value) {
            setError('Please enter both origin and destination');
            return;
        }
        setOrigin(originRef.current.value);
        setDestination(destRef.current.value);
    };

    if (loadError) {
        return (
            <div className="bg-surface p-8 rounded-3xl border border-red-500/20 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Maps Failed to Load</h3>
                <p className="text-textSecondary text-sm">Please ensure you have a valid Google Maps API Key configured in your environment.</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="h-[400px] bg-surface rounded-3xl animate-pulse flex items-center justify-center border border-gray-800">
                <div className="text-primary flex items-center gap-3">
                    <Clock className="w-6 h-6 animate-spin" />
                    <span className="font-bold tracking-widest uppercase text-xs">Loading Journey Planner...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-surface p-8 rounded-3xl border border-gray-800 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <Navigation className="w-6 h-6" />
                        </div>
                        Journey & Fuel Planner
                    </h3>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                        <Info className="w-4 h-4 text-primary" />
                        <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Dynamic Estimation</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <label className="block text-xs text-textSecondary uppercase tracking-widest font-bold ml-1">Starting From</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:text-white transition-colors" />
                            <Autocomplete
                                onLoad={(autocomplete) => (originRef.current = autocomplete)}
                                onPlaceChanged={() => { }}
                            >
                                <input
                                    type="text"
                                    placeholder="Enter origin (e.g., Karol Bagh, Delhi)"
                                    className="input-field pl-12 h-14 text-sm bg-background border-gray-800 focus:border-primary transition-all rounded-2xl w-full"
                                />
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="block text-xs text-textSecondary uppercase tracking-widest font-bold ml-1">Ending At</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:text-white transition-colors" />
                            <Autocomplete
                                onLoad={(autocomplete) => (destRef.current = autocomplete)}
                                onPlaceChanged={() => { }}
                            >
                                <input
                                    type="text"
                                    placeholder="Enter destination (e.g., Agra, UP)"
                                    className="input-field pl-12 h-14 text-sm bg-background border-gray-800 focus:border-primary transition-all rounded-2xl w-full"
                                />
                            </Autocomplete>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-3 group rounded-2xl transition-all hover:scale-[1.02]"
                >
                    <Navigation className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    Calculate Route & Estimation
                </button>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </motion.div>
                )}

                <AnimatePresence>
                    {distance && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8"
                        >
                            <div className="p-6 rounded-2xl bg-background border border-gray-800 flex flex-col items-center text-center group hover:border-primary/50 transition-colors">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 mb-4 group-hover:bg-blue-500 group-hover:text-background transition-colors">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-textSecondary font-bold mb-1">Total Distance</span>
                                <span className="text-2xl font-bold text-white">{distance}</span>
                            </div>
                            <div className="p-6 rounded-2xl bg-background border border-gray-800 flex flex-col items-center text-center group hover:border-primary/50 transition-colors">
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-background transition-colors">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-textSecondary font-bold mb-1">Travel Time</span>
                                <span className="text-2xl font-bold text-white">{duration}</span>
                            </div>
                            <div className="p-6 rounded-2xl bg-background border border-gray-800 flex flex-col items-center text-center group hover:border-primary/50 transition-colors">
                                <div className="p-3 rounded-xl bg-green-500/10 text-green-500 mb-4 group-hover:bg-green-500 group-hover:text-background transition-colors">
                                    <Fuel className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-textSecondary font-bold mb-1">Est. Fuel Consumption</span>
                                <span className="text-2xl font-bold text-white">{fuelEstimation} Litres</span>
                                <span className="text-[10px] text-textSecondary mt-1 italic">Based on {vehicle.mileage} km/l</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={5}
                    center={{ lat: 20.5937, lng: 78.9629 }}
                    options={mapOptions}
                >
                    {origin && destination && (
                        <DirectionsService
                            options={{
                                destination: destination,
                                origin: origin,
                                travelMode: 'DRIVING'
                            }}
                            callback={directionsCallback}
                        />
                    )}

                    {response !== null && (
                        <DirectionsRenderer
                            options={{
                                directions: response,
                                polylineOptions: {
                                    strokeColor: '#D4AF37', // Gold color to match theme
                                    strokeWeight: 5,
                                    strokeOpacity: 0.8
                                },
                                markerOptions: {
                                    visible: true
                                }
                            }}
                        />
                    )}
                </GoogleMap>
                <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-background/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white font-bold uppercase tracking-widest">
                    Live Route Visualization
                </div>
            </div>
        </div>
    );
};

export default TripPlanner;
