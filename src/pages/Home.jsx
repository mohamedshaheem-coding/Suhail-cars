import { useState, useEffect, useMemo } from 'react';
import { getCars, getReviews, addReview } from '../lib/api';
import CarCard from '../components/CarCard';
import ReviewCard from '../components/ReviewCard';
import { Search, Loader2, SlidersHorizontal, Star, X, ChevronDown } from 'lucide-react';
import { usePageTitle } from '../lib/hooks';
import { Button } from '../components/ui/Button';

const FUEL_TYPES = ['All', 'Petrol', 'Diesel', 'Electric'];
const TRANSMISSIONS = ['All', 'Manual', 'Automatic'];
const BODY_TYPES = ['All', 'Hatchback', 'Sedan', 'SUV', 'MUV'];

const SORT_OPTIONS = [
    { value: 'default', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'year_desc', label: 'Newest First' },
    { value: 'year_asc', label: 'Oldest First' },
    { value: 'km_asc', label: 'Lowest KM Driven' },
];

function StarPicker({ value, onChange }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => onChange(star)}>
                    <Star className={`h-7 w-7 transition-colors ${star <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                </button>
            ))}
        </div>
    );
}

const WA_SVG = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

export default function Home() {
    usePageTitle('Home');

    const [cars, setCars] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [fuelFilter, setFuelFilter] = useState('All');
    const [transmissionFilter, setTransmissionFilter] = useState('All');
    const [bodyTypeFilter, setBodyTypeFilter] = useState('All');
    const [maxPrice, setMaxPrice] = useState('');
    const [priceSlider, setPriceSlider] = useState(5000000);
    const [sortBy, setSortBy] = useState('default');

    const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [carData, reviewData] = await Promise.all([getCars(), getReviews()]);
                setCars(carData);
                setReviews(reviewData);
            } catch (error) {
                console.error('Failed to fetch:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Sync price slider upper bound once cars are fetched
    useEffect(() => {
        if (cars.length > 0) {
            const prices = cars.map(c => c.price).filter(Boolean);
            if (prices.length) {
                const max = Math.ceil(Math.max(...prices) / 100000) * 100000;
                setPriceSlider(max);
            }
        }
    }, [cars]);

    const maxCarPrice = useMemo(() => {
        const prices = cars.map(c => c.price).filter(Boolean);
        return prices.length ? Math.ceil(Math.max(...prices) / 100000) * 100000 : 5000000;
    }, [cars]);

    const filteredCars = useMemo(() => {
        let result = cars.filter(car => {
            if (car.status !== 'Available') return false;
            const term = searchTerm.toLowerCase();
            const matchesSearch = !term ||
                car.make?.toLowerCase().includes(term) ||
                car.model?.toLowerCase().includes(term) ||
                car.colour?.toLowerCase().includes(term) ||
                car.body_type?.toLowerCase().includes(term);
            const matchesFuel = fuelFilter === 'All' || car.fuel_type === fuelFilter;
            const matchesTx = transmissionFilter === 'All' || car.transmission === transmissionFilter;
            const matchesBody = bodyTypeFilter === 'All' || car.body_type === bodyTypeFilter;
            const effectiveMaxPrice = maxPrice ? Number(maxPrice) : priceSlider;
            const matchesPrice = car.price <= effectiveMaxPrice;
            return matchesSearch && matchesFuel && matchesTx && matchesBody && matchesPrice;
        });

        switch (sortBy) {
            case 'price_asc': result.sort((a, b) => a.price - b.price); break;
            case 'price_desc': result.sort((a, b) => b.price - a.price); break;
            case 'year_desc': result.sort((a, b) => b.year - a.year); break;
            case 'year_asc': result.sort((a, b) => a.year - b.year); break;
            case 'km_asc': result.sort((a, b) => (a.km_driven || a.mileage || 0) - (b.km_driven || b.mileage || 0)); break;
            default: break;
        }
        return result;
    }, [cars, searchTerm, fuelFilter, transmissionFilter, bodyTypeFilter, maxPrice, priceSlider, sortBy]);

    const soldCars = cars.filter(car => car.status === 'Sold');
    const availableStock = cars.filter(car => car.status === 'Available').length;
    const hasActiveFilters = fuelFilter !== 'All' || transmissionFilter !== 'All' || bodyTypeFilter !== 'All' || maxPrice || sortBy !== 'default';

    const clearFilters = () => {
        setFuelFilter('All');
        setTransmissionFilter('All');
        setBodyTypeFilter('All');
        setMaxPrice('');
        setPriceSlider(maxCarPrice);
        setSortBy('default');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.comment.trim() || !reviewForm.name.trim()) return;
        setReviewSubmitting(true);
        try {
            const newReview = await addReview(reviewForm);
            setReviews([{ ...newReview, createdAt: { toDate: () => new Date() } }, ...reviews]);
            setReviewForm({ name: '', rating: 5, comment: '' });
            setReviewSuccess(true);
            setTimeout(() => setReviewSuccess(false), 4000);
        } catch (e) {
            console.error('Failed to submit review:', e);
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
                <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-800/10 rounded-full blur-2xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left */}
                        <div>
                            <span className="inline-block bg-primary-600/20 text-primary-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                                Erode's Trusted Used Car Dealer
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                                Find Your <span className="text-primary-400">Dream Car</span> at the Right Price
                            </h1>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg">
                                Quality pre-owned vehicles, handpicked and thoroughly inspected. Transparent, affordable, and hassle-free.
                            </p>

                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    placeholder="Search by make, model, colour, body type..."
                                    className="w-full py-4 px-5 pr-14 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-xl text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="absolute right-2 top-2 p-2.5 bg-primary-600 rounded-xl text-white hover:bg-primary-700 transition-colors">
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <a href="#inventory" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-lg">
                                    Browse Cars
                                </a>
                                <a href="https://wa.me/919566689290" target="_blank" rel="noopener noreferrer"
                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-lg flex items-center gap-2">
                                    {WA_SVG} WhatsApp Us
                                </a>
                            </div>
                        </div>

                        {/* Right: Stats card (desktop only) */}
                        <div className="hidden lg:flex justify-center items-center">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-md">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {[
                                        { value: cars.length ? availableStock : '50+', label: 'Cars in Stock' },
                                        { value: '100+', label: 'Happy Customers' },
                                        { value: '7 Days', label: 'Open Every Day' },
                                        { value: 'Erode', label: 'Tamil Nadu' },
                                    ].map(({ value, label }) => (
                                        <div key={label} className="bg-white/10 rounded-2xl p-4 text-center">
                                            <p className="text-2xl font-extrabold text-white mb-1">{value}</p>
                                            <p className="text-gray-400 text-xs font-medium">{label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 bg-green-500/20 rounded-xl px-4 py-3">
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-green-300 text-sm font-medium">Open Today · 10:00 AM – 8:30 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats bar (mobile only) ── */}
            <section className="lg:hidden py-4 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 gap-3 text-center">
                    <div><p className="text-xl font-extrabold text-primary-400">{cars.length ? availableStock : '50+'}</p><p className="text-gray-400 text-xs">Cars in Stock</p></div>
                    <div><p className="text-xl font-extrabold text-primary-400">100+</p><p className="text-gray-400 text-xs">Happy Customers</p></div>
                </div>
            </section>

            {/* ── Why Suhail Cars ── */}
            <section className="py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        {[
                            { emoji: '✅', title: 'Verified Cars', desc: 'Every vehicle is thoroughly inspected before listing.' },
                            { emoji: '💰', title: 'Transparent Pricing', desc: 'No hidden fees. The price you see is the price you pay.' },
                            { emoji: '🤝', title: 'No-Pressure Experience', desc: 'Browse at your pace. We help, not push.' },
                        ].map(({ emoji, title, desc }) => (
                            <div key={title} className="flex flex-col items-center px-4 py-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="w-14 h-14 bg-primary-600/20 rounded-2xl flex items-center justify-center mb-4 text-2xl">{emoji}</div>
                                <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Inventory: Sidebar + Grid ── */}
            <section id="inventory" className="py-16 px-4 flex-grow border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white">Current Inventory</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {filteredCars.length} vehicle{filteredCars.length !== 1 ? 's' : ''} available
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* ── Sidebar Filter ── */}
                        <aside className="lg:w-64 shrink-0">
                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden lg:sticky lg:top-20">
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                                    <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
                                        <SlidersHorizontal className="h-4 w-4 text-primary-400" /> Filters &amp; Sort
                                    </h3>
                                    {hasActiveFilters && (
                                        <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                            <X className="h-3 w-3" /> Reset
                                        </button>
                                    )}
                                </div>

                                {/* Scrollable body */}
                                <div className="overflow-y-auto max-h-[70vh] px-5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">

                                    {/* Sort */}
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Sort By</p>
                                        <div className="flex flex-col gap-1">
                                            {SORT_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setSortBy(opt.value)}
                                                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === opt.value
                                                        ? 'bg-primary-600 text-white font-semibold'
                                                        : 'text-gray-300 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fuel Type */}
                                    <div className="border-t border-white/10 pt-5">
                                        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Fuel Type</p>
                                        <div className="flex flex-col gap-1">
                                            {FUEL_TYPES.map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => setFuelFilter(f)}
                                                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${fuelFilter === f
                                                        ? 'bg-primary-600 text-white font-semibold'
                                                        : 'text-gray-300 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Body Type */}
                                    <div className="border-t border-white/10 pt-5">
                                        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Body Type</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {BODY_TYPES.map(b => (
                                                <button
                                                    key={b}
                                                    onClick={() => setBodyTypeFilter(b)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${bodyTypeFilter === b
                                                        ? 'bg-primary-600 text-white'
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                        }`}
                                                >
                                                    {b}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Transmission */}
                                    <div className="border-t border-white/10 pt-5">
                                        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Transmission</p>
                                        <div className="flex gap-2">
                                            {TRANSMISSIONS.map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setTransmissionFilter(t)}
                                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${transmissionFilter === t
                                                        ? 'bg-primary-600 text-white'
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                        }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Slider */}
                                    <div className="border-t border-white/10 pt-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Price</p>
                                            <span className="text-primary-400 font-bold text-sm">₹{(priceSlider).toLocaleString('en-IN')}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="100000"
                                            max={maxCarPrice}
                                            step="50000"
                                            value={priceSlider}
                                            onChange={e => setPriceSlider(Number(e.target.value))}
                                            className="w-full accent-primary-500 cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                                            <span>₹1L</span>
                                            <span>₹{(maxCarPrice / 100000).toFixed(0)}L</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </aside>

                        {/* ── Car Grid ── */}
                        <div className="flex-1">
                            {filteredCars.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {filteredCars.map(car => <CarCard key={car.id} car={car} />)}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-xl text-gray-400">No cars match your search.</p>
                                    <button
                                        className="mt-4 text-primary-400 underline text-sm"
                                        onClick={() => { setSearchTerm(''); clearFilters(); }}
                                    >
                                        Clear search &amp; filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Recently Sold ── */}
            {soldCars.length > 0 && (
                <section className="py-12 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-1 w-10 bg-primary-500 rounded-full" />
                            <h3 className="text-xl font-bold text-white">Recently Sold</h3>
                        </div>
                        <div className="flex gap-5 overflow-x-auto pb-4">
                            {soldCars.map(car => (
                                <div key={car.id} className="min-w-[260px] w-[260px] shrink-0">
                                    <CarCard car={car} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Customer Reviews ── */}
            <section className="py-20 px-4 border-t border-white/5">
                <div className="max-w-7xl mx-auto">

                    {/* Section header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
                        <div>
                            <span className="inline-block text-xs font-bold tracking-widest text-primary-400 uppercase mb-3">Testimonials</span>
                            <h2 className="text-4xl font-extrabold text-white leading-tight">What Our Customers Say</h2>
                            <p className="text-gray-400 mt-3 max-w-md">Real experiences from real buyers — no filters, no scripts.</p>
                        </div>

                        {reviews.length > 0 && (() => {
                            const avg = (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1);
                            return (
                                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 shrink-0">
                                    <div>
                                        <p className="text-5xl font-extrabold text-white leading-none">{avg}</p>
                                        <div className="flex gap-0.5 mt-1">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={`h-4 w-4 ${s <= Math.round(avg) ? 'text-amber-400 fill-amber-400' : 'text-gray-700 fill-gray-700'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <div className="h-14 w-px bg-white/10" />
                                    <div className="space-y-1">
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const count = reviews.filter(r => Math.round(r.rating) === star).length;
                                            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 w-2">{star}</span>
                                                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Review cards */}
                    {reviews.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                            {reviews.slice(0, 6).map((review, i) => (
                                <ReviewCard key={review.id} review={review} index={i} />
                            ))}
                        </div>
                    )}

                    {reviews.length === 0 && (
                        <div className="text-center py-16 mb-12">
                            <Star className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500">No reviews yet. Be the first!</p>
                        </div>
                    )}

                    {/* Submit form */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                            <div className="px-8 py-5 border-b border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-600/25 flex items-center justify-center">
                                    <Star className="h-4 w-4 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Share Your Experience</h3>
                                    <p className="text-gray-500 text-xs">Bought a car from us? Let others know!</p>
                                </div>
                            </div>
                            <div className="p-8">
                                {reviewSuccess ? (
                                    <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
                                        <Star className="h-5 w-5 fill-green-400 text-green-400 shrink-0" />
                                        <p className="font-medium">Thank you! Your review has been submitted.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReviewSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
                                                    value={reviewForm.name}
                                                    onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Rating</label>
                                                <StarPicker value={reviewForm.rating} onChange={r => setReviewForm({ ...reviewForm, rating: r })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Review</label>
                                            <textarea
                                                required
                                                rows="4"
                                                placeholder="Tell others about your experience buying from Suhail Cars..."
                                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none resize-none"
                                                value={reviewForm.comment}
                                                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            />
                                        </div>
                                        <Button type="submit" isLoading={reviewSubmitting} className="w-full py-3">
                                            Submit Review
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── WhatsApp CTA Banner ── */}
            <section className="py-14 px-4 border-t border-white/10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-3">Ready to Find Your Car?</h2>
                    <p className="text-gray-400 mb-8 text-lg">Message us on WhatsApp — we'll help you find the perfect vehicle fast.</p>
                    <a
                        href="https://wa.me/919566689290"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl text-lg transition-colors shadow-xl"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Chat on WhatsApp
                    </a>
                </div>
            </section>

        </div>
    );
}
