import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, ArrowRight } from 'lucide-react';

const ConfirmActionModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, loading }) => {
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
                        className="relative w-full max-w-sm bg-surface border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <div className="px-8 py-8 text-center space-y-6">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-serif font-black text-white italic tracking-tight">{title}</h2>
                                <p className="text-textSecondary text-sm italic leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : confirmText || "Confirm Action"} <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-textSecondary hover:text-white transition-colors"
                                >
                                    Cancel and Return
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmActionModal;
