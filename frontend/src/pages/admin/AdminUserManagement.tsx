import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { app } from '../../config/firebase';

const db = getFirestore(app);

export default function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const liveUsers: any[] = [];
      snapshot.forEach((doc) => {
        liveUsers.push({ id: doc.id, ...doc.data() });
      });
      // Sort by creation date
      setUsers(liveUsers.sort((a, b) => {
        const parseDate = (val: any) => {
          if (!val) return 0;
          if (typeof val === 'string') return new Date(val).getTime() || 0;
          if (typeof val === 'number') return val;
          if (val?.toDate && typeof val.toDate === 'function') return val.toDate().getTime();
          if (val?.seconds) return val.seconds * 1000;
          return 0;
        };
        return parseDate(b.createdAt) - parseDate(a.createdAt);
      }));
    }, (err) => console.error(err));
    
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (user: any) => {
    try {
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      await updateDoc(doc(db, 'users', user.id), { status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const updateVerification = async (user: any, status: 'VERIFIED' | 'REJECTED') => {
    try {
      const updateData: any = { verificationStatus: status };
      if (status === 'VERIFIED') {
        updateData.status = 'active';
      } else {
        updateData.status = 'pending';
      }
      await updateDoc(doc(db, 'users', user.id), updateData);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u => {
    const status = u.status || 'active';
    const verStatus = u.verificationStatus || 'PENDING';
    if (filter !== 'all' && u.role !== filter && status !== filter && verStatus !== filter) return false;
    const searchLower = search.toLowerCase();
    if (search && !(u.name?.toLowerCase().includes(searchLower)) && !(u.email?.toLowerCase().includes(searchLower))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <Link to="/admin" className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <h1 className="font-display text-[36px] text-on-surface leading-tight">User Management</h1>
            </div>
            <p className="text-secondary font-body-lg">Manage platform users, roles, and permissions.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-md mb-lg">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-[10px] rounded-xl border border-outline-variant bg-surface text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-surface border border-outline-variant rounded-full px-lg py-xs text-on-surface font-body-sm focus:outline-none focus:border-primary">
            <option value="all">All Roles &amp; Statuses</option>
            <option value="PENDING">Pending Verification</option>
            <option value="ORGANIZER">Organizers</option>
            <option value="NOMINEE">Nominees</option>
            <option value="VOTER">Voters</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-outline-variant bg-surface-container-lowest">
                  <th className="px-xl py-md font-label-md text-secondary uppercase tracking-wider text-xs">User</th>
                  <th className="px-xl py-md font-label-md text-secondary uppercase tracking-wider text-xs">Role</th>
                  <th className="px-xl py-md font-label-md text-secondary uppercase tracking-wider text-xs">Status</th>
                  <th className="px-xl py-md font-label-md text-secondary uppercase tracking-wider text-xs">Verification</th>
                  <th className="px-xl py-md"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface text-sm">{u.name || 'Anonymous'}</div>
                          <div className="text-secondary text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <span className={`px-sm py-xs rounded-full font-label-sm text-xs font-bold ${u.role === 'ORGANIZER' ? 'bg-blue-100 text-primary border border-primary/30' : u.role === 'ADMIN' ? 'bg-amber-100 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                        {u.role || 'VOTER'}
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <span className={`px-sm py-xs rounded-full font-label-sm text-xs font-bold ${(!u.status || u.status === 'active') ? 'bg-green-100 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-red-100 text-on-error-container border border-error/30'}`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="px-xl py-md">
                      {u.role === 'ORGANIZER' && (
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                            u.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {u.verificationStatus || 'PENDING'}
                          </span>
                          {u.companyName && <span className="text-xs text-secondary">{u.companyName} ({u.registrationNumber})</span>}
                          {u.phone && <span className="text-xs text-secondary">{u.phone}</span>}
                          {u.ghanaCardNumber && <span className="text-xs text-secondary">{u.ghanaCardNumber}</span>}
                          {u.verificationDocumentUrl && (
                            <a href={u.verificationDocumentUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline block">View verification document</a>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-xl py-md text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-xs">
                        {u.role === 'ORGANIZER' && u.verificationStatus === 'PENDING' && (
                          <>
                            <button onClick={() => updateVerification(u, 'VERIFIED')} className="text-emerald-600 hover:text-emerald-900 bg-emerald-500/10 px-3 py-1 rounded-full font-label-md transition-colors">Approve</button>
                            <button onClick={() => updateVerification(u, 'REJECTED')} className="text-error hover:text-red-900 bg-error-container px-3 py-1 rounded-full font-label-md transition-colors">Reject</button>
                          </>
                        )}
                        <button onClick={() => toggleStatus(u)} className={`${u.status === 'suspended' ? 'text-emerald-600 hover:text-emerald-900' : 'text-error hover:text-red-900'} font-label-md ml-4 transition-colors`}>
                          {u.status === 'suspended' ? 'Restore' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-lg py-xl text-center text-secondary font-body-md">
                      No users found matching your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
