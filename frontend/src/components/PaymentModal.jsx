import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, IndianRupee, Smartphone, Building2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
    const [step, setStep] = useState('method'); // method, details, processing, success
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

    const handleProcessPayment = () => {
        setStep('processing');
        // Simulate payment delay
        setTimeout(() => {
            setStep('success');
            // Notify success after visual animation
            setTimeout(() => {
                onPaymentSuccess();
                onClose();
            }, 2000);
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-surface border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-8 pb-4 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-white">Secure Checkout</h2>
                            <p className="text-textSecondary text-sm">Transaction powered by CarawINN Pay</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/5 text-textSecondary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Bar (Simulated) */}
                    <div className="px-8 mb-6">
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "33%" }}
                                animate={{ width: step === 'method' ? "33%" : step === 'details' ? "66%" : "100%" }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>

                    <div className="p-8 pt-0">
                        {step === 'method' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex justify-between items-center mb-6">
                                    <span className="text-textSecondary text-sm uppercase tracking-widest font-bold">Payable Amount</span>
                                    <span className="text-2xl font-bold text-primary flex items-center">
                                        <IndianRupee className="w-5 h-5" /> {amount.toFixed(0)}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
                                        { id: 'upi', name: 'UPI (GPay, PhonePe)', icon: Smartphone },
                                        { id: 'netbanking', name: 'Net Banking', icon: Building2 },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => {
                                                setPaymentMethod(method.id);
                                                setStep('details');
                                            }}
                                            className="w-full p-4 rounded-2xl border border-gray-800 bg-surface hover:border-primary/50 hover:bg-white/5 transition-all text-left flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-xl bg-gray-800 text-textSecondary group-hover:text-primary transition-colors">
                                                    <method.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-white">{method.name}</span>
                                            </div>
                                            <div className="w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 'details' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-textSecondary ml-1">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                            <input
                                                type="text"
                                                placeholder="XXXX XXXX XXXX XXXX"
                                                className="input-field pl-12 h-12 text-sm"
                                                maxLength="19"
                                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-textSecondary ml-1">Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="input-field h-12 text-sm text-center"
                                                maxLength="5"
                                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-textSecondary ml-1">CVC</label>
                                            <input
                                                type="password"
                                                placeholder="***"
                                                className="input-field h-12 text-sm text-center"
                                                maxLength="3"
                                                onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setStep('method')}
                                        className="flex-1 py-4 rounded-2xl border border-gray-800 text-textSecondary font-bold hover:bg-white/5 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleProcessPayment}
                                        className="flex-[2] btn-primary py-4 font-bold flex items-center justify-center gap-2"
                                    >
                                        Pay ₹{amount.toFixed(0)}
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-[10px] text-textSecondary uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3 text-green-500" /> Secure SSL Encrypted
                                </div>
                            </motion.div>
                        )}

                        {step === 'processing' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
                                    <Loader2 className="w-20 h-20 text-primary animate-spin absolute inset-0" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Processing Transaction</h3>
                                    <p className="text-textSecondary mt-1 text-sm">Please do not refresh the page...</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Payment Successful</h3>
                                    <p className="text-textSecondary mt-1 text-sm">Transferring to your dashboard...</p>
                                </div>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5 }}
                                    className="h-1 bg-green-500 rounded-full"
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Footer Brands */}
                    {step !== 'processing' && step !== 'success' && (
                        <div className="p-8 py-6 bg-white/5 border-t border-gray-800 flex justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
                            <span className="text-[10px] font-bold text-white italic tracking-tighter">VISA</span>
                            <span className="text-[10px] font-bold text-white italic tracking-tighter">MASTERCARD</span>
                            <span className="text-[10px] font-bold text-white italic tracking-tighter">RAZORPAY</span>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
