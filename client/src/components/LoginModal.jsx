import { useState } from 'react';
import { X, Lock, Eye, EyeOff, Building, ShieldCheck } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onDealerLogin, onAdminLogin }) {
  const [activeTab, setActiveTab] = useState('dealer'); // 'dealer' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passkey, setPasskey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'dealer') {
      if (email === 'dealer@drivecycle.com' && password === 'demo2026') {
        onDealerLogin();
      } else {
        setError('Invalid credentials. Try the demo credentials below.');
      }
    } else {
      if (email === 'admin@drivecycle.com' && password === 'admin2026' && passkey === 'DC-ADMIN') {
        onAdminLogin();
      } else {
        setError('Invalid admin credentials. Try the demo credentials below.');
      }
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    setEmail('');
    setPassword('');
    setPasskey('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-['DM_Sans']">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#040608]/95 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] bg-[#0c0f14] border border-white/10 rounded-[20px] shadow-2xl p-8 z-10 animate-in zoom-in-95 duration-200 isolate overflow-hidden">
         
         {/* Subtle styling effects */}
         <div className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-300 ${activeTab === 'dealer' ? 'bg-blue-500' : 'bg-[#f59e0b]'}`}></div>

         {/* Close Button */}
         <button 
           onClick={onClose}
           className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
         >
           <X className="w-5 h-5" />
         </button>

         {/* Tabs */}
         <div className="flex border-b border-white/10 mb-8 mt-2">
            <button
               onClick={() => handleTabSwitch('dealer')}
               className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${
                 activeTab === 'dealer' 
                   ? 'border-blue-500 text-white' 
                   : 'border-transparent text-gray-500 hover:text-gray-300'
               }`}
            >
               <Building className="w-4 h-4" />
               Dealer Login
            </button>
            <button
               onClick={() => handleTabSwitch('admin')}
               className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${
                 activeTab === 'admin' 
                   ? 'border-[#f59e0b] text-white' 
                   : 'border-transparent text-gray-500 hover:text-gray-300'
               }`}
            >
               <ShieldCheck className="w-4 h-4" />
               Admin Login
            </button>
         </div>

         {/* Content Area */}
         <div className="mb-6">
            {activeTab === 'dealer' ? (
              <>
                 <h2 className="font-['Syne'] text-2xl font-bold text-white tracking-tight mb-1">Welcome back</h2>
                 <p className="text-gray-400 text-sm">Sign in to your dealership dashboard</p>
              </>
            ) : (
              <>
                 <h2 className="font-['Syne'] text-2xl font-bold text-white tracking-tight mb-1">Admin Access</h2>
                 <p className="text-[#f59e0b] text-sm font-medium">Internal DriveCycle administration</p>
              </>
            )}
         </div>

         {error && (
            <div className={`mb-6 p-3 rounded-lg text-xs font-bold ${activeTab === 'dealer' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
              {error}
            </div>
         )}

         {/* Form */}
         <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
               <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-[#040608] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                 placeholder={activeTab === 'dealer' ? "dealer@drivecycle.com" : "admin@drivecycle.com"}
               />
            </div>

            {/* Password */}
            <div>
               <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
               <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#040608] border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
               </div>
            </div>

            {/* Passkey (Admin Only) */}
            {activeTab === 'admin' && (
               <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                    <Lock className="w-3 h-3 text-[#f59e0b]" />
                    Admin Passkey
                  </label>
                  <input 
                    type="password" 
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    className="w-full bg-[#040608] border border-[#f59e0b]/30 rounded-lg px-4 py-2.5 text-[#f59e0b] placeholder-orange-900/50 focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-all text-sm font-mono tracking-widest"
                    placeholder="ENTER-PASSKEY"
                  />
               </div>
            )}

            {/* Remember Me / Forgot Password (Dealer Only) */}
            {activeTab === 'dealer' && (
               <div className="flex items-center justify-between text-xs mt-2 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                     <div className="w-4 h-4 rounded border border-white/20 bg-[#040608] group-hover:border-blue-500 transition-colors flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-blue-500 opacity-0 group-hover:opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                     </div>
                     <span className="text-gray-400 group-hover:text-gray-300">Remember me</span>
                  </label>
                  <button type="button" className="text-blue-500 hover:text-blue-400 font-medium">Forgot password?</button>
               </div>
            )}

            {/* Submit Button */}
            <button 
               type="submit"
               className={`w-full mt-6 text-sm font-bold text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                 activeTab === 'dealer'
                   ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]'
                   : 'bg-[#f59e0b] hover:bg-orange-400 text-orange-950 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)]'
               }`}
            >
               {activeTab === 'dealer' ? 'Sign In as Dealer' : 'Authenticate Admin'}
            </button>

            {/* Admin Warning Note */}
            {activeTab === 'admin' && (
               <p className="text-[10px] text-center text-gray-500 mt-4 leading-relaxed">
                 Admin access is restricted to DriveCycle core team members only. All authentication attempts are logged.
               </p>
            )}

            {/* Dealer Alternate Options */}
            {activeTab === 'dealer' && (
               <>
                  <div className="flex items-center gap-3 my-6">
                     <div className="flex-1 h-px bg-white/10"></div>
                     <span className="text-xs text-gray-500 font-medium">or continue with</span>
                     <div className="flex-1 h-px bg-white/10"></div>
                  </div>

                  <button 
                     type="button"
                     disabled
                     title="Coming soon"
                     className="w-full bg-[#040608] border border-white/10 hover:border-white/20 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                  >
                     <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                     </svg>
                     Google Account
                  </button>

                  <p className="text-center text-sm text-gray-400 mt-6">
                     New dealership? <button type="button" className="text-blue-500 font-medium hover:text-blue-400">Get started &rarr;</button>
                  </p>
               </>
            )}

         </form>

         {/* Helper: Demo Credentials */}
         <div className="mt-8 pt-6 border-t border-white/5">
            <button 
               onClick={() => setShowDemo(!showDemo)}
               className="text-xs text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1 w-full transition-colors"
            >
               {showDemo ? 'Hide Demo Credentials' : 'Show Demo Credentials'}
            </button>
            
            {showDemo && (
               <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg text-xs font-mono space-y-3 animate-in slide-in-from-top-2">
                  <div>
                    <span className="text-blue-400 font-bold block mb-1">Dealer Access:</span>
                    <span className="text-gray-400">dealer@drivecycle.com / demo2026</span>
                  </div>
                  <div>
                    <span className="text-[#f59e0b] font-bold block mb-1">Admin Access:</span>
                    <span className="text-gray-400">admin@drivecycle.com / admin2026 / DC-ADMIN</span>
                  </div>
               </div>
            )}
         </div>

      </div>
    </div>
  );
}
