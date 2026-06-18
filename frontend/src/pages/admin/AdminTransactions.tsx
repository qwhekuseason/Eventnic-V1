import { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { app } from '../../config/firebase';
import { useEvents } from '../../contexts/EventsContext';
import { Link } from 'react-router-dom';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const { getEvent } = useEvents();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'), limit(100));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => doc.data());
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex justify-between items-center mb-xl">
          <div>
            <h1 className="font-display text-[40px] text-on-surface">Global Transactions</h1>
            <p className="text-secondary">View all recent ticket purchases across the platform.</p>
          </div>
          <Link to="/admin" className="text-primary font-bold hover:underline">Back to Dashboard</Link>
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
