import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, CreditCard, FileText, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingFormModal = ({ isOpen, onClose, onSubmit, vehicle, priceBreakdown }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        aadhaarImage: '',
        licenseImage: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you'd upload to S3/Cloudinary. 
            // For this demo, we'll use a local URL or a placeholder.
            const fakeUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, [field]: fakeUrl }));
            toast.success(`${field === 'aadhaarImage' ? 'Aadhaar' : 'License'} uploaded!`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        const { fullName, email, phone, address, aadhaarImage, licenseImage } = formData;
        if (!fullName || !email || !phone || !address || !aadhaarImage || !licenseImage) {
            toast.error('All details are mandatory. Please fill in all fields and upload documents.');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-surface border border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-1">Rental Application</h2>
                        <p className="text-textSecondary text-sm">Submit your documents for dealer verification.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-textSecondary hover:text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {success ? (
                        <div className="py-12 text-center space-y-6">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                                <p className="text-textSecondary max-w-sm mx-auto">
                                    Your request is now <span className="text-primary font-bold italic">"Pending Approval"</span>.
                                    The dealer will review your documents shortly.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Details Section */}
                            <div className="space-y-6">
                                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-primary flex items-center gap-2">
                                    <User className="w-3 h-3" /> Personal Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-700"
                                                placeholder="Enter your legal name"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-700"
                                                placeholder="example@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                            <input
                                                type="tel"
                                                required
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-700"
                                                placeholder="+91 99XXX XXXXX"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Residential Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-700"
                                                placeholder="City, State"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Document Upload Section */}
                            <div className="space-y-6">
                                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-primary flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> Mandatory Documents
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Aadhaar Upload */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Aadhaar Card</label>
                                        <div className={`relative h-40 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all group ${formData.aadhaarImage ? 'border-green-500/50 bg-green-500/5' : 'border-gray-800 hover:border-primary/50 bg-background'}`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => handleFileUpload(e, 'aadhaarImage')}
                                            />
                                            {formData.aadhaarImage ? (
                                                <div className="text-center">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                                    <span className="text-xs text-green-500 font-bold">Document Loaded</span>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="w-10 h-10 text-gray-700 group-hover:text-primary transition-colors mx-auto mb-2" />
                                                    <span className="text-xs text-textSecondary uppercase tracking-widest font-bold">Upload Aadhaar</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* License Upload */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Driving License</label>
                                        <div className={`relative h-40 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all group ${formData.licenseImage ? 'border-green-500/50 bg-green-500/5' : 'border-gray-800 hover:border-primary/50 bg-background'}`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => handleFileUpload(e, 'licenseImage')}
                                            />
                                            {formData.licenseImage ? (
                                                <div className="text-center">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                                    <span className="text-xs text-green-500 font-bold">Document Loaded</span>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="w-10 h-10 text-gray-700 group-hover:text-primary transition-colors mx-auto mb-2" />
                                                    <span className="text-xs text-textSecondary uppercase tracking-widest font-bold">Upload License</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-orange-200/70 leading-relaxed font-medium capitalize">
                                    Your details will be reviewed by the dealer. once approved, you'll be able to proceed with the payment of <span className="text-white font-bold">₹{priceBreakdown?.total?.toLocaleString('en-IN')}</span> and confirm your luxury experience.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-background font-bold py-6 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Application'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BookingFormModal;
