import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCarById } from '../lib/api';
import { Button } from '../components/ui/Button';
import {
    ArrowLeft, Check, Calendar, Gauge, Fuel, Settings2,
    Paintbrush, Car, Loader2, Share2, MapPin, UserCheck, ShieldCheck
} from 'lucide-react';
import InquiryModal from '../components/InquiryModal';
import { usePageTitle } from '../lib/hooks';

function SpecBadge({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
                <Icon className="h-5 w-5 text-primary-600" />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="font-semibold text-gray-900 text-sm">{value}</p>
            </div>
        </div>
    );
}

export default function CarDetails() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState(0);

    usePageTitle(car ? `${car.make} ${car.model}` : 'Car Details');

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const data = await getCarById(id);
                setCar(data);
            } catch (error) {
                console.error("Failed to fetch car:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const galleryImages = car?.image_urls?.length
        ? car.image_urls
        : car?.image_url
            ? [car.image_url]
            : [];

    useEffect(() => {
        if (!isFullscreenOpen || galleryImages.length === 0) return;
        
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                setSelectedImg(prev => (prev + 1) % galleryImages.length);
            } else if (e.key === 'ArrowLeft') {
                setSelectedImg(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
            } else if (e.key === 'Escape') {
                setIsFullscreenOpen(false);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreenOpen, galleryImages.length]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Car Not Found</h2>
                <Link to="/"><Button variant="outline">Back to Inventory</Button></Link>
            </div>
        );
    }

    const features = car.features
        ? car.features.split(',').map(f => f.trim()).filter(Boolean)
        : [];

    const whatsappMsg = encodeURIComponent(`Hi! I'm interested in the ${car.year} ${car.make} ${car.model} listed on your website.`);
    const whatsappUrl = `https://wa.me/919566689290?text=${whatsappMsg}`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors text-sm font-medium">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Inventory
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Gallery */}
                <div>
                    {/* Main Image */}
                    <button 
                        onClick={() => setIsFullscreenOpen(true)}
                        className="w-full text-left rounded-2xl overflow-hidden shadow-lg aspect-video bg-gray-100 mb-3 relative group cursor-zoom-in block outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <img
                            src={galleryImages[selectedImg]}
                            alt={`${car.make} ${car.model} photo ${selectedImg + 1}`}
                            className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                                Click to enlarge
                            </span>
                        </div>
                    </button>
                    {/* Thumbnails */}
                    {galleryImages.length > 1 && (
                        <div className="flex gap-2 flex-wrap">
                            {galleryImages.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImg(idx)}
                                    className={`h-16 w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImg === idx
                                        ? 'border-primary-500 shadow-md'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div>
                    <div className="pb-5 mb-5 border-b border-gray-200">
                        <div className="flex items-start justify-between gap-2">
                            <h1 className="text-3xl font-bold text-gray-900">{car.make} {car.model}</h1>
                            <span className={`mt-1 shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${car.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {car.status}
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-primary-600 mt-2">
                            ₹{car.price.toLocaleString('en-IN')}
                        </p>
                    </div>

                    {/* Spec Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <SpecBadge icon={Calendar} label="Year" value={car.year} />
                        <SpecBadge icon={Gauge} label="KM Driven" value={(car.km_driven || car.mileage) ? `${(car.km_driven || car.mileage).toLocaleString('en-IN')} km` : null} />
                        <SpecBadge icon={Fuel} label="Fuel Type" value={car.fuel_type} />
                        <SpecBadge icon={Settings2} label="Transmission" value={car.transmission} />
                        <SpecBadge icon={Car} label="Body Type" value={car.body_type} />
                        <SpecBadge icon={Paintbrush} label="Colour" value={car.colour} />
                        <SpecBadge icon={UserCheck} label="Ownership" value={car.ownership} />
                        <SpecBadge icon={ShieldCheck} label="Insurance" value={car.insurance} />
                        <SpecBadge icon={MapPin} label="Location" value={car.location} />
                    </div>

                    {/* Description */}
                    {car.description && (
                        <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">About this car</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
                        </div>
                    )}

                    {/* Features */}
                    {features.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Key Features</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            size="lg"
                            className="flex-1"
                            onClick={() => setIsModalOpen(true)}
                            disabled={car.status !== 'Available'}
                        >
                            {car.status === 'Available' ? "I'm Interested" : 'Sold'}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => window.open(whatsappUrl, '_blank')}
                        >
                            WhatsApp
                        </Button>
                    </div>
                </div>
            </div>

            <InquiryModal car={car} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Fullscreen Image Overlay */}
            {isFullscreenOpen && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm" 
                    onClick={() => setIsFullscreenOpen(false)}
                >
                    {/* Left Button */}
                    {galleryImages.length > 1 && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImg(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
                            }}
                            className="absolute left-4 md:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none z-10"
                        >
                            <svg className="h-6 w-6 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    <img
                        src={galleryImages[selectedImg]}
                        alt={`Enlarged ${car.make} ${car.model}`}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Right Button */}
                    {galleryImages.length > 1 && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImg(prev => (prev + 1) % galleryImages.length);
                            }}
                            className="absolute right-4 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none z-10"
                        >
                            <svg className="h-6 w-6 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Close Button */}
                    <button 
                        onClick={() => setIsFullscreenOpen(false)}
                        className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none z-20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
