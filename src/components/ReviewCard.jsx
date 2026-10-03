import { Star, Quote } from 'lucide-react';

const AVATAR_COLORS = [
    'from-primary-600 to-primary-800',
    'from-violet-600 to-violet-800',
    'from-emerald-600 to-emerald-800',
    'from-rose-600 to-rose-800',
    'from-amber-500 to-amber-700',
    'from-sky-600 to-sky-800',
];

export default function ReviewCard({ review, index = 0 }) {
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const initial = review.name?.charAt(0).toUpperCase() || '?';
    const fullStars = Math.max(0, Math.min(5, Math.round(review.rating)));

    return (
        <div className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-primary-500/40 rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary-900/20 relative overflow-hidden">

            {/* Subtle corner glow on hover */}
            <div className="absolute -top-10 -right-10 h-24 w-24 bg-primary-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Quote icon + stars on same row */}
            <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-600/25 flex items-center justify-center">
                    <Quote className="h-4 w-4 text-primary-400 fill-primary-400" />
                </div>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star
                            key={star}
                            className={`h-4 w-4 ${star <= fullStars ? 'text-amber-400 fill-amber-400' : 'text-gray-700 fill-gray-700'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Comment */}
            <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-5">
                "{review.comment}"
            </p>

            {/* Author row */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg`}>
                    {initial}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{review.name}</p>
                    {review.createdAt?.toDate && (
                        <p className="text-xs text-gray-500">
                            {review.createdAt.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                        </p>
                    )}
                </div>
                <div className="ml-auto">
                    <span className="text-xs font-bold text-primary-400 bg-primary-600/15 px-2 py-0.5 rounded-full">
                        Verified
                    </span>
                </div>
            </div>
        </div>
    );
}
