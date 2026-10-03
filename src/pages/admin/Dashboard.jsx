import { useState, useEffect } from 'react';
import { getCars, getLeads } from '../../lib/api';
import { Loader2, Car, MessageSquare, TrendingUp, CheckCircle, Clock } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, subtext }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentLeads, setRecentLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [cars, leads] = await Promise.all([getCars(), getLeads()]);
                const available = cars.filter(c => c.status === 'Available').length;
                const sold = cars.filter(c => c.status === 'Sold').length;
                const newLeads = leads.filter(l => l.status === 'New').length;
                const contactedLeads = leads.filter(l => l.status === 'Contacted').length;

                setStats({ total: cars.length, available, sold, newLeads, contactedLeads, totalLeads: leads.length });
                setRecentLeads(leads.slice(0, 5));
            } catch (err) {
                console.error("Dashboard failed to load:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
                <p>{error}</p>
            </div>
        );
    }

    const soldPct = stats.total > 0 ? Math.round((stats.sold / stats.total) * 100) : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard icon={Car} label="Total Inventory" value={stats.total} color="bg-blue-500" subtext={`${stats.available} available`} />
                <StatCard icon={CheckCircle} label="Cars Sold" value={stats.sold} color="bg-green-500" subtext={`${soldPct}% of inventory`} />
                <StatCard icon={MessageSquare} label="New Leads" value={stats.newLeads} color="bg-amber-500" subtext="Awaiting response" />
                <StatCard icon={TrendingUp} label="Total Inquiries" value={stats.totalLeads} color="bg-purple-500" subtext={`${stats.contactedLeads} contacted`} />
            </div>

            {/* Inventory Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Inventory Status</h2>
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                            className="h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                            style={{ width: `${stats.total > 0 ? (stats.available / stats.total) * 100 : 0}%` }}
                        />
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{stats.available} available</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                            className="h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-700"
                            style={{ width: `${soldPct}%` }}
                        />
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{stats.sold} sold</span>
                </div>
            </div>

            {/* Recent Leads Table */}
            {recentLeads.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-900">Recent Leads</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="text-left px-6 py-3 font-medium">Name</th>
                                    <th className="text-left px-6 py-3 font-medium">Phone</th>
                                    <th className="text-left px-6 py-3 font-medium">Car Enquiry</th>
                                    <th className="text-left px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Support both InquiryModal (customer_name) and Contact form (name) field names */}
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {lead.customer_name || lead.name || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {lead.phone_number || lead.phone || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {lead.car_name || lead.car_inquiry || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${lead.status === 'New'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : lead.status === 'Contacted'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                {lead.status === 'New'
                                                    ? <Clock className="h-3 w-3" />
                                                    : <CheckCircle className="h-3 w-3" />}
                                                {lead.status || 'New'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
