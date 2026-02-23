import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, ShieldAlert, LineChart, PlusCircle, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const links = [
    { name: 'Command Center', path: '/', icon: LayoutDashboard },
    { name: 'ServicePulse', path: '/service-pulse', icon: Activity },
    { name: 'RecallReach', path: '/recall-reach', icon: ShieldAlert },
    { name: 'TradeIQ', path: '/trade-iq', icon: LineChart },
    { name: 'Log Service Job', path: '/add-service-job', icon: PlusCircle },
  ];

  return (
    <div className="flex flex-col w-64 h-full bg-gray-950 flex-shrink-0">
      
      {/* Brand */}
      <div className="flex flex-col justify-center h-20 px-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <Activity className="w-5 h-5 text-white" />
           </div>
           <div>
             <h1 className="text-xl font-bold tracking-tight text-white leading-tight">DriveCycle</h1>
             <p className="text-xs text-blue-500 font-medium">LIFECYCLE ENGINE</p>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-4">Platform</div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
                  : 'text-gray-400 border border-transparent hover:bg-gray-900 hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link to="/settings" className={`flex items-center gap-3 px-3 py-2 w-full text-left rounded-md font-medium transition-colors ${
          location.pathname === '/settings' 
            ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
            : 'text-gray-400 border border-transparent hover:bg-gray-900 hover:text-gray-200'
        }`}>
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button 
           onClick={onLogout}
           className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md font-medium transition-colors text-gray-400 hover:bg-gray-900 hover:text-gray-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
