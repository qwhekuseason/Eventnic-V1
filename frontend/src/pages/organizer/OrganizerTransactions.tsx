import { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { app } from '../../config/firebase';
import { useEvents } from '../../contexts/EventsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function OrganizerTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const { user } = useAuth();
  const { getEventsByOrganizer } = useEvents();

  useEffect(() => {
    async function fetchTransactions() {
      if (!user) return;
      try {
        const myEvents = getEventsByOrganizer(user.email);
        const eventIds = myEvents.map(e => e.id);
        
        if (eventIds.length === 0) {
          setLoading(false);
          return;
        }

        // Firestore 'in' query supports up to 10 items
        // For a real app, this might be chunked, but we'll do basic chunks for safety
        const chunks = [];
        for (let i = 0; i < eventIds.length; i += 10) {
          chunks.push(eventIds.slice(i, i + 10));
        }

        let allData: any[] = [];
        for (const chunk of chunks) {
          const q = query(collection(db, 'tickets'), where('eventId', 'in', chunk));
          const snap = await getDocs(q);
          allData = allData.concat(snap.docs.map(doc => doc.data()));
        }

        allData.sort((a, b) => b.createdAt - a.createdAt);
        setTransactions(allData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [user]);

  const { getEvent } = useEvents();

  return (
    <div className="min-h-screen bg-background pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex justify-between items-center mb-xl">
          <div>
            <h1 className="font-display text-[40px] text-on-surface">Event Transactions</h1>
            <p className="text-secondary">View ticket purchases for your events.</p>
          </div>
          <Link to="/dashboard" className="text-primary font-bold hover:underline">Back to Dashboard</Link>
        </div>

        <div className="bg-surface rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-xl text-center text-secondary">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-xl text-center text-secondary">No transactions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant">
                    <th className="p-md font-label-md text-secondary">Date</th>
                    <th className="p-md font-label-md text-secondary">Transaction ID</th>
                    <th className="p-md font-label-md text-secondary">Event</th>
                    <th className="p-md font-label-md text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {transactions.map((tx, i) => {
                    const evt = getEvent(tx.eventId);
                    return (
                      <tr key={i} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="p-md font-body-sm">{new Date(tx.createdAt).toLocaleString()}</td>
                        <td className="p-md font-body-sm font-mono text-xs">{tx.id}</td>
                        <td className="p-md font-body-sm font-bold">{evt?.title || 'Unknown Event'}</td>
                        <td className="p-md font-body-sm">
                          <span className="px-sm py-xs rounded bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
