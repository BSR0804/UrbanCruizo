import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Ban, CreditCard, Clock, MapPin } from 'lucide-react';

const RentalPolicyPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const policies = [
        {
            icon: <FileText className="w-8 h-8 text-primary" />,
            title: "Required Documentation",
            items: [
                "Valid Indian Driving License or International Driving Permit (IDP).",
                "Aadhaar Card, Passport, or any Government-issued ID.",
                "For foreigners: Passport and Valid Visa copy is mandatory.",
                "All documents must be original at the time of pickup."
            ]
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            title: "Age & Eligibility",
            items: [
                "Minimum age for Car & Caravan rentals: 25 years.",
                "Minimum age for Bike rentals: 21 years (24 years for Superbikes).",
                "A minimum of 3 years of active driving experience is preferred.",
                "Learner's licenses are strictly not accepted."
            ]
        },
        {
            icon: <CreditCard className="w-8 h-8 text-primary" />,
            title: "Security Deposit & Payments",
            items: [
                "A refundable security deposit is required for all rentals.",
                "Caravans: ₹20,000 | Luxury Cars: ₹15,000 | Bikes: ₹5,000.",
                "Full rental payment must be cleared 24 hours before pickup.",
                "Deposit is refunded within 5-7 working days after vehicle return."
            ]
        },
        {
            icon: <Clock className="w-8 h-8 text-primary" />,
            title: "Cancellation & Refunds",
            items: [
                "Full refund if cancelled 7 days prior to the journey.",
                "50% refund if cancelled between 3 to 7 days.",
                "No refund if cancelled within 72 hours of pickup.",
                "Early returns are not eligible for any partial refunds."
            ]
        },
        {
            icon: <MapPin className="w-8 h-8 text-primary" />,
            title: "Usage & Mileage",
            items: [
                "Standard Mileage: 250km/day for Cars/Caravans (Extra km charges apply).",
                "Fuel and Tolls are to be borne by the customer (Dry Rental).",
                "Vehicles must be returned in the same condition as picked up.",
                "Inter-state taxes must be paid by the customer at border checkpoints."
            ]
        },
        {
            icon: <Ban className="w-8 h-8 text-primary" />,
            title: "Prohibited Activities",
            items: [
                "Strictly NO Smoking or Alcohol consumption inside the vehicle.",
                "Off-roading, racing, or commercial use is strictly prohibited.",
                "Unauthorized drivers are not allowed to operate the vehicle.",
                "Carrying hazardous materials or illegal substances is a criminal offense."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background py-20 px-6">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">Rental Policy</h1>
                    <p className="text-xl text-textSecondary max-w-3xl mx-auto">
                        Transparent, fair, and designed for your safety. Please review our guidelines to ensure a seamless UrbanCruizo experience.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {policies.map((policy, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-surface p-8 rounded-3xl border border-gray-800 hover:border-primary/30 transition-all group"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-primary/5 inline-block group-hover:scale-110 transition-transform duration-300">
                                {policy.icon}
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-6 leading-tight">{policy.title}</h3>
                            <ul className="space-y-4">
                                {policy.items.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-textSecondary leading-relaxed">
                                        <div className="min-w-[6px] h-[6px] rounded-full bg-primary mt-2" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-20 p-8 rounded-3xl bg-primary/5 border border-primary/20 text-center"
                >
                    <h4 className="text-white font-bold mb-4">Have questions about our policy?</h4>
                    <p className="text-textSecondary mb-6">Our support team is available 24/7 to help you clarify any terms.</p>
                    <div className="flex justify-center gap-4">
                        <a href="/help-center" className="btn-primary px-8 py-3">Talk to Support</a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RentalPolicyPage;
