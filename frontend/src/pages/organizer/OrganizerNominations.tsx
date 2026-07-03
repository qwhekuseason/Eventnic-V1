import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents, uid } from '../../contexts/EventsContext';
import { useNominations } from '../../contexts/NominationsContext';
import type { NominationSubmission } from '../../contexts/NominationsContext';
import { app } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

type TabFilter = 'pending' | 'approved' | 'rejected' | 'all';

export default function OrganizerNominations() {
  const { user } = useAuth();
  const { getEventsByOrganizer, updateEvent, getEvent } = useEvents();
  const { nominations, updateNominationStatus } = useNominations();

  const myEvents = getEventsByOrganizer(user?.email || '');
  const [selectedEventId, setSelectedEventId] = useState<string>(myEvents[0]?.id || '');
  const [generatedNominees, setGeneratedNominees] = useState<any[]>([]);
  const [loadingNominees, setLoadingNominees] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>('pending');
  const [approving, setApproving] = useState<string | null>(null);
  
  useEffect(() => {
    if (myEvents.length > 0 && !selectedEventId) {
      setSelectedEventId(myEvents[0].id);
    }
  }, [myEvents, selectedEventId]);

  const loadGeneratedNominees = async (eventId: string) => {
    setLoadingNominees(true);
    try {
      const db = getFirestore(app);
      const q = query(collection(db, 'users'), where('role', '==', 'NOMINEE'), where('eventId', '==', eventId));
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
    if (selectedEventId) {
      loadGeneratedNominees(selectedEventId);
    }
  }, [selectedEventId]);

  // Use getEvent for the freshest real-time data from the EventsContext
  const selectedEvent = getEvent(selectedEventId);

  // Filter nominations for this event
  const eventNominations = nominations.filter(n => n.eventId === selectedEventId);
  const filteredNominations = activeTab === 'all' 
    ? eventNominations 
    : eventNominations.filter(n => n.status === activeTab);

  const pendingCount = eventNominations.filter(n => n.status === 'pending').length;
  const approvedCount = eventNominations.filter(n => n.status === 'approved').length;
  const rejectedCount = eventNominations.filter(n => n.status === 'rejected').length;

  const handleApprove = async (nomination: NominationSubmission) => {
    if (!selectedEvent) return;
    setApproving(nomination.id);
    try {
      // 1. Mark as approved in the nominations collection
      await updateNominationStatus(nomination.id, 'approved');
      
      // 2. Add nominee to the event's voting category so they appear on the public voting page
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

      // 3. Generate Nominee Account via Backend API
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

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[80px] px-margin">
      <div className="max-w-container-max mx-auto">
        <h1 className="font-display text-[40px] text-on-surface mb-lg">Manage Nominations</h1>
        
        {myEvents.length === 0 ? (
          <div className="bg-surface border border-outline-variant rounded-2xl p-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-outline mb-md block">event_busy</span>
            <p className="text-secondary">You don't have any events yet. Create one to start receiving nominations.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-xl">
            {/* Sidebar / Event Selector */}
            <div className="w-full lg:w-1/4">
              <div className="bg-surface border border-outline-variant rounded-2xl p-md sticky top-[140px]">
                <h3 className="font-headline-sm font-bold text-on-surface mb-md px-xs">Select Event</h3>
                <div className="flex flex-col gap-xs">
                  {myEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={() => { setSelectedEventId(event.id); setActiveTab('pending'); }}
                      className={`text-left px-md py-sm rounded-xl font-body-md transition-colors ${
                        selectedEventId === event.id 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-secondary hover:bg-surface-variant'
                      }`}
                    >
                      <span className="block truncate">{event.title}</span>
                      {/* Show badge for pending nominations */}
                      {nominations.filter(n => n.eventId === event.id && n.status === 'pending').length > 0 && (
                        <span className="inline-block mt-xs bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {nominations.filter(n => n.eventId === event.id && n.status === 'pending').length} pending
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4 space-y-xl">
              {selectedEvent && (
                <>
                  {/* Header with event info */}
                  <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg border-b border-outline-variant pb-md gap-md">
                      <div>
                        <h2 className="font-headline-md font-bold text-on-surface">{selectedEvent.title}</h2>
                        <p className="text-secondary font-body-sm mt-xs">
                          {eventNominations.length} total submissions · {pendingCount} awaiting review
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/event/${selectedEvent.slug}/nominate`;
                          navigator.clipboard.writeText(url);
                          alert('Nomination link copied to clipboard!');
                        }}
                        className="bg-primary/10 text-primary hover:bg-primary/20 px-md py-sm rounded-lg font-label-md transition-colors flex items-center gap-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        Copy Public Nomination Link
                      </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-sm">
                      {tabs.map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center gap-xs px-md py-sm rounded-full font-label-md transition-all ${
                            activeTab === tab.key 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'bg-surface-variant text-secondary hover:bg-outline-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                          {tab.label}
                          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                            activeTab === tab.key ? 'bg-white/20' : 'bg-surface-container'
                          }`}>
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nominations List */}
                  <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
                    {filteredNominations.length === 0 ? (
                      <div className="text-center py-xxl">
                        <span className="material-symbols-outlined text-[48px] text-outline mb-sm block">inbox</span>
                        <p className="text-secondary">
                          {activeTab === 'pending' && 'No pending nominations for this event.'}
                          {activeTab === 'approved' && 'No approved nominations yet.'}
                          {activeTab === 'rejected' && 'No rejected nominations.'}
                          {activeTab === 'all' && 'No nominations have been submitted for this event yet.'}
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
                                {/* Avatar */}
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

                  {/* Generated Nominee Accounts */}
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
