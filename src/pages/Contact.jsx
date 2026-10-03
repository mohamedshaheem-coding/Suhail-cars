import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { usePageTitle } from '../lib/hooks';
import { submitInquiry } from '../lib/api';
import { Button } from '../components/ui/Button';

const CONTACT_INFO = [
    {
        icon: MapPin,
        title: 'Our Location',
        lines: ['Near Bama Sekar Hospital, K. Kulam', 'Sathy Road, Erode – 638004']
    },
    {
        icon: Phone,
        title: 'Phone',
        lines: ['+91 95666 89290']
    },
    {
        icon: Mail,
        title: 'Email',
        lines: ['roshansuhail2001@gmail.com']
    },
    {
        icon: Clock,
        title: 'Business Hours',
        lines: ['Mon – Sun: 10:00 AM – 8:30 PM']
    },
];

export default function Contact() {
    usePageTitle('Contact Us');
    const [form, setForm] = useState({ name: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await submitInquiry({ ...form, car_inquiry: 'General Inquiry' });
            setSuccess(true);
            setForm({ name: '', phone: '', message: '' });
        } catch (err) {
            setError('Failed to send. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = "w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-400 focus:outline-none transition";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 py-14">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
                    <p className="text-gray-400 text-lg">We'd love to hear from you. Visit us or drop us a message.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left: Info Cards */}
                    <div className="space-y-4">
                        {CONTACT_INFO.map(({ icon: Icon, title, lines }) => (
                            <div key={title} className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-sm">
                                <div className="p-2.5 bg-primary-600/20 rounded-xl">
                                    <Icon className="h-5 w-5 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                                    {lines.map((line, i) => (
                                        <p key={i} className="text-gray-400 text-sm">{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Map Embed */}
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-sm" style={{ height: '220px' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1473.169972808086!2d77.69487658076727!3d11.36333757464371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9690020e1122d%3A0x7e0dd2e11a091129!2sSuhail%20cars!5e0!3m2!1sen!2sin!4v1772869325347!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Suhail Cars Location"
                            />
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-sm p-8">
                        <h2 className="text-xl font-bold text-white mb-1">Send Us a Message</h2>
                        <p className="text-gray-400 text-sm mb-6">We'll get back to you within 24 hours.</p>

                        {success ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                                <CheckCircle className="h-14 w-14 text-green-500" />
                                <h3 className="text-lg font-bold text-white">Message Sent!</h3>
                                <p className="text-gray-400 text-sm">We've received your message and will be in touch soon.</p>
                                <button onClick={() => setSuccess(false)} className="mt-2 text-primary-400 text-sm underline">
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Your Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className={inputCls}
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        className={inputCls}
                                        placeholder="+91 98765 43210"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Message *</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className={inputCls}
                                        placeholder="Tell us how we can help..."
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                    />
                                </div>

                                {error && <p className="text-red-400 text-sm">{error}</p>}

                                <Button type="submit" className="w-full" isLoading={submitting}>
                                    Send Message
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
