import { useState, useEffect } from 'react';
import { getReviews, deleteReview } from '../../lib/api';
import ReviewCard from '../../components/ReviewCard';
import { Button } from '../../components/ui/Button';
import { Trash2, Loader2, Star, MessageSquare } from 'lucide-react';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        try {
            const data = await getReviews();
            setReviews(data);
        } catch (e) {
            console.error('Failed to load reviews:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this review?')) return;
        setDeletingId(id);
        try {
            await deleteReview(id);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (e) {
            alert('Failed to delete review.');
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
                    <p className="text-gray-500 text-sm mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''} submitted</p>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet. They'll appear here when customers submit them.</p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {reviews.map((review) => (
                        <div key={review.id} className="relative group">
                            <ReviewCard review={review} />
                            <button
                                onClick={() => handleDelete(review.id)}
                                disabled={deletingId === review.id}
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 text-red-500 rounded-lg p-1.5"
                                title="Delete review"
                            >
                                {deletingId === review.id
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <Trash2 className="h-4 w-4" />}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
