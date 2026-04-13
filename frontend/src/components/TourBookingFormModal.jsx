import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    X, User, Mail, Phone, Calendar, Users, MapPin,
    CreditCard, Upload, CheckCircle2, Loader2, Camera,
    ShieldCheck, Utensils, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const FileUploadField = ({ label, hint, accept, onChange, value }) => {
    const inputRef = useRef();
    return (
        <div className="space-y-2">
            <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">{label}</label>
            <button
                type="button"
                onClick={() => inputRef.current.click()}
                className="w-full bg-background border border-gray-800 rounded-2xl py-4 px-4 text-left flex items-center gap-3 hover:border-primary/50 transition-all group"
            >
                <Upload className="w-4 h-4 text-primary/40 group-hover:text-primary shrink-0 transition-colors" />
                <span className={`text-sm truncate ${value ? 'text-white' : 'text-gray-600'}`}>
                    {value ? value.name : hint}
                </span>
                {value && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
            </button>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => onChange(e.target.files[0] || null)}
            />
        </div>
    );
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-5">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h3>
        <div className="flex-1 h-px bg-gray-800" />
        {subtitle && <span className="text-[10px] text-primary/60 uppercase tracking-wider">{subtitle}</span>}
    </div>
);

const TourBookingFormModal = ({ isOpen, onClose, onSubmit, packageName, price, duration }) => {
    const [step, setStep] = useState(1); // 1 = Personal, 2 = ID & Verification, 3 = Tour Preferences

    const [formData, setFormData] = useState({
        // Personal
        fullName: '',
        email: '',
        phone: '',
        age: '',
        // Group
        groupSize: 1,
        pickupLocation: '',
        dietaryPreference: '',
        specialRequests: '',
        // ID
        aadhaarNumber: '',
    });

    const [files, setFiles] = useState({
        aadhaarFront: null,
        aadhaarBack: null,
        selfie: null,
        passport: null,
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFile = (key) => (file) => {
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    const validateStep = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.phone || !formData.age) {
                toast.error('Please fill in all personal details');
                return false;
            }
            if (parseInt(formData.age) < 18) {
                toast.error('You must be at least 18 years old to book');
                return false;
            }
        }
        if (step === 2) {
            if (!formData.aadhaarNumber || formData.aadhaarNumber.replace(/\s/g, '').length < 12) {
                toast.error('Please enter a valid 12-digit Aadhaar number');
                return false;
            }
            if (!files.aadhaarFront || !files.aadhaarBack) {
                toast.error('Please upload both sides of your Aadhaar card');
                return false;
            }
            if (!files.selfie) {
                toast.error('Please upload a selfie for identity verification');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) setStep(s => s + 1);
    };

    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.pickupLocation) {
            toast.error('Please enter your pickup location');
            return;
        }
        setLoading(true);
        try {
            await onSubmit({ ...formData, files });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setStep(1);
            }, 2500);
        } catch {
            toast.error('Failed to process booking');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalPayable = (price || 0) + 499;

    const stepLabels = ['Personal Details', 'ID Verification', 'Tour Preferences'];

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
                <div className="p-8 border-b border-gray-800 flex justify-between items-start bg-white/5">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-1">Book Your Experience</h2>
                        <p className="text-textSecondary text-sm">{packageName} &mdash; {duration}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-textSecondary hover:text-white transition-all mt-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Step Indicator */}
                {!success && (
                    <div className="px-8 pt-6 flex items-center gap-2">
                        {stepLabels.map((label, i) => (
                            <div key={i} className="flex items-center gap-2 flex-1">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary text-background' : 'bg-gray-800 text-textSecondary'}`}>
                                    {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider font-bold hidden sm:block ${step === i + 1 ? 'text-primary' : 'text-textSecondary'}`}>{label}</span>
                                {i < stepLabels.length - 1 && <div className={`flex-1 h-px transition-all ${step > i + 1 ? 'bg-green-500/50' : 'bg-gray-800'}`} />}
                            </div>
                        ))}
                    </div>
                )}

                <div className="p-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
                    {success ? (
                        <div className="py-12 text-center space-y-6">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Details Confirmed!</h3>
                                <p className="text-textSecondary max-w-sm mx-auto">
                                    Proceeding to secure payment for your luxury experience.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* ── Step 1: Personal Details ── */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <SectionHeader icon={User} title="Personal Details" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    required
                                                    className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                                    placeholder="Enter your full name"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Age */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Age</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                                <input
                                                    type="number"
                                                    name="age"
                                                    min="18"
                                                    max="100"
                                                    required
                                                    className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                                    placeholder="e.g. 28"
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                                    placeholder="example@email.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                                    placeholder="+91 98765 43210"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Group Size */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Group Size (including yourself)</label>
                                            <div className="relative">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                                <input
                                                    type="number"
                                                    name="groupSize"
                                                    min="1"
                                                    max="20"
                                                    required
                                                    className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                                    value={formData.groupSize}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <p className="text-[11px] text-textSecondary pl-1">All group members must carry valid government ID during the tour.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 2: ID & Verification ── */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <SectionHeader icon={ShieldCheck} title="ID & Verification" subtitle="India-Specific" />

                                    {/* Aadhaar Number */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Aadhaar Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                            <input
                                                type="text"
                                                name="aadhaarNumber"
                                                required
                                                maxLength={14}
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all tracking-widest"
                                                placeholder="XXXX XXXX XXXX"
                                                value={formData.aadhaarNumber}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                                                    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                                                    setFormData(prev => ({ ...prev, aadhaarNumber: formatted }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Aadhaar Upload — Front + Back */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FileUploadField
                                            label="Upload Aadhaar (Front)"
                                            hint="Click to upload front side"
                                            accept="image/*,application/pdf"
                                            value={files.aadhaarFront}
                                            onChange={handleFile('aadhaarFront')}
                                        />
                                        <FileUploadField
                                            label="Upload Aadhaar (Back)"
                                            hint="Click to upload back side"
                                            accept="image/*,application/pdf"
                                            value={files.aadhaarBack}
                                            onChange={handleFile('aadhaarBack')}
                                        />
                                    </div>

                                    {/* Selfie */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1 flex items-center gap-2">
                                            <Camera className="w-3.5 h-3.5 text-primary/60" /> Selfie for Verification
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('tour-selfie-input').click()}
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 px-4 flex items-center gap-3 hover:border-primary/50 transition-all group"
                                        >
                                            <Camera className="w-4 h-4 text-primary/40 group-hover:text-primary shrink-0 transition-colors" />
                                            <span className={`text-sm truncate ${files.selfie ? 'text-white' : 'text-gray-600'}`}>
                                                {files.selfie ? files.selfie.name : 'Click to upload a clear selfie'}
                                            </span>
                                            {files.selfie && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
                                        </button>
                                        <input
                                            id="tour-selfie-input"
                                            type="file"
                                            accept="image/*"
                                            capture="user"
                                            className="hidden"
                                            onChange={(e) => handleFile('selfie')(e.target.files[0] || null)}
                                        />
                                        <p className="text-[11px] text-textSecondary pl-1">Your face must be clearly visible and match the uploaded Aadhaar photo.</p>
                                    </div>

                                    {/* Passport — Optional */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1 flex items-center gap-2">
                                            <CreditCard className="w-3.5 h-3.5 text-primary/60" />
                                            Passport
                                            <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 text-[9px] uppercase tracking-wider font-bold">Optional</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('tour-passport-input').click()}
                                            className="w-full bg-background border border-dashed border-gray-700 rounded-2xl py-4 px-4 flex items-center gap-3 hover:border-primary/40 transition-all group"
                                        >
                                            <Upload className="w-4 h-4 text-primary/30 group-hover:text-primary shrink-0 transition-colors" />
                                            <span className={`text-sm truncate ${files.passport ? 'text-white' : 'text-gray-600'}`}>
                                                {files.passport ? files.passport.name : 'Upload passport (if available)'}
                                            </span>
                                            {files.passport && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
                                        </button>
                                        <input
                                            id="tour-passport-input"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="hidden"
                                            onChange={(e) => handleFile('passport')(e.target.files[0] || null)}
                                        />
                                        <p className="text-[11px] text-textSecondary pl-1">Required only for international travelers or cross-border tour routes.</p>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 3: Tour Preferences ── */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <SectionHeader icon={MapPin} title="Tour Preferences" />

                                    {/* Pickup Location */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Pickup Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                            <input
                                                type="text"
                                                name="pickupLocation"
                                                required
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                                placeholder="e.g. Hotel Taj, MG Road, Jaipur"
                                                value={formData.pickupLocation}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <p className="text-[11px] text-textSecondary pl-1">Our team will pick you up from this location on the departure date.</p>
                                    </div>

                                    {/* Dietary Preference */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Dietary Preference</label>
                                        <div className="relative">
                                            <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                            <select
                                                name="dietaryPreference"
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all appearance-none"
                                                value={formData.dietaryPreference}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select preference</option>
                                                <option value="vegetarian">Vegetarian</option>
                                                <option value="non-vegetarian">Non-Vegetarian</option>
                                                <option value="vegan">Vegan</option>
                                                <option value="jain">Jain</option>
                                                <option value="no-preference">No Preference</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Special Requests */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Special Requests</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-primary/40" />
                                            <textarea
                                                name="specialRequests"
                                                rows={4}
                                                className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all resize-none"
                                                placeholder="Accessibility needs, anniversary surprises, extra luggage, etc."
                                                value={formData.specialRequests}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="p-6 bg-surface/50 border border-gray-800 rounded-[2rem] space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-textSecondary">Package Price</span>
                                            <span className="text-white font-medium">₹{(price || 0).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pb-4 border-b border-gray-800/50">
                                            <span className="text-textSecondary">Service & Documentation</span>
                                            <span className="text-white font-medium">₹499</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <div>
                                                <span className="text-textSecondary text-xs uppercase tracking-[0.2em] block">Total Payable</span>
                                                <span className="text-[10px] text-primary/60 italic font-medium">Includes Transfers & Entry Fees</span>
                                            </div>
                                            <span className="text-4xl font-bold text-white">₹{totalPayable.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 pt-2">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex-1 py-4 rounded-2xl border border-gray-700 text-textSecondary font-bold hover:border-primary/40 hover:text-white transition-all"
                                    >
                                        Back
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex-1 bg-primary text-background font-bold py-4 rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-primary text-background font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm & Proceed to Pay'}
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default TourBookingFormModal;
