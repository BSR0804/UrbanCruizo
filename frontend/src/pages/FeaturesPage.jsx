import { motion } from 'framer-motion';
import { BarChart3, Car, Users, MapPin, Shield, Zap, X } from 'lucide-react';

const FeaturesPage = ({ onClose }) => {
    const features = [
        { icon: <BarChart3 />, title: 'Real-Time Analytics', desc: 'Track earnings, bookings, and vehicle performance with live dashboards and detailed insights. Monitor your fleet performance 24/7.' },
        { icon: <Car />, title: 'Fleet Management', desc: 'Add, edit, or remove vehicles with ease. Set custom pricing, manage availability, and organize your listings by specific locations.' },
        { icon: <Users />, title: 'Booking Control', desc: 'Complete control over your rentals. Accept or reject booking requests, view customer details, and manage rental applications efficiently.' },
        { icon: <MapPin />, title: 'Location Listings', desc: 'Target customers accurately by listing vehicles in specific cities and local areas. Match your fleet with local demand.' },
        { icon: <Shield />, title: 'Verified Partners', desc: 'Access trust badges by completing profile verification. Build credibility and attract more premium customers with a verified status.' },
        { icon: <Zap />, title: 'Instant Leads', desc: 'Never miss an opportunity with instant notifications for custom car requests from users searching for specific vehicles in your operating zone.' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl overflow-y-auto pt-32 pb-20 px-6"
        >
            <div className="container mx-auto max-w-6xl relative">
                <button
                    onClick={onClose}
                    className="fixed top-8 right-8 p-4 bg-surface rounded-2xl border border-gray-800 text-textSecondary hover:text-primary transition-all z-[110]"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-20">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] uppercase tracking-[0.5em] text-primary font-black mb-4 italic"
                    >
                        Exclusive Platform Features
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-serif font-black text-white"
                    >
                        Precision Tools for<br />
                        <span className="text-primary italic">Professional Partners</span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="bg-surface/50 border border-gray-800 rounded-[3rem] p-10 hover:border-primary/40 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-all" />
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-background transition-all duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-4 italic">{feature.title}</h3>
                            <p className="text-textSecondary text-sm leading-relaxed font-medium">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-20 text-center"
                >
                    <button
                        onClick={onClose}
                        className="btn-primary px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                        Return to Portal
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FeaturesPage;
