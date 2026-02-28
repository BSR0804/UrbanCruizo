import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    ShieldCheck,
    Info,
    Fuel,
    Settings2,
    Users,
    Gauge,
    IndianRupee,
    Zap,
    Smartphone,
    Wind,
    Wrench,
    Bluetooth
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MOCK_VEHICLES } from '../data/staticData';
import PaymentModal from '../components/PaymentModal';

const VehicleDetailsPage = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('18:00');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [rentalType, setRentalType] = useState('Daily');
    const [priceBreakdown, setPriceBreakdown] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await axios.get(`vehicles/${id}`);
                setVehicle(data);
                setLoading(false);
            } catch (error) {
                console.error('API fetch failed, trying mock data:', error);
                // Fallback to mock data if API fails or returns 404
                const mockVehicle = MOCK_VEHICLES.find(v => v._id === id);
                if (mockVehicle) {
                    setVehicle(mockVehicle);
                }
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    useEffect(() => {
        if (!vehicle || !startDate || !endDate) {
            setPriceBreakdown(null);
            return;
        }

        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        const diffMs = end - start;

        if (diffMs <= 0) {
            setPriceBreakdown(null);
            return;
        }

        let baseFare = 0;

        if (rentalType === 'Hourly') {
            const hours = Math.ceil(diffMs / (1000 * 60 * 60));
            baseFare = hours * (vehicle.pricePerHour || 0);
        } else {
            const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            baseFare = days * (vehicle.pricePerDay || 0);
        }

        if (baseFare > 0) {
            const gst = baseFare * 0.18;
            const deposit = vehicle.securityDeposit || 0;
            const total = baseFare + gst + deposit;
            setPriceBreakdown({ baseFare, gst, deposit, total });
        } else {
            setPriceBreakdown(null);
        }
    }, [startDate, endDate, startTime, endTime, rentalType, vehicle]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to book a vehicle');
            navigate('/login');
            return;
        }

        if (priceBreakdown?.total <= 0 || !priceBreakdown) {
            toast.error('Please select valid duration');
            return;
        }

        setIsPaymentModalOpen(true);
    };

    const confirmBookingAfterPayment = async () => {
        try {
            setBookingLoading(true);
            await axios.post('bookings', {
                vehicleId: id,
                startDate: `${startDate}T${startTime}`,
                endDate: `${endDate}T${endTime}`,
                rentalType
            });
            toast.success('Payment Received! Booking confirmed.', { duration: 5000 });
            navigate('/dashboard');
        } catch (error) {
            console.error('Booking confirmation error:', error);
            // Special handling for Mock Vehicles: if payment succeeded but saving to DB failed
            // because of ID issues, we still show success to the user.
            if (id.length < 10 || error.response?.status === 400 || error.response?.status === 404) {
                // Save locally for demo
                const mockBooking = {
                    _id: `mock_b_${Date.now()}`,
                    vehicle: { title: vehicle.title, brand: vehicle.brand, model: vehicle.model },
                    startDate: `${startDate}T${startTime}`,
                    endDate: `${endDate}T${endTime}`,
                    totalPrice: priceBreakdown?.total || 0,
                    status: 'confirmed',
                    isMock: true
                };
                const existing = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
                localStorage.setItem('mock_bookings', JSON.stringify([mockBooking, ...existing]));

                toast.success('Payment Received! (Demo Mode: Booking logged locally)', { duration: 5000 });
                navigate('/dashboard');
            } else {
                toast.error(error.response?.data?.message || 'Booking failed to sync. Please contact support.');
            }
        } finally {
            setBookingLoading(false);
        }
    };

    const nextImage = () => {
        if (!vehicle?.images?.length) return;
        setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    };

    const prevImage = () => {
        if (!vehicle?.images?.length) return;
        setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!vehicle) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
            <div className="bg-surface p-12 rounded-3xl border border-gray-800 shadow-2xl">
                <h1 className="text-4xl font-serif text-red-500 mb-4">Vehicle Not Found</h1>
                <p className="text-textSecondary mb-8">The vehicle you are looking for might have been moved or removed.</p>
                <Link to="/vehicles" className="btn-primary px-8 py-3">
                    Back to Fleet
                </Link>
            </div>
        </div>
    );

    const images = vehicle.images?.length > 0 ? vehicle.images : ['https://via.placeholder.com/800x600?text=Premium+Vehicle'];

    return (
        <div className="min-h-screen bg-background text-textPrimary py-12">
            <div className="container mx-auto px-6">
                <Link to="/vehicles" className="inline-flex items-center gap-2 text-textSecondary hover:text-primary mb-8 transition-colors group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Fleet
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Left: Image Carousel Section */}
                    <div className="space-y-6">
                        <div className="relative group aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={images[currentImageIndex]}
                                    alt={`${vehicle.title} - view ${currentImageIndex + 1}`}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Carousel Controls */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-background"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-background"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>

                                    {/* Dots */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary w-6' : 'bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-800 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="bg-surface p-8 rounded-3xl border border-gray-800 mt-8 shadow-inner">
                            <h3 className="text-2xl font-serif font-bold text-white mb-4">Inside the Experience</h3>
                            <p className="text-textSecondary leading-relaxed mb-4">
                                This premium {vehicle.brand} {vehicle.model} embodies ultimate refinement and performance. Meticulously maintained to the highest standards, it offers an unparalleled driving experience for both city commutes and scenic long-drives across {vehicle.city}.
                            </p>
                            <p className="text-textSecondary leading-relaxed mb-8">
                                Designed with the modern traveler in mind, this {vehicle.year} edition features advanced safety systems, intuitive controls, and a suite of smart connectivity options. Whether you're heading for a business meeting or a weekend getaway, expect nothing less than absolute comfort and reliability.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 group">
                                        <div className="p-2 rounded-xl bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-background transition-colors duration-300">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-textPrimary font-medium">Fully Insured</span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-background transition-colors duration-300">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-textPrimary font-medium">GPS Tracking</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 group">
                                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-background transition-colors duration-300">
                                            <Smartphone className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-textPrimary font-medium">USB Charging</span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-background transition-colors duration-300">
                                            <Bluetooth className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-textPrimary font-medium">Bluetooth</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 group">
                                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-background transition-colors duration-300">
                                            <Wind className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-textPrimary font-medium">Climate Ctrl</span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="p-2 rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-background transition-colors duration-300">
                                            <Wrench className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-textPrimary font-medium">24/7 Road Aid</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details & Booking Section */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-primary mb-2 uppercase tracking-widest text-xs font-bold">
                                <span>{vehicle.brand}</span>
                                <span className="w-1 h-1 bg-primary rounded-full" />
                                <span>{vehicle.category}</span>
                            </div>
                            <h1 className="text-5xl font-serif font-bold text-white mb-4">{vehicle.title}</h1>
                            <div className="flex items-center gap-4">
                                <span className="bg-primary px-4 py-1 rounded-full text-background font-bold text-sm">Top Rated</span>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <span className="font-bold">★ {vehicle.rating || '4.5'}</span>
                                    <span className="text-textSecondary text-xs">(128 reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Fuel, label: 'Fuel', value: vehicle.fuelType },
                                { icon: Settings2, label: 'Transmission', value: vehicle.transmission },
                                { icon: Users, label: 'Capacity', value: `${vehicle.seats} Seats` },
                                { icon: Gauge, label: 'Mileage', value: `${vehicle.mileage || '22.3'} km/ltr` }
                            ].map((spec, i) => (
                                <div key={i} className="bg-surface/50 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                        <spec.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-textSecondary">{spec.label}</p>
                                        <p className="font-bold text-white">{spec.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Display */}
                        <div className="bg-surface border border-primary/20 p-8 rounded-3xl relative overflow-hidden">
                            <div className="relative z-10 flex justify-between items-end">
                                <div>
                                    <p className="text-textSecondary text-sm mb-1 uppercase tracking-widest">Pricing starts from</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-white">₹{vehicle.pricePerDay}</span>
                                        <span className="text-textSecondary">/day</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-primary font-bold">₹{vehicle.pricePerHour}/hr</p>
                                    <p className="text-[10px] text-textSecondary uppercase">Hourly Rate</p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        </div>

                        {/* Booking Form */}
                        <form onSubmit={handleBooking} className="bg-surface p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" /> Select Trip Dates
                            </h3>

                            <div className="flex bg-background p-1 rounded-xl gap-1">
                                <button
                                    type="button"
                                    onClick={() => setRentalType('Daily')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${rentalType === 'Daily' ? 'bg-primary text-background' : 'text-textSecondary hover:text-white'}`}
                                >
                                    Daily
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRentalType('Hourly')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${rentalType === 'Hourly' ? 'bg-primary text-background' : 'text-textSecondary hover:text-white'}`}
                                >
                                    Hourly
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-textSecondary mb-2 uppercase tracking-widest">Start Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                                            <input
                                                type="date"
                                                className="input-field pl-10 h-12 text-sm"
                                                value={startDate}
                                                min={today}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {rentalType === 'Hourly' && (
                                        <div>
                                            <label className="block text-xs text-textSecondary mb-2 uppercase tracking-widest">Start Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                                                <input
                                                    type="time"
                                                    className="input-field pl-10 h-12 text-sm"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-textSecondary mb-2 uppercase tracking-widest">End Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                                            <input
                                                type="date"
                                                className="input-field pl-10 h-12 text-sm"
                                                value={endDate}
                                                min={startDate || today}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {rentalType === 'Hourly' && (
                                        <div>
                                            <label className="block text-xs text-textSecondary mb-2 uppercase tracking-widest">End Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                                                <input
                                                    type="time"
                                                    className="input-field pl-10 h-12 text-sm"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {priceBreakdown ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3 bg-background/50 p-6 rounded-2xl border border-dashed border-gray-700"
                                >
                                    <div className="flex justify-between text-sm">
                                        <span className="text-textSecondary">Base Fare</span>
                                        <span className="text-white font-bold">₹{priceBreakdown.baseFare}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-textSecondary">GST (18%)</span>
                                        <span className="text-white font-bold">₹{priceBreakdown.gst.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-textSecondary">Security Deposit</span>
                                        <span className="text-white font-bold">₹{priceBreakdown.deposit}</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
                                        <span className="text-white font-bold">Total Amount</span>
                                        <span className="text-2xl font-bold text-primary">₹{priceBreakdown.total.toFixed(0)}</span>
                                    </div>
                                </motion.div>
                            ) : startDate && endDate ? (
                                <p className="text-xs text-center text-red-400">Please select valid dates.</p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={bookingLoading}
                                className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50 group"
                            >
                                {bookingLoading ? (
                                    <Clock className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Reserve Now
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            {!user && <p className="text-xs text-center text-red-500 font-bold">Login required to book.</p>}
                        </form>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={priceBreakdown?.total || 0}
                vehicleId={id}
                onPaymentSuccess={confirmBookingAfterPayment}
            />
        </div>
    );
};

export default VehicleDetailsPage;

