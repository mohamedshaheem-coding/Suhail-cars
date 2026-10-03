import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import logo from '../assets/Suhail_Cars_Logo.png';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={logo} alt="Suhail Cars" className="h-16 md:h-20 w-auto object-contain bg-white/10 rounded-lg p-2" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Drive your dream — trusted, transparent, and affordable pre-owned cars handpicked just for you.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-3 mt-5">
                            <a
                                href="https://www.instagram.com/suhail_cars_?igsh=MW5ucTgyMDRldm5lMg=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/919566689290"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-800 hover:bg-green-600 rounded-lg transition-colors"
                                aria-label="WhatsApp"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-base mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">Inventory</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-base mb-4">Get In Touch</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="h-4 w-4 text-primary-400 shrink-0 mt-0.5" />
                                <span>Near Bama Sekar Hospital, K. Kulam, Sathy Road, Erode – 638004</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                                <a href="tel:+919566689290" className="hover:text-white transition-colors">+91 95666 89290</a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                                <a href="mailto:roshansuhail2001@gmail.com" className="hover:text-white transition-colors">roshansuhail2001@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
                    <p>© {currentYear} Suhail Cars. All rights reserved.</p>
                    <Link to="/admin/login" className="hover:text-primary-400 transition-colors">Admin Login</Link>
                </div>
            </div>
        </footer>
    );
}
