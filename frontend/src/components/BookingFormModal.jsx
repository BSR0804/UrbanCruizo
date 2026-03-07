import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, CreditCard, FileText, Upload, CheckCircle2, AlertCircle, Loader2, Users, ShieldCheck, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingFormModal = ({ isOpen, onClose, onSubmit, packageName, price, isPackage = false }) => {
    const [formData, setFormData] = useState({
        bookingName: '',
        bookingEmail: '',
        bookingPhone: '',
        bookingAddress: '',
        guests: 1,
        specialRequests: '',
        aadhaarImage: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=400&auto=format&fit=crop', // Mock URL
        licenseImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop'   // Mock URL
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSuccess(false);
            setLoading(false);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'guests') {
            const val = parseInt(value);
            if (val > 10) return;
            if (val < 1 && value !== '') return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            toast.error('Failed to process. Please check details.');
        } finally {
            setLoading(false);
        }
    };

    const dynamicPrice = isPackage ? (price * formData.guests) : (price || 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/95 backdrop-blur-xl"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl bg-[#0A0A0A] border border-gray-800/80 rounded-[3rem] shadow-2xl overflow-hidden"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute right-8 top-8 z-10 p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                    <X className="w-6 h-6" />
                </button>

                <div className="grid lg:grid-cols-[1fr,350px] divide-x divide-gray-800/50 min-h-[600px]">
                    <div className="p-10 lg:p-14">
                        {/* Header */}
                        <div className="mb-12">
                            <h2 className="text-4xl font-serif font-black text-white mb-2 italic tracking-tight">
                                {isPackage ? 'Traveler Details' : 'Identity Verification'}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="h-[1px] w-12 bg-primary/40 block" />
                                <p className="text-textSecondary text-[10px] uppercase tracking-[0.3em] font-black opacity-60">
                                    {isPackage ? 'Finalize your voyage details' : 'Complete your premium rental authentication'}
                                </p>
                            </div>
                        </div>

                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-20 text-center space-y-4"
                            >
                                <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <h3 className="text-3xl font-serif font-black text-white italic">Authentication Successful</h3>
                                <p className="text-textSecondary font-bold text-sm tracking-widest uppercase opacity-40">Securing your reservation...</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Common Fields */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-primary uppercase font-black tracking-widest pl-1 italic">Legal Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                name="bookingName"
                                                required
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-5 pl-12 pr-4 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-white/5 font-medium"
                                                placeholder="Johnathan Doe"
                                                value={formData.bookingName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-primary uppercase font-black tracking-widest pl-1 italic">Contact Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="email"
                                                name="bookingEmail"
                                                required
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-5 pl-12 pr-4 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-white/5 font-medium"
                                                placeholder="concierge@urcruizo.com"
                                                value={formData.bookingEmail}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-primary uppercase font-black tracking-widest pl-1 italic">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="tel"
                                                name="bookingPhone"
                                                required
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-5 pl-12 pr-4 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-white/5 font-medium"
                                                placeholder="+91 XXXXX XXXXX"
                                                value={formData.bookingPhone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Conditional Fields */}
                                    {isPackage ? (
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-primary uppercase font-black tracking-widest pl-1 italic">Total Guests</label>
                                            <div className="relative group">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="number"
                                                    name="guests"
                                                    min="1"
                                                    required
                                                    className="w-full bg-background border border-gray-800 rounded-2xl py-5 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all font-black"
                                                    value={formData.guests}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-primary uppercase font-black tracking-widest pl-1 italic">Local Address</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    name="bookingAddress"
                                                    required
                                                    className="w-full bg-background border border-gray-800 rounded-2xl py-5 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/5 font-medium"
                                                    placeholder="Hotel or Residential Terminal"
                                                    value={formData.bookingAddress}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Identity Docs for Vehicles */}
                                {!isPackage && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                        <div className="space-y-4">
                                            <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest flex items-center gap-2 italic">
                                                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Aadhaar Card Authentication
                                            </label>
                                            <div className="relative group/upload bg-background/30 border border-dashed border-gray-800 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-all cursor-pointer overflow-hidden aspect-[16/9]">
                                                <img src={formData.aadhaarImage} alt="Doc" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover/upload:opacity-40 transition-opacity" />
                                                <div className="relative z-10 flex flex-col items-center gap-2">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                                        <Upload className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="text-[9px] font-black text-white uppercase italic tracking-widest">Update Document</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest flex items-center gap-2 italic">
                                                <CreditCard className="w-3.5 h-3.5 text-primary" /> Driving License Verification
                                            </label>
                                            <div className="relative group/upload bg-background/30 border border-dashed border-gray-800 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-all cursor-pointer overflow-hidden aspect-[16/9]">
                                                <img src={formData.licenseImage} alt="Doc" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover/upload:opacity-40 transition-opacity" />
                                                <div className="relative z-10 flex flex-col items-center gap-2">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                                        <Upload className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="text-[9px] font-black text-white uppercase italic tracking-widest">Update Document</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isPackage && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-primary uppercase font-black tracking-widest pl-1 italic">Special Concierge Requests</label>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-6 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                                            <textarea
                                                name="specialRequests"
                                                className="w-full bg-background border border-gray-800 rounded-3xl py-6 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all min-h-[160px] placeholder:text-white/5 font-medium leading-relaxed"
                                                placeholder="Dietary preferences, luxury additions, or specific pickup coordinates..."
                                                value={formData.specialRequests}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full bg-primary text-background h-20 rounded-2xl font-black uppercase tracking-[0.3em] italic flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_50px_rgba(255,191,0,0.15)] group"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-background" />
                                        ) : (
                                            <>
                                                Confirm & Proceed
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="bg-white/[0.02] p-10 lg:p-12 flex flex-col">
                        <div className="flex-1">
                            <h4 className="text-[9px] text-primary/60 uppercase font-black tracking-[0.4em] mb-12 flex items-center gap-3 italic">
                                <div className="h-[1px] w-6 bg-primary/40" />
                                Reservation Summary
                            </h4>

                            <div className="space-y-10">
                                <div className="relative">
                                    <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-primary/20" />
                                    <p className="text-white font-serif text-3xl font-black italic leading-tight mb-2">{packageName}</p>
                                    <p className="text-[9px] text-textSecondary uppercase font-black tracking-[0.2em] opacity-30 italic">UrbanCruizo Royal Fleet</p>
                                </div>

                                <div className="space-y-5 pt-10 border-t border-gray-800/30">
                                    <div className="flex justify-between items-center group">
                                        <span className="text-[10px] text-textSecondary uppercase font-black tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">Base Fare</span>
                                        <span className="text-sm text-white font-black italic">₹{(price || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                    {isPackage && (
                                        <div className="flex justify-between items-center group">
                                            <span className="text-[10px] text-textSecondary uppercase font-black tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">Travelers</span>
                                            <span className="text-sm text-white font-black italic">× {formData.guests}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center group">
                                        <span className="text-[10px] text-textSecondary uppercase font-black tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">Documentation</span>
                                        <span className="text-[10px] text-primary font-black italic tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Included</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-gray-800/40 mt-12">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] text-textSecondary uppercase font-black tracking-[0.3em] opacity-40 italic mb-2">Total Amount</p>
                                    <p className="text-5xl font-black text-white italic tracking-tighter">₹{dynamicPrice.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <ShieldCheck className="w-8 h-8 text-primary opacity-50" />
                                <div>
                                    <p className="text-[9px] text-white font-black uppercase tracking-widest italic leading-none mb-1">Elite Security</p>
                                    <p className="text-[8px] text-textSecondary uppercase font-black tracking-widest opacity-40">SSL SECURED TERMINAL</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingFormModal;
