import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, TrendingUp, MapPin, Shield, ChevronRight, Star, Zap, BarChart3, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PartnerLanding = () => {
    const { user } = useAuth();
    const isDealer = user && user.role === 'dealer';

    return (
        <div className="min-h-screen bg-background text-white overflow-hidden">

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

            {/* Features */}
            <section className="py-32 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-black mb-4 italic">Why Partner With Us</p>
                        <h2 className="text-4xl md:text-6xl font-serif font-black">Everything You Need<br /><span className="text-primary italic">To Succeed</span></h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <BarChart3 />, title: 'Real-Time Analytics', desc: 'Track earnings, bookings, and vehicle performance with live dashboards and detailed insights.' },
                            { icon: <Car />, title: 'Fleet Management', desc: 'Add, edit, remove vehicles. Set pricing, availability, and manage listings location-wise.' },
                            { icon: <Users />, title: 'Booking Control', desc: 'Accept or reject booking requests. View customer details and manage rental applications.' },
                            { icon: <MapPin />, title: 'Location Listings', desc: 'List vehicles by city and area. Reach customers in your specific operating zones.' },
                            { icon: <Shield />, title: 'Verified Partners', desc: 'Complete profile verification for trust badges. Build credibility with every listing.' },
                            { icon: <Zap />, title: 'Instant Leads', desc: 'Get notified about custom car requests from users looking for specific vehicles in your area.' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-surface border border-gray-800 rounded-[2rem] p-8 hover:border-primary/30 transition-all group"
                            >
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-textSecondary text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-32 px-6 bg-surface/30">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-black mb-4 italic">Partner Benefits</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-black mb-8">Earn More.<br /><span className="text-primary italic">Stress Less.</span></h2>
                            <div className="space-y-6">
                                {[
                                    { title: '90% Revenue Share', desc: 'Keep 90% of every booking. Only 10% platform commission.' },
                                    { title: 'Zero Listing Fees', desc: 'List unlimited vehicles at no cost. Pay only when you earn.' },
                                    { title: 'Monthly Payouts', desc: 'Reliable, scheduled payouts directly to your bank account.' },
                                    { title: 'Dedicated Support', desc: '24/7 partner support team to help you grow your fleet business.' }
                                ].map((benefit, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0 mt-1">
                                            <Star className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{benefit.title}</h4>
                                            <p className="text-textSecondary text-sm">{benefit.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-background border border-gray-800 rounded-[3rem] p-10 text-center">
                                <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
                                <h3 className="text-5xl font-serif font-bold text-primary mb-2">90%</h3>
                                <p className="text-xl font-bold text-white mb-2">Revenue Share</p>
                                <p className="text-textSecondary text-sm">Industry's highest partner payout ratio</p>
                                <div className="mt-8 pt-8 border-t border-gray-800 grid grid-cols-2 gap-6">
                                    <div><p className="text-2xl font-bold text-white">₹0</p><p className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Listing Fee</p></div>
                                    <div><p className="text-2xl font-bold text-white">∞</p><p className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Vehicles</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-32 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-black mb-4 italic">Platform Performance</p>
                    <h2 className="text-4xl md:text-5xl font-serif font-black mb-16">Numbers That<br /><span className="text-primary italic">Speak Volumes</span></h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: '98%', label: 'Partner Satisfaction' },
                            { value: '4.8★', label: 'Average Rating' },
                            { value: '15min', label: 'Avg Response Time' },
                            { value: '24/7', label: 'Support Available' }
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-surface border border-gray-800 rounded-[2rem] p-8">
                                <p className="text-3xl font-serif font-bold text-primary mb-2">{stat.value}</p>
                                <p className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
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
                                <Link to="/dealer/dashboard" className="bg-background text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform border border-white/10 shadow-2xl">
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartnerLanding;
