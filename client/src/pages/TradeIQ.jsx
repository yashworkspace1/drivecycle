import { useState, useEffect } from 'react';
import { LineChart, RefreshCw, MessageSquare, TrendingUp, Flame } from 'lucide-react';
import api from '../api';
import MessagePreview from '../components/MessagePreview';

export default function TradeIQ() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [sending, setSending] = useState({});
  const [generating, setGenerating] = useState({});
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await api.getHotLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      await api.recalculateAllScores();
      await fetchLeads();
    } catch (err) {
      console.error(err);
    } finally {
      setRecalculating(false);
    }
  };

  const handleSendClick = async (lead) => {
    try {
      setGenerating(prev => ({ ...prev, [lead.customer.id]: true }));
      const res = await api.generateMessage({ 
        customerId: lead.customer.id, 
        type: 'tradeiq'
      });
      
      setPreview({
        message: res.message,
        recipientName: lead.customer.name,
        recipientPhone: lead.customer.phone,
        type: 'tradeiq',
        id: lead.customer.id
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate message');
    } finally {
      setGenerating(prev => ({ ...prev, [lead.customer.id]: false }));
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
      await fetchLeads(); // Refresh
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    } finally {
      setSending(prev => ({ ...prev, [preview.id]: false }));
    }
  };

  const activeLeads = leads.length;
  const readyToBuy = leads.filter(l => l.customer.score >= 90).length;
  const avgValue = leads.length > 0 
    ? Math.round(leads.reduce((sum, l) => sum + (l.valuation?.tradeValueLow || 0), 0) / leads.length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header & Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <LineChart className="text-green-500 w-6 h-6" />
            TradeIQ
          </h1>
          <p className="text-gray-400 mt-1">AI-driven purchase intent scoring and transparent valuations.</p>
        </div>
        
        <button 
          onClick={handleRecalculate}
          disabled={recalculating}
          className="bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 text-green-500 px-4 py-2 rounded-lg font-medium tracking-tight flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} />
          {recalculating ? 'Recalculating...' : 'Recalculate All Scores'}
        </button>
      </div>

      {/* Stats Mini-Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Hot Leads</p>
            <p className="text-xl font-bold text-white tracking-tight">{activeLeads}</p>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div>
             <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Ready to buy (&gt;90)</p>
             <p className="text-xl font-bold text-white tracking-tight">{readyToBuy}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <LineChart className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Avg Pipeline Value</p>
            <p className="text-xl font-bold text-white tracking-tight">${avgValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 border border-gray-800 border-dashed rounded-xl">
          <p className="text-gray-500">No hot leads found (score &gt;= 60). Try recalculating scores.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const score = lead.customer.score;
            const isReady = score >= 90;
            const yearsOwned = new Date().getFullYear() - (lead.vehicle?.year || new Date().getFullYear());

            return (
              <div key={lead.customer.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
                
                <div className="flex items-start justify-between">
                   
                   {/* Left Col: Target Info */}
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white">{lead.customer.name}</h3>
                        {isReady && <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Ready</span>}
                        {lead.customer.hasUpsell && <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Upsell Detected</span>}
                      </div>
                      
                      <p className="text-sm text-gray-400 capitalize">
                        {lead.vehicle ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}` : 'Unknown Vehicle'}
                        <span className="mx-2">•</span> 
                        Owned {yearsOwned} years
                      </p>

                      {/* Trade Value Block */}
                      {lead.valuation && (
                         <div className="mt-4 flex gap-6">
                            <div>
                               <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Trade Value Est.</p>
                               <p className="text-lg font-bold text-green-400 tracking-tight">
                                 ${lead.valuation.tradeValueLow.toLocaleString()} - ${lead.valuation.tradeValueHigh.toLocaleString()}
                               </p>
                            </div>
                            <div>
                               <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">YTD Repair Spend</p>
                               <p className={`text-lg font-bold tracking-tight ${lead.repairSpendThisYear > 1000 ? 'text-orange-400' : 'text-gray-300'}`}>
                                 ${lead.repairSpendThisYear.toLocaleString()}
                               </p>
                            </div>
                         </div>
                      )}
                   </div>

                   {/* Right Col: Score & Action */}
                   <div className="w-64 flex flex-col items-end shrink-0 pl-6 border-l border-gray-800">
                      
                      <div className="w-full mb-4">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Buy Score</span>
                          <span className={`text-xl font-bold ${isReady ? 'text-green-500' : 'text-white'}`}>{score}</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isReady ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => handleSendClick(lead)}
                        disabled={sending[lead.customer.id] || generating[lead.customer.id]}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {sending[lead.customer.id] || generating[lead.customer.id] ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-200" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-blue-200" />
                        )}
                        {generating[lead.customer.id] ? 'Drafting...' : sending[lead.customer.id] ? 'Sending...' : 'Send Valuation'}
                      </button>

                   </div>

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
