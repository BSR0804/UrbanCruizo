import { motion } from 'framer-motion';
import { Gavel, CheckCircle, AlertTriangle, CreditCard, Ban, Scale } from 'lucide-react';

const TermsOfServicePage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const clauses = [
        {
            icon: <CheckCircle className="w-8 h-8 text-primary" />,
            title: "Acceptance of Terms",
            items: [
                "By accessing UrbanCruizo, you agree to be bound by these Terms of Service.",
                "Users must provide accurate and truthful information during registration.",
                "We reserve the right to refuse service to anyone at any time.",
                "Continued use of the platform implies acceptance of updated terms."
            ]
        },
        {
            icon: <Scale className="w-8 h-8 text-primary" />,
            title: "User Eligibility",
            items: [
                "Minimum age for Car/Caravan: 25 years | Bikes: 21 years.",
                "Must hold a valid, original Indian Driving License or IDP.",
                "Accounts are personal and cannot be shared with third parties.",
                "Users are responsible for maintaining account confidentiality."
            ]
        },
        {
            icon: <CreditCard className="w-8 h-8 text-primary" />,
            title: "Booking & Payments",
            items: [
                "Bookings are confirmed only upon receipt of advance payment.",
                "Security deposits are mandatory and vary by vehicle category.",
                "All payments must be made through our secure platform.",
                "Refunds are processed as per our Cancellation Policy."
            ]
        },
        {
            icon: <AlertTriangle className="w-8 h-8 text-primary" />,
            title: "Liability & Damages",
            items: [
                "Renters are liable for all damages, theft, or loss during the period.",
                "Insurance covers major accidents, but deductibles apply to the renter.",
                "UrbanCruizo is not liable for personal belongings left in vehicles.",
                "Mechanical failures must be reported immediately to our support."
            ]
        },
        {
            icon: <Ban className="w-8 h-8 text-primary" />,
            title: "Usage Restrictions",
            items: [
                "No smoking, drinking, or illegal activities inside vehicles.",
                "Vehicles cannot be used for commercial purposes or racing.",
                "Caravans: Night travel (after 8 PM) is strictly restricted.",
                "Sub-letting the rented vehicle to others is strictly prohibited."
            ]
        },
        {
            icon: <Gavel className="w-8 h-8 text-primary" />,
            title: "Governing Law",
            items: [
                "All disputes are subject to the jurisdiction of Indian Courts.",
                "Terms are governed by the Information Technology Act, 2000.",
                "Violations may result in account suspension and legal action.",
                "Arbitration will be the first step for resolving any conflicts."
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
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">Terms of Service</h1>
                    <p className="text-xl text-textSecondary max-w-3xl mx-auto">
                        The legal framework that ensures a safe, premium, and transparent rental experience for every member of our club.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {clauses.map((clause, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-surface p-8 rounded-3xl border border-gray-800 hover:border-primary/30 transition-all group"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-primary/5 inline-block group-hover:scale-110 transition-transform duration-300">
                                {clause.icon}
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-6 leading-tight">{clause.title}</h3>
                            <ul className="space-y-4">
                                {clause.items.map((item, i) => (
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
                    <h4 className="text-white font-bold mb-4">Legal Inquiry?</h4>
                    <p className="text-textSecondary mb-6">For detailed legal documentation, reach out to legal@urbancruizo.com</p>
                    <div className="flex justify-center gap-4">
                        <a href="/help-center" className="btn-primary px-8 py-3">Legal Support</a>
                        <a href="/" className="btn-outline px-8 py-3">I Understand</a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
