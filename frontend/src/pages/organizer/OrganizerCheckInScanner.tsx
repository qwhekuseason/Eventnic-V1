import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../config/firebase';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';

export default function OrganizerCheckInScanner() {
  const db = getFirestore(app);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastScanned, setLastScanned] = useState<{name: string, ticketType: string} | null>(null);
  const [lookupId, setLookupId] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  useEffect(() => {
    const initScanner = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraPermission('granted');
      } catch (error) {
        console.error('Camera permission denied or unavailable:', error);
        setCameraPermission('denied');
        return;
      }

      const scanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
        false
      );

      let isScanning = false;

      scanner.render(
        async (decodedText) => {
          if (isScanning) return;
          isScanning = true;

          await handleScan(decodedText);

          setTimeout(() => {
            isScanning = false;
          }, 3000);
        },
        () => {
          // ignore continuous scan errors
        }
      );

      return () => {
        scanner.clear().catch(console.error);
      };
    };

    initScanner();
  }, []);

  const handleScan = async (ticketId: string) => {
    setLookupId(ticketId);
    setIsLookingUp(true);
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const ticketSnap = await getDoc(ticketRef);
      
      if (!ticketSnap.exists()) {
        setScanStatus('error');
      } else {
        const tData = ticketSnap.data();
        if (tData.status === 'valid') {
          await updateDoc(ticketRef, { status: 'checked_in' });
          
          // Optionally fetch user to get their name
          let userName = 'Attendee';
          if (tData.userId) {
            const userSnap = await getDoc(doc(db, 'users', tData.userId));
            if (userSnap.exists()) {
              userName = userSnap.data().name || 'Attendee';
            }
          }

          const scannedData = { name: userName, ticketType: tData.tierId || 'General Admission' };
          setLastScanned(scannedData);
          setScanStatus('success');
          
          setRecentCheckIns(prev => [scannedData, ...prev].slice(0, 5));
          toast.success('Ticket Checked In successfully!');
        } else {
          setScanStatus('error'); // already checked in or cancelled
          toast.error(`Ticket status is ${tData.status}`);
        }
      }
    } catch (e) {
      console.error(e);
      setScanStatus('error');
    } finally {
      setIsLookingUp(false);
      setTimeout(() => setScanStatus('idle'), 3000);
    }
  };

  const handleManualLookup = () => {
    const trimmedId = lookupId.trim();
    if (trimmedId) handleScan(trimmedId);
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
          <div className="bg-surface rounded-3xl border border-outline-variant shadow-lg p-lg md:p-xl flex flex-col items-center justify-center relative overflow-hidden">
            
            <div className="w-full relative z-10" id="reader"></div>

            <div className="relative z-10 w-full mt-4 min-h-[120px]">
              {cameraPermission === 'pending' && (
              <div className="text-center text-secondary bg-surface-container p-md rounded-xl mx-auto max-w-[320px]">
                <p className="font-bold">Requesting camera permission...</p>
              </div>
            )}

            {cameraPermission === 'denied' && (
              <div className="text-center text-secondary bg-error-container p-md rounded-xl mx-auto max-w-[320px] border border-error/30">
                <p className="font-bold">Camera permission is required.</p>
                <p className="text-sm mt-2">Please allow camera access in your browser and refresh this page.</p>
              </div>
            )}

            {cameraPermission === 'granted' && scanStatus === 'idle' && (
              <div className="text-center text-secondary bg-surface-container p-md rounded-xl mx-auto max-w-[320px]">
                <p className="font-bold">Waiting for scan...</p>
              </div>
            )}

            {cameraPermission === 'granted' && scanStatus === 'success' && (
              <div className="text-center bg-emerald-500/10 text-green-800 p-md rounded-2xl border border-emerald-500/30 shadow-lg animate-in zoom-in">
                <span className="material-symbols-outlined text-[48px] text-emerald-600 dark:text-emerald-400 block mb-xs">check_circle</span>
                <h3 className="font-display text-xl font-bold mb-xs">Valid Ticket!</h3>
                <p className="font-bold">{lastScanned?.name}</p>
                <p className="text-sm opacity-80">{lastScanned?.ticketType}</p>
              </div>
            )}

            {cameraPermission === 'granted' && scanStatus === 'error' && (
              <div className="text-center bg-error-container text-red-800 p-md rounded-2xl border border-error/30 shadow-lg animate-in zoom-in">
                <span className="material-symbols-outlined text-[48px] text-error block mb-xs">cancel</span>
                <h3 className="font-display text-xl font-bold mb-xs">Invalid Ticket</h3>
                <p className="font-bold text-sm">This QR code is not recognized or has already been used.</p>
              </div>
            )}
            </div>
          </div>

          {/* Stats & Manual Entry */}
          <div className="space-y-lg">
            <div className="bg-primary text-white rounded-2xl p-lg shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-container mb-xs">Recent Scans</h3>
                <div className="font-display text-[48px] leading-none">{recentCheckIns.length}</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">how_to_reg</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-lg">
              <h3 className="font-bold text-on-surface mb-md">Manual Entry Lookup</h3>
              <p className="text-sm text-secondary mb-md">If a scanner is not working, enter the ticket ID.</p>
              
              <div className="flex gap-sm">
                <input 
                  type="text" 
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  placeholder="Ticket ID"
                  className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button 
                  onClick={handleManualLookup}
                  disabled={isLookingUp}
                  className="bg-surface-container-highest text-on-surface font-bold px-lg rounded-xl hover:bg-outline-variant transition-colors cursor-pointer"
                >
                  {isLookingUp ? '...' : 'Lookup'}
                </button>
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-lg">
              <h3 className="font-bold text-on-surface mb-md">Recent Check-Ins</h3>
              {recentCheckIns.length === 0 ? (
                <p className="text-sm text-secondary">No check-ins yet.</p>
              ) : (
                <div className="space-y-sm">
                  {recentCheckIns.map((r, i) => (
                    <div key={i} className="flex justify-between items-center py-sm border-b border-outline-variant last:border-0">
                      <div>
                        <div className="font-bold text-sm text-on-surface">{r.name}</div>
                        <div className="text-secondary text-xs">{r.ticketType}</div>
                      </div>
                      <div className="text-xs text-secondary">Just now</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
