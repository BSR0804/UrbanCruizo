import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle2, Loader2, IndianRupee } from 'lucide-react';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess, vehicleId, bookingId }) => {
    const [step, setStep] = useState('method'); // method, processing, success
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleRazorpayPayment = async () => {
        try {
            setLoading(true);
            setStep('processing');

            // 1. Create order on backend
            const { data: order } = await axios.post('payment/razorpay/order', {
                amount: amount,
                vehicleId: vehicleId // Pass vehicle ID for Sandbox/Demo detection
            });

            // Handle Mock Success for Sandbox
            if (order.mock) {
                console.log("Sandbox checkout detected, simulating success...");
                // Simulate status update locally for mock bookings
                if (bookingId && bookingId.startsWith('mock')) {
                    const mockBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
                    const updated = mockBookings.map(b => b._id === bookingId ? { ...b, status: 'confirmed' } : b);
                    localStorage.setItem('mock_bookings', JSON.stringify(updated));
                }

                setTimeout(() => {
                    setStep('success');
                    setTimeout(() => {
                        onPaymentSuccess();
                        onClose();
                    }, 2000);
                }, 1500);
                return;
            }

            // 2. Configure Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
                amount: order.amount,
                currency: order.currency,
                name: "CarawINN",
                description: "Premium Rental Booking Confirmation",
                image: "/vite.svg",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify payment on backend
                        const { data } = await axios.post('payment/razorpay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId // PASS BOOKING ID HERE
                        });

                        if (data.success) {
                            setStep('success');
                            setTimeout(() => {
                                onPaymentSuccess();
                                onClose();
                            }, 2000);
                        }
                    } catch (error) {
                        toast.error("Payment Verification Failed");
                        setStep('method');
                    }
                },
                prefill: {
                    name: user?.name || "Guest",
                    email: user?.email || "",
                    contact: user?.phone || ""
                },
                theme: {
                    color: "#FACC15" // Yellow primary
                },
                modal: {
                    ondismiss: function () {
                        setStep('method');
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Payment Error:', error);
            const errorMsg = error.response?.data?.details || error.response?.data?.message || "Payment Initialization Failed";
            toast.error(errorMsg, { duration: 5000 });
            setStep('method');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-surface border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                    <div className="p-8 pb-4 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-white">Razorpay Checkout</h2>
                            <p className="text-textSecondary text-sm">Secure transactions by Razorpay</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/5 text-textSecondary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8">
                        {step === 'method' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-2">
                                    <span className="text-textSecondary text-xs uppercase tracking-widest font-bold">Total Payable</span>
                                    <span className="text-4xl font-bold text-primary flex items-center gap-1">
                                        <IndianRupee className="w-8 h-8" /> {amount.toFixed(0)}
                                    </span>
                                </div>

                                <button
                                    onClick={handleRazorpayPayment}
                                    disabled={loading}
                                    className="w-full btn-primary py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                                >
                                    Proceed to Pay
                                </button>

                                <div className="flex items-center justify-center gap-4 py-4 bg-white/5 rounded-2xl grayscale opacity-50">
                                    <span className="text-[10px] font-bold text-white">VISA</span>
                                    <span className="text-[10px] font-bold text-white">MASTERCARD</span>
                                    <span className="text-[10px] font-bold text-white">UPI</span>
                                    <span className="text-[10px] font-bold text-white uppercase italic">Razorpay</span>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-[10px] text-textSecondary uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3 text-green-500" /> Secure SSL Encrypted Checkout
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
                                    <h3 className="text-xl font-bold text-white">Awaiting Payment</h3>
                                    <p className="text-textSecondary mt-1 text-sm">Please finalize the payment in the Razorpay window.</p>
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
                                    <h3 className="text-2xl font-bold text-white">Booking Confirmed!</h3>
                                    <p className="text-textSecondary mt-1 text-sm">Redirecting to your dashboard...</p>
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
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
