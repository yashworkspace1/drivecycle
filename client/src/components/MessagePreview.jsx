import React from 'react';
import { Smartphone, Send, X, Activity, ShieldAlert, LineChart } from 'lucide-react';

export default function MessagePreview({ 
  message, 
  recipientName, 
  recipientPhone, 
  type, 
  onConfirm, 
  onCancel, 
  isLoading 
}) {
  const charCount = message?.length || 0;
  const isOverLimit = charCount > 160;

  const getEngineDetails = (engineType) => {
    switch(engineType?.toLowerCase()) {
      case 'servicepulse': 
        return { icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'ServicePulse' };
      case 'recallreach': 
        return { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'RecallReach' };
      case 'tradeiq': 
        return { icon: LineChart, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'TradeIQ' };
      default: 
        return { icon: Smartphone, color: 'text-gray-400', bg: 'bg-gray-800', border: 'border-gray-700', label: 'System' };
    }
  };

  const engine = getEngineDetails(type);
  const EngineIcon = engine.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-950/80">
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 ${engine.bg} ${engine.color} ${engine.border} border rounded-full text-xs font-bold uppercase tracking-wider`}>
              <EngineIcon className="w-3.5 h-3.5" />
              {engine.label}
            </span>
            <span className="text-gray-400 text-sm font-medium">Message Preview</span>
          </div>
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-500 hover:text-white transition-colors disabled:opacity-50 p-1 hover:bg-gray-800 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center bg-gray-900">
          
          {/* Phone Mockup UI */}
          <div className="w-[280px] h-[520px] bg-gray-950 border-[8px] border-gray-800 rounded-[3rem] relative shadow-inner flex flex-col overflow-hidden">
            {/* Phone Notch/Speaker */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-10">
              <div className="w-24 h-5 bg-gray-800 rounded-b-2xl"></div>
            </div>

            {/* iOS style Header inside phone */}
            <div className="pt-10 pb-3 px-4 bg-gray-900/50 border-b border-gray-800 flex flex-col items-center z-0">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 mb-2 text-lg font-medium">
                {recipientName ? recipientName.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="text-sm font-semibold text-white tracking-tight">{recipientName || 'Customer'}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{recipientPhone || '+1 (555) 000-0000'}</div>
            </div>

            {/* iMessage style chat area */}
            <div className="flex-1 p-4 bg-black flex flex-col justify-end overflow-y-auto custom-scrollbar">
              <div className="flex flex-col items-end space-y-1 mb-2">
                <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-[13px] leading-relaxed shadow-sm">
                  {message || 'Message preview will appear here...'}
                </div>
                {message && <div className="text-[9px] text-gray-500 pr-1 mt-1 font-medium">Delivered</div>}
              </div>
            </div>

            {/* Message input fake area */}
            <div className="h-16 bg-gray-900 rgb(17, 24, 39) border-t border-gray-800 px-4 flex items-center pb-2 shrink-0">
              <div className="w-full h-9 rounded-full border border-gray-700 bg-black px-4 flex items-center">
                <div className="text-[11px] text-gray-500 font-medium">iMessage</div>
              </div>
            </div>
          </div>

          {/* Character Count Info */}
          <div className="w-full flex justify-between items-center mt-6 px-4">
            <span className="text-sm font-medium text-gray-400">SMS Length</span>
            <span className={`text-sm font-bold ${isOverLimit ? 'text-orange-400' : 'text-gray-300'}`}>
              {charCount} <span className="text-gray-500 text-xs font-normal">/ 160</span>
            </span>
          </div>
          {isOverLimit && (
            <div className="w-full px-4 mt-2">
              <p className="text-[11px] text-orange-400/90 leading-tight bg-orange-500/10 p-2 rounded border border-orange-500/20">
                Message exceeds 160 characters and may be split into multiple SMS segments depending on the carrier.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/80 flex justify-end gap-3">
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50 text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading || !message}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20 text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
            ) : (
              <Send className="w-4 h-4 shrink-0" />
            )}
            {isLoading ? 'Sending SMS...' : 'Send Message'}
          </button>
        </div>

      </div>
    </div>
  );
}
