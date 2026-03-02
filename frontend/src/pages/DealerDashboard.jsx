import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Car,
    CalendarCheck,
    Wallet,
    Bell,
    Settings,
    Plus,
    TrendingUp,
    Users,
    MapPin,
    Trash2,
    Edit,
    Check,
    X,
    Eye,
    MessageSquare,
    RefreshCw,
    Lock
} from 'lucide-react';
import axios from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DealerDashboard = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [carRequests, setCarRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        businessName: user?.businessName || '',
        city: user?.city || '',
        location: user?.location || '',
    });

    // Keep profile form in sync with user context
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                businessName: user.businessName || '',
                city: user.city || '',
                location: user.location || '',
            });
        }
    }, [user]);

    // Vehicle Form State
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [vehicleFormData, setVehicleFormData] = useState({
        title: '',
        brand: '',
        model: '',
        year: '',
        type: 'car',
        category: 'normal',
        pricePerDay: '',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seats: '',
        location: '',
        city: '',
        images: '',
        availability: true
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, vehiclesRes, bookingsRes, requestsRes] = await Promise.all([
                axios.get('dealers/dashboard/stats'),
                axios.get('dealers/dashboard/vehicles'),
                axios.get('dealers/dashboard/bookings'),
                axios.get('dealers/dashboard/car-requests')
            ]);

            setStats(statsRes.data);
            setVehicles(vehiclesRes.data);
            setBookings(bookingsRes.data);
            setCarRequests(requestsRes.data);

            if (user && !user.isProfileComplete) {
                setShowProfileForm(true);
            }
            setLoading(false);
        } catch (error) {
            console.error('Dashboard error:', error);
            // Don't show toast immediately if it's the 404 for car-requests (will be handled)
            // toast.error('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const isAuthenticated = !!user;

    useEffect(() => {
        if (isAuthenticated && user.role === 'dealer') {
            fetchData();
            const interval = setInterval(fetchData, 60000);
            return () => clearInterval(interval);
        } else if (!isAuthenticated) {
            // Set demo data for unauthenticated users
            setStats({
                totalVehicles: 8,
                activeVehicles: 5,
                bookedVehicles: 3,
                totalBookings: 12,
                totalEarnings: 285400,
                recentActivity: [
                    { vehicle: { title: 'Range Rover Vogue' }, bookingName: 'Aman Sharma', createdAt: new Date().toISOString() },
                    { vehicle: { title: 'Mercedes G-Wagon' }, bookingName: 'Priya Verma', createdAt: new Date(Date.now() - 3600000).toISOString() }
                ]
            });
            setVehicles([
                { _id: 'd1', title: 'Range Rover Vogue', brand: 'Land Rover', model: 'Vogue', pricePerDay: 45000, location: 'Jubilee Hills', city: 'Hyderabad', availability: true, images: ['https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=2000'] },
                { _id: 'd2', title: 'Mercedes G-Wagon', brand: 'Mercedes', model: 'G63', pricePerDay: 65000, location: 'Worli', city: 'Mumbai', availability: false, images: ['https://images.unsplash.com/photo-1520050206274-a1af44640bb6?q=80&w=2000'] }
            ]);
            setBookings([
                { _id: 'b1', vehicle: { title: 'Range Rover Vogue' }, bookingName: 'Rahul Singh', startDate: new Date(), endDate: new Date(Date.now() + 86400000 * 3), finalAmount: 135000, status: 'pending_approval' }
            ]);
            setCarRequests([
                { _id: 'r1', requirements: 'Need a white Rolls Royce for a wedding', vehicleType: 'Luxury', name: 'Alok Gupta', city: 'Delhi', phone: '9876543210', email: 'alok@example.com', createdAt: new Date().toISOString() }
            ]);
            setLoading(false);
        } else if (user.role !== 'dealer') {
            navigate('/dashboard'); // Regular users go to their own dashboard
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isAuthenticated) {
                const { data } = await axios.put('/api/v1/dealers/profile', profileData);
                const updatedUser = { ...user, ...data, isProfileComplete: true };
                updateUser(updatedUser);
                toast.success('Profile updated! Welcome to the UrbanCruizo Partner Portal.');
            } else {
                // Demo Mode: Update context locally so changes appear immediately
                const demoUser = { ...profileData, role: 'dealer', isProfileComplete: true };
                updateUser(demoUser);
                toast.success('Demo Profile Updated! (Changes visible locally)');
            }
            setShowProfileForm(false);
            if (isAuthenticated) fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    const handleVehicleSubmit = async (e) => {
        e.preventDefault();
        try {
            const imagesArray = vehicleFormData.images.split(',').map(img => img.trim());
            const dataToSubmit = { ...vehicleFormData, images: imagesArray };

            if (isAuthenticated) {
                if (editingVehicle) {
                    await axios.put(`vehicles/${editingVehicle._id}`, dataToSubmit);
                    toast.success('Vehicle updated!');
                } else {
                    await axios.post('vehicles', dataToSubmit);
                    toast.success('Vehicle added successfully!');
                }
            } else {
                // Demo Mode Logic: Just show success and close
                toast.success('Success! (Demo Mode: Results not saved to database)');
            }
            setShowAddModal(false);
            setEditingVehicle(null);
            if (isAuthenticated) fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDeleteVehicle = async (id) => {
        if (window.confirm('Delete this vehicle permanently?')) {
            try {
                await axios.delete(`vehicles/${id}`);
                toast.success('Vehicle removed');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const handleBookingStatus = async (id, status) => {
        try {
            await axios.put(`bookings/${id}/review`, { status });
            toast.success(`Booking ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
            />
            <p className="mt-4 text-primary font-serif italic text-xl">Loading your premium dashboard...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-2 underline decoration-primary/50 underline-offset-8">
                            Dealer Dashboard
                        </h1>
                        <p className="text-textSecondary">Manage your premium fleet and bookings from one place.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className={`p-3 bg-surface rounded-xl border border-gray-800 text-textSecondary hover:text-primary transition-all ${loading ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-surface rounded-xl border border-gray-800 text-textSecondary hover:text-primary transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <div className="h-10 w-[1px] bg-gray-800" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-none">{user?.name || (isAuthenticated ? 'Partner' : 'Partner Guest')}</p>
                                <p className="text-[10px] text-primary uppercase tracking-widest mt-1">{isAuthenticated ? 'Authorized Dealer' : 'Demo Account'}</p>
                            </div>
                            <button
                                onClick={() => setShowProfileForm(true)}
                                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-background shadow-lg shadow-primary/20 relative group overflow-hidden"
                            >
                                <span className="group-hover:opacity-0 transition-opacity">{user?.name ? user.name[0].toUpperCase() : (isAuthenticated ? 'P' : 'G')}</span>
                                <Edit className="w-4 h-4 absolute opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-[1fr_3fr] gap-10">

                    {/* Sidebar Nav */}
                    <nav className="space-y-2">
                        {[
                            { id: 'overview', icon: <LayoutDashboard />, label: 'Overview' },
                            { id: 'vehicles', icon: <Car />, label: 'My Vehicles' },
                            { id: 'bookings', icon: <CalendarCheck />, label: 'Booking Requests' },
                            { id: 'requests', icon: <MessageSquare />, label: 'Car Requests' },
                            { id: 'earnings', icon: <Wallet />, label: 'Earnings' },
                            { id: 'settings', icon: <Settings />, label: 'Settings' }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === item.id
                                    ? 'bg-primary text-background shadow-xl shadow-primary/20 scale-105'
                                    : 'text-textSecondary hover:bg-surface hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}

                    </nav>

                    {/* Content Section */}
                    <main className="bg-surface rounded-[2.5rem] border border-gray-800 p-8 shadow-2xl relative overflow-hidden">

                        {/* Decorative Gradient Background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />

                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-primary to-primary-dark overflow-hidden shadow-2xl shadow-primary/20">
                                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
                                        <div className="relative z-10">
                                            <h2 className="text-3xl md:text-5xl font-serif font-black text-background mb-4">
                                                Welcome back, <span className="italic">{user?.name?.split(' ')[0] || (isAuthenticated ? 'Partner' : 'Partner')}</span>
                                            </h2>
                                            <p className="text-background/80 max-w-lg leading-relaxed font-medium">
                                                Your fleet is performing exceptionally well this month. You've earned ₹{stats?.totalEarnings?.toLocaleString()} after commission.
                                            </p>
                                            <button
                                                onClick={() => setShowProfileForm(true)}
                                                className="mt-6 px-6 py-3 bg-background text-primary rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
                                            >
                                                <Edit className="w-4 h-4" /> Manage Profile
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-background/30 backdrop-blur-md border border-white/5 p-6 rounded-3xl">
                                        <div>
                                            <h3 className="text-lg font-serif font-bold text-white tracking-tight">Performance Insights</h3>
                                            <p className="text-[10px] text-textSecondary uppercase tracking-widest font-black italic">Last updated: {new Date().toLocaleTimeString()}</p>
                                        </div>
                                        <button onClick={fetchData} className="btn-outline px-4 py-2 text-xs">Sync Data</button>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Total Fleet', value: stats?.totalVehicles, icon: <Car />, color: 'primary' },
                                            { label: 'Available', value: stats?.activeVehicles, icon: <Check />, color: 'green' },
                                            { label: 'Booked', value: stats?.bookedVehicles, icon: <Lock />, color: 'red' },
                                            { label: 'Active Bookings', value: stats?.totalBookings, icon: <Users />, color: 'blue' }
                                        ].map((stat, idx) => (
                                            <div key={idx} className="bg-background border border-gray-800 p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-3 bg-surface rounded-xl text-primary">{stat.icon}</div>
                                                    <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                                        <TrendingUp className="w-3 h-3" />
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-textSecondary uppercase tracking-[0.2em] font-black mb-1 italic">{stat.label}</p>
                                                <p className="text-3xl font-serif font-bold text-white tracking-tight">{stat.value || 0}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Monthly Performance Card */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-background border border-gray-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                                            <h3 className="text-xl font-bold text-white mb-2 italic">Total Payouts</h3>
                                            <p className="text-5xl font-serif font-bold text-primary mb-2 tracking-tighter">₹{stats?.totalEarnings?.toLocaleString()}</p>
                                            <p className="text-sm text-textSecondary font-medium">After 10% Platform Commission</p>
                                        </div>
                                        <div className="bg-background border border-gray-800 p-8 rounded-[2.5rem] flex flex-col justify-center">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-xs uppercase tracking-widest text-textSecondary font-bold">Fleet Health</span>
                                                <span className="text-xs text-primary font-bold">{stats?.totalVehicles > 0 ? ((stats?.activeVehicles / stats?.totalVehicles * 100) || 0).toFixed(0) : 0}% Utilization</span>
                                            </div>
                                            <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stats?.totalVehicles > 0 ? (stats?.activeVehicles / stats?.totalVehicles * 100) : 0}%` }}
                                                    className="h-full bg-primary"
                                                />
                                            </div>
                                            <p className="text-[10px] text-textSecondary mt-4 italic">Performance is calculated based on vehicle availability vs total listings.</p>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="bg-background border border-gray-800 p-8 rounded-[2rem]">
                                        <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-800 pb-4">Recent Notifications</h3>
                                        <div className="space-y-6">
                                            {stats?.recentActivity?.length > 0 ? stats.recentActivity.map((activity, idx) => (
                                                <div key={idx} className="flex gap-4 items-start group">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                                        <Bell className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm">
                                                            New booking request for <span className="font-bold text-primary">{activity.vehicle?.title}</span> by <span className="text-gray-300">{activity.user?.name || activity.bookingName}</span>
                                                        </p>
                                                        <p className="text-[10px] text-textSecondary mt-1 uppercase tracking-tighter">
                                                            {new Date(activity.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-textSecondary italic">No recent activity found.</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'vehicles' && (
                                <motion.div
                                    key="vehicles"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-8"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                                        <div>
                                            <h2 className="text-2xl font-serif font-bold text-white">Your Premium Fleet</h2>
                                            <p className="text-xs text-textSecondary italic mt-1 uppercase tracking-widest">Manage your listings location-wise</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                                            <div className="relative flex-1 md:w-64">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                                                <input
                                                    type="text"
                                                    placeholder="Search by city/area..."
                                                    className="w-full bg-background border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all font-medium"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setEditingVehicle(null);
                                                    setVehicleFormData({
                                                        title: '', brand: '', model: '', year: '', type: 'car', category: 'normal', pricePerDay: '', transmission: 'Automatic', fuelType: 'Petrol', seats: '', location: '', city: '', images: '', availability: true
                                                    });
                                                    setShowAddModal(true);
                                                }}
                                                className="bg-primary text-background px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                            >
                                                <Plus className="w-5 h-5" /> Add Vehicle
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {vehicles
                                            .filter(v =>
                                                v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                v.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                v.location.toLowerCase().includes(searchTerm.toLowerCase())
                                            ).map(vehicle => (
                                                <div key={vehicle._id} className="bg-background border border-gray-800 rounded-3xl p-6 group">
                                                    <div className="relative h-48 mb-6 rounded-2xl overflow-hidden flex items-center justify-center bg-surface">
                                                        {vehicle.images?.[0] ? (
                                                            <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        ) : (
                                                            <Car className="w-16 h-16 text-gray-800" />
                                                        )}
                                                        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase border border-primary/20">
                                                            {vehicle.availability ? 'Available' : 'Booked'}
                                                        </div>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-1">{vehicle.title}</h3>
                                                    <p className="text-sm text-textSecondary flex items-center gap-2 mb-6">
                                                        <MapPin className="w-4 h-4 text-primary/60" /> {vehicle.location}, {vehicle.city}
                                                    </p>
                                                    <div className="flex justify-between items-center bg-surface/50 p-4 rounded-xl border border-gray-800/50">
                                                        <span className="text-primary font-bold">₹{vehicle.pricePerDay}/day</span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingVehicle(vehicle);
                                                                    setVehicleFormData({ ...vehicle, images: vehicle.images.join(', ') });
                                                                    setShowAddModal(true);
                                                                }}
                                                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                                title="Edit Vehicle"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await axios.put(`vehicles/${vehicle._id}`, { availability: !vehicle.availability });
                                                                        toast.success(`Status updated to ${!vehicle.availability ? 'Available' : 'Booked'}`);
                                                                        fetchData();
                                                                    } catch (e) { toast.error('Failed to update status'); }
                                                                }}
                                                                className={`p-2 rounded-lg transition-colors ${vehicle.availability ? 'text-green-500 hover:bg-green-500/10' : 'text-orange-500 hover:bg-orange-500/10'}`}
                                                                title={vehicle.availability ? 'Mark as Booked' : 'Mark as Available'}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteVehicle(vehicle._id)}
                                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                title="Delete Listing"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'bookings' && (
                                <motion.div
                                    key="bookings"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-2xl font-serif font-bold text-white">Rental Applications</h2>
                                    <div className="space-y-6">
                                        {bookings.length > 0 ? bookings.map(booking => (
                                            <div key={booking._id} className="bg-background border border-gray-800 rounded-3xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                                                {/* Status Badge */}
                                                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] uppercase font-black italic tracking-widest ${booking.status === 'pending_approval' ? 'bg-orange-500 text-white' :
                                                    booking.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
                                                    }`}>
                                                    {booking.status.replace('_', ' ')}
                                                </div>

                                                <div className="w-full md:w-32 h-32 bg-surface rounded-2xl shrink-0 flex items-center justify-center overflow-hidden border border-gray-800">
                                                    {booking.vehicle?.images?.[0] ? (
                                                        <img src={booking.vehicle.images[0]} className="w-full h-full object-cover" />
                                                    ) : <Car className="w-10 h-10 text-gray-800" />}
                                                </div>

                                                <div className="flex-grow">
                                                    <h3 className="text-xl font-bold text-white mb-2">{booking.vehicle?.title || 'Unknown Vehicle'}</h3>
                                                    <div className="space-y-1 text-sm text-textSecondary mb-4">
                                                        <p className="flex items-center gap-2"><Users className="w-3 h-3 text-primary" /> {booking.user?.name || booking.bookingName}</p>
                                                        <p className="flex items-center gap-2"><CalendarCheck className="w-3 h-3 text-primary" /> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                                                        <p className="flex items-center gap-2 font-bold text-primary">₹{booking.finalAmount || booking.totalPrice}</p>
                                                    </div>

                                                    {booking.status === 'pending_approval' && (
                                                        <div className="flex gap-4">
                                                            <button
                                                                onClick={() => handleBookingStatus(booking._id, 'approved')}
                                                                className="flex-1 bg-green-500/10 text-green-500 border border-green-500/20 py-2 rounded-xl text-xs font-bold hover:bg-green-500 hover:text-white transition-all"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleBookingStatus(booking._id, 'rejected')}
                                                                className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                                                            >
                                                                Deny
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-20 bg-background/50 rounded-3xl border border-dashed border-gray-800">
                                                <CalendarCheck className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                                <p className="text-textSecondary italic">No booking requests yet. Once users apply for your cars, they'll appear here.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'requests' && (
                                <motion.div
                                    key="requests"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-2xl font-serif font-bold text-white">General Car Requests</h2>
                                    <p className="text-sm text-textSecondary italic bg-primary/5 p-4 rounded-xl border border-primary/10">
                                        These are custom requests from users who couldn't find exactly what they were looking for. Reach out to them to strike a deal!
                                    </p>
                                    <div className="space-y-6">
                                        {carRequests.length > 0 ? carRequests.map(req => (
                                            req && (
                                                <div key={req._id} className={`bg-background border border-gray-800 rounded-3xl p-6 relative group border-l-4 transition-all ${req.city?.toLowerCase() === user?.city?.toLowerCase() ? 'border-l-primary shadow-xl shadow-primary/5' : 'border-l-gray-800 opacity-80 hover:opacity-100'}`}>
                                                    {req.city?.toLowerCase() === user?.city?.toLowerCase() && (
                                                        <div className="absolute top-4 right-16 bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic animate-pulse">
                                                            City Match
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-serif font-black text-white italic">{req.requirements}</h3>
                                                            <p className="text-[10px] text-primary uppercase tracking-widest font-black mt-1 italic">Type: {req.vehicleType}</p>
                                                        </div>
                                                        <span className="text-[10px] text-textSecondary bg-surface px-2 py-1 rounded-md uppercase tracking-widest font-bold">{new Date(req.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-xs text-textSecondary pt-4 border-t border-gray-800 font-medium">
                                                        <p><span className="text-white opacity-60">Customer:</span> {req.name}</p>
                                                        <p><span className="text-white opacity-60">City:</span> {req.city}</p>
                                                        <p><span className="text-white opacity-60">Contact:</span> {req.phone}</p>
                                                        <p><span className="text-white opacity-60">Email:</span> {req.email}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => window.open(`tel:${req.phone}`)}
                                                        className="w-full mt-6 py-3 bg-surface hover:bg-primary hover:text-background transition-all rounded-xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                                                    >
                                                        Contact Lead <MessageSquare className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )
                                        )) : (
                                            <div className="text-center py-20 bg-background/50 rounded-3xl border border-dashed border-gray-800">
                                                <MessageSquare className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                                <p className="text-textSecondary italic">No general requests at the moment. When users submit custom forms, you'll see them here.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'earnings' && (
                                <motion.div
                                    key="earnings"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-2xl font-serif font-bold text-white text-center mb-10">Earnings & Performance</h2>
                                    <div className="bg-background border border-gray-800 p-10 rounded-[3rem] text-center space-y-4">
                                        <Wallet className="w-16 h-16 text-primary mx-auto mb-6" />
                                        <h3 className="text-xl font-bold text-white">Total Disbursed Earnings</h3>
                                        <p className="text-5xl font-serif font-bold text-primary">₹{stats?.totalEarnings?.toLocaleString()}</p>
                                        <p className="text-sm text-textSecondary italic">Commission of 10% already deducted. Next payout scheduled for 5th of next month.</p>
                                    </div>

                                    <div className="bg-background border border-gray-800 rounded-[2.5rem] overflow-hidden">
                                        <div className="p-8 border-b border-gray-800">
                                            <h3 className="text-xl font-bold text-white">Earnings History</h3>
                                            <p className="text-xs text-textSecondary mt-1 uppercase tracking-widest font-black italic">Recent Confirmed Bookings</p>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-surface/50 text-[10px] uppercase font-black tracking-[0.2em] text-textSecondary">
                                                    <tr>
                                                        <th className="px-8 py-4">Ref ID</th>
                                                        <th className="px-8 py-4">Date</th>
                                                        <th className="px-8 py-4">Vehicle</th>
                                                        <th className="px-8 py-4">Net Amount</th>
                                                        <th className="px-8 py-4">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800/50">
                                                    {bookings.filter(b => b.status === 'approved' || b.status === 'confirmed').length > 0 ? (
                                                        bookings.filter(b => b.status === 'approved' || b.status === 'confirmed').slice(0, 10).map(b => (
                                                            <tr key={b._id} className="hover:bg-primary/5 transition-colors group">
                                                                <td className="px-8 py-6 text-xs font-mono text-gray-500">#{b._id.slice(-6).toUpperCase()}</td>
                                                                <td className="px-8 py-6 text-sm text-white font-medium">{new Date(b.createdAt).toLocaleDateString()}</td>
                                                                <td className="px-8 py-6 text-sm text-textSecondary">{b.vehicle?.brand} {b.vehicle?.model}</td>
                                                                <td className="px-8 py-6 text-sm text-primary font-bold">₹{(b.totalPrice * 0.9).toLocaleString()}</td>
                                                                <td className="px-8 py-6">
                                                                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20 italic">Disbursed</span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="px-8 py-20 text-center text-textSecondary italic">No earnings records found yet.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-2xl font-serif font-bold text-white">Account Management</h2>
                                    <div className="bg-background border border-gray-800 p-8 rounded-[2rem] space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-xs uppercase tracking-widest text-primary font-bold">Profile Identity</p>
                                            <div className="flex items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-gray-800 group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">{user?.name ? user.name[0] : 'G'}</div>
                                                    <div>
                                                        <p className="text-white font-bold text-lg">{user?.name || 'Partner Guest'}</p>
                                                        <p className="text-xs text-textSecondary">{user?.email || 'demo@urbancruizo.com'}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowProfileForm(true)}
                                                    className="p-3 bg-background hover:bg-primary hover:text-background rounded-xl border border-gray-800 transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowProfileForm(true)}
                                            className="w-full btn-outline py-4 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            Update Profile Details <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Profile Completion Modal */}
            <AnimatePresence>
                {showProfileForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-xl bg-surface border border-gray-800 rounded-[3rem] p-10 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowProfileForm(false)}
                                className="absolute top-6 right-6 p-2 bg-background rounded-full border border-gray-800 text-textSecondary hover:text-primary transition-all z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {user && !user.isProfileComplete && (
                                <div className="absolute -top-4 -left-4 bg-primary text-background px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce">
                                    Action Required
                                </div>
                            )}

                            <h2 className="text-3xl font-serif font-bold text-primary mb-2">Partner Profile</h2>
                            <p className="text-textSecondary mb-8 text-sm italic">
                                {user && !user.isProfileComplete
                                    ? "Before you can start listing your premium fleet, we need a few details to verify your identity and dealership."
                                    : "Keep your dealership details updated for better trust scores."}
                            </p>

                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">Full Identity (Legal Name)</label>
                                        <input type="text" required className="input-field" placeholder="Full Name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">Direct Contact Number</label>
                                        <input type="tel" required className="input-field" placeholder="+91 XXXX XXX XXX" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">Business / Dealer Name (Display name on portal)</label>
                                    <input type="text" required className="input-field" placeholder="Ex: Elite Motors Pvt Ltd" value={profileData.businessName} onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">Operating City</label>
                                        <input type="text" required className="input-field" placeholder="Ex: Delhi" value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">Operating Location (Specific Area)</label>
                                        <input type="text" required className="input-field" placeholder="Ex: Gachibowli, Jubilee Hills" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} />
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button type="submit" className="flex-1 btn-primary py-4 rounded-2xl shadow-xl shadow-primary/20">
                                        Save & Continue
                                    </button>
                                    {user?.isProfileComplete && (
                                        <button type="button" onClick={() => setShowProfileForm(false)} className="px-6 border border-gray-800 text-textSecondary rounded-2xl">Cancel</button>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add/Edit Vehicle Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-2xl bg-surface border border-gray-800 rounded-[2.5rem] p-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-serif font-bold text-primary">{editingVehicle ? 'Edit Experience' : 'List New Experience'}</h2>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleVehicleSubmit} className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Vehicle Title</label>
                                    <input type="text" required className="input-field" placeholder="Ex: BMW X5 M-Sport" value={vehicleFormData.title} onChange={(e) => setVehicleFormData({ ...vehicleFormData, title: e.target.value })} />
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Base Brand</label>
                                    <input type="text" required className="input-field" placeholder="Ex: BMW" value={vehicleFormData.brand} onChange={(e) => setVehicleFormData({ ...vehicleFormData, brand: e.target.value })} />
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Model Name</label>
                                    <input type="text" required className="input-field" placeholder="Ex: X5" value={vehicleFormData.model} onChange={(e) => setVehicleFormData({ ...vehicleFormData, model: e.target.value })} />
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Year of Manufacture</label>
                                    <input type="number" required className="input-field" placeholder="2023" value={vehicleFormData.year} onChange={(e) => setVehicleFormData({ ...vehicleFormData, year: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Vehicle Category</label>
                                    <select className="input-field" value={vehicleFormData.category} onChange={(e) => setVehicleFormData({ ...vehicleFormData, category: e.target.value })}>
                                        <option value="normal">Standard</option>
                                        <option value="luxury">Luxury Elite</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Fair (₹) Per Day</label>
                                    <input type="number" required className="input-field" placeholder="5000" value={vehicleFormData.pricePerDay} onChange={(e) => setVehicleFormData({ ...vehicleFormData, pricePerDay: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Initial Status</label>
                                    <select className="input-field" value={vehicleFormData.availability} onChange={(e) => setVehicleFormData({ ...vehicleFormData, availability: e.target.value === 'true' })}>
                                        <option value="true">Available</option>
                                        <option value="false">Booked / Maintenance</option>
                                    </select>
                                </div>

                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Listing City</label>
                                    <input type="text" required className="input-field" placeholder="Ex: Hyderabad" value={vehicleFormData.city} onChange={(e) => setVehicleFormData({ ...vehicleFormData, city: e.target.value })} />
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Station/Area</label>
                                    <input type="text" required className="input-field" placeholder="Ex: Jubilee Hills" value={vehicleFormData.location} onChange={(e) => setVehicleFormData({ ...vehicleFormData, location: e.target.value })} />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Image URLs (comma separated)</label>
                                    <textarea className="input-field h-24" placeholder="https://image1.jpg, https://image2.jpg" value={vehicleFormData.images} onChange={(e) => setVehicleFormData({ ...vehicleFormData, images: e.target.value })} />
                                </div>

                                <button type="submit" className="col-span-2 btn-primary py-4 rounded-xl mt-4">
                                    {editingVehicle ? 'Update Listing' : 'Publish to Marketplace'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default DealerDashboard;
