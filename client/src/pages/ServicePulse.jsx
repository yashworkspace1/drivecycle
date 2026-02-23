import { useState, useEffect } from 'react';
import { Activity, Mail, RefreshCw, Filter, Search } from 'lucide-react';
import api from '../api';
import MessagePreview from '../components/MessagePreview';

export default function ServicePulse() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, At-Risk, Drifted
  const [generating, setGenerating] = useState({});
  const [sending, setSending] = useState({});
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      // ServicePulse focuses on churn and retention
      const sorted = data.sort((a, b) => b.churnScore - a.churnScore);
      setCustomers(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    if (filter === 'All') return true;
    if (filter === 'At-Risk') return c.status === 'at-risk';
    if (filter === 'Drifted') return c.status === 'drifted';
    return true;
  });

  const handleSendClick = async (customer) => {
    try {
      setGenerating(prev => ({ ...prev, [customer.id]: true }));
      const res = await api.generateMessage({ 
        customerId: customer.id, 
        type: 'servicepulse'
      });
      
      setPreview({
        message: res.message,
        recipientName: customer.name,
        recipientPhone: customer.phone,
        type: 'servicepulse',
        id: customer.id
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate message');
    } finally {
      setGenerating(prev => ({ ...prev, [customer.id]: false }));
    }
  };

  const handleConfirm = async () => {
    try {
      setSending(prev => ({ ...prev, [preview.id]: true }));
      await api.sendMessage({
        message: preview.message,
        customerId: preview.id,
        type: preview.type
      });
      setPreview(null);
      await fetchData(); // Refresh
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    } finally {
      setSending(prev => ({ ...prev, [preview.id]: false }));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-red-500';
    if (score >= 5) return 'text-orange-400';
    return 'text-green-500';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Active</span>;
      case 'at-risk': return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">At Risk</span>;
      case 'drifted': return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Drifted</span>;
      case 'recovered': return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Recovered</span>;
      default: return <span className="bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="text-blue-500 w-6 h-6" />
            ServicePulse
          </h1>
          <p className="text-gray-400 mt-1">Post-purchase retention and AI-driven upside detection.</p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex gap-2 mb-6">
        {['All', 'At-Risk', 'Drifted'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              filter === f 
                ? 'bg-blue-600/10 border-blue-600/30 text-blue-500' 
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="bg-gray-900 border border-gray-800 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 w-64 transition-colors"
          />
        </div>
      </div>

      {/* Main Table Layout conceptually built as Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((customer) => {
            
            // Get last job info
            const sortedJobs = [...(customer.serviceJobs || [])].sort((a,b) => new Date(b.serviceDate) - new Date(a.serviceDate));
            const lastJob = sortedJobs[0];
            let daysAgo = -1;
            if (lastJob) {
               daysAgo = Math.floor((new Date() - new Date(lastJob.serviceDate)) / (1000 * 60 * 60 * 24));
            }

            return (
              <div key={customer.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-6 hover:bg-gray-800/20 transition-colors">
                
                {/* Score Avatar */}
                <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gray-950 border border-gray-800">
                  <span className={`text-2xl font-bold font-mono tracking-tighter ${getScoreColor(customer.churnScore)}`}>
                    {customer.churnScore}
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-gray-600">Risk</span>
                </div>

                {/* Identity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-white truncate">{customer.name}</h3>
                    {getStatusBadge(customer.status)}
                  </div>
                  <p className="text-sm text-gray-400 capitalize truncate">
                    {customer.vehicles?.[0] ? `${customer.vehicles[0].year} ${customer.vehicles[0].make} ${customer.vehicles[0].model}` : 'No Vehicle Linked'}
                  </p>
                </div>

                {/* Last Visit */}
                <div className="w-48 shrink-0">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Last Visit</div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-300 font-medium truncate">{lastJob?.serviceType || 'Never'}</span>
                    {daysAgo >= 0 && <span className="text-xs text-gray-500">{daysAgo} days ago</span>}
                  </div>
                </div>

                {/* Upsells / Activity indicator */}
                <div className="w-48 shrink-0">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Upsells</div>
                  {lastJob && lastJob.upsellOpportunities ? (
                     <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-green-500/20">
                       Detected
                     </span>
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                </div>

                {/* Actions */}
                <div className="shrink-0 pl-4 border-l border-gray-800">
                   <button 
                     onClick={() => handleSendClick(customer)}
                     disabled={generating[customer.id] || sending[customer.id]}
                     className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                   >
                     {generating[customer.id] || sending[customer.id] ? (
                       <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                     ) : (
                       <Mail className="w-4 h-4 text-blue-400" />
                     )}
                     {generating[customer.id] ? 'Drafting...' : sending[customer.id] ? 'Sending...' : 'Follow-Up'}
                   </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {preview && (
        <MessagePreview
          message={preview.message}
          recipientName={preview.recipientName}
          recipientPhone={preview.recipientPhone}
          type={preview.type}
          isLoading={sending[preview.id]}
          onConfirm={handleConfirm}
          onCancel={() => setPreview(null)}
        />
      )}

    </div>
  );
}
