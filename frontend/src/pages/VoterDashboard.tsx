import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';
import { useEvents } from '../contexts/EventsContext';

export default function VoterDashboard() {
  const { user } = useAuth();
  const { getEvent } = useEvents();
  const db = getFirestore(app);

  const [tickets, setTickets] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // Fetch Tickets
        const tQuery = query(collection(db, 'tickets'), where('userId', '==', user.id));
        const tSnap = await getDocs(tQuery);
        const fetchedTickets = tSnap.docs.map(doc => doc.data());
        setTickets(fetchedTickets);

        // Fetch Votes
        const vQuery = query(collection(db, 'votes'), where('voterId', '==', user.id));
        const vSnap = await getDocs(vQuery);
        const fetchedVotes = vSnap.docs.map(doc => doc.data());
        setVotes(fetchedVotes);

      } catch (err) {
        console.error("Failed to fetch voter data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, db]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading your dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[80px] px-margin">
      <div className="max-w-container-max mx-auto">
        <h1 className="font-display text-[40px] text-on-surface mb-xs">Welcome back, {user?.name}</h1>
        <p className="font-body-lg text-secondary mb-xl">Here is your activity across all events.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          {/* Tickets & RSVPs */}
          <div className="bg-surface border border-outline-variant rounded-[24px] p-xl shadow-sm">
            <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-[32px] text-primary">local_activity</span>
              <h2 className="font-headline-md font-bold text-on-surface">My Tickets & RSVPs</h2>
            </div>
            
            {tickets.length === 0 ? (
              <p className="text-secondary py-lg text-center">You haven't bought any tickets or RSVP'd yet.</p>
            ) : (
              <div className="space-y-md">
                {tickets.map(t => {
                  const event = getEvent(t.eventId);
                  return (
                    <div key={t.id} className="bg-background border border-outline rounded-xl p-md flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-on-surface">{event?.title || 'Unknown Event'}</h4>
                        <p className="text-secondary text-sm">Ticket ID: {t.id.slice(0, 8)}</p>
                      </div>
                      <div className={`px-sm py-xs rounded-full text-xs font-bold uppercase tracking-wider ${t.status === 'valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-variant text-secondary'}`}>
                        {t.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-lg">
              <Link to="/explore" className="text-primary font-bold hover:underline">Find more events &rarr;</Link>
            </div>
          </div>

          {/* Voting History */}
          <div className="bg-surface border border-outline-variant rounded-[24px] p-xl shadow-sm">
            <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-[32px] text-tertiary">how_to_vote</span>
              <h2 className="font-headline-md font-bold text-on-surface">My Votes</h2>
            </div>
            
            {votes.length === 0 ? (
              <p className="text-secondary py-lg text-center">You haven't cast any votes yet.</p>
            ) : (
              <div className="space-y-md">
                {votes.map(v => {
                  const event = getEvent(v.eventId);
                  const category = event?.votingCategories?.find(c => c.id === v.categoryId);
                  const nominee = category?.nominees.find(n => n.id === v.nomineeId);
                  
                  return (
                    <div key={v.id} className="bg-background border border-outline rounded-xl p-md">
                      <div className="text-xs text-secondary mb-xs">{new Date(v.createdAt).toLocaleDateString()}</div>
                      <h4 className="font-bold text-on-surface">{nominee?.name || 'Unknown Nominee'}</h4>
                      <p className="text-secondary text-sm">{category?.name || 'Unknown Category'} &mdash; {event?.title || 'Unknown Event'}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
