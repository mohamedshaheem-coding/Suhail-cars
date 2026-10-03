import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { usePageTitle } from '../lib/hooks';

export default function About() {
    usePageTitle('About Us');
    const faqs = [
        {
            question: "Do you offer financing?",
            answer: "Yes, we work with multiple banks to provide competitive financing options for all credit types."
        },
        {
            question: "Are prices negotiable?",
            answer: "We price our cars competitively to save you time. However, we are always open to reasonable discussions."
        },
        {
            question: "Can I trade in my old car?",
            answer: "Absolutely! We offer fair market value for trade-ins. Bring your car in for an appraisal."
        },
        {
            question: "Do you offer warranties?",
            answer: "All our cars come with a standard 30-day warranty. Extended warranties are available for purchase."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">About Suhail Cars</h1>
                    <p className="text-xl text-gray-400">Driving trust and quality since 2010.</p>
                </div>

                <div className="prose prose-lg mx-auto text-gray-300 mb-16">
                    <p>
                        At Suhail Cars, we believe buying a used car should be as exciting and worry-free as buying a new one.
                        Founded with a mission to bring transparency to the pre-owned market, we meticulously inspect every
                        vehicle in our inventory to ensure it meets our high standards.
                    </p>
                    <p>
                        Our strictly "no-pressure" environment allow you to explore our digital showroom
                        at your own pace. When you're ready, simply book a visit, and we'll have the keys waiting for you.
                    </p>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                                <p className="text-gray-400">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
