import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, ShieldAlert, MessageSquare, Activity, LogOut, ShieldCheck, RefreshCw, Building, AlertTriangle, CheckCircle, Search, ChevronDown } from 'lucide-react';
import api from '../api';

// ═══════════════════════════════════════════════
// ADMIN DASHBOARD — 5 Pages, Real Database Data
// ═══════════════════════════════════════════════

export default function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('overview'); // overview | dealers | recalls | messages | health
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sidebar badge counts (from overview)
  const dealerCount = overviewData?.platform?.totalDealers || 0;
  const criticalCount = overviewData?.recallMonitor?.criticalUnnotified?.length || 0;
  const messagesToday = overviewData?.aiActivity?.messagesToday || 0;

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const data = await api.adminGetOverview();
      setOverviewData(data);
    } catch (err) {
      console.error('Failed to fetch admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard, section: 'OVERVIEW' },
    { id: 'dealers', label: 'All Dealers', icon: Building, badge: dealerCount, badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20', section: 'MANAGEMENT' },
    { id: 'recalls', label: 'Recall Monitor', icon: ShieldAlert, badge: criticalCount > 0 ? criticalCount : null, badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20', section: 'MANAGEMENT' },
    { id: 'messages', label: 'AI Message Log', icon: MessageSquare, badge: messagesToday > 0 ? messagesToday : null, badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20', section: 'INTELLIGENCE' },
    { id: 'health', label: 'System Health', icon: Activity, section: 'INTELLIGENCE' },
  ];

  const sections = ['OVERVIEW', 'MANAGEMENT', 'INTELLIGENCE'];

  return (
    <div className="flex h-screen bg-[#040608] text-[#f0f4ff] font-['DM_Sans']">

      {/* ─── SIDEBAR ─── */}
      <div className="w-[260px] bg-[#0c0f14] border-r border-white/10 flex flex-col shrink-0">
        {/* Logo + Admin Badge */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">DriveCycle</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5" style={{background:'rgba(245,158,11,0.15)',border:'1px solid rgba(245,158,11,0.3)'}}>
            <ShieldCheck className="w-3 h-3 text-amber-500" />
            <span className="text-[0.65rem] font-bold text-amber-500 tracking-[0.15em] uppercase">ADMIN</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {sections.map(section => {
            const sectionItems = navItems.filter(n => n.section === section);
            if (sectionItems.length === 0) return null;
            return (
              <div key={section} className="mb-4">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] px-3 mb-2">{section}</p>
                {sectionItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button key={item.id} onClick={() => setActivePage(item.id)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'}`}
                      style={isActive ? {background:'rgba(245,158,11,0.1)',borderLeft:'2px solid #f59e0b'} : {borderLeft:'2px solid transparent'}}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge != null && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.badgeColor}`}>{item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User + Sign Out */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-amber-900" style={{background:'linear-gradient(135deg,#f59e0b,#d97706)'}}>SM</div>
            <div className="min-w-0"><p className="text-sm font-medium text-white truncate">Sarah Mitchell</p><p className="text-[10px] text-gray-500">Admin</p></div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 w-full text-left font-medium text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 overflow-auto relative">
        <div className="absolute top-0 left-1/4 right-0 h-[200px] bg-gradient-to-r from-amber-500/5 to-red-500/5 blur-[100px] pointer-events-none" />
        <div className="relative z-10 p-8 lg:p-10 max-w-[1440px]">
          {activePage === 'overview' && <OverviewPage data={overviewData} loading={loading} onRefresh={fetchOverview} />}
          {activePage === 'dealers' && <DealersPage />}
          {activePage === 'recalls' && <RecallsPage />}
          {activePage === 'messages' && <MessagesPage />}
          {activePage === 'health' && <HealthPage />}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE 1: Platform Overview
// ═══════════════════════════════════════════════
function OverviewPage({ data, loading, onRefresh }) {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSecondsAgo(Math.floor((new Date() - lastUpdated) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  useEffect(() => {
    const interval = setInterval(() => {
      onRefresh();
      setLastUpdated(new Date());
      setSecondsAgo(0);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => { onRefresh(); setLastUpdated(new Date()); setSecondsAgo(0); };

  const timeLabel = secondsAgo < 5 ? 'Updated just now' : secondsAgo < 60 ? `Updated ${secondsAgo}s ago` : `Updated ${Math.floor(secondsAgo/60)}m ago`;

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>;
  if (!data) return <p className="text-gray-500">Failed to load overview data.</p>;

  const p = data.platform;
  const ai = data.aiActivity;
  const rm = data.recallMonitor;
  const ch = data.customerHealth;
  const totalCustomers = ch.byStatus.active + ch.byStatus.atRisk + ch.byStatus.drifted + ch.byStatus.recovered || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div><h1 className="font-['Syne'] font-bold text-[1.8rem] text-white tracking-tight">Platform Overview</h1><p className="text-gray-500 text-sm mt-1">Live data across all connected dealerships</p></div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">{timeLabel}</span>
          <button onClick={handleRefresh} className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"><RefreshCw className="w-4 h-4 text-gray-400" /></button>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-xs font-bold text-green-400">Live</span></div>
        </div>
      </div>

      {/* Row 1: Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard accent="#f59e0b" label="REGISTERED DEALERS" value={p.totalDealers} icon={<Building className="w-5 h-5 text-amber-500" />} sub={<span className="text-green-400 text-xs font-bold">Active</span>} />
        <StatCard accent="#3b82f6" label="CUSTOMERS TRACKED" value={p.totalCustomers} icon={<Users className="w-5 h-5 text-blue-500" />} sub={<span className="text-xs text-gray-500">across all dealerships</span>} />
        <StatCard accent="#22c55e" label="AI MESSAGES TODAY" value={ai.messagesToday} icon={<MessageSquare className="w-5 h-5 text-green-500" />}
          sub={<div className="flex gap-2 mt-1">{[['SP',ai.byType.servicepulse,'blue'],['RR',ai.byType.recallreach,'orange'],['TI',ai.byType.tradeiq,'green']].map(([l,v,c])=><span key={l} className={`text-[10px] font-bold text-${c}-400 bg-${c}-500/10 px-1.5 py-0.5 rounded`}>{l}: {v}</span>)}</div>} />
        <StatCard accent="#ef4444" label="CRITICAL RECALLS" value={rm.bySeverity.critical} icon={<AlertTriangle className="w-5 h-5 text-red-500" />} valueColor={rm.bySeverity.critical > 0 ? '#ef4444' : '#22c55e'}
          sub={rm.criticalUnnotified.length > 0 ? <span className="text-xs font-bold text-red-400">{rm.criticalUnnotified.length} unnotified</span> : <span className="text-xs text-green-400">All notified ✓</span>} />
      </div>

      {/* Row 2: Customer Health + Critical Recalls */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Customer Health (60%) */}
        <div className="xl:col-span-3 bg-[#0c0f14] border border-white/[0.07] rounded-2xl p-6">
          <h3 className="font-bold text-white mb-5">Customer Health — Platform Wide</h3>
          <div className="space-y-4 mb-6">
            {[['Active',ch.byStatus.active,'#22c55e'],['At-Risk',ch.byStatus.atRisk,'#f59e0b'],['Drifted',ch.byStatus.drifted,'#ef4444'],['Recovered',ch.byStatus.recovered,'#3b82f6']].map(([label,count,color])=>(
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-400">{label}</span><span className="font-bold text-white">{count}</span></div>
                <div className="w-full h-1.5 rounded-full" style={{background:'rgba(255,255,255,0.06)'}}><div className="h-full rounded-full transition-all duration-700" style={{width:`${(count/totalCustomers)*100}%`,background:color}} /></div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
            {[`Avg Churn Score: ${ch.avgChurnScore}`,`Avg Purchase Score: ${ch.avgPurchaseScore}`,`Avg Lifetime Spend: $${ch.avgLifetimeSpend.toLocaleString()}`].map(t=>(
              <span key={t} className="text-[0.78rem] text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-full px-3.5 py-1.5">{t}</span>
            ))}
          </div>
        </div>

        {/* Critical Recall Alerts (40%) */}
        <div className="xl:col-span-2 bg-[#0c0f14] border border-white/[0.07] rounded-2xl p-6">
          <h3 className="font-bold text-white mb-5">Critical Recall Alerts</h3>
          {rm.criticalUnnotified.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center"><CheckCircle className="w-10 h-10 text-green-500 mb-3" /><p className="text-green-400 font-medium">All critical recalls notified ✓</p></div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">{rm.criticalUnnotified.map((r,i) => (
              <div key={i} className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">CRITICAL</span>
                  <span className={`text-[10px] font-bold ${r.daysPending > 3 ? 'text-red-400' : 'text-amber-400'}`}>{r.daysPending}d pending</span>
                </div>
                <p className="text-sm font-bold text-white truncate">{r.component}</p>
                <p className="text-xs text-gray-500">{r.customerName} · {r.vehicleName}</p>
                <button onClick={async()=>{try{await api.notifyRecall(r.vehicleId);onRefresh();}catch(e){console.error(e)}}} className="mt-3 text-[11px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg hover:bg-blue-600/30 transition-colors">Notify Now</button>
              </div>
            ))}</div>
          )}
        </div>
      </div>

      {/* Row 3: AI Activity + Recall Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AI Message Activity */}
        <div className="bg-[#0c0f14] border border-white/[0.07] rounded-2xl p-6">
          <h3 className="font-bold text-white mb-5">AI Message Activity</h3>
          <div className="space-y-3 mb-6">
            {[['ServicePulse',ai.byType.servicepulse,'blue','SP'],['RecallReach',ai.byType.recallreach,'orange','RR'],['TradeIQ',ai.byType.tradeiq,'green','TI']].map(([name,count,color,tag])=>(
              <div key={name} className="flex items-center gap-3 p-3 rounded-xl border border-white/5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>{tag}</span>
                <span className="text-sm text-white font-medium flex-1">{name}</span>
                <span className="text-sm font-bold text-white">{count} <span className="text-xs font-normal text-gray-500">today</span></span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/5">
            <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-400">Message Success Rate</span><span className="text-2xl font-['Syne'] font-bold text-green-400">{ai.successRate}%</span></div>
            <div className="w-full h-2 rounded-full" style={{background:'rgba(255,255,255,0.06)'}}><div className="h-full rounded-full bg-green-500 transition-all duration-700" style={{width:`${ai.successRate}%`}} /></div>
          </div>
        </div>

        {/* Recall Status Breakdown */}
        <div className="bg-[#0c0f14] border border-white/[0.07] rounded-2xl p-6">
          <h3 className="font-bold text-white mb-5">Recall Status Breakdown</h3>
          <div className="flex items-center justify-center py-4">
            <DonutChart data={rm.byStatus} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[['Pending',rm.byStatus.pending,'#f59e0b'],['Notified',rm.byStatus.notified,'#3b82f6'],['Scheduled',rm.byStatus.scheduled,'#8b5cf6'],['Completed',rm.byStatus.completed,'#22c55e']].map(([label,count,color])=>(
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5">
                <div className="w-2.5 h-2.5 rounded-full" style={{background:color}} /><span className="text-sm text-gray-400">{label}</span><span className="text-sm font-bold text-white ml-auto">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE 2: All Dealers
// ═══════════════════════════════════════════════
function DealersPage() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { api.adminGetDealers().then(setDealers).catch(console.error).finally(() => setLoading(false)); }, []);

  const filtered = dealers.filter(d => d.dealershipName.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="font-['Syne'] font-bold text-[1.8rem] text-white tracking-tight">All Dealers <span className="text-base font-normal text-gray-500 ml-2">{dealers.length}</span></h1><p className="text-gray-500 text-sm mt-1">View and manage registered dealerships</p></div>
      </div>
      <div className="relative max-w-md"><Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full bg-[#0c0f14] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50" /></div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No dealers found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map(d => (
            <div key={d.id} className="bg-[#0c0f14] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-amber-900 shrink-0" style={{background:'linear-gradient(135deg,#f59e0b,#d97706)'}}>{d.fullName.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-['Syne'] font-bold text-white">{d.dealershipName}</p>
                  <p className="text-xs text-gray-500">{d.fullName} · {d.email}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${d.plan === 'full' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/5 text-gray-400 border-white/10'}`}>{d.plan === 'full' ? 'FULL ACCESS' : 'FREE'}</span>
              </div>
              <div className="grid grid-cols-5 gap-3 mb-4">
                {[['Customers',d.stats.customers],['Vehicles',d.stats.vehicles],['Recalls',d.stats.activeRecalls],['Messages',d.stats.messagesSent],['Hot Leads',d.stats.hotLeads]].map(([l,v])=>(
                  <div key={l} className="text-center"><p className="text-lg font-bold text-white">{v}</p><p className="text-[10px] text-gray-500">{l}</p></div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500">{d.city}, {d.country} · Since {new Date(d.createdAt).toLocaleDateString()}</span>
                <button onClick={()=>alert(JSON.stringify(d,null,2))} className="text-xs font-bold text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE 3: Recall Monitor
// ═══════════════════════════════════════════════
function RecallsPage() {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchRecalls = () => { api.adminGetRecalls().then(setRecalls).catch(console.error).finally(() => setLoading(false)); };
  useEffect(fetchRecalls, []);

  const filtered = recalls.filter(r => {
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const handleNotify = async (vehicleId) => {
    try { await api.notifyRecall(vehicleId); fetchRecalls(); } catch (e) { console.error(e); }
  };

  if (loading) return <Loader />;

  const stats = { total: recalls.length, critical: recalls.filter(r=>r.severity==='critical').length, high: recalls.filter(r=>r.severity==='high').length, pending: recalls.filter(r=>r.status==='pending').length };

  return (
    <div className="space-y-6">
      <div><h1 className="font-['Syne'] font-bold text-[1.8rem] text-white tracking-tight">Global Recall Monitor</h1><p className="text-gray-500 text-sm mt-1">Platform-wide vehicle safety recall tracking</p></div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {['all','critical','high','medium'].map(s=>(
          <button key={s} onClick={()=>setSeverityFilter(s)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${severityFilter===s ? 'bg-white/10 text-white border-white/20' : 'text-gray-500 border-white/5 hover:text-gray-300'}`}>{s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}</button>
        ))}
        <div className="ml-auto relative">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-[#0c0f14] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 appearance-none pr-8 focus:outline-none">
            <option value="all">All Statuses</option><option value="pending">Pending</option><option value="notified">Notified</option><option value="completed">Completed</option>
          </select>
          <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Stats Pills */}
      <div className="flex flex-wrap gap-3">
        {[['Total',stats.total,'gray'],['Critical',stats.critical,'red'],['High',stats.high,'orange'],['Pending',stats.pending,'amber']].map(([l,v,c])=>(
          <span key={l} className={`text-xs font-bold px-3 py-1.5 rounded-full border bg-${c}-500/10 text-${c}-400 border-${c}-500/20`}>{l}: {v}</span>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0c0f14] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Severity</th><th className="px-4 py-3 text-left">Recall ID</th><th className="px-4 py-3 text-left">Component</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Vehicle</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Detected</th><th className="px-4 py-3 text-left">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3"><SeverityBadge s={r.severity} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.recallId}</td>
                  <td className="px-4 py-3 text-white max-w-[200px] truncate" title={r.component}>{r.component}</td>
                  <td className="px-4 py-3"><span className="text-white">{r.customer.name}</span></td>
                  <td className="px-4 py-3 text-gray-400">{r.vehicle.year} {r.vehicle.make} {r.vehicle.model}</td>
                  <td className="px-4 py-3"><StatusBadge s={r.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.daysPending}d ago</td>
                  <td className="px-4 py-3">
                    {r.status === 'pending' ? <button onClick={()=>handleNotify(r.vehicle.id)} className="text-[11px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg hover:bg-blue-600/30 transition-colors">Notify</button>
                    : r.status === 'notified' ? <span className="text-xs text-green-400 font-medium">Done ✓</span>
                    : <span className="text-xs text-gray-500">Completed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-gray-500 py-12">No recalls match your filters.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE 4: AI Message Log
// ═══════════════════════════════════════════════
function MessagesPage() {
  const [data, setData] = useState({ messages: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMessages = (type, status) => {
    setLoading(true);
    api.adminGetMessages({ type: type || 'all', status: status || 'all', limit: 50 })
      .then(setData).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleTypeChange = (t) => { setTypeFilter(t); fetchMessages(t, statusFilter); };
  const handleStatusChange = (s) => { setStatusFilter(s); fetchMessages(typeFilter, s); };

  const typeColors = { servicepulse: 'blue', recallreach: 'orange', tradeiq: 'green' };
  const typeTags = { servicepulse: 'SP', recallreach: 'RR', tradeiq: 'TI' };
  const statusColors = { sent: 'gray', delivered: 'blue', replied: 'green', failed: 'red' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="font-['Syne'] font-bold text-[1.8rem] text-white tracking-tight">AI Message Log</h1><p className="text-gray-500 text-sm mt-1">Every AI-generated message across all engines</p></div>
        <span className="text-xs text-gray-500">Showing {data.messages.length} of {data.total} messages</span>
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap items-center gap-3">
        {['all','servicepulse','recallreach','tradeiq'].map(t=>(
          <button key={t} onClick={()=>handleTypeChange(t)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${typeFilter===t ? 'bg-white/10 text-white border-white/20' : 'text-gray-500 border-white/5 hover:text-gray-300'}`}>{t==='all'?'All':t==='servicepulse'?'ServicePulse':t==='recallreach'?'RecallReach':'TradeIQ'}</button>
        ))}
        <div className="ml-auto flex gap-2">
          {['all','sent','delivered','replied','failed'].map(s=>(
            <button key={s} onClick={()=>handleStatusChange(s)} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${statusFilter===s ? 'bg-white/10 text-white border-white/20' : 'text-gray-500 border-white/5 hover:text-gray-300'}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-3">
          {data.messages.map(m => {
            const c = typeColors[m.type] || 'gray';
            const sc = statusColors[m.status] || 'gray';
            return (
              <div key={m.id} className="bg-[#0c0f14] border border-white/[0.07] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${c}-500/10 text-${c}-400 border border-${c}-500/20`}>{typeTags[m.type] || m.type}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${sc}-500/10 text-${sc}-400 border border-${sc}-500/20`}>{m.status}</span>
                </div>
                <div className="mb-2"><span className="text-[0.9rem] font-medium text-white">{m.customerName}</span><span className="text-xs text-gray-500 ml-2">{m.customerPhone}</span></div>
                <div className="rounded-lg p-3 text-[0.85rem] text-gray-300 leading-relaxed" style={{background:'rgba(255,255,255,0.03)',borderLeft:`3px solid var(--tw-${c}-500, #6b7280)`}}>
                  {m.message}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] text-gray-500">{timeAgo(m.sentAt)}</span>
                  {m.twilioSid && <span className="text-[10px] text-gray-600 font-mono">{m.twilioSid}</span>}
                </div>
              </div>
            );
          })}
          {data.messages.length === 0 && <p className="text-center text-gray-500 py-12">No messages match your filters.</p>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE 5: System Health
// ═══════════════════════════════════════════════
function HealthPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => { setLoading(true); api.adminGetSystemHealth().then(setHealth).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { fetchHealth(); const i = setInterval(fetchHealth, 60000); return () => clearInterval(i); }, []);

  if (loading || !health) return <Loader />;

  const s = health.services;
  const allHealthy = s.database.status === 'healthy' && s.nhtsa.status === 'healthy';
  const anyError = Object.values(s).some(v => v.status === 'error' || v.status === 'not_configured');
  const anyWarning = Object.values(s).some(v => v.status === 'rate_limited');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="font-['Syne'] font-bold text-[1.8rem] text-white tracking-tight">System Health</h1></div>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${anyError ? 'bg-red-500/10 text-red-400 border-red-500/20' : anyWarning ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : allHealthy ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{anyError ? 'System error' : anyWarning ? 'Rate limited' : allHealthy ? 'All systems operational' : 'Degraded performance'}</span>
          <button onClick={fetchHealth} className="text-xs font-bold text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> Run Health Check</button>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { name: 'Database (Supabase)', sub: 'PostgreSQL via Supabase', data: s.database, showLatency: true },
          { name: 'NHTSA API', sub: 'api.nhtsa.gov', data: s.nhtsa, showLatency: true },
          { name: 'Gemini AI', sub: 'Google Gemini 2.0 Flash', data: s.gemini, showLatency: false },
          { name: 'Twilio SMS', sub: 'SMS delivery service', data: s.twilio, showLatency: false }
        ].map(svc => {
          const ok = svc.data.status === 'healthy' || svc.data.status === 'configured';
          const rateLimited = svc.data.status === 'rate_limited';
          return (
            <div key={svc.name} className="bg-[#0c0f14] rounded-2xl p-6" style={{border: ok ? '1px solid rgba(34,197,94,0.2)' : rateLimited ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(239,68,68,0.2)'}}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${ok ? 'bg-green-500 animate-pulse' : rateLimited ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
                <span className={`text-sm font-bold ${ok ? 'text-green-400' : rateLimited ? 'text-amber-400' : 'text-red-400'}`}>{ok ? (svc.data.status === 'configured' ? 'Configured' : 'Operational') : rateLimited ? 'Rate Limited' : svc.data.status === 'not_configured' ? 'Not Configured' : 'Error'}</span>
              </div>
              <p className="font-bold text-white text-lg mb-1">{svc.name}</p>
              <p className="text-xs text-gray-500 mb-2">{svc.sub}</p>
              {svc.showLatency && svc.data.latency != null && <p className="text-xs text-gray-400">{svc.data.latency}ms response time</p>}
            </div>
          );
        })}
      </div>

      {/* Database Records */}
      <div className="bg-[#0c0f14] border border-white/[0.07] rounded-2xl p-6">
        <h3 className="font-bold text-white mb-5">Database Records</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(health.database).map(([k,v]) => (
            <div key={k} className="text-center p-3 rounded-xl border border-white/5">
              <p className="text-2xl font-bold text-white">{v}</p>
              <p className="text-[10px] text-gray-500 mt-1">{k.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Server Info */}
      <div className="flex flex-wrap gap-3">
        {[`Node: ${health.environment.nodeVersion}`,`Uptime: ${Math.floor(health.environment.uptime/60)}m`,`Memory: ${health.environment.memoryUsage}MB`].map(t=>(
          <span key={t} className="text-[0.78rem] text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-full px-3.5 py-1.5">{t}</span>
        ))}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════

function StatCard({ accent, label, value, icon, sub, valueColor }) {
  return (
    <div className="bg-[#0c0f14] border border-white/[0.07] rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{background: accent}} />
      <div className="flex justify-between items-start mb-3">{icon}<p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p></div>
      <p className="text-4xl font-['Syne'] font-extrabold leading-none mb-2" style={{color: valueColor || 'white'}}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {sub}
    </div>
  );
}

function DonutChart({ data }) {
  const total = Object.values(data).reduce((s,v) => s+v, 0) || 1;
  const colors = { pending: '#f59e0b', notified: '#3b82f6', scheduled: '#8b5cf6', completed: '#22c55e' };
  const entries = Object.entries(data);
  let cumulative = 0;
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      {entries.map(([key, value]) => {
        const pct = value / total;
        const dashArray = `${pct * circumference} ${circumference}`;
        const offset = -cumulative * circumference + circumference * 0.25;
        cumulative += pct;
        return <circle key={key} cx={size/2} cy={size/2} r={radius} fill="none" stroke={colors[key] || '#666'} strokeWidth={strokeWidth} strokeDasharray={dashArray} strokeDashoffset={offset} style={{transition:'stroke-dasharray 0.7s ease'}} />;
      })}
      <text x={size/2} y={size/2-6} textAnchor="middle" fill="white" fontSize="24" fontWeight="800" fontFamily="Syne">{total}</text>
      <text x={size/2} y={size/2+14} textAnchor="middle" fill="#6b7a99" fontSize="10" fontWeight="600">TOTAL</text>
    </svg>
  );
}

function SeverityBadge({ s }) {
  const m = { critical: 'bg-red-500/10 text-red-500 border-red-500/20', high: 'bg-orange-500/10 text-orange-400 border-orange-500/20', medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', low: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${m[s]||m.low}`}>{s}</span>;
}

function StatusBadge({ s }) {
  const m = { pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20', notified: 'bg-blue-500/10 text-blue-400 border-blue-500/20', scheduled: 'bg-purple-500/10 text-purple-400 border-purple-500/20', completed: 'bg-green-500/10 text-green-400 border-green-500/20' };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${m[s]||m.pending}`}>{s}</span>;
}

function Loader() { return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>; }

function timeAgo(date) {
  const s = Math.floor((new Date() - new Date(date)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}
