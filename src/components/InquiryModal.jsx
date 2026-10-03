import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './ui/Button';
import { X, Loader2 } from 'lucide-react';
import { submitInquiry } from '../lib/api';

export default function InquiryModal({ car, isOpen, onClose }) {
    const [formData, setFormData] = useState({
        customer_name: '',
        phone_number: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!car) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await submitInquiry({
                ...formData,
                car_id: car.id,
                car_name: `${car.make} ${car.model} (${car.year})`
            });
            setIsSuccess(true);
        } catch (err) {
            console.error("Submission error:", err);
            setError("Failed to submit inquiry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setIsSuccess(false);
        setFormData({ customer_name: '', phone_number: '', message: '' });
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isSuccess ? 'Inquiry Sent!' : 'I\'m Interested'}
                    </h2>
                    <p className="text-gray-500 mb-6">
                        {isSuccess
                            ? 'Thanks for reaching out! One of our agents will contact you shortly.'
                            : `Fill out the form below to inquire about the ${car.year} ${car.make} ${car.model}.`
                        }
                    </p>

                    {isSuccess ? (
                        <div className="flex justify-center">
                            <Button onClick={handleClose} className="w-full">Close</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                <textarea
                                    name="message"
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="I'd like to schedule a test drive..."
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}

                            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                                Submit Inquiry
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
