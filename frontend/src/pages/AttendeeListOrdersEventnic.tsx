import { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { app } from '../config/firebase';
import { useEvents } from '../contexts/EventsContext';
import { useAuth } from '../contexts/AuthContext';

export default function AttendeeListOrdersEventnic() {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const { user } = useAuth();
  const { getEventsByOrganizer, getEvent } = useEvents();

  useEffect(() => {
    async function fetchAttendees() {
      if (!user) return;
      try {
        const myEvents = getEventsByOrganizer(user.email);
        const eventIds = myEvents.map(e => e.id);
        
        if (eventIds.length === 0) {
          setAttendees([]);
          setLoading(false);
          return;
        }

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
        setAttendees(allData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendees();
  }, [user, getEventsByOrganizer, db]);

  return (
    <main className="max-w-container-max mx-auto px-margin pt-[120px] pb-xxl">
      <div className="flex justify-between items-end mb-xl">
        <div>
          <h1 className="font-display text-display text-on-surface mb-xs">Attendee Management</h1>
          <p className="font-body-lg text-body-lg text-secondary">Monitor registrations and manage orders.</p>
        </div>
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-xl text-center text-secondary">Loading attendees...</div>
        ) : attendees.length === 0 ? (
          <div className="p-xl text-center text-secondary">No attendees have registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-secondary uppercase font-label-sm tracking-wider text-label-sm">
                  <th className="px-lg py-md border-b border-outline-variant font-semibold">Attendee</th>
                  <th className="px-lg py-md border-b border-outline-variant font-semibold">Event</th>
                  <th className="px-lg py-md border-b border-outline-variant font-semibold">Order Date</th>
                  <th className="px-lg py-md border-b border-outline-variant font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {attendees.map((ticket) => {
                  const evt = getEvent(ticket.eventId);
                  const attendeeName = ticket.attendeeName || ticket.userId || 'Guest';
                  return (
                    <tr key={ticket.id} className="hover:bg-surface-bright transition-colors group">
                      <td className="px-lg py-lg">
                        <div className="font-headline-sm text-body-md text-on-surface">{attendeeName}</div>
                        <div className="text-body-sm text-secondary">Ticket: {ticket.id}</div>
                      </td>
                      <td className="px-lg py-lg">
                        <span className="px-md py-xs bg-surface-container-highest text-on-surface-variant rounded-full text-label-sm font-semibold">{evt?.title || 'Unknown Event'}</span>
                      </td>
                      <td className="px-lg py-lg text-body-md text-secondary">{new Date(ticket.createdAt).toLocaleString()}</td>
                      <td className="px-lg py-lg">
                        <span className={`flex items-center gap-xs font-semibold text-label-sm ${ticket.status === 'checked_in' ? 'text-primary' : 'text-secondary'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'checked_in' ? 'bg-primary' : 'bg-secondary'}`}></span>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
