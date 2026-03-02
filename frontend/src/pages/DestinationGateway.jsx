import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Car, Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const DestinationGateway = () => {
    const navigate = useNavigate();

    const options = [
        {
            id: 'user',
            title: "Join UrbanCruizo",
            subtitle: "For Luxury Travelers",
            description: "Discover India's most premium vehicle rental marketplace and book your next luxury experience.",
            icon: <Users className="w-8 h-8" />,
            color: "from-primary to-primary-dark",
            tag: "Bespoke Travels",
            action: () => navigate('/login?role=user&redirect=/home'),
            features: ["500+ Luxury Vehicles", "Verified Chauffeurs", "PAN India Presence"]
        },
        {
            id: 'partner',
            title: "Partner With Us",
            subtitle: "For Fleet Owners",
            description: "List your premium fleet on our platform and maximize your revenue with our industry-leading portal.",
            icon: <Car className="w-8 h-8" />,
            color: "from-surface to-background",
            tag: "Business Growth",
            action: () => navigate('/login?role=dealer&redirect=/partner'),
            features: ["Real-time Bookings", "Automated Payouts", "Fleet Analytics"]
        }
    ];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="container max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] uppercase tracking-[0.5em] text-primary font-black italic"
                    >
                        The Choice of Excellence
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-black text-white"
                    >
                        Choose Your <span className="text-primary italic">Journey.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-textSecondary max-w-lg mx-auto italic"
                    >
                        Please identify your purpose to access the exclusive UrbanCruizo marketplace.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {options.map((option, idx) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, x: idx === 0 ? -40 : 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1), duration: 0.6 }}
                            whileHover={{ y: -10 }}
                            onClick={option.action}
                            className={`relative cursor-pointer group rounded-[3rem] border border-gray-800 overflow-hidden bg-gradient-to-br ${option.id === 'user' ? 'from-surface to-background' : 'from-background to-surface'}`}
                        >
                            {/* Accent Background for User Card */}
                            {option.id === 'user' && (
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
                            )}

                            <div className="p-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className={`p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform`}>
                                        {option.icon}
                                    </div>
                                    <span className="text-[8px] uppercase tracking-widest font-black py-2 px-4 rounded-full border border-gray-800 text-textSecondary group-hover:border-primary group-hover:text-primary transition-colors">
                                        {option.tag}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-primary text-[10px] uppercase tracking-widest font-bold mb-2 italic">
                                        {option.subtitle}
                                    </p>
                                    <h3 className="text-3xl font-serif font-bold text-white mb-4">
                                        {option.title}
                                    </h3>
                                    <p className="text-textSecondary text-sm leading-relaxed mb-8">
                                        {option.description}
                                    </p>

                                    <div className="space-y-3">
                                        {option.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-textSecondary italic">
                                                <Zap className="w-3 h-3 text-primary" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all ${option.id === 'user' ? 'bg-primary text-background' : 'bg-surface border border-gray-800 text-white group-hover:bg-primary group-hover:text-background group-hover:border-primary'}`}>
                                    Continue to Log In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-16 flex items-center justify-center gap-8 border-t border-gray-800 pt-10"
                >
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-textSecondary font-bold">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Encryption Secure
                    </div>
                    <div className="w-[1px] h-4 bg-gray-800" />
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-textSecondary font-bold">
                        <Zap className="w-4 h-4 text-primary" />
                        Instant Access
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DestinationGateway;
