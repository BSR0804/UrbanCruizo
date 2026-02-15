import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { useCity } from '../context/CityContext';

const VehicleListingPage = () => {
    const { city } = useCity();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!city) {
            // Optional: Redirect to home if no city selected, or just show all (but backend filters by city usually)
            // For now, let's allow "All" if empty, but UI suggests city specific.
        }

        const fetchVehicles = async () => {
            try {
                const params = new URLSearchParams();
                if (city) params.append('city', city);
                if (keyword) params.append('keyword', keyword);
                if (type && type !== 'all') params.append('type', type);
                if (category && category !== 'all') params.append('category', category);
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);

                const { data } = await axios.get(`/vehicles?${params.toString()}`);
                setVehicles(data.vehicles);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchVehicles();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [city, keyword, type, category, minPrice, maxPrice]);

    if (loading) return <div className="text-center py-20 text-primary">Loading Fleet in {city}...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-serif text-primary">
                    Available in <span className="text-white">{city || 'All Cities'}</span>
                </h1>
                <Link to="/" className="text-sm text-textSecondary hover:text-primary">Change City</Link>
            </div>

            {/* Filters */}
            <div className="bg-surface p-6 rounded-lg shadow mb-12 border border-gray-800">
                <div className="grid md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search brand, model..."
                        className="input-field"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <select
                        className="input-field"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="all">All Vehicle Types</option>
                        <option value="car">Cars</option>
                        <option value="bike">Bikes</option>
                        <option value="caravan">Caravans</option>
                    </select>
                    <select
                        className="input-field"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="luxury">Luxury</option>
                        <option value="commuter">Commuter Bike</option>
                        <option value="royal-enfield">Royal Enfield</option>
                    </select>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min $"
                            className="input-field"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max $"
                            className="input-field"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {vehicles.length === 0 ? (
                <div className="text-center text-textSecondary text-xl py-20">
                    <p>No vehicles found in {city}.</p>
                    <Link to="/" className="text-primary hover:underline mt-4 inline-block">Try another city</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle._id}
                            className="bg-surface rounded-lg overflow-hidden shadow-lg hover:shadow-primary/20 transition duration-300 flex flex-col group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={vehicle.images?.[0] || 'https://via.placeholder.com/400x300?text=Vehicle'}
                                    alt={vehicle.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white uppercase font-bold">
                                    {vehicle.category}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold font-serif text-textPrimary">
                                        {vehicle.title}
                                    </h3>
                                    <div className="text-right">
                                        <div className="text-primary font-bold text-lg">₹{vehicle.pricePerDay}<span className="text-xs text-gray-400">/day</span></div>
                                        <div className="text-secondary font-bold text-sm">₹{vehicle.pricePerHour}<span className="text-xs text-gray-400">/hr</span></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-textSecondary mb-4">
                                    <span>⚙️ {vehicle.transmission}</span>
                                    <span>⛽ {vehicle.fuelType}</span>
                                    <span>💺 {vehicle.seats} Seats</span>
                                </div>

                                <div className="text-sm text-textSecondary mb-4">
                                    📍 {vehicle.location}
                                </div>

                                <Link
                                    to={`/vehicles/${vehicle._id}`}
                                    className="btn-outline text-center block w-full mt-auto"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VehicleListingPage;
