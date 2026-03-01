import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, TrendingUp, MapPin, Shield, ChevronRight, Star, Zap, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeaturesPage from './FeaturesPage';
import BenefitsPage from './BenefitsPage';
import PerformancePage from './PerformancePage';
import { AnimatePresence } from 'framer-motion';

const Landing = () => {
    const [showFeatures, setShowFeatures] = useState(false);
    const [showBenefits, setShowBenefits] = useState(false);
    const [showPerformance, setShowPerformance] = useState(false);
    return (
        <div className="min-h-screen bg-background text-white overflow-hidden">
            <AnimatePresence>
                {showFeatures && <FeaturesPage onClose={() => setShowFeatures(false)} />}
                {showBenefits && <BenefitsPage onClose={() => setShowBenefits(false)} />}
                {showPerformance && <PerformancePage onClose={() => setShowPerformance(false)} />}
            </AnimatePresence>

            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-gray-800/50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <Car className="w-5 h-5 text-background" />
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-white leading-none">UrbanCruizo</h1>
                            <p className="text-[8px] uppercase tracking-[0.3em] text-primary font-black">Partner Portal</p>
                        </div>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => setShowFeatures(true)}
                            className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => setShowBenefits(true)}
                            className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold"
                        >
                            Benefits
                        </button>
                        <button
                            onClick={() => setShowPerformance(true)}
                            className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold"
                        >
                            Performance
                        </button>
                        <Link to="/dashboard" className="btn-primary px-8 py-2.5 text-xs rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">Get Started →</Link>

                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 text-center max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-black mb-6 italic">Exclusive Partner Program</p>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black mb-8 leading-[0.9]">
                            Your Fleet.<br />
                            <span className="text-primary italic">Our Platform.</span><br />
                            Maximum Revenue.
                        </h1>
                        <p className="text-lg md:text-xl text-textSecondary max-w-2xl mx-auto mb-12 leading-relaxed">
                            Join India's most premium vehicle rental marketplace. List your cars, manage bookings, and earn — all from one powerful dashboard.
                        </p>
                    </motion.div>

                    {/* Hero CTA */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/dashboard" className="bg-primary text-background px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-primary/40 flex items-center gap-3 justify-center">
                            Get Started Now <ChevronRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>




            {/* CTA */}
            <section className="py-32 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="relative bg-gradient-to-br from-primary to-yellow-700 rounded-[3rem] p-16 text-center overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-background mb-6">Ready to Grow<br />Your Fleet Business?</h2>
                            <p className="text-background/80 max-w-xl mx-auto mb-10 text-lg">Join hundreds of partners already earning on UrbanCruizo. List your first vehicle in under 5 minutes.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/dashboard" className="bg-background text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform border border-white/10 shadow-2xl">
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-10 px-6">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-primary" />
                        <span className="font-serif font-bold text-white">UrbanCruizo</span>
                        <span className="text-[8px] uppercase tracking-widest text-primary font-black bg-primary/10 px-2 py-0.5 rounded-full">Partner</span>
                    </div>
                    <p className="text-xs text-textSecondary">© 2026 UrbanCruizo. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
