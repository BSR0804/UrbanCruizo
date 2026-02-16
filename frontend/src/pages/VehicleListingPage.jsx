import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Phone,
    Car,
    ArrowRight,
    Navigation,
    Search,
    Map
} from 'lucide-react';
import axios from '../utils/api';
import { useCity } from '../context/CityContext';

const CITY_COORDINATES = {
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Jaipur': { lat: 26.9124, lng: 75.7873 }
};

const VehicleListingPage = () => {
    const { city, setCity } = useCity();
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [locating, setLocating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchDealers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/dealers${city ? `?city=${city}` : ''}`);
            setDealers(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dealers:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDealers();
    }, [city]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleFindNearest = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                let closestCity = '';
                let minDistance = Infinity;

                Object.entries(CITY_COORDINATES).forEach(([cityName, coords]) => {
                    const dist = calculateDistance(latitude, longitude, coords.lat, coords.lng);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestCity = cityName;
                    }
                });

                if (closestCity) {
                    setCity(closestCity);
                }
                setLocating(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setLocating(false);
                alert("Could not access location. Please check browser permissions.");
            }
        );
    };

    const filteredDealers = dealers.filter(dealer =>
        dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-textPrimary py-12">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                            {city ? `Dealers in ${city}` : 'Authorized Dealers'}
                        </h1>
                        <p className="text-textSecondary">Select a dealer to browse their luxury fleet</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
                    >
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="input-field pl-10 h-12"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleFindNearest}
                            disabled={locating}
                            className="bg-primary/10 border border-primary/30 text-primary px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-background transition-all duration-300 disabled:opacity-50"
                        >
                            <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
                            {locating ? 'Locating...' : 'Near Me'}
                        </button>
                    </motion.div>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-primary font-serif italic text-xl">Connecting to our premium network...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={city + searchQuery}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredDealers.map((dealer, idx) => (
                                <motion.div
                                    key={dealer._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-surface rounded-2xl border border-gray-800 p-6 hover:border-primary/50 transition-all group flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 rounded-xl bg-primary/10 text-primary">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="bg-background border border-gray-800 px-3 py-1 rounded-full text-xs text-textSecondary flex items-center gap-2">
                                            <Car className="w-3 h-3 text-primary" />
                                            {dealer.vehicleCount} Vehicles
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                        {dealer.name}
                                    </h3>

                                    <div className="space-y-3 mb-8 flex-grow">
                                        <div className="flex items-center gap-3 text-textSecondary text-sm">
                                            <Map className="w-4 h-4 text-primary/60" />
                                            {dealer.city || 'Location not specified'}
                                        </div>
                                        <div className="flex items-center gap-3 text-textSecondary text-sm">
                                            <Phone className="w-4 h-4 text-primary/60" />
                                            {dealer.phone || '+91 XXXX XXX XXX'}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/dealers/${dealer._id}/vehicles`)}
                                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 group/btn"
                                    >
                                        View Collection
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>

                        {filteredDealers.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-24"
                            >
                                <div className="inline-block p-6 rounded-full bg-surface border border-gray-800 mb-6 font-serif italic text-primary">
                                    No dealers found in this region
                                </div>
                                <p className="text-textSecondary">Try search for a different city or broaden your criteria.</p>
                                <button
                                    onClick={() => setCity('')}
                                    className="text-primary font-bold mt-4 hover:underline"
                                >
                                    Show all locations
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default VehicleListingPage;
