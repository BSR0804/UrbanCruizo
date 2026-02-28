import { useState, useEffect } from 'react';
import axios from '../utils/api';
import { Clock, CheckCircle2, IndianRupee, History, AlertCircle, CreditCard, XCircle } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

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
            setBookings(merged);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handlePaymentSuccess = async () => {
        toast.success("Payment successful! Booking confirmed.");
        setIsPaymentOpen(false);
        fetchBookings(); // Refresh to show 'confirmed' status
    };

    if (loading) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
            <Clock className="w-12 h-12 text-primary animate-spin" />
            <p className="text-textSecondary animate-pulse">Loading your luxury travels...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-textPrimary py-12">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-serif font-bold text-white mb-2">My Dashboard</h1>
                        <p className="text-textSecondary">Manage your premium rentals and travel history.</p>
                    </div>
                </div>

                <div className="bg-surface rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-800 bg-white/5 flex items-center gap-3">
                        <History className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-white">Booking History</h2>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="p-16 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto">
                                <History className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white">No Bookings Yet</h3>
                            <p className="text-textSecondary">Your travel story hasn't started. Experience luxury today.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800/50">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="p-8 flex flex-col md:flex-row justify-between items-center hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                                    {booking.vehicle?.title || 'Premium Vehicle'}
                                                </h3>
                                                {booking.isMock && (
                                                    <span className="text-[10px] uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Demo</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-textSecondary flex items-center gap-2">
                                                {new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                                {new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6 md:mt-0 flex flex-col items-end gap-3">
                                        <div className="text-2xl font-bold text-white flex items-center justify-end gap-1">
                                            <IndianRupee className="w-5 h-5 text-primary" />
                                            {Number(booking.finalAmount || booking.totalPrice).toLocaleString('en-IN')}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {(booking.status === 'approved' || (booking.isMock && booking.status === 'approved')) && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setIsPaymentOpen(true);
                                                    }}
                                                    className="flex items-center gap-2 bg-primary text-background px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                                                >
                                                    <CreditCard className="w-3.5 h-3.5" />
                                                    Pay Now
                                                </button>
                                            )}
                                            <span className={`px-4 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5 ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                    booking.status === 'approved' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                        booking.status === 'pending_approval' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                            booking.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                                'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                                }`}>
                                                {booking.status === 'pending_approval' && <Clock className="w-3 h-3" />}
                                                {booking.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                                {booking.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                {booking.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedBooking && (
                <PaymentModal
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    amount={selectedBooking.finalAmount || selectedBooking.totalPrice}
                    vehicleId={selectedBooking.vehicle?._id}
                    bookingId={selectedBooking._id}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default DashboardPage;

