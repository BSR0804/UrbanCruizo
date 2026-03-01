import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Target, ShieldCheck, Zap, X, Globe, Trophy } from 'lucide-react';

const PerformancePage = ({ onClose }) => {
    const stats = [
        {
            value: '98%',
            label: 'Partner Satisfaction',
            desc: 'Based on our annual partner feedback survey regarding platform ease of use and support.',
            icon: <ShieldCheck className="w-5 h-5" />
        },
        {
            value: '4.8★',
            label: 'Average Trip Rating',
            desc: 'High customer satisfaction leads to repeat bookings and higher visibility for your fleet.',
            icon: <Trophy className="w-5 h-5" />
        },
        {
            value: '15min',
            label: 'Avg Response Time',
            desc: 'Our dedicated partner support team provides industry-leading response times globally.',
            icon: <Zap className="w-5 h-5" />
        },
        {
            value: '24/7',
            label: 'Support Available',
            desc: 'Round-the-clock technical and operational assistance whenever you need it.',
            icon: <Users className="w-5 h-5" />
        }
    ];

    const milestones = [
        { title: '₹2Cr+', subtitle: 'Monthly Payouts', icon: <TrendingUp /> },
        { title: '10K+', subtitle: 'Vehicles Listed', icon: <BarChart3 /> },
        { title: '50+', subtitle: 'Cities Covered', icon: <Globe /> },
        { title: '500+', subtitle: 'Active Partners', icon: <Target /> }
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

                <div className="text-center mb-24">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] uppercase tracking-[0.5em] text-primary font-black mb-4 italic"
                    >
                        Platform Performance Metrics
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-serif font-black text-white"
                    >
                        Numbers That<br />
                        <span className="text-primary italic">Speak Volumes</span>
                    </motion.h2>
                </div>

                {/* Big Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {milestones.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="bg-surface/50 border border-gray-800 rounded-[3rem] p-10 text-center hover:border-primary/40 transition-all group"
                        >
                            <div className="text-primary mb-4 flex justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                                {item.icon}
                            </div>
                            <p className="text-4xl md:text-5xl font-serif font-black text-white mb-2">{item.title}</p>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-textSecondary font-black italic">{item.subtitle}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Analytics Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="bg-surface/30 border border-gray-800/50 rounded-[2.5rem] p-10 flex gap-8 items-center group hover:bg-surface/50 transition-all"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-background transition-all">
                                {stat.icon}
                            </div>
                            <div>
                                <div className="flex items-baseline gap-3 mb-2">
                                    <h4 className="text-3xl font-serif font-black text-white italic">{stat.value}</h4>
                                    <span className="text-[10px] uppercase tracking-widest text-primary font-black italic">{stat.label}</span>
                                </div>
                                <p className="text-textSecondary text-sm leading-relaxed font-medium">{stat.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                >
                    <button
                        onClick={onClose}
                        className="btn-primary px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                        Back to Portal
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PerformancePage;
