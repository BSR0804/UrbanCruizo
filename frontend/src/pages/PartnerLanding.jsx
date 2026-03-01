import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, TrendingUp, MapPin, Shield, ChevronRight, Star, Zap, BarChart3, Users, ArrowRight } from 'lucide-react';
import FeaturesPage from './FeaturesPage';
import BenefitsPage from './BenefitsPage';
import PerformancePage from './PerformancePage';

const PartnerLanding = () => {
    const { user } = useAuth();
    const isDealer = user && user.role === 'dealer';
    const location = useLocation();
    const navigate = useNavigate();

    const [showFeatures, setShowFeatures] = useState(false);
    const [showBenefits, setShowBenefits] = useState(false);
    const [showPerformance, setShowPerformance] = useState(false);

    useEffect(() => {
        if (location.hash === '#features') setShowFeatures(true);
        else setShowFeatures(false);

        if (location.hash === '#benefits') setShowBenefits(true);
        else setShowBenefits(false);

        if (location.hash === '#stats') setShowPerformance(true);
        else setShowPerformance(false);
    }, [location]);

    const closeOverlay = () => {
        navigate('/partner', { replace: true });
    };

    return (
        <div className="min-h-screen bg-background text-white overflow-hidden pb-20">
            <AnimatePresence>
                {showFeatures && <FeaturesPage onClose={closeOverlay} />}
                {showBenefits && <BenefitsPage onClose={closeOverlay} />}
                {showPerformance && <PerformancePage onClose={closeOverlay} />}
            </AnimatePresence>


            {/* Hero */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-6">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(198,168,125,0.08)_0%,transparent_70%)]" />
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

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/dealer/dashboard" className="bg-primary text-background px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-primary/40 flex items-center gap-3 justify-center">
                            Get Started Now <ChevronRight className="w-5 h-5" />
                        </Link>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-16 flex flex-wrap justify-center gap-8 md:gap-14">
                        {[
                            { value: '500+', label: 'Active Partners' },
                            { value: '10K+', label: 'Vehicles Listed' },
                            { value: '₹2Cr+', label: 'Monthly Payouts' },
                            { value: '50+', label: 'Cities Covered' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl md:text-3xl font-serif font-bold text-primary">{stat.value}</p>
                                <p className="text-[10px] uppercase tracking-widest text-textSecondary font-bold mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>



        </div>
    );
};

export default PartnerLanding;
