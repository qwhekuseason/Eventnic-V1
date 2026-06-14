import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function OrganizerCheckInScanner() {
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastScanned, setLastScanned] = useState<{name: string, ticketType: string} | null>(null);

  const simulateScan = (type: 'success' | 'error') => {
    setScanStatus(type);
    if (type === 'success') {
      setLastScanned({ name: 'Alex Johnson', ticketType: 'VIP Access' });
    } else {
      setLastScanned(null);
    }
    
    setTimeout(() => {
      setScanStatus('idle');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <Link to="/dashboard" className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <h1 className="font-display text-[36px] text-on-surface leading-tight">Check-In Scanner</h1>
            </div>
            <p className="text-secondary font-body-lg">Scan attendee QR codes for quick entry.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl max-w-4xl mx-auto">
          {/* Scanner Area */}
          <div className="bg-surface rounded-3xl border border-outline-variant shadow-lg p-lg md:p-xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            
            {/* Simulated Camera View */}
            <div className="absolute inset-0 bg-black/5 z-0 flex items-center justify-center">
              {/* Target box */}
              <div className="w-64 h-64 border-2 border-dashed border-primary/50 relative animate-pulse">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary"></div>
              </div>
            </div>

            <div className="relative z-10 w-full">
              {scanStatus === 'idle' && (
                <div className="text-center text-secondary bg-surface/80 backdrop-blur-md p-md rounded-xl mx-auto max-w-xs">
                  <span className="material-symbols-outlined text-[48px] mb-sm block">qr_code_scanner</span>
                  <p className="font-bold">Position QR code within the frame to scan.</p>
                </div>
              )}

              {scanStatus === 'success' && (
                <div className="text-center bg-green-50 text-green-800 p-lg rounded-2xl border border-green-200 shadow-lg animate-in zoom-in">
                  <span className="material-symbols-outlined text-[64px] text-green-600 block mb-sm">check_circle</span>
                  <h3 className="font-display text-2xl font-bold mb-xs">Valid Ticket!</h3>
                  <p className="font-bold text-lg">{lastScanned?.name}</p>
                  <p className="text-sm opacity-80">{lastScanned?.ticketType}</p>
                </div>
              )}

              {scanStatus === 'error' && (
                <div className="text-center bg-red-50 text-red-800 p-lg rounded-2xl border border-red-200 shadow-lg animate-in zoom-in">
                  <span className="material-symbols-outlined text-[64px] text-red-600 block mb-sm">cancel</span>
                  <h3 className="font-display text-2xl font-bold mb-xs">Invalid Ticket</h3>
                  <p className="font-bold">This QR code is not recognized or has already been used.</p>
                </div>
              )}
            </div>

            {/* Test Buttons - Since we can't use real camera */}
            <div className="absolute bottom-lg flex gap-sm z-20">
              <button 
                onClick={() => simulateScan('success')}
                className="bg-green-600 text-white px-md py-sm rounded-full text-sm font-bold shadow-md hover:bg-green-700"
              >
                Simulate Valid Scan
              </button>
              <button 
                onClick={() => simulateScan('error')}
                className="bg-red-600 text-white px-md py-sm rounded-full text-sm font-bold shadow-md hover:bg-red-700"
              >
                Simulate Invalid Scan
              </button>
            </div>
          </div>

          {/* Stats & Manual Entry */}
          <div className="space-y-lg">
            <div className="bg-primary text-white rounded-2xl p-lg shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-container mb-xs">Checked In</h3>
                <div className="font-display text-[48px] leading-none">842 <span className="text-xl text-primary-container font-body-md">/ 1,500</span></div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">how_to_reg</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-lg">
              <h3 className="font-bold text-on-surface mb-md">Manual Entry Lookup</h3>
              <p className="text-sm text-secondary mb-md">If a scanner is not working, enter the ticket ID or attendee email below.</p>
              
              <div className="flex gap-sm">
                <input 
                  type="text" 
                  placeholder="Ticket ID or Email"
                  className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button className="bg-surface-container-highest text-on-surface font-bold px-lg rounded-xl hover:bg-outline-variant transition-colors">
                  Lookup
                </button>
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-lg">
              <h3 className="font-bold text-on-surface mb-md">Recent Check-Ins</h3>
              <div className="space-y-sm">
                {[1,2,3].map(i => (
                  <div key={i} className="flex justify-between items-center py-sm border-b border-outline-variant last:border-0">
                    <div>
                      <div className="font-bold text-sm text-on-surface">Attendee Name {i}</div>
                      <div className="text-secondary text-xs">General Admission</div>
                    </div>
                    <div className="text-xs text-secondary">Just now</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
