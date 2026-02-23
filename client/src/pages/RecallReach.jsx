import { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Car, User, ShieldCheck, Mail } from 'lucide-react';
import api from '../api';
import MessagePreview from '../components/MessagePreview';

export default function RecallReach() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [notifying, setNotifying] = useState({}); // track loading state per vehicle id
  const [generating, setGenerating] = useState({});
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchActiveRecalls();
  }, []);

  const fetchActiveRecalls = async () => {
    try {
      setLoading(true);
      const data = await api.getActiveRecalls();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    try {
      setScanning(true);
      setScanResults(null);
      const results = await api.scanAllRecalls();
      setScanResults(results);
      if (results.newRecallsFound > 0) {
        await fetchActiveRecalls(); // Refresh list if new ones were found
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleSendClick = async (vehicle) => {
    try {
      setGenerating(prev => ({ ...prev, [vehicle.id]: true }));
      const res = await api.generateMessage({ 
        customerId: vehicle.customer.id, 
        type: 'recallreach',
        vehicleId: vehicle.id
      });
      
      setPreview({
        message: res.message,
        recipientName: vehicle.customer.name,
        recipientPhone: vehicle.customer.phone,
        type: 'recallreach',
        id: vehicle.customer.id,
        vehicleId: vehicle.id
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate message');
    } finally {
      setGenerating(prev => ({ ...prev, [vehicle.id]: false }));
    }
  };

  const handleConfirm = async () => {
    try {
      setNotifying(prev => ({ ...prev, [preview.vehicleId]: true }));
      await api.sendMessage({
        message: preview.message,
        customerId: preview.id,
        type: preview.type,
        vehicleId: preview.vehicleId
      });
      setPreview(null);
      await fetchActiveRecalls(); // Refresh
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    } finally {
      setNotifying(prev => ({ ...prev, [preview.vehicleId]: false }));
    }
  };

  const renderSeverityBadge = (severity) => {
    switch(severity) {
      case 'critical': return <span className="bg-red-500/10 text-red-500 border-red-500/20 border px-2 py-0.5 rounded text-[10px] uppercase font-bold">Critical</span>;
      case 'high': return <span className="bg-orange-500/10 text-orange-400 border-orange-500/20 border px-2 py-0.5 rounded text-[10px] uppercase font-bold">High</span>;
      case 'medium': return <span className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 border px-2 py-0.5 rounded text-[10px] uppercase font-bold">Medium</span>;
      default: return <span className="bg-gray-800 text-gray-400 border-gray-700 border px-2 py-0.5 rounded text-[10px] uppercase font-bold">Low</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Header & Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-red-500 w-6 h-6" />
            RecallReach
          </h1>
          <p className="text-gray-400 mt-1">Live NHTSA database scanning and proactive AI alerts.</p>
        </div>
        
        <button 
          onClick={handleScan}
          disabled={scanning}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium tracking-tight flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning NHTSA...' : 'Scan NHTSA Database'}
        </button>
      </div>

      {/* Scan Results Banner */}
      {scanResults && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-green-400">Scan Complete</h3>
            <p className="text-sm text-green-500/80 mt-1">
              Scanned {scanResults.scanned} vehicles. 
              Found {scanResults.newRecallsFound} new recalls 
              affecting {scanResults.vehiclesAffected?.length || 0} vehicles.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20 border border-gray-800 border-dashed rounded-xl">
          <ShieldCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300">Clean Bill of Health</h3>
          <p className="text-gray-500 mt-2">No active pending recalls found in your customer database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 transition-colors hover:border-gray-700">
              
              {/* Vehicle Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="flex items-center gap-1 text-gray-400">
                        <User className="w-3.5 h-3.5" />
                        {vehicle.customer?.name}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400">{vehicle.customer?.phone}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400 flex border border-gray-700 px-1.5 py-0.5 rounded bg-gray-950 text-[10px] tracking-wider font-semibold">
                        SCORE: {vehicle.customer?.purchaseLikelihoodScore}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleSendClick(vehicle)}
                  disabled={notifying[vehicle.id] || generating[vehicle.id]}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 border border-gray-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {notifying[vehicle.id] || generating[vehicle.id] ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-red-400" />
                  )}
                  {notifying[vehicle.id] ? 'Sending...' : generating[vehicle.id] ? 'Drafting...' : 'Send AI Alert'}
                </button>
              </div>

              {/* Recalls List */}
              <div className="space-y-3 pl-16">
                {vehicle.recalls?.map((recall) => (
                  <div key={recall.id} className="bg-gray-950/50 border border-gray-800/80 rounded-lg p-4 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${recall.severity === 'critical' ? 'bg-red-500' : recall.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                    
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {renderSeverityBadge(recall.severity)}
                        <span className="text-sm font-semibold text-gray-300">{recall.component}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{recall.recallId}</span>
                    </div>
                    
                    <p className="text-sm text-gray-400 leading-relaxed mb-2">
                      {recall.summary}
                    </p>
                    
                    {recall.status === 'notified' && (
                       <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider flex items-center gap-1">
                         <ShieldCheck className="w-3 h-3" /> Notified Customer
                       </span>
                    )}

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      {preview && (
        <MessagePreview
          message={preview.message}
          recipientName={preview.recipientName}
          recipientPhone={preview.recipientPhone}
          type={preview.type}
          isLoading={notifying[preview.vehicleId]}
          onConfirm={handleConfirm}
          onCancel={() => setPreview(null)}
        />
      )}

    </div>
  );
}
