import { useState, useEffect } from 'react';
import axios from '../utils/api';
import toast from 'react-hot-toast';

const AdminPage = () => {
    const [bookings, setBookings] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: 'Standard vehicle description',
        pricePerDay: '',
        type: 'car',
        category: 'normal',
        brand: '',
        model: '',
        year: '',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seats: '',
        images: '',
        location: '',
        amenities: '', // Keeping for backward compat or if we add it back to schema optionally
    });

    const fetchData = async () => {
        try {
            const bookingsRes = await axios.get('/bookings');
            const vehiclesRes = await axios.get('/vehicles?limit=1000'); // Get all for admin
            setBookings(bookingsRes.data);
            setVehicles(vehiclesRes.data.vehicles);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteVehicle = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await axios.delete(`/vehicles/${id}`);
                toast.success('Vehicle deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete vehicle');
            }
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const imagesArray = formData.images.split(',').map((item) => item.trim());

            await axios.post('/vehicles', {
                ...formData,
                images: imagesArray,
            });

            toast.success('Vehicle added successfully');
            setShowAddModal(false);
            // Reset Form
            setFormData({
                title: '',
                description: 'Standard vehicle description',
                pricePerDay: '',
                type: 'car',
                category: 'normal',
                brand: '',
                model: '',
                year: '',
                transmission: 'Automatic',
                fuelType: 'Petrol',
                seats: '',
                images: '',
                location: '',
                amenities: ''
            });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add vehicle');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto px-4 py-12 relative">
            <h1 className="text-3xl font-serif text-primary mb-8">Admin Dashboard</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Bookings Section */}
                <div className="bg-surface rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-textPrimary mb-4 border-b border-gray-700 pb-2">
                        All Bookings
                    </h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {bookings.length === 0 ? (
                            <p className="text-textSecondary">No bookings found.</p>
                        ) : (
                            bookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="bg-background p-4 rounded border border-gray-800"
                                >
                                    <div className="font-bold text-primary">
                                        {booking.vehicle?.title || 'Unknown Vehicle'}
                                    </div>
                                    <div className="text-sm text-textSecondary">
                                        User: {booking.user?.name || 'Unknown User'}
                                    </div>
                                    <div className="text-sm text-textSecondary">
                                        {new Date(booking.startDate).toLocaleDateString()} -{' '}
                                        {new Date(booking.endDate).toLocaleDateString()}
                                    </div>
                                    <div className="mt-2 text-right font-bold text-white">
                                        ${booking.totalPrice}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Vehicles Section */}
                <div className="bg-surface rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-textPrimary mb-4 border-b border-gray-700 pb-2">
                        Manage Fleet
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary w-full mb-4 py-2 text-sm"
                    >
                        Add New Vehicle
                    </button>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle._id}
                                className="flex justify-between items-center bg-background p-4 rounded border border-gray-800"
                            >
                                <div>
                                    <div className="font-bold text-textPrimary">
                                        {vehicle.title}
                                    </div>
                                    <div className="text-sm text-primary">
                                        ${vehicle.pricePerDay}/day
                                    </div>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleDeleteVehicle(vehicle._id)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface p-8 rounded-lg w-full max-w-2xl border border-secondary/20 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-serif text-primary mb-6">
                            Add New Vehicle
                        </h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="title" placeholder="Title" className="input-field" value={formData.title} onChange={handleChange} required />
                                <input type="text" name="brand" placeholder="Brand" className="input-field" value={formData.brand} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="model" placeholder="Model" className="input-field" value={formData.model} onChange={handleChange} required />
                                <input type="number" name="year" placeholder="Year" className="input-field" value={formData.year} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <select name="type" className="input-field" value={formData.type} onChange={handleChange}>
                                    <option value="car">Car</option>
                                    <option value="bike">Bike</option>
                                    <option value="caravan">Caravan</option>
                                </select>
                                <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
                                    <option value="normal">Normal</option>
                                    <option value="luxury">Luxury</option>
                                </select>
                                <input type="number" name="pricePerDay" placeholder="Price/Day" className="input-field" value={formData.pricePerDay} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <select name="transmission" className="input-field" value={formData.transmission} onChange={handleChange}>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                                <select name="fuelType" className="input-field" value={formData.fuelType} onChange={handleChange}>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                                <input type="number" name="seats" placeholder="Seats" className="input-field" value={formData.seats} onChange={handleChange} required />
                            </div>

                            <input type="text" name="location" placeholder="Location" className="input-field" value={formData.location} onChange={handleChange} required />
                            <input type="text" name="images" placeholder="Image URLs (comma separated)" className="input-field" value={formData.images} onChange={handleChange} />

                            <div className="flex gap-4 mt-6">
                                <button type="submit" className="btn-primary w-full">Save Vehicle</button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline w-full">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
