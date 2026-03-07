import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, User, IndianRupee, Phone, Mail, Building2, ShieldCheck, Clock } from 'lucide-react';

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
    if (!booking) return null;

    const vehicle = booking.vehicle || {};
    const dealer = vehicle.owner || {};

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-surface border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-800 flex justify-between items-center bg-white/5">
                            <h2 className="text-2xl font-serif font-bold text-white italic">Voyage Details</h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                                <X className="w-6 h-6 text-textSecondary" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left side: Vehicle & Rental Info */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit border border-primary/20">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-3xl font-serif font-black text-white">{vehicle.title || 'Premium Experience'}</h3>
                                        <p className="text-primary text-[10px] font-black uppercase tracking-widest italic">{vehicle.brand} {vehicle.model}</p>
                                    </div>

                                    <div className="bg-background/50 p-6 rounded-3xl border border-gray-800 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] text-textSecondary uppercase font-black tracking-widest opacity-40">Journey Dates</p>
                                                <p className="text-sm font-medium text-white">
                                                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] text-textSecondary uppercase font-black tracking-widest opacity-40">Rental Time</p>
                                                <p className="text-sm font-medium text-white">
                                                    {new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <IndianRupee className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] text-textSecondary uppercase font-black tracking-widest opacity-40">Total Amount Paid</p>
                                                <p className="text-lg font-black text-white">₹{Number(booking.finalAmount || booking.totalPrice).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side: Dealer & Booking Info */}
                                <div className="space-y-6">
                                    <div className="bg-surface p-6 rounded-3xl border border-gray-800 relative overflow-hidden group">
                                        <Building2 className="absolute -top-4 -right-4 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors" />
                                        <h4 className="text-[10px] text-primary uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2 italic">
                                            <User className="w-3 h-3" /> Experience Architect
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-white font-serif text-lg font-bold">{dealer.name || 'UrbanCruizo Fleet'}</p>
                                                <p className="text-textSecondary text-[10px] uppercase font-bold tracking-widest">Official Partner</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 text-xs text-textSecondary">
                                                    <Mail className="w-4 h-4 text-primary" />
                                                    {dealer.email || 'concierge@urbancruizo.com'}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-textSecondary">
                                                    <Phone className="w-4 h-4 text-primary" />
                                                    {dealer.phone || '+91 XXXXX XXXXX'}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-textSecondary">
                                                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                                                    <span className="leading-tight">{dealer.address || 'UrbanCruizo Executive Terminal'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-6 rounded-3xl border flex items-center justify-between shadow-lg ${booking.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                            booking.status === 'pending_approval' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                                'bg-gray-500/10 border-gray-800 text-gray-400'
                                        }`}>
                                        <div className="text-[10px] uppercase font-black tracking-[0.2em]">Booking Status</div>
                                        <div className="font-serif font-black italic uppercase tracking-widest">{booking.status.replace('_', ' ')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer (Actions could go here but user wants them on main dashboard card too) */}
                        <div className="px-8 py-6 bg-white/5 border-t border-gray-800 text-center">
                            <p className="text-[10px] text-textSecondary uppercase font-black tracking-widest italic opacity-40">Thank you for choosing UrbanCruizo.</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookingDetailsModal;
