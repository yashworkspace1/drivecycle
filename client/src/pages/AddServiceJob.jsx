import { useState, useEffect } from 'react';
import { PlusCircle, Wrench, RefreshCw } from 'lucide-react';
import api from '../api';

export default function AddServiceJob() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [formData, setFormData] = useState({
    customerId: '',
    serviceType: 'Oil Change',
    complaints: '',
    laborCost: '',
    partsCost: '',
    advisor: 'Sarah Chen'
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const selectedVehicle = selectedCustomer?.vehicles?.[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) return alert('Customer must have a vehicle');

    try {
      setSubmitting(true);
      setSuccessData(null);

      const payload = {
        customerId: formData.customerId,
        vehicleId: selectedVehicle.id,
        serviceType: formData.serviceType,
        complaints: formData.complaints,
        laborCost: parseFloat(formData.laborCost) || 0,
        partsCost: parseFloat(formData.partsCost) || 0,
        advisor: formData.advisor
      };

      const result = await api.addServiceJob(payload);
      setSuccessData(result);
      
      // Reset form but keep customer selected for easy demoing
      setFormData(prev => ({
        ...prev,
        complaints: '',
        laborCost: '',
        partsCost: ''
      }));

    } catch (err) {
      console.error(err);
      alert('Failed to log service job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Wrench className="text-gray-400 w-6 h-6" />
          Log Service Job
        </h1>
        <p className="text-gray-400 mt-1">Simulate a closed RO to trigger the ServicePulse analyzer.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer</label>
              <select 
                value={formData.customerId}
                onChange={e => setFormData({...formData, customerId: e.target.value})}
                required
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select a Customer...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {selectedVehicle && (
              <div className="p-3 bg-gray-950/50 border border-gray-800 rounded-lg flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-200">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</p>
                  <p className="text-xs text-gray-500 font-mono">VIN: {selectedVehicle.vin}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Service Type</label>
                <select 
                  value={formData.serviceType}
                  onChange={e => setFormData({...formData, serviceType: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                >
                  <option>Oil Change</option>
                  <option>Brake Inspection</option>
                  <option>Brake Replacement</option>
                  <option>AC Service</option>
                  <option>Tyre Rotation</option>
                  <option>Battery Check</option>
                  <option>Full Service</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Advisor</label>
                <input 
                  type="text"
                  value={formData.advisor}
                  onChange={e => setFormData({...formData, advisor: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Complaints / Tech Notes</label>
              <textarea 
                rows={3}
                value={formData.complaints}
                onChange={e => setFormData({...formData, complaints: e.target.value})}
                placeholder="e.g. customer mentioned battery seemed weak when starting..."
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors placeholder:text-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Labor Cost ($)</label>
                <input 
                  type="number"
                  value={formData.laborCost}
                  onChange={e => setFormData({...formData, laborCost: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Parts Cost ($)</label>
                <input 
                  type="number"
                  value={formData.partsCost}
                  onChange={e => setFormData({...formData, partsCost: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-800">
            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <PlusCircle className="w-5 h-5" />
              )}
              {submitting ? 'Analyzing and Logging...' : 'Complete Service Job'}
            </button>
          </div>

        </form>
      )}

      {/* Real-time AI Analysis Results Box */}
      {successData && (
         <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-emerald-400 mb-2">Job Logged Successfully</h3>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
                <span className="text-emerald-500/80 text-sm">New Churn Score</span>
                <span className="font-bold text-emerald-400 font-mono text-lg">{successData.newChurnScore}/10</span>
              </div>
              {successData.upsellOpportunities && successData.upsellOpportunities.length > 0 ? (
                <div>
                   <span className="text-emerald-500/80 text-sm block mb-2">AI Detected Upsell Opportunities:</span>
                   {successData.upsellOpportunities.map((op, idx) => (
                     <div key={idx} className="bg-emerald-950/50 p-3 rounded-lg border border-emerald-500/20 mb-2">
                       <span className="font-bold text-emerald-400">{op.part}</span>
                       <p className="text-emerald-500/70 text-sm mt-1">{op.message}</p>
                     </div>
                   ))}
                </div>
              ) : (
                 <span className="text-emerald-500/60 text-sm">No new upsell opportunities detected from notes.</span>
              )}
            </div>
         </div>
      )}

    </div>
  );
}

// Minimal missing icon
function Car(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
}
