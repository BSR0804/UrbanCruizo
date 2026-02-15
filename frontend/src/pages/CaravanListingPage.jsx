import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';

const CaravanListingPage = () => {
    const [caravans, setCaravans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const fetchCaravans = async () => {
            try {
                // The backend controller for getCaravans accepts a keyword query parameter
                const { data } = await axios.get(`/caravans?keyword=${keyword}`);
                setCaravans(data.caravans);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchCaravans();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [keyword]); // Refetch when keyword changes

    if (loading) return <div className="text-center py-20 text-primary">Loading Fleet...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-serif text-center mb-8 text-primary">Our Luxury Fleet</h1>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="input-field"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {caravans.length === 0 ? (
                <div className="text-center text-textSecondary text-xl">No caravans found matching your search.</div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {caravans.map((caravan) => (
                        <div key={caravan._id} className="bg-surface rounded-lg overflow-hidden shadow-lg hover:shadow-primary/20 transition duration-300 flex flex-col">
                            <img
                                src={caravan.images[0] || 'https://via.placeholder.com/400x300?text=Caravan'}
                                alt={caravan.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold font-serif text-textPrimary">{caravan.title}</h3>
                                    <span className="text-primary font-bold">${caravan.pricePerDay}/day</span>
                                </div>
                                <p className="text-textSecondary mb-4 flex-1">{caravan.description.substring(0, 100)}...</p>
                                <div className="text-sm text-textSecondary mb-4">
                                    📍 {caravan.location}
                                </div>
                                <Link to={`/caravans/${caravan._id}`} className="btn-outline text-center block w-full mt-auto">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CaravanListingPage;

