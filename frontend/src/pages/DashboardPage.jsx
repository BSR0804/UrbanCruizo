import { useState, useEffect } from 'react';
import axios from '../utils/api';

const DashboardPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('/bookings/mybookings');
                setBookings(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <div className="text-center py-20 text-primary">Loading Dashboard...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif text-primary mb-8">My Dashboard</h1>

            <div className="bg-surface rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-textPrimary">Booking History</h2>
                </div>

                {bookings.length === 0 ? (
                    <div className="p-6 text-textSecondary">You have no bookings yet.</div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="p-6 flex flex-col md:flex-row justify-between items-center hover:bg-white/5 transition">
                                <div>
                                    <h3 className="text-lg font-bold text-primary mb-1">{booking.caravan?.title || 'Caravan Removed'}</h3>
                                    <p className="text-sm text-textSecondary">
                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0 text-right">
                                    <div className="text-xl font-bold text-textPrimary">${booking.totalPrice}</div>
                                    <span className={`inline-block px-3 py-1 text-xs rounded mt-2 ${booking.status === 'confirmed' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
