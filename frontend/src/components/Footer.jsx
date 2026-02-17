import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface pt-20 pb-10 border-t border-gray-800">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-3xl font-serif font-bold text-primary mb-6 block">
                            UrbanCruizo
                        </Link>
                        <p className="text-textSecondary leading-relaxed">
                            Your premium gateway to local dealers for Cars, Bikes, and Luxury Caravans across India.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 italic">Quick Links</h4>
                        <ul className="space-y-4 text-textSecondary">
                            <li><Link to="/home" className="hover:text-primary transition">Destinations</Link></li>
                            <li><Link to="/vehicles" className="hover:text-primary transition">Our Fleet</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition">Member Login</Link></li>
                            <li><Link to="/register" className="hover:text-primary transition">Join Club</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 italic">Support</h4>
                        <ul className="space-y-4 text-textSecondary">
                            <li><Link to="/help-center" className="hover:text-primary transition">Help Center</Link></li>
                            <li><Link to="/rental-policy" className="hover:text-primary transition">Rental Policy</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-primary transition">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-primary transition">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 italic">Connect</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="p-2 rounded-full bg-background border border-gray-800 text-primary hover:bg-primary hover:text-background transition duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-background border border-gray-800 text-primary hover:bg-primary hover:text-background transition duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-background border border-gray-800 text-primary hover:bg-primary hover:text-background transition duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                        <div className="space-y-3 text-textSecondary text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" /> concierge@urbancruizo.com
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" /> +91 7827064282
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} UrbanCruizo. Designed for the adventurous elite.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-600 uppercase tracking-widest">
                        <span>Made in India</span>
                        <span>Luxury Standard</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
