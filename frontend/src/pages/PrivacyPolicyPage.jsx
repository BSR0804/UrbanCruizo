import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Share2, ClipboardList } from 'lucide-react';

const PrivacyPolicyPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const sections = [
        {
            icon: <Database className="w-8 h-8 text-primary" />,
            title: "Information We Collect",
            items: [
                "Personal details: Name, Email, Phone Number, and Address.",
                "Identity verification: Aadhaar, Driving License, or Passport copies.",
                "Vehicle data: Real-time GPS location and usage telemetry during rentals.",
                "Technical info: IP address, device type, and browsing patterns via cookies."
            ]
        },
        {
            icon: <Eye className="w-8 h-8 text-primary" />,
            title: "How We Use Your Data",
            items: [
                "To process bookings and verify your driving eligibility.",
                "To provide 24/7 roadside assistance and emergency services.",
                "To prevent theft and monitor vehicle safety via GPS tracking.",
                "To send personalized offers and updates (with your consent)."
            ]
        },
        {
            icon: <Lock className="w-8 h-8 text-primary" />,
            title: "Data Security",
            items: [
                "All sensitive data is encrypted using SSL/TLS protocols.",
                "Payment processing is handled by PCI-DSS compliant gateways.",
                "Strict access controls: Only authorized personnel can access your documents.",
                "Regular security audits to prevent data leaks or unauthorized access."
            ]
        },
        {
            icon: <Share2 className="w-8 h-8 text-primary" />,
            title: "Sharing & Disclosure",
            items: [
                "Shared with law enforcement only when required by Indian law.",
                "Disclosed to insurance providers in case of accidents or claims.",
                "Partners: Verified local dealers to facilitate your pickup/drop-off.",
                "We NEVER sell your personal information to third-party marketers."
            ]
        },
        {
            icon: <ClipboardList className="w-8 h-8 text-primary" />,
            title: "Your Rights",
            items: [
                "Right to access: Request a copy of all data we hold about you.",
                "Right to correction: Update any inaccurate or incomplete records.",
                "Right to erasure: Request deletion of your account (subject to past rental audits).",
                "Right to withdraw consent for marketing and secondary notifications."
            ]
        },
        {
            icon: <Shield className="w-8 h-8 text-primary" />,
            title: "Data Retention",
            items: [
                "Documents are stored securely until the completion of the rental period.",
                "Rental history is kept for 7 years as per Indian tax and legal requirements.",
                "GPS logs are automatically anonymized after 12 months.",
                "Unused account data is purged after 3 years of inactivity."
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
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">Privacy Policy</h1>
                    <p className="text-xl text-textSecondary max-w-3xl mx-auto">
                        Your trust is our most valuable asset. We are committed to protecting your personal information as per the Digital Personal Data Protection Act, 2023.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-surface p-8 rounded-3xl border border-gray-800 hover:border-primary/30 transition-all group"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-primary/5 inline-block group-hover:scale-110 transition-transform duration-300">
                                {section.icon}
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-6 leading-tight">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.items.map((item, i) => (
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
                    <h4 className="text-white font-bold mb-4">Privacy Concerns?</h4>
                    <p className="text-textSecondary mb-6">Contact our Data Protection Officer at bhaskarshamoray11@gmail.com</p>
                    <div className="flex justify-center gap-4">
                        <a href="/help-center" className="btn-primary px-8 py-3">Talk to Support</a>
                        <a href="/" className="btn-outline px-8 py-3">Back to Home</a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
