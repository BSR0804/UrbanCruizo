import { motion } from 'framer-motion';
import { Star, TrendingUp, X, CheckCircle2, IndianRupee, Clock, Headphones } from 'lucide-react';

const BenefitsPage = ({ onClose }) => {
    const benefits = [
        {
            icon: <IndianRupee />,
            title: '90% Revenue Share',
            desc: 'Industry-leading payout structure. Keep 90% of every booking value. We only take a 10% platform fee to maintain operations.'
        },
        {
            icon: <CheckCircle2 />,
            title: 'Zero Listing Fees',
            desc: 'Start growing your business with no upfront costs. List an unlimited number of vehicles for free. You only pay when you earn.'
        },
        {
            icon: <Clock />,
            title: 'Reliable Monthly Payouts',
            desc: 'No more chasing payments. All your earnings are automatically processed and credited to your account on the 5th of every month.'
        },
        {
            icon: <Headphones />,
            title: '24/7 Priority Support',
            desc: 'Direct access to a dedicated partner support team. We help you with listings, customer disputes, and platform optimization.'
        },
        {
            icon: <TrendingUp />,
            title: 'Market Growth Insights',
            desc: 'Get data-driven suggestions on pricing and demand hotspots. We help you position your fleet for maximum utilization.'
        },
        {
            icon: <Star />,
            title: 'Premium Brand Association',
            desc: 'Position your fleet alongside India’s most exclusive vehicles. Benefit from our premium marketing and elite customer base.'
        }
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
                        Partner Value Proposition
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-serif font-black text-white"
                    >
                        Earn More.<br />
                        <span className="text-primary italic">Stress Less.</span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                    <div className="bg-surface/50 border border-gray-800 rounded-[3rem] p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-8 border border-primary/20">
                                <TrendingUp className="w-10 h-10" />
                            </div>
                            <h3 className="text-5xl font-serif font-bold text-primary mb-4 tracking-tighter">90%</h3>
                            <p className="text-2xl font-bold text-white mb-4">Revenue Payout</p>
                            <p className="text-textSecondary leading-relaxed font-medium">
                                We believe our partners deserve the lion's share. That's why we maintain the industry's most transparent and rewarding payout ratio.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-2 gap-8 pt-10 border-t border-gray-800">
                            <div>
                                <p className="text-3xl font-serif font-bold text-white mb-2">₹0</p>
                                <p className="text-[10px] uppercase tracking-widest text-textSecondary font-black italic">Platform Entry Fee</p>
                            </div>
                            <div>
                                <p className="text-3xl font-serif font-bold text-white mb-2">Unlimited</p>
                                <p className="text-[10px] uppercase tracking-widest text-textSecondary font-black italic">Fleet Capacity</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {benefits.filter((_, i) => i > 0).map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="flex gap-6 bg-surface/30 p-8 rounded-[2.5rem] border border-gray-800/50 hover:border-primary/30 transition-all group"
                            >
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-background transition-all">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2 italic underline underline-offset-4 decoration-primary/20">{benefit.title}</h4>
                                    <p className="text-textSecondary text-sm leading-relaxed">{benefit.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
                        Back to Landing
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default BenefitsPage;
