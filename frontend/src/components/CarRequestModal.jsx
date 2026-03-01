import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, MapPin, Car, MessageSquare } from 'lucide-react';
import axios from '../utils/api';
import toast from 'react-hot-toast';

const CarRequestModal = ({ isOpen, onClose, initialCity }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: initialCity || '',
        vehicleType: 'car',
        requirements: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('dealers/dashboard/car-requests', formData);
            toast.success('Your request has been sent to our dealer network!');
            onClose();
            setFormData({ name: '', email: '', phone: '', city: '', vehicleType: 'car', requirements: '' });
        } catch (error) {
            toast.error('Failed to send request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg bg-surface border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-2">Can't Find Your Ride?</h2>
                        <p className="text-sm text-textSecondary italic">Submit a custom request and our premium dealers will find it for you.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-primary/40" />
                            <input type="text" required className="input-field pl-10" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-primary/40" />
                            <input type="email" required className="input-field pl-10" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-primary/40" />
                            <input type="tel" required className="input-field pl-10" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-primary/40" />
                            <input type="text" required className="input-field pl-10" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-primary tracking-widest pl-1">Vehicle Preference</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['car', 'bike', 'caravan'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, vehicleType: type })}
                                    className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${formData.vehicleType === type ? 'bg-primary text-background border-primary' : 'bg-background text-textSecondary border-gray-800'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-primary/40" />
                        <textarea required className="input-field pl-10 h-24 pt-3" placeholder="Tell us about the vehicle you need (Model, Budget, Dates)..." value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} />
                    </div>

                    <button disabled={loading} type="submit" className="w-full btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 group">
                        {loading ? 'Sending Request...' : 'Submit Request'}
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default CarRequestModal;
