import { Link } from 'react-router-dom';
import { Fuel, Gauge, Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function CarCard({ car }) {
    const coverImage = car.image_urls?.length ? car.image_urls[0] : (car.image_url || '');
    const isSold = car.status === 'Sold';

    return (
        <Link to={`/car/${car.id}`} className="group block">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/50 hover:bg-white/8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/20 flex flex-col h-full">

                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={coverImage}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Status badge */}
                    {isSold ? (
                        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                            SOLD
                        </span>
                    ) : (
                        <span className="absolute top-3 right-3 bg-green-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                            AVAILABLE
                        </span>
                    )}

                    {/* Price on image */}
                    <div className="absolute bottom-3 left-3">
                        <p className="text-white text-xl font-extrabold drop-shadow-lg">
                            ₹{car.price?.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Title */}
                    <div className="mb-3">
                        <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary-400 transition-colors">
                            {car.make} {car.model}
                        </h3>
                        <p className="text-gray-400 text-sm">{car.year}</p>
                    </div>

                    {/* Specs row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1.5">
                            <Gauge className="h-3.5 w-3.5 text-primary-500" />
                            <span>{(car.km_driven || car.mileage)?.toLocaleString('en-IN')} km</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Fuel className="h-3.5 w-3.5 text-primary-500" />
                            <span>{car.fuel_type || 'Petrol'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-primary-500" />
                            <span>{car.year}</span>
                        </div>
                        {car.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-primary-500" />
                                <span>{car.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                            {car.transmission || ''}{car.body_type ? ` · ${car.body_type}` : ''}
                        </span>
                        <span className="flex items-center gap-1 text-primary-400 text-sm font-semibold group-hover:gap-2 transition-all">
                            View Details <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
