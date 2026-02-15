import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';

const VehicleDetailsPage = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [rentalType, setRentalType] = useState('Daily');
    const [priceBreakdown, setPriceBreakdown] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await axios.get(`/vehicles/${id}`);
                setVehicle(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                toast.error('Failed to load vehicle details');
            }
        };
        fetchVehicle();
    }, [id]);

    useEffect(() => {
        if (!vehicle || !startDate || !endDate) {
            setPriceBreakdown(null);
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = Math.abs(end - start);
        let baseFare = 0;

        if (rentalType === 'Hourly') {
            // In real app, user selects Time also, keeping it simple to Date only for MVP
            // Assuming 24h for Day diff if standard date picker
            const hours = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) * 24; // Mock logic if using date picker for hourly
            baseFare = hours * vehicle.pricePerHour;
        } else {
            const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            baseFare = days * vehicle.pricePerDay;
        }

        if (baseFare > 0) {
            const gst = baseFare * 0.18;
            const deposit = vehicle.securityDeposit || 0;
            const total = baseFare + gst + deposit;
            setPriceBreakdown({ baseFare, gst, deposit, total });
        }
    }, [startDate, endDate, rentalType, vehicle]);


    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to book a vehicle');
            navigate('/login');
            return;
        }

        try {
            setBookingLoading(true);
            await axios.post('/bookings', {
                vehicleId: id,
                startDate,
                endDate,
                rentalType
            });
            toast.success('Booking confirmed! Check your dashboard.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-primary">Loading...</div>;
    if (!vehicle) return <div className="text-center py-20 text-red-500">Vehicle Not Found</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/vehicles" className="text-textSecondary hover:text-primary mb-6 inline-block">
                &larr; Back to Fleet
            </Link>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div>
                    <img
                        src={vehicle.images?.[0] || 'https://via.placeholder.com/600x400?text=Vehicle'}
                        alt={vehicle.title}
                        className="w-full rounded-lg shadow-xl mb-4"
                    />
                    <div className="grid grid-cols-4 gap-2">
                        {vehicle.images.slice(1).map((img, index) => (
                            <img key={index} src={img} alt="Vehicle view" className="rounded cursor-pointer hover:opacity-80" />
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-4xl font-serif text-primary mb-2">{vehicle.title}</h1>
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-2xl font-bold text-white">₹{vehicle.pricePerDay}<span className="text-sm font-normal text-gray-400">/day</span></div>
                        <div className="text-xl font-bold text-secondary">₹{vehicle.pricePerHour}<span className="text-sm font-normal text-gray-400">/hr</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-300 bg-surface p-4 rounded border border-gray-800">
                        <div><span className="text-gray-500">City:</span> {vehicle.city}</div>
                        <div><span className="text-gray-500">Fuel:</span> {vehicle.fuelType}</div>
                        <div><span className="text-gray-500">Seats:</span> {vehicle.seats}</div>
                        <div><span className="text-gray-500">Transmission:</span> {vehicle.transmission}</div>
                        <div><span className="text-gray-500">KM Limit:</span> {vehicle.kmsLimitPerDay}/day</div>
                        <div><span className="text-gray-500">Extra KM:</span> ₹{vehicle.extraKmCharge}/km</div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Book This Vehicle</h3>

                    <form onSubmit={handleBooking} className="space-y-4 bg-surface p-6 rounded-lg shadow-inner border border-gray-800">
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="rentalType"
                                    value="Daily"
                                    checked={rentalType === 'Daily'}
                                    onChange={(e) => setRentalType(e.target.value)}
                                />
                                <span className="text-white">Daily Rental</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="rentalType"
                                    value="Hourly"
                                    checked={rentalType === 'Hourly'}
                                    onChange={(e) => setRentalType(e.target.value)}
                                />
                                <span className="text-white">Hourly Rental</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-textSecondary mb-1 text-sm">Start Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-textSecondary mb-1 text-sm">End Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {priceBreakdown && (
                            <div className="bg-background p-4 rounded text-sm space-y-2 border border-dotted border-gray-600">
                                <div className="flex justify-between">
                                    <span>Base Fare:</span>
                                    <span>₹{priceBreakdown.baseFare}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>GST (18%):</span>
                                    <span>₹{priceBreakdown.gst.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Security Deposit:</span>
                                    <span>₹{priceBreakdown.deposit}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-primary border-t border-gray-700 pt-2 mt-2">
                                    <span>Total Payable:</span>
                                    <span>₹{priceBreakdown.total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary w-full py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={bookingLoading}
                        >
                            {bookingLoading ? 'Processing...' : `Confirm Booking (₹${priceBreakdown?.total?.toFixed(0) || '0'})`}
                        </button>
                        {!user && <p className="text-xs text-center text-red-400">You must be logged in to book.</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsPage;
