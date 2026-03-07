import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import axios from '../utils/api';
import { MOCK_CARAVANS } from '../data/staticData';

const SkeletonCard = () => (
    <div className="bg-surface rounded-lg overflow-hidden shadow-lg border border-gray-800 animate-pulse">
        <div className="w-full h-48 bg-gray-800" />
        <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-800 rounded w-1/2" />
            <div className="h-20 bg-gray-800 rounded" />
            <div className="h-10 bg-gray-800 rounded" />
        </div>
    </div>
);

const CaravanListingPage = () => {
    // Start with MOCK_CARAVANS for instant visual feedback
    const [caravans, setCaravans] = useState(MOCK_CARAVANS);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const fetchCaravans = async () => {
            try {
                // If we're filtering, we show a slight loading state if needed
                if (keyword) setLoading(true);

                const { data } = await axios.get(`/caravans?keyword=${keyword}`);
                if (data.caravans && data.caravans.length > 0) {
                    setCaravans(data.caravans);
                } else if (keyword) {
                    // If backend search results are empty, filter the mock data
                    setCaravans(MOCK_CARAVANS.filter(pkg =>
                        pkg.title.toLowerCase().includes(keyword.toLowerCase()) ||
                        pkg.description.toLowerCase().includes(keyword.toLowerCase())
                    ));
                } else {
                    setCaravans(MOCK_CARAVANS);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (!keyword) {
            fetchCaravans();
            return;
        }

        const timeoutId = setTimeout(fetchCaravans, 300);
        return () => clearTimeout(timeoutId);
    }, [keyword]);

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-serif font-black text-primary mb-4 italic">Premium Tour Packages</h1>
                <p className="text-textSecondary max-w-2xl mx-auto">Discover ultra-luxury curated experiences across India's most iconic destinations.</p>
            </motion.div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-16 px-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search your next destination..."
                        className="input-field pl-12 h-14 bg-surface/50 backdrop-blur-sm border-gray-800 focus:border-primary transition-all rounded-full text-lg"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/50">
                        <Sparkles className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {loading && caravans.length === 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : caravans.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 bg-surface/30 rounded-[3rem] border border-gray-800 border-dashed"
                >
                    <div className="text-primary text-6xl mb-6 font-serif italic font-black opacity-20">No Discoveries Yet</div>
                    <p className="text-textSecondary text-xl italic font-serif">Try searching for another destination or exploring all packages.</p>
                    <button onClick={() => setKeyword('')} className="text-primary font-bold mt-6 underline decoration-primary/30 underline-offset-8">Show all experiences</button>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {caravans.map((packageItem, idx) => (
                            <motion.div
                                layout
                                key={packageItem._id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="group relative flex flex-col bg-surface rounded-[2.5rem] overflow-hidden border border-gray-800 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
                            >
                                {/* Tag */}
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 italic">
                                        {packageItem.duration || 'Curated Tour'}
                                    </span>
                                </div>

                                {/* Bookmark/Action */}
                                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-3 rounded-2xl bg-primary/90 text-background">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="relative h-72 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <img
                                        src={packageItem.images[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'}
                                        alt={packageItem.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                                    />
                                </div>
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="mb-6 flex justify-between items-start gap-4">
                                        <h3 className="text-2xl font-serif font-black text-white leading-tight group-hover:text-primary transition-colors">{packageItem.title}</h3>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-primary text-2xl font-black italic tracking-tighter">₹{(packageItem.packagePrice || packageItem.pricePerDay)?.toLocaleString('en-IN')}</div>
                                            <div className="text-[10px] text-textSecondary uppercase tracking-widest font-black opacity-60 mt-1">Full Experience</div>
                                        </div>
                                    </div>
                                    <p className="text-textSecondary mb-8 flex-grow leading-relaxed italic line-clamp-3">
                                        "{packageItem.description.substring(0, 120)}..."
                                    </p>
                                    <Link
                                        to={`/caravans/${packageItem._id}`}
                                        className="w-full py-4 rounded-2xl bg-surface border border-gray-800 text-white font-black text-xs uppercase tracking-[0.2em] text-center transition-all group-hover:bg-primary group-hover:text-background group-hover:border-primary flex items-center justify-center gap-3"
                                    >
                                        Explore Itinerary <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Coming Soon Banner */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-24 p-10 md:p-14 rounded-[3rem] bg-gradient-to-br from-surface to-background border border-primary/10 relative overflow-hidden text-center group"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/5">
                        <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-white italic tracking-tight">More Grandeur On The Way</h2>
                        <p className="text-textSecondary text-lg max-w-2xl mx-auto leading-relaxed italic opacity-80">
                            Our experience architects are currently curating new chapters in <span className="text-primary font-black underline decoration-primary/30 underline-offset-8">Goa, Kerala, and the Himalayas</span>.
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="w-2 h-2 rounded-full bg-primary/50" />
                        <div className="w-2 h-2 rounded-full bg-primary/20" />
                    </div>
                </div>

                <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-1000" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-1000" />
            </motion.div>
        </div>
    );
};


