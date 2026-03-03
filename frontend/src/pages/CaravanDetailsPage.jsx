import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    MapPin,
    ShieldCheck,
    Wifi,
    Coffee,
    Utensils,
    Tv,
    Wind,
    Droplets
} from 'lucide-react';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MOCK_CARAVANS } from '../data/staticData';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';

const CaravanDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [caravan, setCaravan] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchCaravanDetails = async () => {
            try {
                const { data } = await axios.get(`caravans/${id}`);
                setCaravan(data);
                setLoading(false);
            } catch (err) {
                console.error('API fetch failed, trying mock data:', err);
                const mockCaravan = MOCK_CARAVANS.find(c => c._id === id);
                if (mockCaravan) {
                    setCaravan(mockCaravan);
                }
                setLoading(false);
            }
        };
        fetchCaravanDetails();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!startDate || !endDate) {
            toast.error('Please select dates');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            toast.error('Invalid dates');
            return;
        }

        const amount = (caravan.packagePrice || caravan.pricePerDay) + 499; // 499 service fee
        setTotalAmount(amount);
        setIsPaymentModalOpen(true);
    };

    const confirmBookingAfterPayment = async () => {
        try {
            await axios.post('bookings', {
                caravanId: id,
                startDate,
                endDate
            });
            toast.success('Payment Received! Adventure details sent to dashboard.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking Failed');
        }
    };

    const nextImage = () => {
        if (!caravan?.images?.length) return;
        setCurrentImageIndex((prev) => (prev + 1) % caravan.images.length);
    };

    const prevImage = () => {
        if (!caravan?.images?.length) return;
        setCurrentImageIndex((prev) => (prev - 1 + caravan.images.length) % caravan.images.length);
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!caravan) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
            <div className="bg-surface p-12 rounded-3xl border border-gray-800 shadow-2xl">
                <h1 className="text-4xl font-serif text-red-500 mb-4">Package Not Found</h1>
                <p className="text-textSecondary mb-8">The tour package you are looking for might have been moved or removed.</p>
                <Link to="/caravans" className="btn-primary px-8 py-3">
                    Back to Packages
                </Link>
            </div>
        </div>
    );

    const images = caravan.images?.length > 0 ? caravan.images : ['https://via.placeholder.com/800x600?text=Luxury+Caravan'];

    const getAmenityIcon = (amenity) => {
        const lower = amenity.toLowerCase();
        if (lower.includes('wifi')) return Wifi;
        if (lower.includes('kitchen') || lower.includes('utensils')) return Utensils;
        if (lower.includes('ac') || lower.includes('conditioning')) return Wind;
        if (lower.includes('bathroom') || lower.includes('water')) return Droplets;
        if (lower.includes('tv') || lower.includes('entertainment')) return Tv;
        if (lower.includes('coffee')) return Coffee;
        return ShieldCheck;
    };

    return (
        <div className="min-h-screen bg-background text-textPrimary py-12">
            <div className="container mx-auto px-6">
                <Link to="/caravans" className="inline-flex items-center gap-2 text-textSecondary hover:text-primary mb-8 transition-colors group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Packages
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Left: Image Carousel */}
                    <div className="space-y-6">
                        <div className="relative group aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={images[currentImageIndex]}
                                    alt={caravan.title}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-background">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-background">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                        {images.map((_, idx) => (
                                            <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary w-6' : 'bg-white/50'}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-800 opacity-60 hover:opacity-100'}`}>
                                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Amenities Card */}
                        <div className="bg-surface p-8 rounded-3xl border border-gray-800 mt-8">
                            <h3 className="text-2xl font-serif font-bold text-white mb-6">Package Highlights</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {caravan.amenities.map((amenity, index) => {
                                    const Icon = getAmenityIcon(amenity);
                                    return (
                                        <div key={index} className="flex items-center gap-3 bg-background/50 p-4 rounded-2xl border border-gray-800">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm text-textPrimary font-medium">{amenity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details & Booking */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-primary mb-2 uppercase tracking-widest text-xs font-bold">
                                <span>{caravan.duration || 'Per Package'}</span>
                                <span className="w-1 h-1 bg-primary rounded-full" />
                                <span>Available Now</span>
                            </div>
                            <h1 className="text-5xl font-serif font-bold text-white mb-4">{caravan.title}</h1>
                            <p className="text-textSecondary leading-relaxed text-lg">
                                {caravan.description}
                            </p>
                        </div>

                        {/* Price Card */}
                        <div className="bg-surface border border-primary/20 p-8 rounded-3xl relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-textSecondary text-sm mb-1 uppercase tracking-widest">Total Package Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-white">₹{caravan.packagePrice || caravan.pricePerDay}</span>
                                    <span className="text-textSecondary text-xl italic">({caravan.duration || 'Full Experience'})</span>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        </div>

                        {/* Booking Form */}
                        <div className="bg-surface p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" /> Book This Experience
                            </h3>

                            {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{error}</div>}

                            <form onSubmit={handleBooking} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-textSecondary mb-2 uppercase tracking-widest">Check-in</label>
                                        <input
                                            type="date"
                                            className="input-field h-12 text-sm"
                                            value={startDate}
                                            min={today}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-textSecondary mb-2 uppercase tracking-widest">Check-out</label>
                                        <input
                                            type="date"
                                            className="input-field h-12 text-sm"
                                            value={endDate}
                                            min={startDate || today}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex justify-between items-center mb-6 px-2">
                                        <span className="text-textSecondary">Service Fee</span>
                                        <span className="text-white font-bold">₹499 (Included)</span>
                                    </div>
                                    <button className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-3 group">
                                        Confirm Your Experience
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                            {!user && <p className="text-xs text-center text-red-500 font-bold">Please login to continue with your booking.</p>}
                        </div>

                        {/* Trust Badges */}
                        <div className="flex justify-between items-center px-4 py-6 border-t border-gray-800">
                            <div className="flex flex-col items-center gap-1">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                <span className="text-[10px] text-textSecondary uppercase">Secured</span>
                            </div>
                            <div className="w-px h-8 bg-gray-800" />
                            <div className="flex flex-col items-center gap-1">
                                <Wind className="w-6 h-6 text-primary" />
                                <span className="text-[10px] text-textSecondary uppercase">Safe Travel</span>
                            </div>
                            <div className="w-px h-8 bg-gray-800" />
                            <div className="flex flex-col items-center gap-1">
                                <Droplets className="w-6 h-6 text-primary" />
                                <span className="text-[10px] text-textSecondary uppercase">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={totalAmount}
                onPaymentSuccess={confirmBookingAfterPayment}
            />
        </div>
    );
};

export default CaravanDetailsPage;

