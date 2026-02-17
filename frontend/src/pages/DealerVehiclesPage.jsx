import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, ShieldCheck } from 'lucide-react';
import axios from '../utils/api';
import { MOCK_DEALERS, MOCK_VEHICLES } from '../data/staticData';

const DealerVehiclesPage = () => {
    const { id } = useParams();
    const [vehicles, setVehicles] = useState([]);
    const [dealer, setDealer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dealerRes, vehiclesRes] = await Promise.all([
                    axios.get(`/dealers/${id}`),
                    axios.get(`/vehicles?owner=${id}`)
                ]);
                setDealer(dealerRes.data);
                setVehicles(vehiclesRes.data.vehicles);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dealer vehicles:', error);
                // Fallback to mock data
                const mockDealer = MOCK_DEALERS.find(d => d._id === id);
                const mockVehicles = MOCK_VEHICLES.filter(v => v.dealerId === id);
                setDealer(mockDealer);
                setVehicles(mockVehicles);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-textPrimary py-12">
            <div className="container mx-auto px-6">

                {/* Dealer Info Header */}
                <Link to="/vehicles" className="inline-flex items-center gap-2 text-textSecondary hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dealers
                </Link>

                {dealer && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface rounded-3xl p-8 border border-gray-800 mb-12 relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-4xl font-serif font-bold text-white mb-2">{dealer.name}</h1>
                                <div className="flex items-center gap-4 text-textSecondary">
                                    <span className="flex items-center gap-1 text-primary"><MapPin className="w-4 h-4" /> {dealer.city}</span>
                                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-500" /> Authorized Dealer</span>
                                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> Top Rated</span>
                                </div>
                            </div>
                            <div className="bg-background/50 backdrop-blur-md border border-primary/20 p-4 rounded-2xl">
                                <p className="text-sm text-textSecondary mb-1 uppercase tracking-wider">Fleet Size</p>
                                <p className="text-3xl font-bold text-primary">{vehicles.length} Vehicles</p>
                            </div>
                        </div>
                        {/* Abstract Background Shape */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </motion.div>
                )}

                {/* Vehicles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map((vehicle, idx) => (
                        <motion.div
                            key={vehicle._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-surface rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all group"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'}
                                    alt={vehicle.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                                        {vehicle.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <div className="bg-primary px-4 py-2 rounded-xl text-background font-bold shadow-xl">
                                        ₹{vehicle.pricePerDay}<span className="text-xs opacity-70"> /day</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-4">{vehicle.title}</h3>

                                <div className="flex justify-between items-center text-sm text-textSecondary mb-6 border-y border-gray-800 py-4">
                                    <span>⚙️ {vehicle.transmission}</span>
                                    <span>⛽ {vehicle.fuelType}</span>
                                    <span>💺 {vehicle.seats} Seats</span>
                                </div>

                                <Link
                                    to={`/vehicles/${vehicle._id}`}
                                    className="w-full btn-outline py-3 text-center block"
                                >
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {vehicles.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-textSecondary text-xl italic font-serif">Empty garage. Check back soon for premium updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealerVehiclesPage;
