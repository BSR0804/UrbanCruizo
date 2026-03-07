import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const EditDatesModal = ({ isOpen, onClose, booking, onUpdate }) => {
    const [startDate, setStartDate] = useState(booking?.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : '');
    const [endDate, setEndDate] = useState(booking?.endDate ? new Date(booking.endDate).toISOString().split('T')[0] : '');
    const [loading, setLoading] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(startDate) >= new Date(endDate)) {
            toast.error("Return date must be after departure date.");
            return;
        }
        setLoading(true);
        await onUpdate(booking._id, startDate, endDate);
        setLoading(false);
        onClose();
    };

    if (!booking) return null;

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
                        className="relative w-full max-w-md bg-surface border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <div className="px-8 py-6 border-b border-gray-800 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-serif font-bold text-white italic">Alter Journey Dates</h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                                <X className="w-5 h-5 text-textSecondary" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex gap-3 items-start">
                                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-orange-500/80 font-bold uppercase tracking-widest leading-relaxed">
                                    Changing dates will reset your booking status to <span className="text-orange-500 italic underline">Pending</span> for dealer re-approval.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-textSecondary px-1">Departure</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={startDate}
                                            min={today}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="input-field pl-10 h-12 text-sm bg-background/50"
                                            required
                                        />
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-textSecondary px-1">Return</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={endDate}
                                            min={startDate || today}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="input-field pl-10 h-12 text-sm bg-background/50"
                                            required
                                        />
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Update Itinerary"} <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full mt-3 py-3 text-[10px] font-black uppercase tracking-widest text-textSecondary hover:text-white transition-colors"
                                >
                                    Maintain Current Plan
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditDatesModal;
