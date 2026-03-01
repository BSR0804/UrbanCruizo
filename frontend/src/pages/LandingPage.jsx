import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Car,
    ShieldCheck,
    MapPin,
    Wifi,
    Zap,
    ChevronRight,
    Star,
    Tv,
    Wind,
    Music,
    Lock,
    Bike,
    Map,
    Smartphone,
    Settings,
    LifeBuoy,
    UserCheck,
    Sparkles,
    FileSearch,
    Users
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const interiorImages = [
        { src: '/images/interiors/interior.jfif', alt: 'Luxury Suite' },
        { src: '/images/interiors/interior1.webp', alt: 'Modern Living Area' },
        { src: '/images/interiors/interior2.jpg', alt: 'Gourmet Kitchen' },
        { src: '/images/interiors/interior4.webp', alt: 'Cozy Bedroom' }
    ];

    const features = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            title: "Premium Security",
            desc: "Every journey is protected by our top-tier security protocols and 24/7 assistance."
        },
        {
            icon: <Zap className="w-8 h-8 text-primary" />,
            title: "Ultimate Luxury",
            desc: "Experience the road in high-end vehicles equipped with modern suites and premium amenities."
        },
        {
            icon: <MapPin className="w-8 h-8 text-primary" />,
            title: "Multi-Vehicle Fleet",
            desc: "Choose from our wide range of premium Cars, rugged Bikes, and luxury Caravans from top local dealers."
        }
    ];

    const luxuryAmenities = [
        { icon: <Bike />, label: "Premium Riding Gear" },
        { icon: <Map />, label: "GPS Navigation" },
        { icon: <Smartphone />, label: "App-Key Entry" },
        { icon: <Settings />, label: "Performance Tuning" },
        { icon: <LifeBuoy />, label: "24/7 Roadside Assist" },
        { icon: <UserCheck />, label: "Verified Dealers" },
        { icon: <FileSearch />, label: "Insurance Covered" },
        { icon: <Sparkles />, label: "Sanitized Vehicles" },
        { icon: <Wifi />, label: "High-Speed WiFi" },
        { icon: <Car />, label: "Smart Drive Tech" },
        { icon: <Star />, label: "Premium Interior" },
        { icon: <Wind />, label: "Climate Control" },
        { icon: <Tv />, label: "Smart Entertainment" },
        { icon: <Music />, label: "Surround Sound" },
        { icon: <Lock />, label: "Biometric Entry" }
    ];

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop"
                        alt="Luxury Caravan"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeIn}
                        className="max-w-3xl"
                    >
                        <motion.span
                            variants={fadeIn}
                            className="inline-block px-4 py-1 mb-6 text-sm font-semibold tracking-wider text-primary border border-primary/30 rounded-full bg-primary/10 backdrop-blur-sm"
                        >
                            REDEFINING MODERN TRAVEL
                        </motion.span>
                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
                        >
                            Your Ultimate <span className="text-primary italic">Road Trip</span> Expert
                        </motion.h1>
                        <motion.p
                            variants={fadeIn}
                            className="text-xl text-textSecondary mb-10 max-w-xl leading-relaxed"
                        >
                            Whether it's a sleek Car, a powerful Bike, or a luxury Caravan—find the perfect ride with India's most trusted local dealers.
                        </motion.p>
                        <motion.div
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button
                                onClick={() => navigate('/home')}
                                className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
                            >
                                Explore Fleet
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="btn-outline text-lg px-8 py-4">
                                Our Story
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Animated Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-textSecondary"
                >
                    <span className="text-xs tracking-widest mb-2">SCROLL</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-surface border-y border-gray-800">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-12"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                className="group p-8 rounded-2xl bg-background border border-gray-800 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
                            >
                                <div className="mb-6 p-4 rounded-xl bg-primary/5 inline-block group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-serif font-bold mb-4">{feature.title}</h3>
                                <p className="text-textSecondary leading-relaxed italic">
                                    "{feature.desc}"
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Authentication Portals Section */}
            <section className="py-24 bg-background relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6"
                        >
                            Select Your <span className="text-primary italic">Experience</span>
                        </motion.h2>
                        <p className="text-textSecondary text-lg max-w-2xl mx-auto italic">
                            Dedicated portals for our luxury fleet providers and elite travelers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Partner Portal Card */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="group relative bg-surface border border-gray-800 p-12 rounded-[3.5rem] overflow-hidden hover:border-primary/40 transition-all duration-500"
                        >
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-primary/10 rounded-2xl text-primary transform group-hover:rotate-12 transition-transform">
                                        <Users className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-serif font-bold text-white">Partner With Us</h3>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mt-1 italic">For Vehicle Owners</p>
                                    </div>
                                </div>
                                <p className="text-textSecondary mb-10 leading-relaxed text-lg">
                                    List your premium Cars, Bikes, or Caravans and reach India's most elite travelers. Manage your fleet and earnings from a powerful dashboard.
                                </p>
                                <div className="mt-auto flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigate('/login?role=dealer')}
                                        className="flex-1 bg-surface border border-primary text-primary py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-background transition-all shadow-lg shadow-primary/5"
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={() => navigate('/register?role=dealer')}
                                        className="flex-1 bg-primary text-background py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl shadow-primary/20"
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Customer Portal Card */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="group relative bg-primary p-12 rounded-[3.5rem] overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-500"
                        >
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
                            <div className="relative z-10 flex flex-col h-full text-background">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-background/10 rounded-2xl text-background">
                                        <Sparkles className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-serif font-bold">Join UrbanCruizo</h3>
                                        <p className="text-[10px] uppercase tracking-[0.3em] font-black mt-1 italic opacity-80">For Luxury Travelers</p>
                                    </div>
                                </div>
                                <p className="opacity-90 mb-10 leading-relaxed text-lg font-medium">
                                    Experience the thrill of the open road. Browse verified premium listings, book in minutes, and embark on your next great adventure.
                                </p>
                                <div className="mt-auto flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigate('/login?role=user')}
                                        className="flex-1 bg-background text-primary py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-2xl"
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={() => navigate('/register?role=user')}
                                        className="flex-1 bg-transparent border-2 border-background text-background py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-background hover:text-primary transition-all"
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Luxury Showcase / Gallery */}
            <section className="py-24 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="flex-1"
                        >
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                                One App. <span className="text-primary">Every Ride</span>. <br />
                                Cars, Bikes & Caravans.
                            </h2>
                            <p className="text-lg text-textSecondary mb-8 leading-relaxed">
                                Our platform connects you with verified local dealers offering a premium fleet for every terrain. From city cruises to cross-country expeditions, we've got you covered.
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                {luxuryAmenities.slice(0, showAllAmenities ? luxuryAmenities.length : 4).map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center gap-3 text-textPrimary"
                                    >
                                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                                            {item.icon}
                                        </div>
                                        <span className="font-semibold">{item.label}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowAllAmenities(!showAllAmenities)}
                                className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all"
                            >
                                {showAllAmenities ? 'SHOW LESS' : 'VIEW ALL AMENITIES'}
                                <ChevronRight className={`w-5 h-5 transition-transform ${showAllAmenities ? 'rotate-90' : ''}`} />
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="flex-1 grid grid-cols-2 gap-4 relative"
                        >
                            {interiorImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 group ${idx === 0 ? 'h-64' : idx === 1 ? 'h-48 mt-8' : idx === 2 ? 'h-48 -mt-8' : 'h-64'
                                        }`}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                </div>
                            ))}
                            {/* Decorative element */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 border border-primary/10 rounded-full blur-3xl -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="container mx-auto max-w-5xl bg-primary rounded-[2rem] p-12 md:p-20 text-center text-background relative overflow-hidden shadow-2xl"
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">
                            Ready to write your next adventure?
                        </h2>
                        <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
                            Join thousands of explorers who have already experienced the UrbanCruizo difference.
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-background text-primary px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl"
                        >
                            Start Your Journey
                        </button>
                    </div>
                    {/* Decorative patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                </motion.div>
            </section>
        </div>
    );
};

export default LandingPage;
