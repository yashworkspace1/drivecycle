import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';

export default function Landing({ onShowLogin }) {
  const [scrollY, setScrollY] = useState(0);

  const revealRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        } else {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
        }
      });
    }, { threshold: 0.15 });

    revealRefs.current.forEach(el => { if (el) observer.observe(el); });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrollY > 50 
      ? 'bg-[#040608]/80 backdrop-blur-md border-b border-white/5 py-4' 
      : 'bg-transparent py-6'
  }`;

  return (
    <div className="font-['DM_Sans'] bg-[#040608] min-h-screen text-[#f0f4ff] selection:bg-blue-500/30">
      
      {/* NAVBAR */}
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
             <div className="flex flex-col">
               <span className="font-bold text-lg leading-tight tracking-tight">DriveCycle</span>
               <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Lifecycle Engine</span>
             </div>
          </div>

          {/* Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#dealers" className="hover:text-white transition-colors">For Dealers</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onShowLogin}
              className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button 
              onClick={onShowLogin}
              className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              Get Started
            </button>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
         {/* Background Elements */}
         <div className="absolute inset-0 z-0">
            {/* Radial Glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            
            {/* CSS Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute rounded-full bg-blue-400/30 animate-float"
                  style={{
                    width: Math.random() * 2 + 2 + 'px',
                    height: Math.random() * 2 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDuration: Math.random() * 10 + 15 + 's',
                    animationDelay: Math.random() * 5 + 's'
                  }}
                />
              ))}
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Col - Copy */}
            <div className="max-w-[680px] w-full pt-10 lg:pt-0">
               <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1.5 mb-8">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold tracking-wide text-blue-400">Live NHTSA Integration · Real-time recall data</span>
               </div>

               <h1 className="font-['Syne'] font-extrabold text-[clamp(3rem,5.5vw,5.2rem)] leading-[1.05] tracking-tight mb-6">
                  <span className="block text-white">Every Customer</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Drives Back</span>
                  <span className="block text-gray-300">To You.</span>
               </h1>

               <p className="text-[#6b7a99] text-lg max-w-[500px] mb-10 leading-relaxed font-medium">
                 DriveCycle turns every service visit, safety recall, and mileage milestone into a revenue opportunity your dealership never misses.
               </p>

               <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
                  <button 
                    onClick={onShowLogin}
                    className="w-full sm:w-auto text-base font-bold bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
                  >
                    Start Free Demo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onShowLogin}
                    className="w-full sm:w-auto text-base font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Watch How It Works
                  </button>
               </div>

               {/* Stats Row */}
               <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                 <div>
                   <p className="font-['Syne'] font-extrabold text-2xl text-white mb-1">12 min</p>
                   <p className="text-xs text-[#6b7a99] font-medium leading-tight">Avg response time improvement</p>
                 </div>
                 <div>
                   <p className="font-['Syne'] font-extrabold text-2xl text-white mb-1">3x</p>
                   <p className="text-xs text-[#6b7a99] font-medium leading-tight">Customer retention rate</p>
                 </div>
                 <div>
                   <p className="font-['Syne'] font-extrabold text-2xl text-white mb-1">Zero</p>
                   <p className="text-xs text-[#6b7a99] font-medium leading-tight">Setup cost to start</p>
                 </div>
               </div>
            </div>

            {/* Right Col - Visual (Hidden on mobile) */}
            <div className="hidden lg:block w-full perspective-1000">
               <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#0c0f14] border border-white/10 p-6 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-tilt transition-transform duration-700 ease-out hover:rotate-y-[-2deg] rotate-y-[-8deg] rotate-x-[4deg]">
                  
                  {/* Fake UI Header */}
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                     <p className="font-bold text-gray-300">Command Center</p>
                     <p className="text-xs text-[#6b7a99]">Mon, Oct 24</p>
                  </div>

                  {/* Fake Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#12161f] border border-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                         <p className="text-[10px] text-gray-500 font-bold uppercase">At-Risk</p>
                      </div>
                      <p className="font-bold text-lg text-white">5</p>
                    </div>
                    <div className="bg-[#12161f] border border-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-2 h-2 rounded-full bg-red-500"></div>
                         <p className="text-[10px] text-gray-500 font-bold uppercase">Recalls</p>
                      </div>
                      <p className="font-bold text-lg text-white">11</p>
                    </div>
                    <div className="bg-[#12161f] border border-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                         <p className="text-[10px] text-gray-500 font-bold uppercase">Hot Leads</p>
                      </div>
                      <p className="font-bold text-lg text-white">6</p>
                    </div>
                  </div>

                  {/* Fake Priority Item */}
                  <div className="bg-[#12161f] border border-red-500/20 rounded-lg p-4 mb-4">
                    <div className="flex gap-3 items-center">
                       <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">CRITICAL</span>
                       <div>
                         <p className="text-sm font-bold text-white leading-tight">James Okafor</p>
                         <p className="text-xs text-gray-400">Recall visit opportunity</p>
                       </div>
                    </div>
                  </div>

                  {/* Fake Feed Item */}
                  <div className="bg-[#12161f] border border-white/5 rounded-lg p-4">
                    <div className="flex gap-3 items-center">
                       <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">MJ</div>
                       <div>
                         <p className="text-sm font-bold text-white leading-tight">Marcus Johnson</p>
                         <p className="text-xs text-gray-500">"Hi Marcus, it's Sarah from service..."</p>
                       </div>
                    </div>
                  </div>

               </div>
            </div>

         </div>
      </section>

      {/* ═══════════ IMMERSIVE ENGINE SHOWCASE ═══════════ */}
      <section id="features" className="relative z-10 bg-[#040608]">

        {/* Section Title Block */}
        <div className="border-t" style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <div className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-blue-500 uppercase mb-6">How DriveCycle Works</p>
            <h2 className="font-['Syne'] font-extrabold text-[clamp(2.8rem,5vw,4.5rem)] leading-[1.0] tracking-[-0.03em] mb-6">
              <span className="block text-white">Three Engines.</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-blue-600">One Unbreakable Loop.</span>
            </h2>
            <p className="text-[#6b7a99] text-base max-w-[580px] mx-auto leading-[1.7]">
              Most dealerships lose customers between touchpoints. DriveCycle connects every moment — service visit, safety recall, and trade-in window — into one continuous revenue loop.
            </p>
          </div>
        </div>

        {/* ── ENGINE 1 — SERVICEPULSE ── */}
        <div className="border-t" style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            {/* Content Left */}
            <div ref={el => revealRefs.current[0] = el} style={{opacity:0, transform:'translateY(30px)', transition:'opacity 0.7s ease, transform 0.7s ease'}} className="relative">
              <span className="absolute -top-4 -left-4 font-['Syne'] font-extrabold text-[5rem] leading-none select-none pointer-events-none" style={{color:'rgba(59,130,246,0.12)'}}>01</span>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-[0.75rem] font-semibold" style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.25)',color:'#60a5fa'}}>⚡ ServicePulse · Retention Engine</div>
                <h3 className="font-['Syne'] font-bold text-[2.4rem] leading-[1.1] tracking-tight mb-6">
                  <span className="block text-white">Stop Losing Customers</span>
                  <span className="block text-white/70">to the Shop Down the Road.</span>
                </h3>
                <p className="text-[#6b7a99] text-[0.95rem] leading-[1.75] mb-8">
                  After a customer drives off the lot, most dealerships go silent. DriveCycle watches six behavioral signals in real-time — days without service, dropping visit frequency, high repair bills, repeat complaints, missed follow-ups — and calculates a live churn score for every single customer in your database.
                </p>
                <p className="text-[#6b7a99] text-[0.95rem] leading-[1.75] mb-8">
                  When someone hits the danger zone, AI generates a personalized message in their advisor's voice, referencing their exact car and last visit. Not a template. A real conversation starter.
                </p>
                <div className="space-y-3.5">
                  {[
                    ['Live Churn Scoring','6-signal algorithm updates after every service job'],
                    ['Upsell Detection','AI reads job card notes to find battery, brake, tyre opportunities'],
                    ['Personalized Outreach','Messages reference the customer\'s exact car, advisor, and last complaint'],
                    ['Auto Status Tracking','active → at-risk → drifted → recovered lifecycle states']
                  ].map(([label,desc],i) => (
                    <div key={i} className="flex gap-3 items-start text-[0.875rem]">
                      <span className="text-blue-500 mt-1 text-[0.6rem]">■</span>
                      <p><span className="text-white font-semibold">{label}</span> <span className="text-[#6b7a99]">— {desc}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Visual Right */}
            <div ref={el => revealRefs.current[1] = el} style={{opacity:0, transform:'translateY(30px)', transition:'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s', perspective:'1000px'}}>
              <div className="engine-card rounded-[20px] p-6" style={{background:'#0c0f14',border:'1px solid rgba(255,255,255,0.07)',boxShadow:'0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), 0 0 60px rgba(59,130,246,0.06)'}}>
                {/* Card Header */}
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/5">
                  <p className="font-['Syne'] font-bold text-white">⚡ ServicePulse</p>
                  <span className="text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">5 need attention</span>
                </div>
                {/* Customer Rows */}
                <div className="space-y-2">
                  {[
                    {score:10,name:'James Okafor',status:'DRIFTED',statusColor:'text-orange-400 bg-orange-500/10 border-orange-500/20',lastVisit:'14 months ago',scoreBg:'rgba(239,68,68,0.15)',scoreColor:'#ef4444',scoreBorder:'rgba(239,68,68,0.3)',idx:0},
                    {score:9,name:'Nina Fernandez',status:'DRIFTED',statusColor:'text-orange-400 bg-orange-500/10 border-orange-500/20',lastVisit:'17 months ago',scoreBg:'rgba(239,68,68,0.15)',scoreColor:'#ef4444',scoreBorder:'rgba(239,68,68,0.3)',idx:1},
                    {score:8,name:'Marcus Johnson',status:'AT RISK',statusColor:'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',lastVisit:'5 months ago',scoreBg:'rgba(245,158,11,0.15)',scoreColor:'#f59e0b',scoreBorder:'rgba(245,158,11,0.3)',idx:2},
                    {score:7,name:'David Kim',status:'AT RISK',statusColor:'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',lastVisit:'6 months ago',scoreBg:'rgba(245,158,11,0.15)',scoreColor:'#f59e0b',scoreBorder:'rgba(245,158,11,0.3)',idx:3}
                  ].map((r) => (
                    <div key={r.idx} className="sp-row flex items-center gap-3 p-3 rounded-xl border border-white/5 transition-colors" style={{animationDelay: r.idx*3+'s'}}>
                      <div className="font-['Syne'] font-bold text-[0.9rem] flex items-center justify-center rounded-lg shrink-0" style={{width:36,height:36,background:r.scoreBg,color:r.scoreColor,border:`1px solid ${r.scoreBorder}`}}>{r.score}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-white truncate">{r.name}</p>
                        <p className="text-[11px] text-gray-500">Last visit: {r.lastVisit}</p>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${r.statusColor} shrink-0`}>{r.status}</span>
                      <button className="text-[11px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg hover:bg-blue-600/30 transition-colors whitespace-nowrap shrink-0">Send Follow-up</button>
                    </div>
                  ))}
                </div>
                {/* Upsell Detection */}
                <div className="mt-4 rounded-r-lg p-3" style={{background:'rgba(245,158,11,0.06)',borderLeft:'3px solid #f59e0b'}}>
                  <p className="text-[0.78rem] text-[#f59e0b] font-medium">💡 AI Detected Upsell · Marcus Johnson — Battery at 62%, brake pads at 35%, rear tyres worn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px mx-auto" style={{background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} />

        {/* ── ENGINE 2 — RECALLREACH ── */}
        <div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            {/* Visual Left */}
            <div ref={el => revealRefs.current[2] = el} className="order-2 md:order-1" style={{opacity:0, transform:'translateY(30px)', transition:'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s', perspective:'1000px'}}>
              <div className="engine-card rounded-[20px] p-6" style={{background:'#0c0f14',border:'1px solid rgba(255,255,255,0.07)',boxShadow:'0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(245,158,11,0.06)'}}>
                {/* Card Header */}
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/5">
                  <p className="font-['Syne'] font-bold text-white">🛡️ RecallReach</p>
                  <span className="text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>NHTSA Live · Connected</span>
                </div>
                {/* Scan Result */}
                <div className="rounded-xl p-4 mb-4" style={{background:'rgba(245,158,11,0.05)',border:'1px solid rgba(245,158,11,0.15)'}}>
                  <p className="text-[0.8rem] font-bold text-[#f59e0b] mb-1">Scan completed · 2 new recalls found</p>
                  <p className="text-[0.75rem] text-gray-500">Matched against 12 vehicles in 1.2 seconds</p>
                </div>
                {/* Recall Cards */}
                <div className="space-y-3 mb-4">
                  <div className="bg-[#12161f] border border-red-500/15 rounded-xl p-4 flex items-start gap-3">
                    <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider mt-0.5 shrink-0">CRITICAL</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-white">24V-441 · Ford F-150 2019</p>
                      <p className="text-xs text-gray-400">Fuel pump failure — engine stall risk</p>
                      <p className="text-[11px] text-gray-500 mt-1">Affects: Marcus Johnson · 68,000 miles</p>
                    </div>
                    <button className="recall-pulse text-[11px] font-bold bg-red-600/20 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 relative">Alert Now</button>
                  </div>
                  <div className="bg-[#12161f] border border-orange-500/15 rounded-xl p-4 flex items-start gap-3">
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider mt-0.5 shrink-0">HIGH</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-white">22V-511 · Honda Accord 2017</p>
                      <p className="text-xs text-gray-400">Takata airbag inflator rupture risk</p>
                      <p className="text-[11px] text-gray-500 mt-1">Affects: James Okafor · 102,000 miles</p>
                    </div>
                    <button className="text-[11px] font-bold bg-orange-600/20 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0">Alert Now</button>
                  </div>
                </div>
                {/* AI Message Preview */}
                <div className="rounded-2xl p-4" style={{background:'#111620'}}>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">AI-Generated Alert Preview</p>
                  <div className="rounded-xl p-3" style={{background:'rgba(59,130,246,0.15)'}}>
                    <p className="text-[0.78rem] text-gray-200 leading-relaxed">"Hi Marcus — your 2019 F-150 has an active safety recall (24V-441). Free repair, covered by Ford. Want to book Thursday? — Sarah at DriveCycle Motors"</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Content Right */}
            <div ref={el => revealRefs.current[3] = el} className="relative order-1 md:order-2" style={{opacity:0, transform:'translateY(30px)', transition:'opacity 0.7s ease, transform 0.7s ease'}}>
              <span className="absolute -top-4 -left-4 font-['Syne'] font-extrabold text-[5rem] leading-none select-none pointer-events-none" style={{color:'rgba(245,158,11,0.1)'}}>02</span>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-[0.75rem] font-semibold" style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.25)',color:'#f59e0b'}}>🛡️ RecallReach · Re-engagement Engine</div>
                <h3 className="font-['Syne'] font-bold text-[2.4rem] leading-[1.1] tracking-tight mb-6">
                  <span className="block text-white">Be the Dealer Who Calls</span>
                  <span className="block text-white/70">Before the Government Does.</span>
                </h3>
                <p className="text-[#6b7a99] text-[0.95rem] leading-[1.75] mb-4">
                  Every day, NHTSA publishes new vehicle safety recalls at api.nhtsa.gov — for free, in real-time. Most dealerships never look. DriveCycle scans every recall against your entire customer database automatically, matches affected vehicles, and sends a proactive AI alert in minutes.
                </p>
                <p className="text-[#6b7a99] text-[0.95rem] leading-[1.75] mb-8">
                  Your customer gets a message from their trusted dealership — not a scary government letter six weeks later. That single moment of proactive care converts lost customers, triggers recall repair appointments, and opens the door to trade-in conversations.
                </p>
                <div className="space-y-3.5">
                  {[
                    ['Live NHTSA API','scans government recall database against your vehicles in real-time, no manual work'],
                    ['Severity Triage','critical/high/medium/low rating determines urgency and message tone automatically'],
                    ['Drifted Customer Recovery','lost customers with recalls get re-entry outreach first'],
                    ['Trade Hook Logic','recall on a 6-year-old car automatically triggers a trade valuation offer']
                  ].map(([label,desc],i) => (
                    <div key={i} className="flex gap-3 items-start text-[0.875rem]">
                      <span className="text-orange-400 mt-1 text-[0.6rem]">■</span>
                      <p><span className="text-white font-semibold">{label}</span> <span className="text-[#6b7a99]">— {desc}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px mx-auto" style={{background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} />

        {/* ── ENGINE 3 — TRADEIQ ── */}
        <div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            {/* Content Left */}
            <div ref={el => revealRefs.current[4] = el} className="relative" style={{opacity:0, transform:'translateY(30px)', transition:'opacity 0.7s ease, transform 0.7s ease'}}>
              <span className="absolute -top-4 -left-4 font-['Syne'] font-extrabold text-[5rem] leading-none select-none pointer-events-none" style={{color:'rgba(34,197,94,0.1)'}}>03</span>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-[0.75rem] font-semibold" style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.25)',color:'#22c55e'}}>📈 TradeIQ · Conversion Engine</div>
                <h3 className="font-['Syne'] font-bold text-[2.4rem] leading-[1.1] tracking-tight mb-6">
                  <span className="block text-white">Know Who's Ready to Buy</span>
                  <span className="block text-white/70">Before They Know It Themselves.</span>
                </h3>
                <p className="text-[#6b7a99] text-[0.95rem] leading-[1.75] mb-4">
                  Every service visit leaves a data trail. Vehicle age, mileage, year-to-date repair spend, recall history, purchase patterns — DriveCycle reads all of it and calculates a 0-100 purchase likelihood score for every customer in your database.
                </p>
                <p className="text-[#6b7a99] text-[0.95rem] leading-[1.75] mb-8">
                  When someone hits 75+, they get a transparency-first trade valuation message with their actual numbers upfront. No games, no pressure — just their real trade value range and a single question. That honesty is your competitive advantage.
                </p>
                <div className="space-y-3.5">
                  {[
                    ['6-Signal Scoring','vehicle age, mileage, repair spend, time since purchase, recall activity, churn'],
                    ['Formula-Based Valuation','transparent $X,XXX–$X,XXX trade range calculated from real depreciation data'],
                    ['Transparency-First Messaging','AI leads with the actual number, not a sales pitch'],
                    ['Flywheel Trigger','recall visit on old vehicle automatically elevates purchase score']
                  ].map(([label,desc],i) => (
                    <div key={i} className="flex gap-3 items-start text-[0.875rem]">
                      <span className="text-green-500 mt-1 text-[0.6rem]">■</span>
                      <p><span className="text-white font-semibold">{label}</span> <span className="text-[#6b7a99]">— {desc}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Visual Right */}
            <div ref={el => revealRefs.current[5] = el} style={{opacity:0, transform:'translateY(30px)', transition:'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s', perspective:'1000px'}}>
              <div className="engine-card rounded-[20px] p-6" style={{background:'#0c0f14',border:'1px solid rgba(255,255,255,0.07)',boxShadow:'0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(34,197,94,0.06)'}}>
                {/* Card Header */}
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/5">
                  <p className="font-['Syne'] font-bold text-white">📈 TradeIQ</p>
                  <span className="text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">6 Hot Leads</span>
                </div>
                {/* Score Leaderboard */}
                <div className="space-y-4 mb-5">
                  {[
                    {name:'James Okafor',vehicle:'2017 Honda Accord',score:92,value:'$8,400 – $10,200',color:'from-green-500 to-green-600'},
                    {name:'Nina Fernandez',vehicle:'2016 Chevrolet Malibu',score:88,value:'$7,200 – $9,100',color:'from-green-500 to-green-600'},
                    {name:'Emily Watson',vehicle:'2018 Ford Fusion',score:83,value:'$13,700 – $16,100',color:'from-amber-400 to-amber-500'},
                    {name:'Marcus Johnson',vehicle:'2019 Ford F-150',score:80,value:'$22,400 – $26,100',color:'from-amber-400 to-amber-500'}
                  ].map((l,i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <p className="text-[13px] text-white font-bold">{l.name} <span className="text-gray-500 font-normal">· {l.vehicle}</span></p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 font-medium">{l.value}</span>
                          <span className="font-['Syne'] font-bold text-[0.9rem]" style={{color: l.score >= 85 ? '#22c55e' : '#f59e0b'}}>{l.score}</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{background:'rgba(255,255,255,0.06)'}}>
                        <div className={`h-full rounded-full bg-gradient-to-r ${l.color} score-bar`} style={{width:'0%','--target-width': l.score+'%'}} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* AI Trade Message */}
                <div className="rounded-2xl p-4" style={{background:'#111620'}}>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">AI-Generated Trade Message</p>
                  <div className="rounded-xl p-3" style={{background:'rgba(34,197,94,0.1)'}}>
                    <p className="text-[0.78rem] text-gray-200 leading-relaxed">"Hi James — your 2017 Accord trade value is sitting at $8,400–$10,200 right now. Before your next repair bill, worth a 15-min chat? — James at DriveCycle"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px mx-auto" style={{background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} />

        {/* ── FLYWHEEL CONNECTION BLOCK ── */}
        <div id="how-it-works" className="py-24 text-center">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-['Syne'] font-bold text-3xl text-white mb-3">The Three Engines Feed Each Other.</h2>
            <p className="text-[#6b7a99] mb-16">This is the flywheel your competitors can't copy.</p>

            {/* Flywheel Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 relative">
              {/* Connecting Lines (desktop) */}
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] -translate-y-1/2 -z-10">
                <div className="h-px border-t-2 border-dashed" style={{borderColor:'rgba(255,255,255,0.15)'}} />
                <div className="flywheel-dot absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              </div>

              {/* Circle 1 */}
              <div className="flex flex-col items-center gap-3 md:flex-1">
                <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-xl" style={{background:'rgba(59,130,246,0.15)',border:'1px solid rgba(59,130,246,0.3)'}}>⚡</div>
                <p className="text-sm font-bold text-white">ServicePulse</p>
              </div>
              <div className="hidden md:block text-[10px] text-gray-500 font-medium px-2 text-center flex-shrink-0 w-40">Identifies drifted customers →</div>
              <div className="md:hidden w-px h-6 border-l-2 border-dashed" style={{borderColor:'rgba(255,255,255,0.15)'}} />

              {/* Circle 2 */}
              <div className="flex flex-col items-center gap-3 md:flex-1">
                <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-xl" style={{background:'rgba(245,158,11,0.15)',border:'1px solid rgba(245,158,11,0.3)'}}>🛡️</div>
                <p className="text-sm font-bold text-white">RecallReach</p>
              </div>
              <div className="hidden md:block text-[10px] text-gray-500 font-medium px-2 text-center flex-shrink-0 w-40">Recall triggers trade window →</div>
              <div className="md:hidden w-px h-6 border-l-2 border-dashed" style={{borderColor:'rgba(255,255,255,0.15)'}} />

              {/* Circle 3 */}
              <div className="flex flex-col items-center gap-3 md:flex-1">
                <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-xl" style={{background:'rgba(34,197,94,0.15)',border:'1px solid rgba(34,197,94,0.3)'}}>📈</div>
                <p className="text-sm font-bold text-white">TradeIQ</p>
              </div>
            </div>

            {/* Loop-back arrow label */}
            <div className="hidden md:flex items-center justify-center gap-2 mt-6">
              <div className="h-px w-12 border-t-2 border-dashed" style={{borderColor:'rgba(34,197,94,0.3)'}} />
              <span className="text-[10px] text-green-400/70 font-medium">↩ New customer restarts retention cycle</span>
              <div className="h-px w-12 border-t-2 border-dashed" style={{borderColor:'rgba(59,130,246,0.3)'}} />
            </div>

            {/* Bold Statement */}
            <p className="text-[#6b7a99] text-base max-w-[560px] mx-auto leading-[1.7] mt-14">
              The data flywheel means every month DriveCycle runs at your dealership, the scoring gets smarter, the messages get better, and your competitors fall further behind.
            </p>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#040608] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
             <span className="font-bold text-gray-300 tracking-tight">DriveCycle</span>
           </div>
           
           <p className="text-xs text-gray-500">Built for modern dealerships.</p>

           <div className="flex items-center gap-4">
             <button onClick={onShowLogin} className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">Admin Login</button>
             <button onClick={onShowLogin} className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">Dealer Login</button>
           </div>
        </div>
      </footer>

      {/* Custom CSS for all animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(45deg); opacity: 0; }
        }
        .animate-float {
          animation: custom-float linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-\\[-8deg\\] { transform: rotateY(-8deg) rotateX(4deg); }
        .hover\\:rotate-y-\\[-2deg\\]:hover { transform: rotateY(-2deg) rotateX(2deg); }

        /* ServicePulse row highlight */
        @keyframes row-highlight {
          0%, 100% { background: transparent; }
          50% { background: rgba(59,130,246,0.05); }
        }
        .sp-row {
          animation: row-highlight 3s ease-in-out infinite;
        }

        /* RecallReach pulse ring */
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          70% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        .recall-pulse {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }

        /* TradeIQ score bars */
        @keyframes fill-bar {
          to { width: var(--target-width); }
        }
        .score-bar {
          animation: fill-bar 1.2s cubic-bezier(0.4,0,0.2,1) 0.5s forwards;
        }

        /* Flywheel traveling dot */
        @keyframes travel-dot {
          0% { left: 0%; }
          100% { left: 100%; }
        }
        .flywheel-dot {
          animation: travel-dot 3s ease-in-out infinite;
        }

        /* 3D floating engine cards */
        .engine-card {
          transform: rotateY(-6deg) rotateX(3deg);
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .engine-card:hover {
          transform: rotateY(-1deg) rotateX(1deg) translateY(-6px);
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 0 80px rgba(59,130,246,0.08) !important;
        }
      `}} />
    </div>
  );
}
