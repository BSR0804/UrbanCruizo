import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, CreditCard, FileText, Upload, CheckCircle2, AlertCircle, Loader2, Users } from 'lucide-react';

const BookingFormModal = ({ isOpen, onClose, onSubmit, packageName, price }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        guests: 1,
        specialRequests: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2500);
        } catch (error) {
            toast.error('Failed to process booking');
        } finally {
            setLoading(false);
        }
    };

    const dynamicPrice = (price * formData.guests);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-surface border border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-1">Traveler Information</h2>
                        <p className="text-textSecondary text-sm">Please finalize your details for {packageName}.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-textSecondary hover:text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {success ? (
                        <div className="py-12 text-center space-y-6">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Details Confirmed!</h3>
                                <p className="text-textSecondary max-w-sm mx-auto">
                                    Proceeding to secure payment for your luxury experience.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(e);
                        }} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                            placeholder="Enter your name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                            placeholder="example@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Total Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <input
                                            type="number"
                                            name="guests"
                                            min="1"
                                            max="10"
                                            required
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                            value={formData.guests}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Special Requests</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-6 w-4 h-4 text-primary/40" />
                                    <textarea
                                        name="specialRequests"
                                        className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all min-h-[120px]"
                                        placeholder="Dietary preferences, pickup points, etc."
                                        value={formData.specialRequests}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-surface/50 border border-gray-800 rounded-[2rem] space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-textSecondary">Base Package ({formData.guests} Traveler{formData.guests > 1 ? 's' : ''})</span>
                                    <span className="text-white font-medium">₹{price.toLocaleString('en-IN')} × {formData.guests}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pb-4 border-b border-gray-800/50">
                                    <span className="text-textSecondary">Service & Documentation</span>
                                    <span className="text-white font-medium">₹499</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div>
                                        <span className="text-textSecondary text-xs uppercase tracking-[0.2em] block">Total Payable</span>
                                        <span className="text-[10px] text-primary/60 italic font-medium">Included: Luxury Transfers & Entry Fees</span>
                                    </div>
                                    <span className="text-4xl font-bold text-white">₹{(dynamicPrice + 499).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-background font-bold py-6 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm & Proceed to Pay'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BookingFormModal;
