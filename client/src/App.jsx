import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ServicePulse from './pages/ServicePulse';
import RecallReach from './pages/RecallReach';
import TradeIQ from './pages/TradeIQ';
import AddServiceJob from './pages/AddServiceJob';
import Settings from './pages/Settings';

// New Authentication Components
import Landing from './pages/Landing';
import LoginModal from './components/LoginModal';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dealer' | 'admin'
  const [showLogin, setShowLogin] = useState(false);

  if (view === 'landing') {
    return (
      <>
        <Landing onShowLogin={() => setShowLogin(true)} />
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)}
          onDealerLogin={() => { setShowLogin(false); setView('dealer'); }}
          onAdminLogin={() => { setShowLogin(false); setView('admin'); }}
        />
      </>
    );
  }

  if (view === 'admin') {
    return <AdminDashboard onLogout={() => setView('landing')} />;
  }

  // view === 'dealer'
  return (
    <Router>
      <div className="flex h-screen bg-gray-950 text-gray-50 overflow-hidden text-sm">
        <Sidebar onLogout={() => setView('landing')} />
        <main className="flex-1 overflow-y-auto p-8 border-l border-gray-800">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/service-pulse" element={<ServicePulse />} />
            <Route path="/recall-reach" element={<RecallReach />} />
            <Route path="/trade-iq" element={<TradeIQ />} />
            <Route path="/add-service-job" element={<AddServiceJob />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
