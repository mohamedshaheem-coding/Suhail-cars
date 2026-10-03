import { useState, useEffect } from 'react';
import { Phone, Mail, Calendar, Loader2, CheckCircle, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { getLeads, updateLeadStatus, deleteLead } from '../../lib/api';
import { Button } from '../../components/ui/Button';

const STATUS_OPTIONS = ['New', 'Contacted', 'Closed'];

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const data = await getLeads();
                setLeads(data);
            } catch (error) {
                console.error("Failed to fetch leads:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await updateLeadStatus(id, newStatus);
            setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
        } catch (e) {
            console.error('Failed to update status', e);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this lead?")) return;
        setUpdatingId(id);
        try {
            await deleteLead(id);
            setLeads(leads.filter(l => l.id !== id));
        } catch (e) {
            console.error('Failed to delete lead', e);
        } finally {
            setUpdatingId(null);
        }
    };

    const statusColor = (status) => {
        if (status === 'New') return 'bg-amber-100 text-amber-700';
        if (status === 'Contacted') return 'bg-blue-100 text-blue-700';
        return 'bg-green-100 text-green-700';
    };

    const exportToCSV = () => {
        if (leads.length === 0) return;
        
        // Prepare CSV headers
        const headers = ['Name', 'Phone', 'Date', 'Car Inquiry', 'Status', 'Message'];
        
        // Map data rows
        const rows = leads.map(lead => {
            const date = lead.createdAt?.seconds 
                ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString('en-IN')
                : 'N/A';
            const name = `"${(lead.name || lead.customer_name || 'Unknown').replace(/"/g, '""')}"`;
            const phone = `"${(lead.phone || lead.phone_number || 'N/A').replace(/"/g, '""')}"`;
            const inquiry = `"${(lead.car_inquiry || lead.car_name || 'General Inquiry').replace(/"/g, '""')}"`;
            const status = `"${lead.status || 'New'}"`;
            const message = `"${(lead.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
            
            return [name, phone, date, inquiry, status, message];
        });
        
        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        // Trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inquiry Leads</h1>
                    <p className="text-gray-500 text-sm mt-1">{leads.length} inquiry{leads.length !== 1 ? 'ies' : ''} total</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={exportToCSV} 
                    disabled={leads.length === 0} 
                    className="shrink-0 flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export CSV
                </Button>
            </div>

            {leads.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No leads yet. They'll appear here when customers fill out the inquiry form.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {leads.map((lead) => (
                        <div key={lead.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-base font-bold text-gray-900 truncate">
                                        {lead.name || lead.customer_name || 'Unknown'}
                                    </h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </div>
                                {(lead.car_inquiry || lead.car_name) && (
                                    <p className="text-sm text-primary-600 font-medium mb-2">
                                        {lead.car_inquiry || lead.car_name}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    {(lead.phone || lead.phone_number) && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5" />
                                            <a href={`tel:${lead.phone || lead.phone_number}`} className="hover:text-primary-600">
                                                {lead.phone || lead.phone_number}
                                            </a>
                                        </span>
                                    )}
                                    {lead.createdAt?.seconds && (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(lead.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    )}
                                    {(lead.message) && (
                                        <span className="flex items-start gap-1.5 w-full">
                                            <Mail className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                            <span className="truncate">{lead.message}</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status Updater */}
                            <div className="flex items-center gap-2 shrink-0">
                                <select
                                    value={lead.status || 'New'}
                                    disabled={updatingId === lead.id}
                                    onChange={e => handleStatusChange(lead.id, e.target.value)}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                </select>
                                <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    disabled={updatingId === lead.id}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete Lead"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                                {updatingId === lead.id && <Loader2 className="h-4 w-4 animate-spin text-primary-600" />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
