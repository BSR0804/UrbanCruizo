import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CaravanDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [caravan, setCaravan] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCaravanDetails = async () => {
            try {
                const { data } = await axios.get(`/caravans/${id}`);
                setCaravan(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
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

        try {
            await axios.post('/bookings', {
                caravanId: id,
                startDate,
                endDate
            });
            navigate('/dashboard'); // or success page
        } catch (err) {
            setError(err.response?.data?.message || 'Booking Failed');
        }
    };

    if (loading) return <div className="text-center py-20 text-primary">Loading Details...</div>;
    if (!caravan) return <div className="text-center py-20 text-red-500">Caravan not found</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <img
                        src={caravan.images[0] || 'https://via.placeholder.com/800x600?text=Luxury+Caravan'}
                        alt={caravan.title}
                        className="w-full h-96 object-cover rounded-lg shadow-2xl mb-8"
                    />
                    {/* Gallery placeholder */}
                    <div className="grid grid-cols-4 gap-4">
                        {caravan.images.slice(1).map((img, index) => (
                            <img key={index} src={img} className="rounded cursor-pointer hover:opacity-80" />
                        ))}
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary mb-4">{caravan.title}</h1>
                    <p className="text-2xl text-textPrimary mb-6">${caravan.pricePerDay} <span className="text-base text-textSecondary">/ night</span></p>

                    <div className="bg-surface p-6 rounded-lg mb-8">
                        <h3 className="text-lg font-bold mb-4 text-textPrimary">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                            {caravan.amenities.map((amenity, index) => (
                                <span key={index} className="bg-background border border-secondary/30 px-3 py-1 rounded text-sm text-secondary">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-textSecondary mb-8 leading-relaxed">
                        {caravan.description}
                    </p>

                    <div className="bg-surface border border-secondary/20 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-serif mb-4 text-primary">Book Your Journey</h3>
                        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
                        <form onSubmit={handleBooking} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-textSecondary mb-1">Check-in</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-textSecondary mb-1">Check-out</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button className="w-full btn-primary py-3 mt-4">
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaravanDetailsPage;
