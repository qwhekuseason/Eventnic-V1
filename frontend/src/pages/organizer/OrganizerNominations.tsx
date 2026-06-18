import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents, uid } from '../../contexts/EventsContext';
import { useNominations } from '../../contexts/NominationsContext';
import type { NominationSubmission } from '../../contexts/NominationsContext';
import { app } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default function OrganizerNominations() {
  const { user } = useAuth();
  const { getEventsByOrganizer, updateEvent } = useEvents();
  const { nominations, updateNominationStatus } = useNominations();

  const myEvents = getEventsByOrganizer(user?.email || '');
  const [selectedEventId, setSelectedEventId] = useState<string>(myEvents[0]?.id || '');
  const [generatedNominees, setGeneratedNominees] = useState<any[]>([]);
  const [loadingNominees, setLoadingNominees] = useState(false);
  
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

  const selectedEvent = myEvents.find(e => e.id === selectedEventId);
  const pendingNominations = nominations.filter(n => n.eventId === selectedEventId && n.status === 'pending');

  const handleApprove = async (nomination: NominationSubmission) => {
    if (!selectedEvent) return;
    try {
      // 1. Mark as approved
      await updateNominationStatus(nomination.id, 'approved');
      
      // 2. Add nominee to the event's voting category
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
      const email = `${firstName}+${eventAbbr}@eventnic.com`;
      const password = Math.random().toString(36).slice(-8);

      const auth = getAuth(app);
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Unable to generate authentication token for nominee account creation.');
      }

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create account on backend');
      }

      await loadGeneratedNominees(selectedEvent.id);
      alert(`Nominee Account Generated Successfully!\n\nEmail: ${email}\nPassword: ${password}\n\nPlease copy and share these credentials with the nominee.`);
    } catch (err) {
      console.error(err);
      alert('Failed to approve nomination');
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

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[80px] px-margin">
      <div className="max-w-container-max mx-auto">
        <h1 className="font-display text-[40px] text-on-surface mb-lg">Manage Nominations</h1>
        
        {myEvents.length === 0 ? (
          <div className="bg-surface border border-outline-variant rounded-2xl p-xl text-center">
            <p className="text-secondary">You don't have any events yet.</p>
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
                      onClick={() => setSelectedEventId(event.id)}
                      className={`text-left px-md py-sm rounded-xl font-body-md transition-colors ${
                        selectedEventId === event.id 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-secondary hover:bg-surface-variant'
                      }`}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {selectedEvent && (
                <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm">
                  <div className="flex justify-between items-center mb-xl border-b border-outline-variant pb-md">
                    <div>
                      <h2 className="font-headline-md font-bold text-on-surface">{selectedEvent.title}</h2>
                      <p className="text-secondary font-body-sm">{pendingNominations.length} Pending Submissions</p>
                    </div>
                  </div>

                  {pendingNominations.length === 0 ? (
                    <div className="text-center py-xxl">
                      <span className="material-symbols-outlined text-[48px] text-outline mb-sm block">inbox</span>
                      <p className="text-secondary">No pending nominations for this event.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-md">
                      {pendingNominations.map(nom => {
                        const categoryName = selectedEvent.votingCategories.find(c => c.id === nom.categoryId)?.name || 'Unknown Category';
                        
                        return (
                          <div key={nom.id} className="bg-background border border-outline-variant rounded-xl p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                            <div>
                              <div className="flex items-center gap-xs mb-xs">
                                <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
                                  {categoryName}
                                </span>
                                <span className="text-xs text-secondary">{new Date(nom.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h3 className="font-headline-sm font-bold text-on-surface">{nom.nomineeName}</h3>
                              {nom.nomineeDescription && (
                                <p className="text-secondary font-body-sm mt-xs line-clamp-2">{nom.nomineeDescription}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-sm shrink-0 w-full md:w-auto">
                              <button onClick={() => handleApprove(nom)} className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-lg py-sm rounded-full font-bold transition-colors">
                                Approve
                              </button>
                              <button onClick={() => handleReject(nom.id)} className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-600 px-lg py-sm rounded-full font-bold transition-colors">
                                Reject
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Generated Nominee Accounts */}
              {selectedEvent && (
                <div className="bg-surface border border-outline-variant rounded-3xl p-xl shadow-sm">
                  <div className="flex items-center gap-sm mb-lg">
                    <span className="material-symbols-outlined text-tertiary">group</span>
                    <h2 className="font-display text-[24px] text-on-surface">Generated Nominee Accounts</h2>
                  </div>

                  {loadingNominees ? (
                    <div className="text-center py-xl text-secondary">Loading accounts...</div>
                  ) : generatedNominees.length === 0 ? (
                    <div className="text-center py-xl border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
                      <p className="text-secondary">No accounts have been generated for this event yet.</p>
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
