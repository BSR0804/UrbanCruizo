import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';
import { MOCK_CARAVANS } from '../data/staticData';

const CaravanListingPage = () => {
    const [caravans, setCaravans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const fetchCaravans = async () => {
            try {
                // The backend controller for getCaravans accepts a keyword query parameter
                const { data } = await axios.get(`/caravans?keyword=${keyword}`);
                if (data.caravans && data.caravans.length > 0) {
                    setCaravans(data.caravans);
                } else {
                    // If backend is empty or doesn't match new concept, use refined mock data
                    const filteredPackages = keyword
                        ? MOCK_CARAVANS.filter(pkg =>
                            pkg.title.toLowerCase().includes(keyword.toLowerCase()) ||
                            pkg.description.toLowerCase().includes(keyword.toLowerCase())
                        )
                        : MOCK_CARAVANS;
                    setCaravans(filteredPackages);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                // Fallback to mock data
                const filteredCaravans = keyword
                    ? MOCK_CARAVANS.filter(caravan =>
                        caravan.title.toLowerCase().includes(keyword.toLowerCase()) ||
                        caravan.description.toLowerCase().includes(keyword.toLowerCase())
                    )
                    : MOCK_CARAVANS;
                setCaravans(filteredCaravans);
                setLoading(false);
            }
        };
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchCaravans();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [keyword]); // Refetch when keyword changes

    if (loading) return <div className="text-center py-20 text-primary">Exploring Packages...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-serif text-center mb-8 text-primary">Premium Tour Packages</h1>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
                <input
                    type="text"
                    placeholder="Search packages..."
                    className="input-field"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {caravans.length === 0 ? (
                <div className="text-center text-textSecondary text-xl">No packages found matching your search.</div>
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
                                    <h3 className="text-xl font-bold font-serif text-textPrimary leading-tight">{caravan.title}</h3>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <div className="text-primary font-bold text-lg">₹{caravan.packagePrice || caravan.pricePerDay}</div>
                                        <div className="text-[10px] text-textSecondary uppercase tracking-tighter whitespace-nowrap">{caravan.duration || 'Per Package'}</div>
                                    </div>
                                </div>
                                <p className="text-textSecondary mb-4 flex-1">{caravan.description.substring(0, 100)}...</p>
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

