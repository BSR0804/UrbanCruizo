import { motion } from 'framer-motion';
import { Mail, Phone, User, Landmark, ShieldCheck, Clock } from 'lucide-react';

const HelpCenterPage = () => {
    const contactInfo = {
        name: "Bhaskar Shamo Ray",
        phone: "7827064282",
        email: "bhaskarshamoray11@gmail.com"
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-background py-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">Help Center</h1>
                    <p className="text-xl text-textSecondary max-w-2xl mx-auto">
                        We're here to ensure your journey is as smooth as your ride. Reach out to our dedicated support lead for any assistance.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-1 gap-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface rounded-[2rem] p-8 md:p-12 border border-gray-800 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                                <User className="w-20 h-20 md:w-32 md:h-32 text-primary opacity-50" />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-sm font-bold tracking-[0.3em] text-primary uppercase mb-4">Direct Support Lead</h2>
                                <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">{contactInfo.name}</h3>

                                <div className="space-y-6">
                                    <a
                                        href={`tel:${contactInfo.phone}`}
                                        className="flex items-center justify-center md:justify-start gap-4 text-xl text-textSecondary hover:text-primary transition-colors group/link"
                                    >
                                        <div className="p-3 rounded-xl bg-background border border-gray-800 group-hover/link:border-primary/50 transition-all">
                                            <Phone className="w-6 h-6 text-primary" />
                                        </div>
                                        <span>+91 {contactInfo.phone}</span>
                                    </a>

                                    <a
                                        href={`mailto:${contactInfo.email}`}
                                        className="flex items-center justify-center md:justify-start gap-4 text-xl text-textSecondary hover:text-primary transition-colors group/link"
                                    >
                                        <div className="p-3 rounded-xl bg-background border border-gray-800 group-hover/link:border-primary/50 transition-all">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className="break-all">{contactInfo.email}</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-0 -translate-x-1/2 translate-y-1/2" />
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: <ShieldCheck />, title: "24/7 Support", desc: "Always available for emergencies" },
                            { icon: <Clock />, title: "Quick Response", desc: "Under 30 mins turnaround" },
                            { icon: <Landmark />, title: "Verified Help", desc: "Direct access to management" }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                className="bg-surface p-6 rounded-2xl border border-gray-800 text-center"
                            >
                                <div className="p-3 bg-primary/10 rounded-xl inline-block text-primary mb-4">
                                    {item.icon}
                                </div>
                                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                                <p className="text-sm text-textSecondary">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 text-center text-textSecondary italic"
                >
                    <p>"Your comfort is our command. UrbanCruizo support is dedicated to making every mile memorable."</p>
                </motion.div>
            </div>
        </div>
    );
};

export default HelpCenterPage;
