// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';

const defaultSettings = {
  deductionFeePercent: 5,
  baseVotePrice: 50,
};

const formatCurrency = (value) => `GH₵ ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PayoutSettingsEventnic() {
  const { user, login } = useAuth();
  const [platformSettings, setPlatformSettings] = useState(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingPlatform, setSavingPlatform] = useState(false);
  const [platformMessage, setPlatformMessage] = useState('');
  const [votePrice, setVotePrice] = useState(user?.votePrice ?? 0);
  const [savingVotePrice, setSavingVotePrice] = useState(false);
  const [votePriceMessage, setVotePriceMessage] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMessage, setWithdrawMessage] = useState('');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [adminRequests, setAdminRequests] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'platformSettings', 'finance');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setPlatformSettings({
            deductionFeePercent: Number(data.deductionFeePercent) || defaultSettings.deductionFeePercent,
            baseVotePrice: Number(data.baseVotePrice) || defaultSettings.baseVotePrice,
          });
        }
      } catch (err) {
        console.error('Failed to load platform settings:', err);
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, [db]);

  useEffect(() => {
    setVotePrice(user?.votePrice ?? 0);
  }, [user]);

  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return;
      try {
        const requestsRef = collection(db, 'withdrawalRequests');
        const q = user.role === 'ADMIN'
          ? query(requestsRef, orderBy('requestedAt', 'desc'))
          : query(requestsRef, where('userId', '==', user.id), orderBy('requestedAt', 'desc'));
        const snap = await getDocs(q);
        const rows = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        if (user.role === 'ADMIN') {
          setAdminRequests(rows);
        } else {
          setRequests(rows);
        }
      } catch (err) {
        console.error('Failed to load withdrawal requests:', err);
      } finally {
        setRequestsLoading(false);
      }
    };

    loadRequests();
  }, [db, user]);

  const savePlatform = async (event) => {
    event.preventDefault();
    if (!user || user.role !== 'ADMIN') return;

    setSavingPlatform(true);
    setPlatformMessage('');
    try {
      const docRef = doc(db, 'platformSettings', 'finance');
      await setDoc(docRef, {
        deductionFeePercent: Number(platformSettings.deductionFeePercent),
        baseVotePrice: Number(platformSettings.baseVotePrice),
      }, { merge: true });
      setPlatformMessage('Platform finance settings updated.');
    } catch (err) {
      console.error('Failed to save platform settings:', err);
      setPlatformMessage('Unable to save settings.');
    } finally {
      setSavingPlatform(false);
    }
  };

  const saveVotePrice = async (event) => {
    event.preventDefault();
    if (!user || user.role !== 'ORGANIZER') return;

    setSavingVotePrice(true);
    setVotePriceMessage('');
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { votePrice: Number(votePrice) });
      const updatedUser = { ...user, votePrice: Number(votePrice) };
      login(updatedUser);
      setVotePriceMessage('Vote price saved successfully.');
    } catch (err) {
      console.error('Failed to save vote price:', err);
      setVotePriceMessage('Unable to save vote price.');
    } finally {
      setSavingVotePrice(false);
    }
  };

  const submitWithdrawal = async (event) => {
    event.preventDefault();
    if (!user || user.role !== 'ORGANIZER') return;

    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawMessage('Enter a valid withdrawal amount.');
      return;
    }
    if (amount > (user.balance || 0)) {
      setWithdrawMessage('Withdrawal amount cannot exceed your current balance.');
      return;
    }

    setProcessingRequest(true);
    setWithdrawMessage('');
    try {
      await addDoc(collection(db, 'withdrawalRequests'), {
        userId: user.id,
        organizerName: user.name,
        amount,
        status: 'PENDING',
        requestedAt: Date.now(),
      });
      setWithdrawMessage('Withdrawal request submitted.');
      setWithdrawAmount('');
      const snap = await getDocs(query(collection(db, 'withdrawalRequests'), where('userId', '==', user.id), orderBy('requestedAt', 'desc')));
      setRequests(snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    } catch (err) {
      console.error('Failed to create withdrawal request:', err);
      setWithdrawMessage('Unable to create withdrawal request.');
    } finally {
      setProcessingRequest(false);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    if (!user || user.role !== 'ADMIN') return;
    setProcessingRequest(true);
    try {
      const reqRef = doc(db, 'withdrawalRequests', requestId);
      await updateDoc(reqRef, { status, processedAt: Date.now() });

      if (status === 'APPROVED') {
        const reqSnap = await getDoc(reqRef);
        const reqData = reqSnap.data();
        if (reqData?.userId) {
          const userRef = doc(db, 'users', reqData.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const currentBalance = Number(userSnap.data().balance || 0);
            const newBalance = Math.max(0, currentBalance - Number(reqData.amount || 0));
            await updateDoc(userRef, { balance: newBalance });
          }
        }
      }

      const snap = await getDocs(query(collection(db, 'withdrawalRequests'), orderBy('requestedAt', 'desc')));
      setAdminRequests(snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    } catch (err) {
      console.error('Failed to update withdrawal request:', err);
    } finally {
      setProcessingRequest(false);
    }
  };

  if (!user) {
    return (
      <main className="max-w-container-max mx-auto px-margin py-xxl">
        <div className="rounded-3xl border border-outline-variant bg-surface p-12 text-center">
          <h1 className="font-display text-headline-lg mb-sm">Not signed in</h1>
          <p className="text-secondary">Please sign in to manage payment and payout settings.</p>
          <Link to="/login" className="mt-md inline-flex rounded-full bg-primary px-lg py-sm text-white font-bold">Sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-container-max mx-auto px-margin py-xxl">
      <div className="mb-xxl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Financial Settings</h1>
        <p className="font-body-md text-body-md text-secondary">Manage your payout settings, vote price, and withdrawal requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-3 space-y-sm">
          <Link className="flex items-center gap-md p-md rounded-xl bg-primary-fixed text-primary font-label-md text-label-md" to="/settings/payout">
            <span className="material-symbols-outlined">payments</span> Payout Settings
          </Link>
          <Link className="flex items-center gap-md p-md rounded-xl text-secondary hover:bg-surface-container transition-colors font-label-md text-label-md" to="/settings/account">
            <span className="material-symbols-outlined">person</span> Account Settings
          </Link>
        </div>

        <div className="lg:col-span-9 space-y-xxl">
          {user.role === 'ADMIN' && (
            <section className="bg-surface-container-lowest p-xl rounded-xl secure-card">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Platform Finance Settings</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Set default fees and vote prices for organizers.</p>
                </div>
                {settingsLoading && <span className="text-secondary">Loading settings…</span>}
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-lg" onSubmit={savePlatform}>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Event Deduction Fee (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={platformSettings.deductionFeePercent}
                    onChange={(e) => setPlatformSettings((prev) => ({ ...prev, deductionFeePercent: Number(e.target.value) }))}
                    className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Base Vote Price</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={platformSettings.baseVotePrice}
                    onChange={(e) => setPlatformSettings((prev) => ({ ...prev, baseVotePrice: Number(e.target.value) }))}
                    className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-between gap-md pt-md border-t border-outline-variant">
                  <p className="text-secondary">This applies to new events and organizer defaults.</p>
                  <button type="submit" disabled={savingPlatform} className="bg-primary text-white px-xl py-md rounded-lg font-bold transition-all disabled:opacity-50">
                    {savingPlatform ? 'Saving…' : 'Save Platform Settings'}
                  </button>
                </div>
                {platformMessage && <div className="md:col-span-2 text-secondary">{platformMessage}</div>}
              </form>
            </section>
          )}

          {user.role === 'ORGANIZER' && (
            <section className="bg-surface-container-lowest p-xl rounded-xl secure-card">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Organizer Vote Settings</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Update the base vote cost used for your events with voting.</p>
                </div>
                <div className="rounded-full bg-primary/10 px-md py-xs text-primary font-medium">Balance: {formatCurrency(user.balance || 0)}</div>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-lg" onSubmit={saveVotePrice}>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Vote Price</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={votePrice}
                    onChange={(e) => setVotePrice(Number(e.target.value))}
                    className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-between gap-md pt-md border-t border-outline-variant">
                  <p className="text-secondary">This value is used when you publish new voting-enabled events.</p>
                  <button type="submit" disabled={savingVotePrice} className="bg-primary text-white px-xl py-md rounded-lg font-bold transition-all disabled:opacity-50">
                    {savingVotePrice ? 'Saving…' : 'Save Vote Price'}
                  </button>
                </div>
                {votePriceMessage && <div className="md:col-span-2 text-secondary">{votePriceMessage}</div>}
              </form>
            </section>
          )}

          {user.role === 'ORGANIZER' && (
            <section className="bg-surface-container-lowest p-xl rounded-xl secure-card">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Request Withdrawal</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Submit a payout request from your available balance for admin approval.</p>
                </div>
                <span className="rounded-full bg-primary/10 px-md py-xs text-primary font-medium">Available: {formatCurrency(user.balance || 0)}</span>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-lg" onSubmit={submitWithdrawal}>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Withdrawal Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-md pt-md border-t border-outline-variant">
                  <button type="submit" disabled={processingRequest} className="bg-primary text-white px-xl py-md rounded-lg font-bold transition-all disabled:opacity-50">
                    {processingRequest ? 'Submitting…' : 'Request Withdrawal'}
                  </button>
                </div>
                {withdrawMessage && <div className="md:col-span-2 text-secondary">{withdrawMessage}</div>}
              </form>

              <div className="mt-xl">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Recent Requests</h3>
                <div className="bg-surface rounded-3xl border border-outline-variant overflow-hidden">
                  {requestsLoading ? (
                    <div className="p-xl text-center text-secondary">Loading requests…</div>
                  ) : requests.length === 0 ? (
                    <div className="p-xl text-center text-secondary">No withdrawal requests yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-surface-container-lowest border-b border-outline-variant">
                            <th className="p-md text-left font-label-md text-secondary">Date</th>
                            <th className="p-md text-left font-label-md text-secondary">Amount</th>
                            <th className="p-md text-left font-label-md text-secondary">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                          {requests.map((request) => (
                            <tr key={request.id} className="hover:bg-surface-container-low transition-colors">
                              <td className="p-md font-body-sm">{new Date(request.requestedAt).toLocaleString()}</td>
                              <td className="p-md font-body-sm">{formatCurrency(request.amount)}</td>
                              <td className="p-md font-body-sm font-bold uppercase">{request.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {user.role === 'ADMIN' && (
            <section className="bg-surface-container-lowest p-xl rounded-xl secure-card">
              <div className="flex items-center justify-between mb-lg">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Withdrawal Requests</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Review organizer payout requests and approve or reject them.</p>
                </div>
                {processingRequest && <span className="text-secondary">Updating request…</span>}
              </div>

              <div className="bg-surface rounded-3xl border border-outline-variant overflow-hidden">
                {requestsLoading ? (
                  <div className="p-xl text-center text-secondary">Loading requests…</div>
                ) : adminRequests.length === 0 ? (
                  <div className="p-xl text-center text-secondary">No withdrawal requests yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-surface-container-lowest border-b border-outline-variant">
                          <th className="p-md text-left font-label-md text-secondary">Date</th>
                          <th className="p-md text-left font-label-md text-secondary">Organizer</th>
                          <th className="p-md text-left font-label-md text-secondary">Amount</th>
                          <th className="p-md text-left font-label-md text-secondary">Status</th>
                          <th className="p-md text-right font-label-md text-secondary">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {adminRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="p-md font-body-sm">{new Date(request.requestedAt).toLocaleString()}</td>
                            <td className="p-md font-body-sm">{request.organizerName}</td>
                            <td className="p-md font-body-sm">{formatCurrency(request.amount)}</td>
                            <td className="p-md font-body-sm font-bold uppercase">{request.status}</td>
                            <td className="p-md text-right space-x-2">
                              {request.status === 'PENDING' ? (
                                <>
                                  <button onClick={() => updateRequestStatus(request.id, 'APPROVED')} className="text-emerald-600 hover:text-emerald-900 font-semibold">Approve</button>
                                  <button onClick={() => updateRequestStatus(request.id, 'REJECTED')} className="text-error hover:text-red-900 font-semibold">Reject</button>
                                </>
                              ) : (
                                <span className="text-secondary">No action</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
