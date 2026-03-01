import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Truck, CalendarCheck, Wallet, Bell, Settings, TrendingUp, Users, MapPin, Edit, Check, X, RefreshCw, Lock, ChevronRight, Fuel, Gauge, Shield, BarChart3, Clock, Route
} from 'lucide-react';
import axios from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const FleetDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        businessName: user?.businessName || '',
        city: user?.city || '',
        location: user?.location || '',
    });

    const isAuthenticated = user && (user.role === 'fleet' || user.role === 'dealer');
    const displayUser = isAuthenticated ? user : { name: 'Demo Fleet Mgr', email: 'demo@urbancruizo.com', businessName: 'Metro Fleet Co.', city: 'Mumbai', isProfileComplete: true };

    // Demo data
    const demoStats = {
        totalVehicles: 45, activeVehicles: 38, bookedVehicles: 12, totalBookings: 28, pendingBookings: 5,
        totalEarnings: 875000,
        recentActivity: [
            { vehicle: { title: 'Toyota Innova Fleet Unit #12' }, user: { name: 'Corporate Client A' }, createdAt: new Date().toISOString() },
            { vehicle: { title: 'Hyundai Creta Fleet Unit #7' }, user: { name: 'Travel Agency B' }, createdAt: new Date(Date.now() - 3600000).toISOString() },
        ]
    };
    const demoVehicles = [
        { _id: '1', title: 'Toyota Innova Crysta #01', brand: 'Toyota', model: 'Innova Crysta', pricePerDay: 4500, location: 'Andheri West', city: 'Mumbai', availability: true, images: [], fuelType: 'Diesel', mileage: 45230 },
        { _id: '2', title: 'Hyundai Creta #02', brand: 'Hyundai', model: 'Creta', pricePerDay: 3200, location: 'Bandra', city: 'Mumbai', availability: true, images: [], fuelType: 'Petrol', mileage: 32100 },
        { _id: '3', title: 'Maruti Suzuki Swift #03', brand: 'Maruti Suzuki', model: 'Swift', pricePerDay: 1800, location: 'Powai', city: 'Mumbai', availability: false, images: [], fuelType: 'Petrol', mileage: 58700 },
        { _id: '4', title: 'Toyota Innova Crysta #04', brand: 'Toyota', model: 'Innova Crysta', pricePerDay: 4500, location: 'Worli', city: 'Mumbai', availability: true, images: [], fuelType: 'Diesel', mileage: 21300 },
        { _id: '5', title: 'Kia Seltos #05', brand: 'Kia', model: 'Seltos', pricePerDay: 3500, location: 'Juhu', city: 'Mumbai', availability: false, images: [], fuelType: 'Petrol', mileage: 41200 },
        { _id: '6', title: 'Hyundai Creta #06', brand: 'Hyundai', model: 'Creta', pricePerDay: 3200, location: 'Dadar', city: 'Mumbai', availability: true, images: [], fuelType: 'Diesel', mileage: 15600 },
    ];
    const demoBookings = [
        { _id: 'b1', vehicle: { title: 'Toyota Innova Crysta #01' }, user: { name: 'TCS Corporate' }, bookingName: 'TCS Corporate', startDate: '2026-03-05', endDate: '2026-03-15', totalPrice: 45000, status: 'confirmed', createdAt: new Date().toISOString() },
        { _id: 'b2', vehicle: { title: 'Hyundai Creta #02' }, user: { name: 'MakeMyTrip' }, bookingName: 'MakeMyTrip', startDate: '2026-03-08', endDate: '2026-03-12', totalPrice: 12800, status: 'pending_approval', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: 'b3', vehicle: { title: 'Kia Seltos #05' }, user: { name: 'Wipro Transport' }, bookingName: 'Wipro Transport', startDate: '2026-03-10', endDate: '2026-03-20', totalPrice: 35000, status: 'confirmed', createdAt: new Date(Date.now() - 172800000).toISOString() },
    ];

    const fetchData = async () => {
        if (!isAuthenticated) {
            setStats(demoStats);
            setVehicles(demoVehicles);
            setBookings(demoBookings);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [statsRes, vehiclesRes, bookingsRes] = await Promise.all([
                axios.get('dealers/dashboard/stats'),
                axios.get('dealers/dashboard/vehicles'),
                axios.get('dealers/dashboard/bookings'),
            ]);
            setStats(statsRes.data);
            setVehicles(vehiclesRes.data);
            setBookings(bookingsRes.data);
            if (!user.isProfileComplete) setShowProfileForm(true);
            setLoading(false);
        } catch (error) {
            console.error('Fleet Dashboard error:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        if (isAuthenticated) {
            const interval = setInterval(fetchData, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { toast.error('Please login first'); return; }
        try {
            const { data } = await axios.put('dealers/profile', profileData);
            const updatedUser = { ...user, ...data, isProfileComplete: true };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            toast.success('Fleet profile updated!');
            setShowProfileForm(false);
            window.location.reload();
        } catch (error) { toast.error(error.response?.data?.message || 'Update failed'); }
    };

    const handleBookingStatus = async (id, status) => {
        if (!isAuthenticated) { toast.error('Please login to manage bookings'); return; }
        try { await axios.put(`bookings/${id}/review`, { status }); toast.success(`Booking ${status}`); fetchData(); }
        catch (error) { toast.error('Failed to update status'); }
    };

    // Fleet-specific computed data
    const totalMileage = vehicles.reduce((acc, v) => acc + (v.mileage || 0), 0);
    const avgMileage = vehicles.length > 0 ? Math.round(totalMileage / vehicles.length) : 0;
    const availableCount = vehicles.filter(v => v.availability).length;
    const bookedCount = vehicles.filter(v => !v.availability).length;
    const utilizationRate = vehicles.length > 0 ? Math.round((bookedCount / vehicles.length) * 100) : 0;

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full" />
            <p className="mt-4 text-primary font-serif italic text-xl">Loading your fleet command center...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-8">
            <div className="container mx-auto max-w-7xl">

                {/* Demo Banner */}
                {!isAuthenticated && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-6 py-3 flex justify-between items-center">
                        <p className="text-sm text-blue-400 font-medium">🔒 You're viewing a <span className="font-black">demo preview</span> of the Fleet Dashboard. Login to access your real data.</p>
                        <Link to="/login" className="bg-primary text-background px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">Login Now</Link>
                    </motion.div>
                )}

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <Link to="/" className="text-xs text-textSecondary hover:text-primary transition mb-2 flex items-center gap-1">← Back to Portal</Link>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-serif font-bold text-white underline decoration-blue-500/50 underline-offset-8">Fleet Command</h1>
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Fleet Manager</span>
                        </div>
                        <p className="text-textSecondary">Monitor and manage your entire fleet from one place.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={fetchData} className="p-3 bg-surface rounded-xl border border-gray-800 text-textSecondary hover:text-blue-400 transition-all"><RefreshCw className="w-5 h-5" /></button>
                        <button className="p-3 bg-surface rounded-xl border border-gray-800 text-textSecondary hover:text-blue-400 transition-all relative"><Bell className="w-5 h-5" /><span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" /></button>
                        <div className="h-10 w-[1px] bg-gray-800" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-none">{displayUser.name}</p>
                                <p className="text-[10px] text-blue-400 uppercase tracking-widest mt-1">{displayUser.businessName || 'Fleet Manager'}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">{displayUser.name[0]}</div>
                        </div>
                    </div>
                </header>

                {/* Main Layout */}
                <div className="grid lg:grid-cols-[1fr_3fr] gap-10">
                    <nav className="space-y-2">
                        {[
                            { id: 'overview', icon: <LayoutDashboard />, label: 'Fleet Overview' },
                            { id: 'vehicles', icon: <Truck />, label: 'All Vehicles' },
                            { id: 'bookings', icon: <CalendarCheck />, label: 'Active Bookings' },
                            { id: 'analytics', icon: <BarChart3 />, label: 'Fleet Analytics' },
                            { id: 'earnings', icon: <Wallet />, label: 'Revenue' },
                            { id: 'settings', icon: <Settings />, label: 'Settings' }
                        ].map(item => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === item.id ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20 scale-105' : 'text-textSecondary hover:bg-surface hover:text-white'}`}>{item.icon}{item.label}</button>
                        ))}
                        <div className="pt-10">
                            {isAuthenticated ? (
                                <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold"><X className="w-5 h-5" /> Logout</button>
                            ) : (
                                <Link to="/login" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-blue-400 hover:bg-blue-500/10 transition-all font-bold"><ChevronRight className="w-5 h-5" /> Login to Access</Link>
                            )}
                        </div>
                    </nav>

                    <main className="bg-surface rounded-[2.5rem] border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -z-10" />
                        <AnimatePresence mode="wait">

                            {/* FLEET OVERVIEW */}
                            {activeTab === 'overview' && (
                                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                    <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-blue-600 to-blue-900 overflow-hidden shadow-2xl shadow-blue-500/20">
                                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Truck className="w-6 h-6 text-blue-200" />
                                                <span className="text-[10px] uppercase tracking-[0.3em] text-blue-200 font-black">Fleet Command Center</span>
                                            </div>
                                            <h2 className="text-3xl md:text-5xl font-serif font-black text-white mb-4">Welcome, <span className="italic">{displayUser.name.split(' ')[0]}</span></h2>
                                            <p className="text-blue-100/80 max-w-lg leading-relaxed font-medium">Your fleet of {stats?.totalVehicles || vehicles.length} vehicles is generating ₹{stats?.totalEarnings?.toLocaleString()} in revenue. {utilizationRate}% utilization rate.</p>
                                        </div>
                                    </div>

                                    {/* Fleet Summary Cards */}
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Total Fleet Size', value: stats?.totalVehicles || vehicles.length, icon: <Truck />, accent: 'blue' },
                                            { label: 'Available', value: stats?.activeVehicles || availableCount, icon: <Check />, accent: 'green' },
                                            { label: 'On Rent', value: stats?.bookedVehicles || bookedCount, icon: <Lock />, accent: 'orange' },
                                            { label: 'Active Bookings', value: stats?.totalBookings || bookings.length, icon: <Users />, accent: 'purple' }
                                        ].map((stat, idx) => (
                                            <div key={idx} className="bg-background border border-gray-800 p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-500/5 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-3 bg-surface rounded-xl text-blue-400">{stat.icon}</div>
                                                    <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><TrendingUp className="w-3 h-3" /></div>
                                                </div>
                                                <p className="text-[10px] text-textSecondary uppercase tracking-[0.2em] font-black mb-1 italic">{stat.label}</p>
                                                <p className="text-3xl font-serif font-bold text-white tracking-tight">{stat.value || 0}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Fleet Health & Revenue */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-background border border-gray-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
                                            <div className="flex items-center gap-2 mb-4">
                                                <Gauge className="w-5 h-5 text-blue-400" />
                                                <h3 className="text-xl font-bold text-white italic">Fleet Utilization</h3>
                                            </div>
                                            <p className="text-5xl font-serif font-bold text-blue-400 mb-2 tracking-tighter">{utilizationRate}%</p>
                                            <div className="w-full h-3 bg-surface rounded-full overflow-hidden mt-4">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${utilizationRate}%` }} className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                                            </div>
                                            <p className="text-sm text-textSecondary mt-3 font-medium">{bookedCount} of {vehicles.length} vehicles currently on rent</p>
                                        </div>
                                        <div className="bg-background border border-gray-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all" />
                                            <div className="flex items-center gap-2 mb-4">
                                                <Wallet className="w-5 h-5 text-green-400" />
                                                <h3 className="text-xl font-bold text-white italic">Fleet Revenue</h3>
                                            </div>
                                            <p className="text-5xl font-serif font-bold text-green-400 mb-2 tracking-tighter">₹{stats?.totalEarnings?.toLocaleString()}</p>
                                            <p className="text-sm text-textSecondary font-medium">After 10% platform commission</p>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="bg-background border border-gray-800 p-8 rounded-[2rem]">
                                        <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-800 pb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-400" /> Recent Fleet Activity</h3>
                                        <div className="space-y-6">
                                            {stats?.recentActivity?.length > 0 ? stats.recentActivity.map((activity, idx) => (
                                                <div key={idx} className="flex gap-4 items-start group">
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-400"><Bell className="w-4 h-4" /></div>
                                                    <div>
                                                        <p className="text-white text-sm">New booking for <span className="font-bold text-blue-400">{activity.vehicle?.title}</span> by <span className="text-gray-300">{activity.user?.name || activity.bookingName}</span></p>
                                                        <p className="text-[10px] text-textSecondary mt-1 uppercase tracking-tighter">{new Date(activity.createdAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            )) : (<p className="text-textSecondary italic">No recent fleet activity.</p>)}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ALL VEHICLES */}
                            {activeTab === 'vehicles' && (
                                <motion.div key="vehicles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                                        <div>
                                            <h2 className="text-2xl font-serif font-bold text-white">Fleet Inventory</h2>
                                            <p className="text-xs text-textSecondary italic mt-1 uppercase tracking-widest">{vehicles.length} vehicles across your fleet</p>
                                        </div>
                                    </div>

                                    {/* Vehicle Status Summary */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 text-center">
                                            <p className="text-2xl font-bold text-green-400">{availableCount}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-green-400/70 font-bold">Available</p>
                                        </div>
                                        <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 text-center">
                                            <p className="text-2xl font-bold text-orange-400">{bookedCount}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-orange-400/70 font-bold">On Rent</p>
                                        </div>
                                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 text-center">
                                            <p className="text-2xl font-bold text-blue-400">{vehicles.length}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-blue-400/70 font-bold">Total</p>
                                        </div>
                                    </div>

                                    {/* Vehicle Table */}
                                    <div className="bg-background border border-gray-800 rounded-[2rem] overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-surface/50 text-[10px] uppercase font-black tracking-[0.2em] text-textSecondary">
                                                    <tr>
                                                        <th className="px-6 py-4">Vehicle</th>
                                                        <th className="px-6 py-4">Location</th>
                                                        <th className="px-6 py-4">Rate/Day</th>
                                                        <th className="px-6 py-4">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800/50">
                                                    {vehicles.map(vehicle => (
                                                        <tr key={vehicle._id} className="hover:bg-blue-500/5 transition-colors">
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center"><Truck className="w-5 h-5 text-blue-400" /></div>
                                                                    <div>
                                                                        <p className="text-white font-bold text-sm">{vehicle.title}</p>
                                                                        <p className="text-[10px] text-textSecondary">{vehicle.brand} {vehicle.model}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 text-sm text-textSecondary">
                                                                <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400/60" />{vehicle.location}, {vehicle.city}</div>
                                                            </td>
                                                            <td className="px-6 py-5 text-sm text-blue-400 font-bold">₹{vehicle.pricePerDay}</td>
                                                            <td className="px-6 py-5">
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${vehicle.availability ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                                                    {vehicle.availability ? 'Available' : 'On Rent'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ACTIVE BOOKINGS */}
                            {activeTab === 'bookings' && (
                                <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif font-bold text-white">Fleet Bookings</h2>
                                    <div className="space-y-6">
                                        {bookings.length > 0 ? bookings.map(booking => (
                                            <div key={booking._id} className="bg-background border border-gray-800 rounded-3xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                                                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] uppercase font-black italic tracking-widest ${booking.status === 'pending_approval' ? 'bg-orange-500 text-white' : booking.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}>{booking.status.replace('_', ' ')}</div>
                                                <div className="w-full md:w-32 h-32 bg-surface rounded-2xl shrink-0 flex items-center justify-center overflow-hidden border border-gray-800"><Truck className="w-10 h-10 text-blue-400/30" /></div>
                                                <div className="flex-grow">
                                                    <h3 className="text-xl font-bold text-white mb-2">{booking.vehicle?.title || 'Unknown Vehicle'}</h3>
                                                    <div className="space-y-1 text-sm text-textSecondary mb-4">
                                                        <p className="flex items-center gap-2"><Users className="w-3 h-3 text-blue-400" /> {booking.user?.name || booking.bookingName}</p>
                                                        <p className="flex items-center gap-2"><CalendarCheck className="w-3 h-3 text-blue-400" /> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                                                        <p className="flex items-center gap-2 font-bold text-blue-400">₹{booking.finalAmount || booking.totalPrice}</p>
                                                    </div>
                                                    {booking.status === 'pending_approval' && (
                                                        <div className="flex gap-4">
                                                            <button onClick={() => handleBookingStatus(booking._id, 'approved')} className="flex-1 bg-green-500/10 text-green-500 border border-green-500/20 py-2 rounded-xl text-xs font-bold hover:bg-green-500 hover:text-white transition-all">Approve</button>
                                                            <button onClick={() => handleBookingStatus(booking._id, 'rejected')} className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Deny</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-20 bg-background/50 rounded-3xl border border-dashed border-gray-800"><CalendarCheck className="w-12 h-12 text-gray-800 mx-auto mb-4" /><p className="text-textSecondary italic">No fleet bookings yet.</p></div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* FLEET ANALYTICS */}
                            {activeTab === 'analytics' && (
                                <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif font-bold text-white">Fleet Analytics</h2>

                                    {/* KPI Cards */}
                                    <div className="grid sm:grid-cols-3 gap-6">
                                        <div className="bg-background border border-gray-800 p-8 rounded-[2rem] text-center">
                                            <Gauge className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                                            <p className="text-4xl font-serif font-bold text-blue-400">{utilizationRate}%</p>
                                            <p className="text-[10px] uppercase tracking-widest text-textSecondary font-bold mt-2">Utilization Rate</p>
                                        </div>
                                        <div className="bg-background border border-gray-800 p-8 rounded-[2rem] text-center">
                                            <Route className="w-10 h-10 text-green-400 mx-auto mb-4" />
                                            <p className="text-4xl font-serif font-bold text-green-400">{avgMileage.toLocaleString()}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-textSecondary font-bold mt-2">Avg KM / Vehicle</p>
                                        </div>
                                        <div className="bg-background border border-gray-800 p-8 rounded-[2rem] text-center">
                                            <Shield className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                                            <p className="text-4xl font-serif font-bold text-purple-400">{vehicles.length}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-textSecondary font-bold mt-2">Total Vehicles</p>
                                        </div>
                                    </div>

                                    {/* Vehicle Distribution */}
                                    <div className="bg-background border border-gray-800 p-8 rounded-[2.5rem]">
                                        <h3 className="text-lg font-bold text-white mb-6">Vehicle Distribution by Brand</h3>
                                        <div className="space-y-4">
                                            {Object.entries(vehicles.reduce((acc, v) => {
                                                acc[v.brand] = (acc[v.brand] || 0) + 1;
                                                return acc;
                                            }, {})).map(([brand, count]) => (
                                                <div key={brand} className="flex items-center gap-4">
                                                    <span className="text-sm text-white font-medium w-32 truncate">{brand}</span>
                                                    <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(count / vehicles.length) * 100}%` }} className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                                                    </div>
                                                    <span className="text-sm text-blue-400 font-bold w-8 text-right">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* City Coverage */}
                                    <div className="bg-background border border-gray-800 p-8 rounded-[2.5rem]">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-400" /> Fleet Locations</h3>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[...new Set(vehicles.map(v => v.location))].map(location => {
                                                const count = vehicles.filter(v => v.location === location).length;
                                                return (
                                                    <div key={location} className="bg-surface border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
                                                        <span className="text-sm text-white font-medium">{location}</span>
                                                        <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full font-bold">{count} units</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* EARNINGS */}
                            {activeTab === 'earnings' && (
                                <motion.div key="earnings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif font-bold text-white text-center mb-10">Fleet Revenue</h2>
                                    <div className="bg-background border border-gray-800 p-10 rounded-[3rem] text-center space-y-4">
                                        <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                                        <h3 className="text-xl font-bold text-white">Total Fleet Revenue</h3>
                                        <p className="text-5xl font-serif font-bold text-blue-400">₹{stats?.totalEarnings?.toLocaleString()}</p>
                                        <p className="text-sm text-textSecondary italic">After 10% platform commission. Next payout scheduled for 5th of next month.</p>
                                    </div>
                                    <div className="bg-background border border-gray-800 rounded-[2.5rem] overflow-hidden">
                                        <div className="p-8 border-b border-gray-800"><h3 className="text-xl font-bold text-white">Booking Revenue</h3><p className="text-xs text-textSecondary mt-1 uppercase tracking-widest font-black italic">From confirmed bookings</p></div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-surface/50 text-[10px] uppercase font-black tracking-[0.2em] text-textSecondary"><tr><th className="px-8 py-4">Ref</th><th className="px-8 py-4">Date</th><th className="px-8 py-4">Vehicle</th><th className="px-8 py-4">Amount</th><th className="px-8 py-4">Status</th></tr></thead>
                                                <tbody className="divide-y divide-gray-800/50">
                                                    {bookings.filter(b => b.status === 'approved' || b.status === 'confirmed').length > 0 ? (
                                                        bookings.filter(b => b.status === 'approved' || b.status === 'confirmed').slice(0, 10).map(b => (
                                                            <tr key={b._id} className="hover:bg-blue-500/5 transition-colors">
                                                                <td className="px-8 py-6 text-xs font-mono text-gray-500">#{b._id.slice(-6).toUpperCase()}</td>
                                                                <td className="px-8 py-6 text-sm text-white font-medium">{new Date(b.createdAt).toLocaleDateString()}</td>
                                                                <td className="px-8 py-6 text-sm text-textSecondary">{b.vehicle?.title}</td>
                                                                <td className="px-8 py-6 text-sm text-blue-400 font-bold">₹{(b.totalPrice * 0.9).toLocaleString()}</td>
                                                                <td className="px-8 py-6"><span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20 italic">Disbursed</span></td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan="5" className="px-8 py-20 text-center text-textSecondary italic">No revenue records yet.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SETTINGS */}
                            {activeTab === 'settings' && (
                                <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif font-bold text-white">Fleet Account</h2>
                                    <div className="bg-background border border-gray-800 p-8 rounded-[2rem] space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-xs uppercase tracking-widest text-blue-400 font-bold">Fleet Identity</p>
                                            <div className="flex items-center gap-4 bg-surface p-4 rounded-2xl border border-gray-800">
                                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">{displayUser.name[0]}</div>
                                                <div><p className="text-white font-bold">{displayUser.name}</p><p className="text-xs text-textSecondary">{displayUser.email}</p></div>
                                                <span className="ml-auto text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-blue-500/20">Fleet Manager</span>
                                            </div>
                                        </div>
                                        <button onClick={() => { if (!isAuthenticated) { toast.error('Login required'); return; } setShowProfileForm(true); }} className="w-full py-4 rounded-xl flex items-center justify-center gap-2 border border-gray-800 text-textSecondary hover:border-blue-500/30 hover:text-blue-400 transition-all font-bold">Update Profile Details <Edit className="w-4 h-4" /></button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {showProfileForm && isAuthenticated && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="w-full max-w-xl bg-surface border border-gray-800 rounded-[3rem] p-10 shadow-2xl relative">
                            {!user?.isProfileComplete && (<div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce">Action Required</div>)}
                            <h2 className="text-3xl font-serif font-bold text-blue-400 mb-2">Fleet Profile</h2>
                            <p className="text-textSecondary mb-8 text-sm italic">{!user?.isProfileComplete ? "Set up your fleet manager profile." : "Keep your details updated."}</p>
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">Full Name</label><input type="text" required className="input-field" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} /></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">Contact Number</label><input type="tel" required className="input-field" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} /></div></div>
                                <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">Fleet / Company Name</label><input type="text" required className="input-field" value={profileData.businessName} onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })} /></div>
                                <div className="grid md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">City</label><input type="text" required className="input-field" value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} /></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-textSecondary font-bold pl-1">Location</label><input type="text" required className="input-field" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} /></div></div>
                                <div className="pt-6 flex gap-4"><button type="submit" className="flex-1 bg-blue-500 text-white py-4 rounded-2xl shadow-xl shadow-blue-500/20 font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-colors">Save & Continue</button>{user?.isProfileComplete && (<button type="button" onClick={() => setShowProfileForm(false)} className="px-6 border border-gray-800 text-textSecondary rounded-2xl">Cancel</button>)}</div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FleetDashboard;
