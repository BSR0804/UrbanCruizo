import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CityContext } from '../context/CityContext';

const HomePage = () => {
    const { setCity } = useContext(CityContext);
    const navigate = useNavigate();

    const cities = [
        { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Hyderabad', image: '/images/hyderabad.jpg' },
        { name: 'Chennai', image: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Pune', image: 'https://images.unsplash.com/photo-1600112356915-089abb8fc71a?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Kolkata', image: '/images/kolkata.jpg' },
        { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop', comingSoon: true },
        { name: 'Kochi', image: 'https://images.unsplash.com/photo-1595168051918-6932c0213197?q=80&w=1600&auto=format&fit=crop', comingSoon: true },
        { name: 'Ahmedabad', image: 'https://images.unsplash.com/photo-1620803451559-00f796afda62?q=80&w=1600&auto=format&fit=crop', comingSoon: true },
        { name: 'Chandigarh', image: 'https://images.unsplash.com/photo-1616113886364-f6552a468d60?q=80&w=1600&auto=format&fit=crop', comingSoon: true },
    ];

    const handleCitySelect = (city) => {
        if (city.comingSoon) {
            toast.success(`UrbanCruizo is arriving in ${city.name} very soon! Stay tuned.`, {
                icon: '🚀',
                style: {
                    borderRadius: '10px',
                    background: '#1a1a1a',
                    color: '#c5a059',
                    border: '1px solid #c5a059',
                },
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
            </section>
        </div>
    );
};

export default HomePage;
