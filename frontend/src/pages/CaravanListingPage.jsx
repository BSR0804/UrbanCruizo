import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import axios from '../utils/api';
import { MOCK_CARAVANS } from '../data/staticData';

const CaravanListingPage = () => {
    const [caravans, setCaravans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const fetchCaravans = async () => {
            try {
                // The backend controller for getCaravans accepts a keyword query parameter
                const { data } = await axios.get(`/caravans?keyword=${keyword}`);
                if (data.caravans && data.caravans.length > 0) {
                    setCaravans(data.caravans);
                } else {
                    // If backend is empty or doesn't match new concept, use refined mock data
                    const filteredPackages = keyword
                        ? MOCK_CARAVANS.filter(pkg =>
                            pkg.title.toLowerCase().includes(keyword.toLowerCase()) ||
                            pkg.description.toLowerCase().includes(keyword.toLowerCase())
                        )
                        : MOCK_CARAVANS;
                    setCaravans(filteredPackages);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                // Fallback to mock data
                const filteredCaravans = keyword
                    ? MOCK_CARAVANS.filter(caravan =>
                        caravan.title.toLowerCase().includes(keyword.toLowerCase()) ||
                        caravan.description.toLowerCase().includes(keyword.toLowerCase())
                    )
                    : MOCK_CARAVANS;
                setCaravans(filteredCaravans);
                setLoading(false);
            }
        };
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchCaravans();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [keyword]); // Refetch when keyword changes

    if (loading) return <div className="text-center py-20 text-primary">Exploring Packages...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-serif text-center mb-8 text-primary">Premium Tour Packages</h1>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
                <input
                    type="text"
                    placeholder="Search packages..."
                    className="input-field"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {caravans.length === 0 ? (
                <div className="text-center text-textSecondary text-xl">No packages found matching your search.</div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {caravans.map((caravan) => (
                        <div key={caravan._id} className="bg-surface rounded-lg overflow-hidden shadow-lg hover:shadow-primary/20 transition duration-300 flex flex-col">
                            <img
                                src={caravan.images[0] || 'https://via.placeholder.com/400x300?text=Caravan'}
                                alt={caravan.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold font-serif text-textPrimary leading-tight">{caravan.title}</h3>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <div className="text-primary font-bold text-lg">₹{caravan.packagePrice || caravan.pricePerDay}</div>
                                        <div className="text-[10px] text-textSecondary uppercase tracking-tighter whitespace-nowrap">{caravan.duration || 'Per Package'}</div>
                                    </div>
                                </div>
                                <p className="text-textSecondary mb-4 flex-1">{caravan.description.substring(0, 100)}...</p>
                                <Link to={`/caravans/${caravan._id}`} className="btn-outline text-center block w-full mt-auto">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Coming Soon Banner */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 p-12 rounded-[3rem] bg-surface border border-primary/10 relative overflow-hidden text-center group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                        <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">More Exclusive Packages Coming Soon</h2>
                        <p className="text-textSecondary max-w-2xl mx-auto">
                            Our destination experts are currently scouting the most breathtaking locations and curating ultra-luxury experiences in <span className="text-primary italic">Goa, Kerala, and the Himalayas</span>. Stay tuned for the next chapter of your journey.
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="w-2 h-2 rounded-full bg-primary/50" />
                        <div className="w-2 h-2 rounded-full bg-primary/20" />
                    </div>
                </div>

                {/* Decorative backgrounds */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            </motion.div>
        </div>
    );
};

export default CaravanListingPage;

