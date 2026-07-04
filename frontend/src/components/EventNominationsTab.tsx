// @ts-nocheck
import { useState, useEffect } from 'react';
import { useEvents, uid } from '../contexts/EventsContext';
import { useNominations } from '../contexts/NominationsContext';
import type { NominationSubmission } from '../contexts/NominationsContext';
import { app } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

type TabFilter = 'pending' | 'approved' | 'rejected' | 'all';

export default function EventNominationsTab({ eventId }: { eventId: string }) {
  const { getEvent, updateEvent } = useEvents();
  const { nominations, updateNominationStatus } = useNominations();

  const [generatedNominees, setGeneratedNominees] = useState<any[]>([]);
  const [loadingNominees, setLoadingNominees] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TabFilter>('pending');
  const [approving, setApproving] = useState<string | null>(null);
  
  const selectedEvent = getEvent(eventId);

  const loadGeneratedNominees = async (id: string) => {
    setLoadingNominees(true);
    try {
      const db = getFirestore(app);
      const q = query(collection(db, 'users'), where('role', '==', 'NOMINEE'), where('eventId', '==', id));
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setGeneratedNominees(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingNominees(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      loadGeneratedNominees(eventId);
    }
  }, [eventId]);

  if (!selectedEvent) return null;

  const eventNominations = nominations.filter(n => n.eventId === eventId);
  const filteredNominations = activeFilter === 'all' 
    ? eventNominations 
    : eventNominations.filter(n => n.status === activeFilter);

  const pendingCount = eventNominations.filter(n => n.status === 'pending').length;
  const approvedCount = eventNominations.filter(n => n.status === 'approved').length;
  const rejectedCount = eventNominations.filter(n => n.status === 'rejected').length;

  const handleApprove = async (nomination: NominationSubmission) => {
    setApproving(nomination.id);
    try {
      await updateNominationStatus(nomination.id, 'approved');
      
      const updatedCategories = selectedEvent.votingCategories.map(cat => {
        if (cat.id === nomination.categoryId) {
          return {
            ...cat,
            nominees: [
              ...cat.nominees,
              {
                id: uid(),
                name: nomination.nomineeName,
                description: nomination.nomineeDescription,
                votes: 0,
                imageUrl: nomination.imageUrl
              }
            ]
          };
        }
        return cat;
      });
      
      await updateEvent(selectedEvent.id, { votingCategories: updatedCategories });

      const firstName = nomination.nomineeName.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      const eventAbbr = selectedEvent.slug.split('-')[0].toLowerCase();
      const email = nomination.email || `${firstName}+${eventAbbr}@eventnic.com`;
      const password = Math.random().toString(36).slice(-8);

      let accountCreated = false;
      try {
        const auth = getAuth(app);
        const token = await auth.currentUser?.getIdToken();
        if (token) {
          const response = await fetch('http://localhost:5000/api/nominees/create-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              email,
              password,
              name: nomination.nomineeName,
              phone: nomination.phone || '',
              imageUrl: nomination.imageUrl || '',
              eventId: selectedEvent.id
            })
          });

          if (response.ok) {
            accountCreated = true;
          } else {
            const errorData = await response.json();
            console.warn('Account creation failed (nominee still approved):', errorData.error);
          }
        }
      } catch (apiErr) {
        console.warn('Backend unavailable — nominee approved but account not created:', apiErr);
      }

      await loadGeneratedNominees(selectedEvent.id);

      if (accountCreated) {
        alert(`✅ Nominee Approved & Account Created!\n\nName: ${nomination.nomineeName}\nEmail: ${email}\nPassword: ${password}\n\nPlease copy and share these credentials with the nominee.`);
      } else {
        alert(`✅ Nominee Approved!\n\n${nomination.nomineeName} has been added to the voting page.\n\n⚠️ The nominee account could not be created automatically (backend may be offline). You can create it manually later.`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to approve nomination. Please try again.');
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateNominationStatus(id, 'rejected');
    } catch (err) {
      console.error(err);
      alert('Failed to reject nomination.');
    }
  };

  const handleResetPassword = async (nominee: any) => {
    if (!confirm(`Are you sure you want to reset the password for ${nominee.name}?`)) return;
    
    try {
      const newPassword = Math.random().toString(36).slice(-8);
      const auth = getAuth(app);
      const token = await auth.currentUser?.getIdToken();

      const response = await fetch('http://localhost:5000/api/nominees/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nomineeUid: nominee.id,
          newPassword
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to reset password');
      }

      alert(`Password Reset Successful!\n\nNominee: ${nominee.name}\nEmail: ${nominee.email}\nNew Password: ${newPassword}\n\nPlease share this with the nominee.`);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to reset password: ${err.message}`);
    }
  };

  const tabs: { key: TabFilter; label: string; count: number; icon: string }[] = [
    { key: 'pending', label: 'Pending', count: pendingCount, icon: 'pending' },
    { key: 'approved', label: 'Approved', count: approvedCount, icon: 'check_circle' },
    { key: 'rejected', label: 'Rejected', count: rejectedCount, icon: 'cancel' },
    { key: 'all', label: 'All', count: eventNominations.length, icon: 'list' },
  ];

  if (!selectedEvent.votingEnabled) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl shadow-sm text-center">
        <span className="material-symbols-outlined text-[48px] text-secondary mb-md">how_to_vote</span>
        <h2 className="font-headline-sm text-on-surface mb-sm">Voting is Disabled</h2>
        <p className="text-secondary">Enable voting in event settings to receive nominations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-xl">
      <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm flex flex-wrap gap-sm">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`flex items-center gap-xs px-md py-sm rounded-full font-label-md transition-all ${
              activeFilter === tab.key 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-surface-variant text-secondary hover:bg-outline-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
              activeFilter === tab.key ? 'bg-white/20' : 'bg-surface-container'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
        {filteredNominations.length === 0 ? (
          <div className="text-center py-xxl">
            <span className="material-symbols-outlined text-[48px] text-outline mb-sm block">inbox</span>
            <p className="text-secondary">
              {activeFilter === 'pending' && 'No pending nominations for this event.'}
              {activeFilter === 'approved' && 'No approved nominations yet.'}
              {activeFilter === 'rejected' && 'No rejected nominations.'}
              {activeFilter === 'all' && 'No nominations have been submitted for this event yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-md">
            {filteredNominations.map(nom => {
              const categoryName = selectedEvent.votingCategories.find(c => c.id === nom.categoryId)?.name || 'Unknown Category';
              const isApproving = approving === nom.id;
              
              return (
                <div key={nom.id} className="bg-background border border-outline-variant rounded-xl p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md hover:shadow-sm transition-all">
                  <div className="flex items-start gap-md flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0">
                      {nom.imageUrl 
                        ? <img className="w-full h-full object-cover" src={nom.imageUrl} alt={nom.nomineeName} /> 
                        : <span className="material-symbols-outlined text-primary">person</span>
                      }
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-xs mb-xs flex-wrap">
                        <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
                          {categoryName}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider ${
                          nom.status === 'approved' ? 'bg-emerald-100 text-emerald-700' 
                          : nom.status === 'rejected' ? 'bg-red-100 text-on-error-container' 
                          : 'bg-amber-100 text-amber-600 dark:text-amber-400'
                        }`}>
                          {nom.status}
                        </span>
                        <span className="text-xs text-secondary">{new Date(nom.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-headline-sm font-bold text-on-surface">{nom.nomineeName}</h3>
                      {nom.nomineeDescription && (
                        <p className="text-secondary font-body-sm mt-xs line-clamp-2">{nom.nomineeDescription}</p>
                      )}
                      {nom.phone && (
                        <p className="text-secondary font-body-sm mt-xs flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">phone</span> {nom.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  {nom.status === 'pending' && (
                    <div className="flex items-center gap-sm shrink-0 w-full md:w-auto">
                      <button 
                        onClick={() => handleApprove(nom)} 
                        disabled={isApproving}
                        className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-lg py-sm rounded-full font-bold transition-colors flex items-center justify-center gap-xs"
                      >
                        {isApproving ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Approving...</>
                        ) : (
                          <><span className="material-symbols-outlined text-[18px]">check</span> Approve</>
                        )}
                      </button>
                      <button 
                        onClick={() => handleReject(nom.id)} 
                        className="flex-1 md:flex-none bg-error-container hover:bg-red-100 text-error px-lg py-sm rounded-full font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-surface border border-outline-variant rounded-3xl p-xl shadow-sm">
        <div className="flex items-center gap-sm mb-lg">
          <span className="material-symbols-outlined text-tertiary">group</span>
          <h2 className="font-display text-[24px] text-on-surface">Generated Nominee Accounts</h2>
        </div>

        {loadingNominees ? (
          <div className="text-center py-xl text-secondary">Loading accounts...</div>
        ) : generatedNominees.length === 0 ? (
          <div className="text-center py-xl border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
            <span className="material-symbols-outlined text-[40px] text-outline mb-sm block">person_add</span>
            <p className="text-secondary">No accounts have been generated yet. Approve pending nominations to auto-create accounts.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  <th className="py-md px-lg font-label-md text-secondary uppercase text-xs">Name</th>
                  <th className="py-md px-lg font-label-md text-secondary uppercase text-xs">Email / Login</th>
                  <th className="py-md px-lg font-label-md text-secondary uppercase text-xs">Phone</th>
                  <th className="py-md px-lg text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {generatedNominees.map(nom => (
                  <tr key={nom.id}>
                    <td className="py-md px-lg font-bold text-on-surface">
                      <div className="flex items-center gap-sm">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center">
                          {nom.imageUrl ? <img className="w-full h-full object-cover" src={nom.imageUrl} alt={nom.name || 'Nominee'} /> : <span className="material-symbols-outlined text-primary">person</span>}
                        </div>
                        <span>{nom.name}</span>
                      </div>
                    </td>
                    <td className="py-md px-lg text-secondary">{nom.email}</td>
                    <td className="py-md px-lg text-secondary">{nom.phone || '-'}</td>
                    <td className="py-md px-lg text-right">
                      <button onClick={() => handleResetPassword(nom)} className="text-primary hover:text-primary-container font-label-md font-bold transition-colors">
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
