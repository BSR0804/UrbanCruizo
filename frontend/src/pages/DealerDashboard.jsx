import { useState, useEffect, useRef } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifSeen, setNotifSeen] = useState(false);
    const notifRef = useRef(null);
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
        category: 'standard',
        pricePerDay: '',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seats: '',
        capacity: '',
        mileage: '',
        location: '',
        city: '',
        images: '',
        availability: true
    });
    const [uploadedImages, setUploadedImages] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, vehiclesRes, bookingsRes] = await Promise.all([
                axios.get('dealers/dashboard/stats'),
                axios.get('dealers/dashboard/vehicles'),
                axios.get('dealers/dashboard/bookings')
            ]);

            setStats(statsRes.data);
            setVehicles(vehiclesRes.data);
            setBookings(bookingsRes.data);

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
        } else if (!isAuthenticated || user.role !== 'dealer') {
            // Set demo data for unauthenticated or non-dealer users
            // This allows anyone coming from the PartnerLanding to see the dashboard experience
            setStats({
                totalVehicles: 8,
                activeVehicles: 5,
                bookedVehicles: 3,
                totalBookings: 12,
                totalEarnings: 285400,
                recentActivity: [
                    { _id: 'notif1', vehicle: { title: 'Range Rover Vogue' }, bookingName: 'Aman Sharma', createdAt: new Date().toISOString() },
                    { _id: 'notif2', vehicle: { title: 'Mercedes G-Wagon' }, bookingName: 'Priya Verma', createdAt: new Date(Date.now() - 3600000).toISOString() }
                ]
            });
            setVehicles([
                { _id: 'd1', title: 'Range Rover Vogue', brand: 'Land Rover', model: 'Vogue', pricePerDay: 45000, location: 'Jubilee Hills', city: 'Hyderabad', availability: true, images: ['https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=2000'] },
                { _id: 'd2', title: 'Mercedes G-Wagon', brand: 'Mercedes', model: 'G63', pricePerDay: 65000, location: 'Worli', city: 'Mumbai', availability: false, images: ['https://images.unsplash.com/photo-1520050206274-a1af44640bb6?q=80&w=2000'] }
            ]);
            setBookings([
                { _id: 'b1', vehicle: { title: 'Range Rover Vogue' }, bookingName: 'Rahul Singh', startDate: new Date(), endDate: new Date(Date.now() + 86400000 * 3), finalAmount: 135000, status: 'pending_approval' }
            ]);
            setLoading(false);
        }
    }, [user, isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only save to backend if actually a dealer, otherwise use demo mode
            if (isAuthenticated && user.role === 'dealer') {
                let response;
                try {
                    // Try primary endpoint
                    response = await axios.put('dealers/profile', profileData);
                } catch (err) {
                    // Fallback alias
                    if (err.response?.status === 404) {
                        response = await axios.put('dealers/dashboard/profile', profileData);
                    } else {
                        throw err;
                    }
                }

                const updatedUser = { ...user, ...response.data, isProfileComplete: true };
                updateUser(updatedUser);
                toast.success('Profile saved successfully! ✨');
                setShowProfileForm(false);
                fetchData();
            } else {
                // Demo Mode (for guests or non-dealer logged in users)
                const demoUser = {
                    ...(user || {}),
                    ...profileData,
                    role: user?.role || 'dealer', // Keep original role if exists, else 'dealer' for demo
                    isProfileComplete: true
                };

                // If not logged in at all, we just update local state
                if (!isAuthenticated) {
                    updateUser(demoUser);
                } else {
                    // If logged in as user, update local but don't change role to dealer in DB
                    updateUser({ ...user, ...profileData, isProfileComplete: true });
                }

                toast.success('Demo profile updated locally!');
                setShowProfileForm(false);
            }
        } catch (error) {
            console.error('Save Error:', error);
            const errMsg = error.response?.data?.message || error.message || 'Server connection error';
            toast.error(`Save failed: ${errMsg}`);
        }
    };

    const handleImageUpload = (files) => {
        if (!files.length) return;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleVehicleSubmit = async (e) => {
        e.preventDefault();
        const imagesArray = uploadedImages.length > 0
            ? uploadedImages
            : (typeof vehicleFormData.images === 'string'
                ? vehicleFormData.images.split(',').map(img => img.trim()).filter(Boolean)
                : []);
        try {
            const { description, ...dataToSubmit } = { ...vehicleFormData, images: imagesArray };

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
            setUploadedImages([]);
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
                            className={`p-3 bg-surface rounded-xl border border-gray-800 text-textSecondary hover:text-primary transition-all ${loading ? "animate-spin" : ""}`}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => { setShowNotifications(!showNotifications); setNotifSeen(true); }}
                                className="p-3 bg-surface rounded-xl border border-gray-800 text-textSecondary hover:text-primary transition-all relative"
                            >
                                <Bell className="w-5 h-5" />
                                {!notifSeen && (stats?.recentActivity?.length > 0 || bookings.filter(b => b.status === 'pending_approval').length > 0) && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 top-14 w-80 bg-surface border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                                    <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800">
                                        <h3 className="text-sm font-bold text-white">Notifications</h3>
                                        <span className="text-[10px] uppercase tracking-widest text-primary font-black">
                                            {bookings.filter(b => b.status === 'pending_approval').length} Pending
                                        </span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-800/50">
                                        {bookings.filter(b => b.status === 'pending_approval').length > 0 ? (
                                            bookings.filter(b => b.status === 'pending_approval').map(b => (
                                                <div
                                                    key={b._id}
                                                    onClick={() => { setActiveTab('bookings'); setShowNotifications(false); }}
                                                    className="px-5 py-4 hover:bg-primary/5 cursor-pointer transition-colors"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Bell className="w-3.5 h-3.5 text-orange-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-white font-medium leading-snug">
                                                                New booking for <span className="text-primary font-bold">{b.vehicle?.title || 'a vehicle'}</span>
                                                            </p>
                                                            <p className="text-xs text-textSecondary mt-1">
                                                                by {b.user?.name || b.bookingName || 'a customer'} · {new Date(b.createdAt).toLocaleDateString()}
                                                            </p>
                                                            <span className="inline-block mt-1.5 text-[9px] uppercase tracking-widest font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">Awaiting Approval</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-5 py-10 text-center">
                                                <Bell className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                                <p className="text-textSecondary text-sm italic">No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-5 py-3 border-t border-gray-800">
                                        <button
                                            onClick={() => { setActiveTab('bookings'); setShowNotifications(false); }}
                                            className="w-full text-center text-[10px] uppercase tracking-widest font-black text-primary hover:underline"
                                        >
                                            View All Bookings
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                                                        title: '', brand: '', model: '', year: '', type: 'car', category: 'standard', pricePerDay: '', transmission: 'Automatic', fuelType: 'Petrol', seats: '', capacity: '', mileage: '', location: '', city: '', images: '', availability: true
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
                                                        <MapPin className="w-4 h-4 text-primary/60" /> {[vehicle.location, vehicle.city].filter(Boolean).join(', ')}
                                                    </p>
                                                    <div className="flex justify-between items-center bg-surface/50 p-4 rounded-xl border border-gray-800/50">
                                                        <span className="text-primary font-bold">₹{vehicle.pricePerDay?.toLocaleString('en-IN')}/day</span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingVehicle(vehicle);
                                                                    setVehicleFormData({ ...vehicle, images: vehicle.images.join(', ') });
                                                                    setUploadedImages(vehicle.images || []);
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

                                    {/* Three sections */}
                                    {[
                                        {
                                            label: 'Requests',
                                            statuses: ['pending_approval'],
                                            color: 'orange',
                                            emptyMsg: 'No pending requests.',
                                        },
                                        {
                                            label: 'Approved',
                                            statuses: ['approved', 'confirmed', 'ongoing', 'completed'],
                                            color: 'green',
                                            emptyMsg: 'No approved bookings yet.',
                                        },
                                        {
                                            label: 'Rejected',
                                            statuses: ['rejected', 'cancelled'],
                                            color: 'red',
                                            emptyMsg: 'No rejected bookings.',
                                        },
                                    ].map(section => {
                                        const sectionBookings = bookings.filter(b => section.statuses.includes(b.status));
                                        const colorMap = {
                                            orange: { border: 'border-orange-500/30', dot: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10' },
                                            green: { border: 'border-green-500/30', dot: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/10' },
                                            red: { border: 'border-red-500/30', dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10' },
                                        }[section.color];

                                        return (
                                            <div key={section.label} className={`border ${colorMap.border} rounded-3xl overflow-hidden`}>
                                                {/* Section Header */}
                                                <div className="flex items-center gap-3 px-6 py-4 bg-background/50 border-b border-gray-800">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${colorMap.dot}`} />
                                                    <h3 className={`font-black uppercase tracking-widest text-xs ${colorMap.text}`}>{section.label}</h3>
                                                    <span className={`ml-auto text-[10px] font-black px-3 py-1 rounded-full ${colorMap.bg} ${colorMap.text}`}>{sectionBookings.length}</span>
                                                </div>

                                                {/* Booking Cards */}
                                                <div className="divide-y divide-gray-800/50">
                                                    {sectionBookings.length === 0 ? (
                                                        <p className="text-center text-textSecondary italic text-sm py-10">{section.emptyMsg}</p>
                                                    ) : sectionBookings.map(booking => (
                                                        <div key={booking._id} className="p-6 flex flex-col gap-5">

                                                            {/* Top row: vehicle image + main info + actions */}
                                                            <div className="flex flex-col md:flex-row gap-5">
                                                                <div className="w-full md:w-28 h-24 bg-surface rounded-2xl shrink-0 overflow-hidden border border-gray-800 flex items-center justify-center">
                                                                    {booking.vehicle?.images?.[0]
                                                                        ? <img src={booking.vehicle.images[0]} className="w-full h-full object-cover" alt="" />
                                                                        : <Car className="w-8 h-8 text-gray-700" />}
                                                                </div>

                                                                <div className="flex-grow space-y-1">
                                                                    <h3 className="text-lg font-bold text-white">{booking.vehicle?.title || 'Unknown Vehicle'}</h3>
                                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-textSecondary mt-2">
                                                                        <p><span className="text-primary font-bold">Customer:</span> {booking.user?.name || booking.bookingName || '—'}</p>
                                                                        <p><span className="text-primary font-bold">Phone:</span> {booking.user?.phone || booking.bookingPhone || '—'}</p>
                                                                        <p><span className="text-primary font-bold">Email:</span> {booking.user?.email || booking.bookingEmail || '—'}</p>
                                                                        <p><span className="text-primary font-bold">Amount:</span> ₹{(booking.finalAmount || booking.totalPrice)?.toLocaleString('en-IN')}</p>
                                                                        <p><span className="text-primary font-bold">From:</span> {new Date(booking.startDate).toLocaleDateString()}</p>
                                                                        <p><span className="text-primary font-bold">To:</span> {new Date(booking.endDate).toLocaleDateString()}</p>
                                                                        {booking.bookingAddress && <p className="col-span-2"><span className="text-primary font-bold">Address:</span> {booking.bookingAddress}</p>}
                                                                    </div>
                                                                </div>

                                                                {/* Approve / Reject buttons only on pending */}
                                                                {booking.status === 'pending_approval' && (
                                                                    <div className="flex md:flex-col gap-3 shrink-0 justify-end">
                                                                        <button
                                                                            onClick={() => handleBookingStatus(booking._id, 'approved')}
                                                                            className="px-5 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all"
                                                                        >
                                                                            Approve
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleBookingStatus(booking._id, 'rejected')}
                                                                            className="px-5 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Verification Details + Documents */}
                                                            {(() => {
                                                                const docs = [
                                                                    { url: booking.licenseImage, label: 'Driving License (Front)' },
                                                                    { url: booking.licenseBackImage, label: 'Driving License (Back)' },
                                                                    { url: booking.aadhaarImage, label: 'Aadhaar / ID' },
                                                                    { url: booking.passportImage, label: 'Passport' },
                                                                    { url: booking.selfieImage, label: 'Selfie' },
                                                                ].filter(d => d.url);
                                                                const extraInfo = [
                                                                    booking.bookingAge && `Age: ${booking.bookingAge}`,
                                                                    booking.drivingLicenseNumber && `License #: ${booking.drivingLicenseNumber}`,
                                                                    booking.aadhaarNumber && `Aadhaar #: ${booking.aadhaarNumber}`,
                                                                    booking.country && `Country: ${booking.country}`,
                                                                ].filter(Boolean);
                                                                if (docs.length === 0 && extraInfo.length === 0) return null;
                                                                return (
                                                                    <div className="pt-4 border-t border-gray-800/50 space-y-3">
                                                                        {extraInfo.length > 0 && (
                                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-xs text-textSecondary">
                                                                                {extraInfo.map((info, i) => (
                                                                                    <p key={i} className="truncate"><span className="text-primary font-bold">{info.split(':')[0]}:</span> {info.split(':').slice(1).join(':').trim()}</p>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {docs.length > 0 && (
                                                                            <div>
                                                                                <p className="text-[10px] uppercase tracking-widest text-textSecondary font-black mb-2">Documents</p>
                                                                                <div className="flex flex-wrap gap-4">
                                                                                    {docs.map((doc, i) => (
                                                                                        <a
                                                                                            key={i}
                                                                                            href={doc.url}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-700 rounded-xl text-xs font-bold text-textSecondary hover:text-primary hover:border-primary/40 transition-all"
                                                                                            onClick={e => {
                                                                                                e.preventDefault();
                                                                                                window.open(doc.url, '_blank', 'noopener,noreferrer');
                                                                                            }}
                                                                                        >
                                                                                            <Eye className="w-3.5 h-3.5" /> {doc.label}
                                                                                        </a>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
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
                                        <option value="hatchback">Hatchback</option>
                                        <option value="sedan">Sedan</option>
                                        <option value="suv">SUV</option>
                                        <option value="luxury">Luxury Elite</option>
                                        <option value="commuter">Commuter</option>
                                        <option value="sports">Sports</option>
                                        <option value="royal-enfield">Royal Enfield</option>
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Number of Seats</label>
                                    <input type="number" required className="input-field" placeholder="5" min="1" value={vehicleFormData.seats} onChange={(e) => setVehicleFormData({ ...vehicleFormData, seats: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Fuel Type</label>
                                    <select className="input-field" value={vehicleFormData.fuelType} onChange={(e) => setVehicleFormData({ ...vehicleFormData, fuelType: e.target.value })}>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="CNG">CNG</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                {vehicleFormData.fuelType !== 'Electric' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Fuel Tank Capacity (Litres)</label>
                                    <input type="number" className="input-field" placeholder="45" min="0" value={vehicleFormData.capacity} onChange={(e) => setVehicleFormData({ ...vehicleFormData, capacity: e.target.value })} />
                                </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Mileage (km/ltr)</label>
                                    <input type="number" className="input-field" placeholder="20" min="0" step="0.1" value={vehicleFormData.mileage} onChange={(e) => setVehicleFormData({ ...vehicleFormData, mileage: e.target.value })} />
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


                                <div className="col-span-2 space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Vehicle Images</label>
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-2xl cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e.target.files)}
                                        />
                                        <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <p className="text-xs text-textSecondary">Click to upload images <span className="text-primary font-bold">(multiple allowed)</span></p>
                                    </label>
                                    {uploadedImages.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {uploadedImages.map((url, i) => (
                                                <div key={i} className="relative group">
                                                    <img src={url} alt="" className="w-20 h-16 object-cover rounded-xl border border-gray-700" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
