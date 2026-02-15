import { useState, useEffect } from 'react';
import axios from '../utils/api';
import toast from 'react-hot-toast';

const AdminPage = () => {
    const [bookings, setBookings] = useState([]);
    const [caravans, setCaravans] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pricePerDay: '',
        amenities: '',
        images: '', // Comma separated for simplicity, or ideally separate inputs
        location: '',
    });

    const fetchData = async () => {
        try {
            const bookingsRes = await axios.get('/bookings');
            const caravansRes = await axios.get('/caravans');
            setBookings(bookingsRes.data);
            setCaravans(caravansRes.data.caravans);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteCaravan = async (id) => {
        if (window.confirm('Are you sure you want to delete this caravan?')) {
            try {
                await axios.delete(`/caravans/${id}`);
                toast.success('Caravan deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete caravan');
            }
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const amenitiesArray = formData.amenities.split(',').map((item) => item.trim());
            const imagesArray = formData.images.split(',').map((item) => item.trim());

            await axios.post('/caravans', {
                ...formData,
                amenities: amenitiesArray,
                images: imagesArray,
            });

            toast.success('Caravan added successfully');
            setShowAddModal(false);
            setFormData({
                title: '',
                description: '',
                pricePerDay: '',
                amenities: '',
                images: '',
                location: '',
            });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add caravan');
        }
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
                                        {booking.caravan?.title || 'Unknown Caravan'}
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

                {/* Caravans Section */}
                <div className="bg-surface rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-textPrimary mb-4 border-b border-gray-700 pb-2">
                        Manage Caravans
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary w-full mb-4 py-2 text-sm"
                    >
                        Add New Caravan
                    </button>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {caravans.map((caravan) => (
                            <div
                                key={caravan._id}
                                className="flex justify-between items-center bg-background p-4 rounded border border-gray-800"
                            >
                                <div>
                                    <div className="font-bold text-textPrimary">
                                        {caravan.title}
                                    </div>
                                    <div className="text-sm text-primary">
                                        ${caravan.pricePerDay}/day
                                    </div>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleDeleteCaravan(caravan._id)}
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
                    <div className="bg-surface p-8 rounded-lg w-full max-w-lg border border-secondary/20 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-serif text-primary mb-6">
                            Add New Caravan
                        </h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                className="input-field"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                required
                            />
                            <textarea
                                placeholder="Description"
                                className="input-field h-24"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Price Per Day"
                                    className="input-field"
                                    value={formData.pricePerDay}
                                    onChange={(e) =>
                                        setFormData({ ...formData, pricePerDay: e.target.value })
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="input-field"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({ ...formData, location: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Amenities (comma separated)"
                                className="input-field"
                                value={formData.amenities}
                                onChange={(e) =>
                                    setFormData({ ...formData, amenities: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                placeholder="Image URLs (comma separated)"
                                className="input-field"
                                value={formData.images}
                                onChange={(e) =>
                                    setFormData({ ...formData, images: e.target.value })
                                }
                            />
                            <div className="flex gap-4 mt-6">
                                <button type="submit" className="btn-primary w-full">
                                    Save Caravan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="btn-outline w-full"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;

