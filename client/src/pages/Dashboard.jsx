import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, LineChart, AlertCircle, ArrowRight, UserCheck, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDashboard();
      setData(response);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { stats, priorityActions, recentOutreach } = data || {};

  // Remove frontend filtering so we perfectly sync with backend engine logic
  const filteredPriorityActions = priorityActions || [];

  const getPriorityColor = (type) => {
    switch(type) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'OPPORTUNITY': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  const getEngineColor = (engine) => {
    switch(engine) {
      case 'ServicePulse': return 'text-blue-500';
      case 'RecallReach': return 'text-red-500';
      case 'TradeIQ': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const handleActionClick = (messageType) => {
    const typeLower = messageType.toLowerCase();
    if (typeLower.includes('recall')) navigate('/recallreach');
    else if (typeLower.includes('churn') || typeLower.includes('servicepulse')) navigate('/servicepulse');
    else if (typeLower.includes('trade') || typeLower.includes('purchase')) navigate('/tradeiq');
    else navigate('/servicepulse'); // Default fallback
  };

  // Prepare Donut Chart Data
  const fleetData = [
    { name: 'Active', value: stats?.servicePulse?.active || 0, color: '#22c55e' },
    { name: 'At-Risk', value: stats?.servicePulse?.atRisk || 0, color: '#f59e0b' },
    { name: 'Drifted', value: stats?.servicePulse?.drifted || 0, color: '#ef4444' },
    { name: 'Recovered', value: stats?.servicePulse?.recovered || 0, color: '#3b82f6' }
  ]; // Removed the .filter(item => item.value > 0) so the legend always renders all four

  // Prepare Engine Status Metrics
  const totalServicePulsePop = (stats?.servicePulse?.active || 0) + (stats?.servicePulse?.atRisk || 0) + (stats?.servicePulse?.drifted || 0);
  const atRiskPercentage = totalServicePulsePop > 0 ? Math.round(((stats?.servicePulse?.atRisk || 0) / totalServicePulsePop) * 100) : 0;
  
  // Dynamic color logic for ServicePulse bar
  let spBarColor = 'bg-green-500';
  if (atRiskPercentage > 60) spBarColor = 'bg-red-500';
  else if (atRiskPercentage > 35) spBarColor = 'bg-orange-500';

  const criticalRecalls = stats?.recallReach?.criticalUnnotified || 0;
  const pendingRecalls = stats?.recallReach?.pendingNotification || 0;
  const readyToBuy = stats?.tradeIQ?.readyToBuy || 0;
  const avgTradeVal = stats?.tradeIQ?.avgTradeValue || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Engines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ServicePulse Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Activity className={getEngineColor('ServicePulse') + " w-4 h-4"} />
              SERVICEPULSE
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-white">{stats?.servicePulse?.active || 0}</div>
              <div className="text-xs font-medium text-gray-500">ACTIVE</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats?.servicePulse?.atRisk || 0}</div>
              <div className="text-xs font-medium text-gray-500">AT RISK</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats?.servicePulse?.drifted || 0}</div>
              <div className="text-xs font-medium text-gray-500">DRIFTED</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats?.servicePulse?.messagesSentToday || 0}</div>
              <div className="text-xs font-medium text-gray-500">AI MSGS TODAY</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-2xl font-bold text-emerald-400">{stats?.servicePulse?.upsellsDetectedToday || 0}</div>
              <div className="text-xs font-medium text-gray-500">UPSELLS TODAY</div>
            </div>
          </div>
        </div>

        {/* RecallReach Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
           <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <ShieldAlert className={getEngineColor('RecallReach') + " w-4 h-4"} />
              RECALLREACH
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-white">{stats?.recallReach?.totalVehiclesWithRecalls || 0}</div>
              <div className="text-xs font-medium text-gray-500">VEHICLES W/ RECALLS</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{stats?.recallReach?.criticalUnnotified || 0}</div>
              <div className="text-xs font-medium text-gray-500">CRITICAL UNNOTIFIED</div>
            </div>
             <div>
              <div className="text-2xl font-bold text-white">{stats?.recallReach?.pendingNotification || 0}</div>
              <div className="text-xs font-medium text-gray-500">PENDING ALERTS</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats?.recallReach?.notified || 0}</div>
              <div className="text-xs font-medium text-gray-500">NOTIFIED</div>
            </div>
          </div>
        </div>

        {/* TradeIQ Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
           <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <LineChart className={getEngineColor('TradeIQ') + " w-4 h-4"} />
              TRADEIQ
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-white">{stats?.tradeIQ?.hotLeads || 0}</div>
              <div className="text-xs font-medium text-gray-500">HOT LEADS (&gt;75)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stats?.tradeIQ?.readyToBuy || 0}</div>
              <div className="text-xs font-medium text-gray-500">READY TO BUY (&gt;90)</div>
            </div>
            <div className="col-span-2">
              <div className="text-2xl font-bold text-white">${(stats?.tradeIQ?.avgTradeValue || 0).toLocaleString()}</div>
              <div className="text-xs font-medium text-gray-500">AVG PIPELINE TRADE VALUE</div>
            </div>
          </div>
        </div>

      </div>

      {/* Visualizations Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-2">
        
        {/* Fleet Health Donut (40%) */}
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4">Fleet Health Overview</h3>
          <div className="flex-1 min-h-[200px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={fleetData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {fleetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Absolute Center Label */}
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div className="text-2xl font-bold text-white">
                {totalServicePulsePop + (stats?.servicePulse?.recovered || 0)}
              </div>
              <div className="text-xs text-gray-500">
                customers
              </div>
            </div>

          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {fleetData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                {item.name} <span className="text-gray-500 ml-1">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engine Status Summary (60%) */}
        <div className="md:col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-bold text-white mb-6">Engine Status</h3>
          
          <div className="space-y-6">
            {/* ServicePulse Row */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="text-xs font-semibold text-blue-500 tracking-wider">SERVICEPULSE</div>
                <div className="text-xs font-medium text-gray-400">{atRiskPercentage}% of customers need attention</div>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${spBarColor} rounded-full`} style={{ width: `${atRiskPercentage}%` }}></div>
              </div>
            </div>

            {/* RecallReach Row */}
            <div className="flex items-center justify-between border-t border-gray-800/50 pt-5">
              <div className="text-xs font-semibold text-red-500 tracking-wider">RECALLREACH</div>
              <div className="flex items-center gap-3">
                <div className={`text-sm font-medium ${criticalRecalls > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {criticalRecalls > 0 ? `${criticalRecalls} critical recalls unnotified` : '0 critical recalls'} {criticalRecalls > 0 && '🔴'}
                </div>
                {pendingRecalls > 0 && (
                  <div className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700">
                    {pendingRecalls} pending
                  </div>
                )}
              </div>
            </div>

            {/* TradeIQ Row */}
            <div className="flex items-center justify-between border-t border-gray-800/50 pt-5">
              <div className="text-xs font-semibold text-green-500 tracking-wider">TRADEIQ</div>
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-300">
                  <span className="text-green-400 font-bold">{readyToBuy}</span> customers ready to buy
                </div>
                <div className="text-sm font-semibold text-white bg-gray-700 px-3 py-1 rounded-full whitespace-nowrap border border-gray-600">
                  ${avgTradeVal.toLocaleString()} <span className="text-gray-400 text-xs font-normal ml-1">avg value</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Main Dashboard Under-deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Priority Actions List */}
        <div className="lg:col-span-2 space-y-4">
           <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
             <AlertCircle className="w-5 h-5 text-gray-400" />
             Priority Actions Engine
           </h3>
           
           <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
             {filteredPriorityActions && filteredPriorityActions.length > 0 ? (
               filteredPriorityActions.map((action, idx) => (
                 <div key={idx} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-4">
                      
                      <div className="flex flex-col gap-1">
                        <div className={`px-2 py-1 rounded text-[10px] items-center text-center font-bold tracking-wider border ${getPriorityColor(action.type)}`}>
                          {action.type}
                        </div>
                        {action.customer.churnScore >= 6 && (
                          <div className="text-[9px] font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-1 py-0.5 rounded text-center">
                            CHURN: {action.customer.churnScore}/10
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-white mb-0.5">
                          {action.customer.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {action.message}
                        </div>
                      </div>

                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const engineMap = {
                          'ServicePulse': '/service-pulse',
                          'RecallReach': '/recall-reach',
                          'TradeIQ': '/trade-iq'
                        };
                        navigate(engineMap[action.engine] || '/');
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
               ))
             ) : (
               <div className="text-center py-12 border border-gray-800 border-dashed rounded-lg">
                 <p className="text-gray-500 text-sm">No priority actions detected.</p>
               </div>
             )}
           </div>
        </div>

        {/* Live Outreach Feed */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight block">
             Live Outreach Feed
          </h3>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-0 overflow-hidden flex flex-col">
             {recentOutreach && recentOutreach.length > 0 ? (
               <>
                 <div className="flex-1 overflow-y-auto max-h-[400px]">
                   {(showAllLogs ? recentOutreach : recentOutreach.slice(0, 10)).map((log, idx) => (
                     <div key={idx} className="p-3 border-b border-gray-800/50 last:border-0 hover:bg-gray-800/20 transition-colors">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-medium text-gray-300">
                           {log.customer?.name}
                         </span>
                         <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                           {log.type}
                         </span>
                       </div>
                       <p className="text-xs text-gray-400 line-clamp-2 pr-4 leading-relaxed">
                         "{log.message}"
                       </p>
                     </div>
                   ))}
                 </div>
                 {recentOutreach.length > 10 && !showAllLogs && (
                   <button 
                     onClick={() => setShowAllLogs(true)}
                     className="w-full py-3 bg-gray-800/50 hover:bg-gray-800 text-xs font-semibold text-blue-400 border-t border-gray-800 transition-colors"
                   >
                     View all {recentOutreach.length} messages
                   </button>
                 )}
                 {showAllLogs && recentOutreach.length > 10 && (
                   <button 
                     onClick={() => setShowAllLogs(false)}
                     className="w-full py-3 bg-gray-800/50 hover:bg-gray-800 text-xs font-semibold text-gray-400 border-t border-gray-800 transition-colors"
                   >
                     Hide messages
                   </button>
                 )}
               </>
             ) : (
               <div className="p-8 text-center text-sm text-gray-500">
                 No outbound messages yet.
               </div>
             )}
          </div>
        </div>

      </div>

    </div>
  );
}
