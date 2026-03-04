import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AlertCircle, X, MapPin, Compass } from 'lucide-react';
import { CityContext } from '../context/CityContext';

const HomePage = () => {
    const { setCity } = useContext(CityContext);
    const navigate = useNavigate();

    const cities = [
        { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Hyderabad', image: '/images/hyderabad_new.png' },
        { name: 'Chennai', image: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Pune', image: 'https://images.unsplash.com/photo-1600112356915-089abb8fc71a?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Kolkata', image: '/images/tour_package_kolkata.png' },
        { name: 'Jaipur', image: '/images/rajasthan_royal.png' },
        { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop', comingSoon: true },
        { name: 'Kochi', image: '/images/kochi_new.png', comingSoon: true },
        { name: 'Ahmedabad', image: '/images/ahmedabad_new.png', comingSoon: true },
        { name: 'Chandigarh', image: '/images/chandigarh.jpg', comingSoon: true },
    ];

    const handleCitySelect = (city) => {
        if (city.comingSoon) {
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-[#fef2f2] shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-red-600 overflow-hidden transition-all duration-300 transform`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <AlertCircle className="h-10 w-10 text-red-600 bg-red-100 rounded-full p-2" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-bold text-red-900 uppercase tracking-wider">
                                    Error!
                                </p>
                                <p className="mt-1 text-sm text-red-700 leading-relaxed">
                                    UrbanCruizo is arriving in <span className="font-bold underline decoration-red-300">{city.name}</span> very soon! Stay tuned.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-red-100 bg-red-50/50">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold text-red-600 hover:text-red-800 hover:bg-red-100 transition-all focus:outline-none"
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            ), {
                duration: 4000,
                position: 'top-center'
            });
            return;
        }
        setCity(city.name);
        navigate('/vehicles');
    };

    return (
        <div className="min-h-screen bg-background pt-12 pb-20">
            <section className="py-20 px-4 container mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-serif text-primary mb-8 italic">Where's Your Next Journey?</h1>
                    <p className="text-xl text-textSecondary mb-12 max-w-2xl mx-auto">
                        Find top-rated dealers for premium Cars, rugged Bikes, and luxury Caravans in your favorite Indian cities.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {cities.map((city, idx) => (
                        <motion.div
                            key={city.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleCitySelect(city)}
                            className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg border border-gray-800 hover:border-primary transition duration-300 aspect-[4/5]"
                        >
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition z-10" />
                            {city.comingSoon && (
                                <div className="absolute top-4 right-4 z-30 bg-primary/90 text-background text-[10px] font-bold px-2 py-1 rounded-full border border-white/20 shadow-lg tracking-wider">
                                    COMING SOON
                                </div>
                            )}
                            <img
                                src={city.image}
                                alt={city.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 z-20 bg-gradient-to-t from-black to-transparent">
                                <h3 className="text-2xl font-bold text-white text-center font-serif tracking-wide">{city.name}</h3>
                            </div>
                        </motion.div>
                    ))}

                </motion.div>

                {/* Expanding Horizons Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-16 relative overflow-hidden rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 p-8 md:p-12 group transition-all duration-500 hover:border-primary/40"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6 text-left">
                            <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500 flex-shrink-0">
                                <Compass className="w-10 h-10 text-primary animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-white mb-2">Expanding Horizons</h3>
                                <p className="text-textSecondary text-lg max-w-xl">
                                    Our fleet is preparing to anchor in more prime cities across India. Your next luxury discovery is just around the corner.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-3">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-[0.3em] uppercase">
                                <MapPin className="w-4 h-4" /> New Citadels Await
                            </div>
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary/80 text-[10px] font-bold border border-primary/20">
                                PHASE 2 EN ROUTE
                            </span>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default HomePage;
