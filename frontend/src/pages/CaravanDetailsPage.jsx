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
    Droplets,
    Building2,
    Phone,
    Navigation,
    AlertCircle
} from 'lucide-react';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MOCK_CARAVANS } from '../data/staticData';
import PaymentModal from '../components/PaymentModal';
import BookingFormModal from '../components/BookingFormModal';
import toast from 'react-hot-toast';

const CaravanDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Initialize with mock data for instant load
    const [caravan, setCaravan] = useState(() => MOCK_CARAVANS.find(c => c._id === id));
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Only show full-page loading if we don't even have mock data
    const [loading, setLoading] = useState(!caravan);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [bookingData, setBookingData] = useState(null);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchCaravanDetails = async () => {
            try {
                const { data } = await axios.get(`caravans/${id}`);
                if (data) {
                    setCaravan(data);
                }
                setLoading(false);
            } catch (err) {
                console.error('API fetch failed, falling back to existing data:', err);
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

        if (nights !== 3) {
            toast.error('This curated experience is designed as a strict 3-day package. Please select exactly 3 days.');
            return;
        }

        const basePrice = (caravan.packagePrice || caravan.pricePerDay);
        setTotalAmount(basePrice);
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        const basePrice = (caravan.packagePrice || caravan.pricePerDay);
        const guests = formData.guests || 1;
        const newTotal = (basePrice * guests); // Service fee is now "Included" in the premium UI
        setTotalAmount(newTotal);
        setBookingData(formData);
        setIsFormModalOpen(false);
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

    const getOrganizerInfo = () => {
        if (caravan.organizer) return caravan.organizer;

        const city = caravan.city || caravan.location || '';
        const lower = city.toLowerCase();

        if (lower.includes('jaipur') || lower.includes('rajasthan')) {
            return {
                name: 'UrbanCruizo Luxury Travels',
                phone: '+91 91234 56789',
                address: 'Palace Road, Near City Palace, Jaipur, Rajasthan 302002'
            };
        }

        if (lower.includes('mumbai') || lower.includes('maharashtra')) {
            return {
                name: 'UrbanCruizo Luxury Travels',
                phone: '+91 99887 76655',
                address: 'Hiranandani Gardens, Powai, Mumbai, MH 400076'
            };
        }

        // Default to Kolkata for legacy reasons or unidentified cities
        return {
            name: 'UrbanCruizo Luxury Travels',
            phone: '+91 98765 43210',
            address: '12/A, Park Street, Kolkata, WB 700016'
        };
    };

    const organizer = getOrganizerInfo();

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

                        {/* Organising Organisation Card */}
                        <div className="bg-surface p-8 rounded-3xl border border-gray-800 mt-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Building2 className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Organising Organisation
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <h4 className="text-white font-serif text-2xl font-bold">{organizer.name}</h4>
                                    <p className="text-textSecondary text-xs uppercase tracking-widest font-medium">Official Premium Experience Partner</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center gap-4 bg-background/30 p-4 rounded-2xl border border-gray-800/50">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-textSecondary uppercase tracking-widest">Contact Number</span>
                                            <span className="text-white font-medium">{organizer.phone}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-background/30 p-4 rounded-2xl border border-gray-800/50">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-textSecondary uppercase tracking-widest">Office Address</span>
                                            <span className="text-white font-medium">{organizer.address}</span>
                                        </div>
                                    </div>
                                </div>
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
                            <div className="bg-surface/30 p-8 rounded-3xl border border-primary/10 backdrop-blur-sm mb-8">
                                <p className="text-textSecondary leading-relaxed text-lg italic">
                                    "{caravan.description}"
                                </p>
                            </div>

                            {/* Detailed Attraction Sections */}
                            <div className="space-y-8">
                                {caravan.description1 && (
                                    <div className="bg-surface/30 p-8 rounded-3xl border border-primary/10 backdrop-blur-sm">
                                        <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-3">The Experience</h4>
                                        <p className="text-textPrimary leading-relaxed italic">"{caravan.description1}"</p>
                                    </div>
                                )}

                                {caravan.description2 && (
                                    <div className="bg-surface/30 p-8 rounded-3xl border border-primary/10 backdrop-blur-sm">
                                        <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-3">Inside the Journey</h4>
                                        <p className="text-textPrimary leading-relaxed">
                                            {caravan.description2}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Card */}
                        <div className="bg-surface border border-primary/20 p-8 rounded-3xl relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-textSecondary text-sm mb-1 uppercase tracking-widest">Total Package Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-white">₹{(caravan.packagePrice || caravan.pricePerDay)?.toLocaleString('en-IN')}</span>
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
                                        <span className="text-white font-bold">₹{(499)?.toLocaleString('en-IN')} (Included)</span>
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
                        {/* Map Section */}
                        <div className="bg-surface p-8 rounded-3xl border border-gray-800 shadow-xl overflow-hidden mt-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                Organizer Location
                            </h3>
                            <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-800 shadow-lg relative group">
                                <iframe
                                    title="Organizer Location"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(organizer.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    className="w-full h-full"
                                    style={{ filter: 'grayscale(1) contrast(1.2) invert(0.9) hue-rotate(180deg) brightness(0.8)' }}
                                ></iframe>
                            </div>
                            <div className="mt-6 space-y-3">
                                <div className="flex items-start gap-3 text-textSecondary text-sm">
                                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                    <span className="leading-relaxed">{organizer.address}</span>
                                </div>
                                <button className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors">
                                    <Navigation className="w-3 h-3" />
                                    Get Directions on Google Maps
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                packageName={caravan.title}
                price={totalAmount}
                isPackage={true}
            />

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

