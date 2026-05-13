import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Phone, Calendar, CreditCard, Upload, CheckCircle2, Loader2, Camera, ShieldCheck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const COUNTRIES = [
    'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium',
    'Brazil','Canada','Chile','China','Colombia','Czech Republic','Denmark','Egypt','Ethiopia',
    'Finland','France','Germany','Ghana','Greece','Hungary','Indonesia','Iran','Iraq','Ireland',
    'Israel','Italy','Japan','Jordan','Kenya','Malaysia','Mexico','Morocco','Myanmar','Nepal',
    'Netherlands','New Zealand','Nigeria','Norway','Pakistan','Philippines','Poland','Portugal',
    'Romania','Russia','Saudi Arabia','Singapore','South Africa','South Korea','Spain','Sri Lanka',
    'Sweden','Switzerland','Thailand','Turkey','Ukraine','United Arab Emirates','United Kingdom',
    'United States','Vietnam','Other'
];

const FileUploadField = ({ label, hint, accept, onChange, value, optional = false, dashed = false }) => {
    const inputRef = useRef();
    return (
        <div className="space-y-2">
            <label className="text-xs text-textSecondary uppercase tracking-widest pl-1 flex items-center gap-2">
                {label}
                {optional && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 text-[9px] uppercase tracking-wider font-bold">Optional</span>
                )}
            </label>
            <button
                type="button"
                onClick={() => inputRef.current.click()}
                className={`w-full bg-background rounded-2xl py-4 px-4 text-left flex items-center gap-3 transition-all group ${dashed ? 'border border-dashed border-gray-700 hover:border-primary/40' : 'border border-gray-800 hover:border-primary/50'}`}
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

const BookingFormModal = ({ isOpen, onClose, onSubmit, packageName, price }) => {
    const [isForeigner, setIsForeigner] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        drivingLicenseNumber: '',
        aadhaarNumber: '',
        country: '',
    });

    const [files, setFiles] = useState({
        licenseFront: null,
        aadhaarDoc: null,
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Driving License always required
        if (!files.licenseFront) {
            toast.error('Please upload your Driving License');
            return;
        }

        // Selfie always required
        if (!files.selfie) {
            toast.error('Please upload a selfie');
            return;
        }

        if (!isForeigner) {
            // Indian national
            if (!files.aadhaarDoc || !files.aadhaarBack) {
                toast.error('Please upload both sides of your Aadhaar card');
                return;
            }
        } else {
            // Foreign national
            if (!formData.country) {
                toast.error('Please select your country');
                return;
            }
            if (!files.passport) {
                toast.error('Passport upload is required for foreign nationals');
                return;
            }
        }

        setLoading(true);
        try {
            const fileToDataUrl = (file) => new Promise((resolve, reject) => {
                if (!file) return resolve(null);
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            const fileUrls = {
                licenseFront: await fileToDataUrl(files.licenseFront),
                aadhaarDoc: await fileToDataUrl(files.aadhaarDoc),
                aadhaarBack: await fileToDataUrl(files.aadhaarBack),
                selfie: await fileToDataUrl(files.selfie),
                passport: await fileToDataUrl(files.passport),
            };
            await onSubmit({ ...formData, isForeigner, files: fileUrls });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2500);
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Failed to process booking';
            toast.error(msg);
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
                        <h2 className="text-3xl font-serif font-bold text-white mb-1">Traveler Information</h2>
                        <p className="text-textSecondary text-sm">Please finalize your details for {packageName}.</p>
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
                                    Your request is pending dealer approval. You'll be notified once confirmed.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* ── Personal Details ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <input type="text" name="fullName" required
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                            placeholder="Enter your name"
                                            value={formData.fullName} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <input type="email" name="email" required
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                            placeholder="example@email.com"
                                            value={formData.email} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <input type="tel" name="phone" required
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Age</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <input type="number" name="age" required min="18" max="100"
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                            placeholder="e.g. 28"
                                            value={formData.age} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            {/* ── ID & Verification ── */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">ID & Verification</h3>
                                    <div className="flex-1 h-px bg-gray-800" />
                                    <span className="text-[10px] text-primary/60 uppercase tracking-wider">India-Specific</span>
                                </div>

                                {/* Foreign National Toggle */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForeigner(prev => !prev);
                                        setFormData(prev => ({ ...prev, aadhaarNumber: '', country: '' }));
                                        setFiles(prev => ({ ...prev, aadhaarDoc: null, aadhaarBack: null, selfie: null }));
                                    }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${isForeigner ? 'border-primary/50 bg-primary/5' : 'border-gray-800 bg-background hover:border-gray-700'}`}
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-all ${isForeigner ? 'bg-primary border-primary' : 'border-gray-600 bg-transparent'}`}>
                                        {isForeigner && (
                                            <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 12 12">
                                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-bold transition-colors ${isForeigner ? 'text-white' : 'text-textSecondary'}`}>I am a Foreign National</p>
                                        <p className="text-[11px] text-textSecondary mt-0.5">Please upload a valid passport to proceed</p>
                                    </div>
                                </button>

                                {/* Driving License — always required */}
                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Driving License Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <input type="text" name="drivingLicenseNumber" required
                                            className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all tracking-widest"
                                            placeholder="e.g. DL-0420110012345"
                                            value={formData.drivingLicenseNumber} onChange={handleChange} />
                                    </div>
                                </div>

                                <FileUploadField
                                    label="Upload License"
                                    hint="Click to upload your Driving License"
                                    accept="image/*,application/pdf"
                                    value={files.licenseFront}
                                    onChange={handleFile('licenseFront')}
                                />

                                {/* ── Indian National fields ── */}
                                {!isForeigner && (
                                    <div className="space-y-5">
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FileUploadField
                                                label="Upload Aadhaar (Front)"
                                                hint="Click to upload front side"
                                                accept="image/*,application/pdf"
                                                value={files.aadhaarDoc}
                                                onChange={handleFile('aadhaarDoc')}
                                            />
                                            <FileUploadField
                                                label="Upload Aadhaar (Back)"
                                                hint="Click to upload back side"
                                                accept="image/*,application/pdf"
                                                value={files.aadhaarBack}
                                                onChange={handleFile('aadhaarBack')}
                                            />
                                        </div>

                                        {/* Passport optional for Indians */}
                                        <FileUploadField
                                            label="Passport"
                                            hint="Upload passport (if available)"
                                            accept="image/*,application/pdf"
                                            value={files.passport}
                                            onChange={handleFile('passport')}
                                            optional={true}
                                            dashed={true}
                                        />
                                        <p className="text-[11px] text-textSecondary pl-1 -mt-3">Required only for international travelers or if renting in border areas.</p>
                                    </div>
                                )}

                                {/* ── Foreign National fields ── */}
                                {isForeigner && (
                                    <div className="space-y-5">
                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Foreign National Mode</p>
                                            <p className="text-[11px] text-textSecondary">Aadhaar is not required. Please upload a valid passport to proceed.</p>
                                        </div>

                                        {/* Country dropdown */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-textSecondary uppercase tracking-widest pl-1">Country / Nationality</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                                                <select
                                                    name="country"
                                                    required
                                                    className="w-full bg-background border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all appearance-none"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select your country</option>
                                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <FileUploadField
                                            label="Passport"
                                            hint="Click to upload your passport"
                                            accept="image/*,application/pdf"
                                            value={files.passport}
                                            onChange={handleFile('passport')}
                                        />
                                        <p className="text-[11px] text-textSecondary pl-1">Upload the photo page of your passport clearly showing your name and photo.</p>
                                    </div>
                                )}

                                {/* Selfie — always required */}
                                <div className="space-y-2">
                                    <label className="text-xs text-textSecondary uppercase tracking-widest pl-1 flex items-center gap-2">
                                        <Camera className="w-3.5 h-3.5 text-primary/60" />
                                        Selfie
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('selfie-input').click()}
                                        className="w-full bg-background border border-gray-800 rounded-2xl py-4 px-4 flex items-center gap-3 hover:border-primary/50 transition-all group"
                                    >
                                        <Camera className="w-4 h-4 text-primary/40 group-hover:text-primary shrink-0 transition-colors" />
                                        <span className={`text-sm truncate ${files.selfie ? 'text-white' : 'text-gray-600'}`}>
                                            {files.selfie ? files.selfie.name : 'Click to upload a clear selfie'}
                                        </span>
                                        {files.selfie && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
                                    </button>
                                    <input id="selfie-input" type="file" accept="image/*" capture="user"
                                        className="hidden"
                                        onChange={(e) => handleFile('selfie')(e.target.files[0] || null)} />
                                    <p className="text-[11px] text-textSecondary pl-1">Make sure your face is clearly visible and matches your ID.</p>
                                </div>
                            </div>

                            {/* ── Price Summary ── */}
                            <div className="p-6 bg-surface/50 border border-gray-800 rounded-[2rem] space-y-4">
                                <div className="flex justify-between items-center text-sm pb-4 border-b border-gray-800/50">
                                    <span className="text-textSecondary">Service & Documentation</span>
                                    <span className="text-white font-medium">₹499</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div>
                                        <span className="text-textSecondary text-xs uppercase tracking-[0.2em] block">Total Payable</span>
                                        <span className="text-[10px] text-primary/60 italic font-medium">Included: Luxury Transfers & Entry Fees</span>
                                    </div>
                                    <span className="text-4xl font-bold text-white">₹{((price || 0) + 499).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-background font-bold py-6 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm & Proceed to Pay'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BookingFormModal;
