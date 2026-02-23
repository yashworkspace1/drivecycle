import React, { useState, useEffect } from 'react';
import { Store, Users, Bot, Sliders, Database, Save, Upload, Download, RefreshCw, Trash2, PlusCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../api';

const DEFAULT_SETTINGS = {
  dealership: {
    name: 'AutoTech Motors',
    address: '123 Innovation Drive, Silicon Valley, CA 94025',
    phone: '(555) 019-8372',
    website: 'https://autotechmotors.demo',
    timezone: 'America/Los_Angeles'
  },
  advisors: [
    { id: 1, name: 'Sarah Chen', email: 'sarah@autotech.demo', style: 'Friendly' },
    { id: 2, name: 'Marcus Johnson', email: 'marcus@autotech.demo', style: 'Professional' }
  ],
  ai: {
    autoSendServicePulse: false,
    servicePulseDelay: 3,
    servicePulseMax: 2,
    includeTradeHook: true,
    tradeHookMinScore: 65,
    autoScanFrequency: 'Weekly',
    tradeIqMinScore: 75,
    tradeIqTone: 'Consultative',
    quietHours: true
  },
  thresholds: {
    churnScoreAlert: 7,
    purchaseLikelihoodAlert: 75,
    daysWithoutService: 90,
    recallResponseSla: 24
  }
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('dealership');
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('drivecycle_settings');
    if (saved) return JSON.parse(saved);
    return DEFAULT_SETTINGS;
  });
  
  const [toast, setToast] = useState(null);
  
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    localStorage.setItem('drivecycle_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSection = (section, data) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };

  const handleSaveDealership = async (e) => {
    e.preventDefault();
    await api.updateDealership(settings.dealership);
    showToast('Dealership settings saved explicitly to server.');
  };

  const [newAdvisor, setNewAdvisor] = useState({ name: '', email: '', style: 'Formal' });
  const [showAddAdvisor, setShowAddAdvisor] = useState(false);

  const handleAddAdvisor = async (e) => {
    e.preventDefault();
    const ad = { ...newAdvisor, id: Date.now() };
    setSettings(prev => ({ ...prev, advisors: [...prev.advisors, ad] }));
    await api.addAdvisor(ad);
    setNewAdvisor({ name: '', email: '', style: 'Formal' });
    setShowAddAdvisor(false);
    showToast('Advisor added.');
  };

  const handleRemoveAdvisor = async (id) => {
    setSettings(prev => ({ ...prev, advisors: prev.advisors.filter(a => a.id !== id) }));
    await api.removeAdvisor(id);
    showToast('Advisor removed.');
  };

  // Sections config
  const tabs = [
    { id: 'dealership', label: 'Dealership', icon: Store },
    { id: 'advisors', label: 'Advisors', icon: Users },
    { id: 'ai', label: 'AI Behaviour', icon: Bot },
    { id: 'thresholds', label: 'Alert Thresholds', icon: Sliders },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full">
      {/* Banner */}
      <div className="bg-blue-900/40 border border-blue-800 text-blue-300 px-4 py-2 rounded-lg text-sm flex items-center justify-center mb-6">
        <AlertTriangle className="w-4 h-4 mr-2 text-blue-400 shrink-0" />
        Settings are saved locally for this demo session
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
          <p className="text-gray-400 mt-1">Configure your dealership and AI engine parameters.</p>
        </div>
      </div>

      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-900/80 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      <div className="flex flex-1 gap-8 min-h-0">
        
        {/* Left Sidebar Nav */}
        <div className="w-64 shrink-0 flex flex-col space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : ''}`} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto pb-20 pr-4">
          
          {/* DEALERSHIP SECTION */}
          {activeTab === 'dealership' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in">
              <h2 className="text-lg font-bold text-white">Dealership Profile</h2>
              <form onSubmit={handleSaveDealership} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dealership Name</label>
                  <input type="text" value={settings.dealership.name} onChange={e => updateSection('dealership', { name: e.target.value })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address</label>
                  <input type="text" value={settings.dealership.address} onChange={e => updateSection('dealership', { address: e.target.value })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                    <input type="text" value={settings.dealership.phone} onChange={e => updateSection('dealership', { phone: e.target.value })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Timezone</label>
                    <select value={settings.dealership.timezone} onChange={e => updateSection('dealership', { timezone: e.target.value })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors">
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Website</label>
                  <input type="text" value={settings.dealership.website} onChange={e => updateSection('dealership', { website: e.target.value })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="pt-4 border-t border-gray-800 flex justify-end">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
                    <Save className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ADVISORS SECTION */}
          {activeTab === 'advisors' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="flex justify-between items-end">
                <h2 className="text-lg font-bold text-white">Service Advisors</h2>
                <button onClick={() => setShowAddAdvisor(!showAddAdvisor)} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-gray-700 transition-colors">
                  <PlusCircle className="w-4 h-4" /> Add Advisor
                </button>
              </div>

              {showAddAdvisor && (
                <form onSubmit={handleAddAdvisor} className="bg-gray-900 border border-blue-500/30 rounded-xl p-5 grid grid-cols-4 gap-4 items-end animate-in fade-in slide-in-from-top-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                    <input required type="text" value={newAdvisor.name} onChange={e => setNewAdvisor({...newAdvisor, name: e.target.value})} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                    <input required type="email" value={newAdvisor.email} onChange={e => setNewAdvisor({...newAdvisor, email: e.target.value})} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Style</label>
                    <select value={newAdvisor.style} onChange={e => setNewAdvisor({...newAdvisor, style: e.target.value})} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
                      <option>Formal</option>
                      <option>Friendly</option>
                      <option>Concise</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center h-[38px]">Save</button>
                  </div>
                </form>
              )}

              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800/60">
                {settings.advisors.map(adv => (
                  <div key={adv.id} className="flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors">
                    <div>
                      <div className="font-semibold text-white">{adv.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{adv.email}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">{adv.style} Tone</span>
                      <button onClick={() => handleRemoveAdvisor(adv.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-md hover:bg-gray-800 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {settings.advisors.length === 0 && (
                   <div className="p-8 text-center text-gray-500 text-sm">No advisors configured.</div>
                )}
              </div>
            </div>
          )}

          {/* AI BEHAVIOUR SECTION */}
          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="flex justify-between items-end">
                <h2 className="text-lg font-bold text-white">AI Behaviour</h2>
                <button onClick={() => showToast('AI Settings applied.')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
                  <Save className="w-4 h-4" /> Apply Changes
                </button>
              </div>

              {/* ServicePulse */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">ServicePulse Options</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Auto-send messages</div>
                    <div className="text-[11px] text-gray-500 mt-1">Skip manual preview and send AI messages automatically.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mb-0">
                    <input type="checkbox" checked={settings.ai.autoSendServicePulse} onChange={e => updateSection('ai', { autoSendServicePulse: e.target.checked })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800/50">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Follow-up delay in days</label>
                     <input type="number" value={settings.ai.servicePulseDelay} onChange={e => updateSection('ai', { servicePulseDelay: parseInt(e.target.value)||0 })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max messages / customer / month</label>
                     <input type="number" value={settings.ai.servicePulseMax} onChange={e => updateSection('ai', { servicePulseMax: parseInt(e.target.value)||0 })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                   </div>
                </div>
              </div>

              {/* RecallReach */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">RecallReach Options</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Include trade-in hook for older vehicles</div>
                    <div className="text-[11px] text-gray-500 mt-1">Append "We want to buy your car" blurbs to safety recalls.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mb-0">
                    <input type="checkbox" checked={settings.ai.includeTradeHook} onChange={e => updateSection('ai', { includeTradeHook: e.target.checked })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800/50">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Trade hook minimum score</label>
                     <input type="number" value={settings.ai.tradeHookMinScore} onChange={e => updateSection('ai', { tradeHookMinScore: parseInt(e.target.value)||0 })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Auto-scan frequency</label>
                     <select value={settings.ai.autoScanFrequency} onChange={e => updateSection('ai', { autoScanFrequency: e.target.value })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                        <option>Manual</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                     </select>
                   </div>
                </div>
              </div>

              {/* TradeIQ */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2">TradeIQ Options</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Minimum score to trigger outreach</label>
                     <input type="number" value={settings.ai.tradeIqMinScore} onChange={e => updateSection('ai', { tradeIqMinScore: parseInt(e.target.value)||0 })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message tone</label>
                     <select value={settings.ai.tradeIqTone} onChange={e => updateSection('ai', { tradeIqTone: e.target.value })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                        <option>Transparent</option>
                        <option>Consultative</option>
                     </select>
                   </div>
                </div>
              </div>

              {/* Global */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Enforce quiet hours (no SMS 9pm-8am)</div>
                    <div className="text-[11px] text-gray-500 mt-1">Queue messages until morning to respect customer boundaries.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mb-0">
                    <input type="checkbox" checked={settings.ai.quietHours} onChange={e => updateSection('ai', { quietHours: e.target.checked })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* THRESHOLDS SECTION */}
          {activeTab === 'thresholds' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in">
              <div className="flex justify-between items-end">
                <h2 className="text-lg font-bold text-white">Alert Thresholds</h2>
                <button onClick={() => showToast('Thresholds updated.')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-white">Churn Score Alert</label>
                    <span className="text-sm font-mono text-blue-400 font-bold">{settings.thresholds.churnScoreAlert} / 10</span>
                  </div>
                  <input type="range" min="1" max="10" step="1" 
                    value={settings.thresholds.churnScoreAlert} 
                    onChange={e => updateSection('thresholds', { churnScoreAlert: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                  <p className="text-xs text-gray-500 mt-2">Flag customers at-risk above this score</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-white">Purchase Likelihood Alert</label>
                    <span className="text-sm font-mono text-green-400 font-bold">{settings.thresholds.purchaseLikelihoodAlert} / 100</span>
                  </div>
                  <input type="range" min="0" max="100" step="1" 
                    value={settings.thresholds.purchaseLikelihoodAlert} 
                    onChange={e => updateSection('thresholds', { purchaseLikelihoodAlert: parseInt(e.target.value) })}
                    className="w-full accent-green-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                  <p className="text-xs text-gray-500 mt-2">Add to hot leads above this score</p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-800/50">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Days Without Service</label>
                    <input type="number" value={settings.thresholds.daysWithoutService} onChange={e => updateSection('thresholds', { daysWithoutService: parseInt(e.target.value)||0 })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recall Response SLA (Hours)</label>
                    <input type="number" value={settings.thresholds.recallResponseSla} onChange={e => updateSection('thresholds', { recallResponseSla: parseInt(e.target.value)||0 })} className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* DATA MANAGEMENT SECTION */}
          {activeTab === 'data' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <h2 className="text-lg font-bold text-white mb-6">Data Management</h2>

              <div className="grid grid-cols-2 gap-5">
                
                {/* Import */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-gray-400" /> Import Customers
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs font-medium border border-gray-700 transition-colors">
                      Download CSV Template
                    </button>
                    <button className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 py-2 rounded-lg text-xs font-medium border border-blue-500/20 transition-colors">
                      Upload CSV Data
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-4 text-center">Last import: Never</p>
                </div>

                {/* Export */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Download className="w-4 h-4 text-gray-400" /> Export Data
                  </h3>
                  <div className="space-y-3">
                    <button onClick={async () => { await api.exportOutreach(); showToast('Outreach exported (mock).')}} className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs font-medium border border-gray-700 transition-colors">
                      Export Outreach Log
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs font-medium border border-gray-700 transition-colors">
                      Export Customer List
                    </button>
                  </div>
                </div>

                {/* Demo Controls */}
                <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-red-500 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Demo Controls
                  </h3>
                  <p className="text-[11px] text-red-400 mb-4">Development use only. This will drop all tables and re-seed the standard demo data.</p>
                  <button onClick={async () => { await api.resetDemoData(); showToast('Demo data reset.'); }} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-medium transition-colors border border-red-600 shadow-sm shadow-red-900">
                    Reset to Demo Data
                  </button>
                  <p className="text-[10px] text-gray-500 mt-4 text-center">Last reset: Active Session</p>
                </div>

                {/* NHTSA Sync */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-gray-400" /> NHTSA Sync
                  </h3>
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-xs text-gray-400">Last scanned: <span className="text-white">Today at 8:00 AM</span></span>
                    <span className="text-xs text-gray-400">Next scheduled: <span className="text-white">Manual</span></span>
                  </div>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs font-medium border border-gray-700 transition-colors flex items-center justify-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5" /> Manual Scan
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
