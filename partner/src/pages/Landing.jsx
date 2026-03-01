import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Car,
    TrendingUp,
    MapPin,
    Shield,
    ChevronRight,
    Star,
    Zap,
    BarChart3,
    Users,
    Wallet,
    Clock,
    ShieldCheck,
    CheckCircle2,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    const stats = [
        { label: 'Network Partners', value: '500+', icon: <Users className="w-5 h-5" /> },
        { label: 'Active Listings', value: '12K+', icon: <Car className="w-5 h-5" /> },
        { label: 'Cities Covered', value: '75+', icon: <MapPin className="w-5 h-5" /> },
        { label: 'Partner Payouts', value: '₹5Cr+', icon: <Wallet className="w-5 h-5" /> },
    ];

    const features = [
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Advanced Analytics",
            description: "Deep dive into your business. Monitor fleet utilization, revenue trends, and seasonal demand predictions.",
            details: ["Daily earnings breakdown", "Customer behavior insights", "Demand heatmaps"]
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Smart Location Targeting",
            description: "Deploy your fleet where demand is highest. Our system suggests optimal areas for maximum bookings.",
            details: ["Hyper-local targeting", "Airport delivery sync", "Regional pricing control"]
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Automated Operations",
            description: "From booking approvals to payout settlement, most processes are automated so you can focus on scale.",
            details: ["Instant booking alerts", "Automated invoicing", "24-hour settlement"]
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "Risk Management",
            description: "Industry-leading security for your premium assets. Every user is verified before they can book.",
            details: ["Aadhaar/KYC verification", "Secure payment escrow", "Legal agreement support"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-background">
            {/* Navbar */}
            <header className="fixed top-0 w-full z-[100] bg-black/40 backdrop-blur-3xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-xl shadow-primary/10">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-white leading-none tracking-tight">UrbanCruizo</h1>
                            <p className="text-[7px] uppercase tracking-[0.4em] text-primary/80 font-black">Elite Partner Network</p>
                        </div>
                    </Link>
                    <nav className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all font-bold">Features</a>
                        <a href="#benefits" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all font-bold">Benefits</a>
                        <a href="#performance" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all font-bold">Performance</a>
                        <Link to="/dashboard" className="bg-primary text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20">
                            Get Started →
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-[100dvh] flex items-center pt-24 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2 opacity-50" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[140px] -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 italic">
                                Institutional Access Only
                            </span>
                            <h1 className="text-6xl md:text-[7rem] font-serif font-black leading-[0.85] mb-8 tracking-tighter">
                                Monetize Your<br />
                                <span className="text-primary italic">Premium Fleet</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 font-medium leading-relaxed">
                                Join the elite network of vehicle owners. List your premium cars, access high-value leads, and manage your operations with industrial precision.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-6 mb-20"
                        >
                            <Link to="/dashboard" className="bg-white text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary transition-all flex items-center gap-4 group shadow-2xl">
                                Start Scaling Now
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <div className="flex -space-x-3 items-center">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-surface overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Partner" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="pl-6">
                                    <p className="text-sm font-bold text-white">500+ Luxury Partners</p>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Join the Elite</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Performance Stats Sticky */}
            <section className="py-20 bg-background/50 border-y border-white/5 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {stats.map((s, i) => (
                            <div key={i} className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{s.icon}</div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{s.label}</p>
                                </div>
                                <h4 className="text-4xl md:text-5xl font-serif font-black text-white">{s.value}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-40 relative px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-12 gap-20 items-center">
                        <div className="lg:col-span-5">
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] block mb-6 italic">/// Platform Capabilities</span>
                            <h2 className="text-5xl md:text-7xl font-serif font-black mb-10 leading-tight"> Built for<br /><span className="text-primary italic">Industrial Scale</span></h2>
                            <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
                                Our tech stack is designed to handle fleets of any size, providing tools that high-end car dealers and fleet managers demand.
                            </p>
                            <Link to="/dashboard" className="border border-white/20 text-white px-10 py-4 rounded-xl text-xs uppercase tracking-widest font-black inline-flex items-center gap-3 hover:bg-white hover:text-black transition-all">
                                Explore Integration <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="lg:col-span-7">
                            <div className="grid sm:grid-cols-2 gap-6">
                                {features.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -10 }}
                                        className="bg-surface/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] hover:bg-surface hover:border-primary/20 transition-all"
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/10">
                                            {f.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4 italic">{f.title}</h3>
                                        <p className="text-gray-400 text-sm mb-6 leading-relaxed font-medium">{f.description}</p>
                                        <div className="space-y-3">
                                            {f.details.map((d, j) => (
                                                <div key={j} className="flex items-center gap-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {d}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Visual Section */}
            <section id="performance" className="py-40 bg-zinc-950 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-24">
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] block mb-6 italic">Performance Metrics</span>
                        <h2 className="text-5xl md:text-7xl font-serif font-black mb-8 leading-tight">Live Business<br /><span className="text-primary italic">Intelligence</span></h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                            Every partner gets access to a multi-billion dollar tech infrastructure. Monitor your business performance with real-time accuracy and predictive modeling.
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-orange-600/50 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-background border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src="/images/dashboard_preview.png"
                                alt="Dashboard Performance"
                                className="w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex items-end p-12">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
                                    <div className="bg-black/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">99.9% Uptime</p>
                                        <h5 className="text-2xl font-serif font-bold text-white tracking-tight italic">Always Online</h5>
                                    </div>
                                    <div className="bg-black/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Real-time GPS</p>
                                        <h5 className="text-2xl font-serif font-bold text-white tracking-tight italic">Live Tracking</h5>
                                    </div>
                                    <div className="bg-black/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Fast Settlement</p>
                                        <h5 className="text-2xl font-serif font-bold text-white tracking-tight italic">Instant Payouts</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Bento Grid */}
            <section id="benefits" className="py-40 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-24">
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] block mb-6 italic">Unrivaled Benefits</span>
                        <h2 className="text-5xl md:text-[5rem] font-serif font-black leading-tight">The Partner<br /><span className="text-primary italic">Advantage</span></h2>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Large Benefit Card */}
                        <div className="lg:col-span-8 bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-[3rem] p-12 overflow-hidden relative">
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="max-w-md">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-4xl font-serif font-black text-white mb-6">Premium Revenue<br />Share Model</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed font-medium mb-12">
                                        Keep 90% of every booking value. We only take 10% for platform maintenance and marketing. Highest payouts in industry.
                                    </p>
                                </div>
                                <div className="flex gap-12">
                                    <div><p className="text-5xl font-serif font-black text-primary">90%</p><p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2 italic">Your Earnings</p></div>
                                    <div><p className="text-5xl font-serif font-black text-white">0%</p><p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2 italic">Listing Fee</p></div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
                        </div>

                        {/* Smaller Benefit Card */}
                        <div className="lg:col-span-4 bg-primary text-black rounded-[3rem] p-12 flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-2xl shadow-primary/20">
                            <div>
                                <Shield className="w-16 h-16 mb-8" />
                                <h3 className="text-4xl font-serif font-black mb-6 leading-tight">Total Asset<br />Security</h3>
                                <p className="text-black/80 font-bold leading-relaxed mb-10">
                                    Every renter undergoes a background check. You have total control over every approval.
                                </p>
                            </div>
                            <div className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center italic">
                                Zero-Risk Partnership
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="lg:col-span-4 bg-zinc-900 border border-white/5 rounded-[3rem] p-12 text-center group">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white mx-auto mb-8 group-hover:bg-primary group-hover:text-black transition-all">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4 italic">Instant Scaling</h4>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">Add unlimited vehicles to your fleet. Our tech scales as you grow.</p>
                        </div>

                        {/* Network Card */}
                        <div className="lg:col-span-8 bg-zinc-950 border border-white/5 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12 group overflow-hidden text-center md:text-left">
                            <div className="relative shrink-0 hidden md:block">
                                <Search className="w-32 h-32 text-primary/10 absolute -top-10 -left-10 group-hover:scale-110 transition-transform" />
                                <BarChart3 className="w-24 h-24 text-primary relative z-10" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-serif font-black text-white mb-4 italic">Demand Priority</h4>
                                <p className="text-gray-400 leading-relaxed font-medium">Partner vehicles get premium ranking and priority results in our customer apps, ensuring your cars never sit idle.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industrial CTA Section */}
            <section className="py-40 px-6 text-center">
                <div className="container mx-auto">
                    <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-[4rem] p-12 md:p-24 text-center border border-white/10 shadow-3xl overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <div className="relative z-10">
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] block mb-8 italic">Ready to Lead?</span>
                            <h2 className="text-5xl md:text-8xl font-serif font-black text-white mb-10 tracking-tighter">Enter the Elite<br /><span className="text-primary italic">Circle</span></h2>
                            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
                                Join the most powerful luxury vehicle network in India. Start listing your premium fleet and access high-ticket bookings today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link to="/dashboard" className="bg-primary text-black px-16 py-7 rounded-[2rem] font-black uppercase tracking-widest text-lg hover:bg-white transition-all shadow-3xl shadow-primary/30 flex items-center justify-center gap-4 group">
                                    Join the Network <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="border-t border-white/5 py-20 px-6 bg-black">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-xl shadow-primary/20 font-black text-xl">UC</div>
                                <h3 className="text-2xl font-serif font-black tracking-tighter italic text-white uppercase">UrbanCruizo</h3>
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-black pl-1 italic">India's Premier Luxury Marketplace</p>
                        </div>
                        <nav className="flex flex-wrap justify-center gap-12">
                            {['Terms of Service', 'Privacy Policy', 'Partner Contract', 'Brand Assets'].map(link => (
                                <a key={link} href="#" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-primary transition-all font-black italic">{link}</a>
                            ))}
                        </nav>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black italic">© 2026 UrbanCruizo Elite. Built for Scale.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
