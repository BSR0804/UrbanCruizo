import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Car,
    ShieldCheck,
    MapPin,
    Wifi,
    Coffee,
    Zap,
    ChevronRight,
    Star,
    Waves,
    Tv,
    Wind,
    Thermometer,
    Music,
    Lock
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
            desc: "Experience the road in high-end caravans equipped with modern suites and amenities."
        },
        {
            icon: <MapPin className="w-8 h-8 text-primary" />,
            title: "Curated Routes",
            desc: "Discover hidden gems with our specially designed road-trip itineraries across India."
        }
    ];

    const luxuryAmenities = [
        { icon: <Wifi />, label: "High-Speed WiFi" },
        { icon: <Coffee />, label: "Mini Kitchenette" },
        { icon: <Car />, label: "Smart Drive Tech" },
        { icon: <Star />, label: "Premium Interior" },
        { icon: <Waves />, label: "Modern Shower" },
        { icon: <Wind />, label: "Climate Control" },
        { icon: <Tv />, label: "Smart Entertainment" },
        { icon: <Thermometer />, label: "Heated Flooring" },
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
                            Journey in <span className="text-primary italic">Absolute</span> Luxury
                        </motion.h1>
                        <motion.p
                            variants={fadeIn}
                            className="text-xl text-textSecondary mb-10 max-w-xl leading-relaxed"
                        >
                            Experience the freedom of the open road without compromising on the comforts of a 5-star suite. Discover India like never before.
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
                                More Than Just a <span className="text-primary">Caravan</span>. <br />
                                It's a Private Retreat.
                            </h2>
                            <p className="text-lg text-textSecondary mb-8 leading-relaxed">
                                Our fleet is meticulously maintained to provide an unparalleled travel experience. From biometric entry systems to gourmet kitchenettes, every detail is engineered for excellence.
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
