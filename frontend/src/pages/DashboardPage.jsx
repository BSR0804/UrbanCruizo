import { useState, useEffect } from 'react';
import axios from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    CheckCircle2,
    IndianRupee,
    History,
    AlertCircle,
    CreditCard,
    XCircle,
    ArrowRight,
    Eye,
    CalendarDays,
    Trash2
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import BookingDetailsModal from '../components/BookingDetailsModal';
import EditDatesModal from '../components/EditDatesModal';
import ConfirmActionModal from '../components/ConfirmActionModal';
import toast from 'react-hot-toast';

const SkeletonRow = () => (
    <div className="p-8 flex flex-col md:flex-row justify-between items-center animate-pulse border-b border-gray-800/50">
        <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="w-16 h-16 rounded-2xl bg-gray-800" />
            <div className="space-y-3 flex-1 md:flex-none md:w-48">
                <div className="h-6 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
                <div className="h-3 bg-gray-800 rounded w-2/3" />
            </div>
        </div>
        <div className="mt-6 md:mt-0 flex flex-col items-end gap-3 w-full md:w-auto">
            <div className="h-8 bg-gray-800 rounded w-24" />
            <div className="h-6 bg-gray-800 rounded w-32" />
        </div>
    </div>
);

const DashboardPage = () => {
    // Initialize from local cache for instant load
    const [bookings, setBookings] = useState(() => {
        const local = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        return local.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    });
    const [loading, setLoading] = useState(bookings.length === 0);
    const [actionLoading, setActionLoading] = useState(false);

    // Modal States
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCancelOpen, setIsCancelOpen] = useState(false);

    const fetchBookings = async () => {
        try {
            let apiBookings = [];
            try {
                const { data } = await axios.get('bookings/mybookings');
                apiBookings = data;
            } catch (e) {
                console.warn("Backend bookings fetch failed, using local only.");
            }
            const mockBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
            const merged = [...mockBookings, ...apiBookings].sort((a, b) =>
                new Date(b.startDate) - new Date(a.startDate)
            );

            // Deduplicate by ID
            const unique = merged.reduce((acc, current) => {
                const x = acc.find(item => item._id === current._id);
                if (!x) return acc.concat([current]);
                return acc;
            }, []);

            setBookings(unique);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancelBooking = async () => {
        if (!selectedBooking) return;
        setActionLoading(true);
        try {
            await axios.put(`bookings/${selectedBooking._id}/cancel`);
            toast.success("Voyage cancelled successfully.");
            setIsCancelOpen(false);
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Cancellation failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateDates = async (bookingId, startDate, endDate) => {
        try {
            await axios.put(`bookings/${bookingId}/dates`, { startDate, endDate });
            toast.success("Journey dates redefined successfully.");
            setIsEditOpen(false);
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Date update failed");
        }
    };

    const handlePaymentSuccess = async () => {
        toast.success("Payment successful! Booking confirmed.");
        setIsPaymentOpen(false);
        fetchBookings(); // Refresh to show 'confirmed' status
    };

    return (
        <div className="min-h-screen bg-background text-textPrimary py-12">
            <div className="container mx-auto px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <h1 className="text-5xl font-serif font-black text-white mb-2 italic">My Citadels</h1>
                        <p className="text-textSecondary italic">Your journey of excellence, curated and archived.</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-surface rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden"
                >
                    <div className="px-10 py-8 border-b border-gray-800 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <History className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Booking History</h2>
                        </div>
                        {loading && bookings.length > 0 && (
                            <div className="flex items-center gap-2 text-[10px] uppercase font-black text-primary animate-pulse tracking-widest">
                                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                                Updating Live
                            </div>
                        )}
                    </div>

                    <div className="divide-y divide-gray-800/50">
                        {loading && bookings.length === 0 ? (
                            <>
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                            </>
                        ) : bookings.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-24 text-center space-y-6"
                            >
                                <div className="w-24 h-24 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto border border-dashed border-gray-700">
                                    <History className="w-10 h-10 text-gray-700" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-serif font-black text-white italic">No Voyages Yet</h3>
                                    <p className="text-textSecondary text-lg max-w-sm mx-auto italic">Your tapestry of premium travels is waiting for its first thread.</p>
                                </div>
                                <button onClick={() => window.location.href = '/home'} className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest rounded-2xl group flex items-center gap-3 mx-auto">
                                    Begin Your Discovery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {bookings.map((booking, idx) => (
                                    <motion.div
                                        layout
                                        key={booking._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-10 flex flex-col lg:flex-row justify-between items-center hover:bg-white/5 transition-all group relative border-b border-gray-800/30 last:border-b-0 gap-8"
                                    >
                                        <div className="flex items-center gap-8 w-full lg:w-auto">
                                            <div className="relative shrink-0">
                                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                                    <CheckCircle2 className="w-10 h-10" />
                                                </div>
                                                {booking.isMock && (
                                                    <div className="absolute -top-2 -right-2 bg-primary text-background text-[8px] font-black px-2 py-1 rounded-full border border-surface shadow-lg tracking-tighter">DEMO</div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex flex-col mb-3">
                                                    <h3 className="text-2xl font-serif font-black text-white group-hover:text-primary transition-colors leading-tight">
                                                        {booking.vehicle?.title || 'Premium Experience'}
                                                    </h3>
                                                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Confirmed Reserveration</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] text-textSecondary uppercase font-black tracking-widest opacity-40">Departure</p>
                                                        <p className="text-white font-medium flex items-center gap-2">
                                                            <span className="text-xs">{new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                            <span className="text-primary font-black">·</span>
                                                            <span className="text-[10px] opacity-80">{new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] text-textSecondary uppercase font-black tracking-widest opacity-40">Return</p>
                                                        <p className="text-white font-medium flex items-center gap-2">
                                                            <span className="text-xs">{new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                            <span className="text-primary font-black">·</span>
                                                            <span className="text-[10px] opacity-80">{new Date(booking.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row lg:flex-col items-center md:items-end gap-6 w-full lg:w-auto">
                                            <div className="text-4xl font-black text-white flex items-center justify-end gap-1 tracking-tighter">
                                                <IndianRupee className="w-5 h-5 text-primary" />
                                                {Number(booking.finalAmount || booking.totalPrice).toLocaleString('en-IN')}
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 transition-all">
                                                {/* Action Buttons */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setIsDetailsOpen(true);
                                                    }}
                                                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-800 transition-all active:scale-95"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> Details
                                                </button>

                                                {(booking.status !== 'cancelled' && booking.status !== 'rejected') && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setIsEditOpen(true);
                                                        }}
                                                        className="flex items-center gap-2 bg-white/5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-800 transition-all active:scale-95"
                                                        title="Change Dates"
                                                    >
                                                        <CalendarDays className="w-3.5 h-3.5" /> Reschedule
                                                    </button>
                                                )}

                                                {(booking.status === 'approved' || (booking.isMock && booking.status === 'approved')) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setIsPaymentOpen(true);
                                                        }}
                                                        className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95"
                                                    >
                                                        <CreditCard className="w-3.5 h-3.5" /> Pay
                                                    </button>
                                                )}

                                                {(booking.status === 'pending_approval' || booking.status === 'approved') && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setIsCancelOpen(true);
                                                        }}
                                                        className="flex items-center gap-2 bg-red-500/5 hover:bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-500/10 transition-all active:scale-95"
                                                        title="Cancel Booking"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Cancel
                                                    </button>
                                                )}

                                                <span className={`px-4 py-2 text-[9px] font-black rounded-xl uppercase tracking-widest flex items-center gap-2 border italic shadow-sm h-full ${booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        booking.status === 'approved' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                            booking.status === 'pending_approval' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                                booking.status === 'rejected' || booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                    'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                                    }`}>
                                                    {booking.status === 'pending_approval' && <Clock className="w-3 h-3" />}
                                                    {(booking.status === 'approved' || booking.status === 'confirmed' || booking.status === 'completed') && <CheckCircle2 className="w-3 h-3" />}
                                                    {(booking.status === 'rejected' || booking.status === 'cancelled') && <XCircle className="w-3 h-3" />}
                                                    {booking.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Modals */}
            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                amount={selectedBooking?.finalAmount || selectedBooking?.totalPrice}
                vehicleId={selectedBooking?.vehicle?._id}
                bookingId={selectedBooking?._id}
                onPaymentSuccess={handlePaymentSuccess}
            />

            <BookingDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                booking={selectedBooking}
            />

            <EditDatesModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                booking={selectedBooking}
                onUpdate={handleUpdateDates}
            />

            <ConfirmActionModal
                isOpen={isCancelOpen}
                onClose={() => setIsCancelOpen(false)}
                onConfirm={handleCancelBooking}
                loading={actionLoading}
                title="Discard This Voyage?"
                message="Are you certain you wish to cancel this premium reservation? This action cannot be undone."
                confirmText="Cancel Reservation"
            />
        </div>
    );
};

export default DashboardPage;
