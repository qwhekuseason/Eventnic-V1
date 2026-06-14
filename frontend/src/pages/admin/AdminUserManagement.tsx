import { useState } from 'react';
import { Link } from 'react-router-dom';

const mockUsers = [
  { id: '1', name: 'Markus DJ', email: 'markus@events.com', role: 'ORGANIZER', status: 'active', events: 12, joined: 'Jan 2024' },
  { id: '2', name: 'Sarah Jenkins', email: 'sarah@tech.io', role: 'ORGANIZER', status: 'active', events: 5, joined: 'Mar 2024' },
  { id: '3', name: 'Amara Osei', email: 'amara@nominee.com', role: 'NOMINEE', status: 'active', events: 0, joined: 'May 2025' },
  { id: '4', name: 'Chris Reed', email: 'chris@startup.co', role: 'ORGANIZER', status: 'suspended', events: 2, joined: 'Jun 2025' },
  { id: '5', name: 'Diana Frost', email: 'diana@awards.com', role: 'NOMINEE', status: 'active', events: 0, joined: 'Jul 2025' },
  { id: '6', name: 'Kwame Mensah', email: 'kwame@org.com', role: 'ORGANIZER', status: 'active', events: 8, joined: 'Feb 2024' },
  { id: '7', name: 'Luna Park', email: 'luna@design.co', role: 'NOMINEE', status: 'pending', events: 0, joined: 'Sep 2025' },
];

export default function AdminUserManagement() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(u => {
    if (filter !== 'all' && u.role !== filter && u.status !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
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
              className="w-full pl-10 pr-4 py-[10px] rounded-xl border border-outline-variant bg-white text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-sm flex-wrap">
            {['all', 'ORGANIZER', 'NOMINEE', 'suspended'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-md py-sm rounded-full font-label-md font-bold transition-all capitalize ${filter === f ? 'bg-primary text-white shadow-md' : 'bg-surface border border-outline-variant text-secondary hover:border-primary'}`}
              >
                {f === 'all' ? 'All Users' : f === 'ORGANIZER' ? 'Organizers' : f === 'NOMINEE' ? 'Nominees' : 'Suspended'}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-outline-variant bg-surface-container-lowest">
                  <th className="px-lg py-md font-label-md text-secondary">User</th>
                  <th className="px-lg py-md font-label-md text-secondary">Role</th>
                  <th className="px-lg py-md font-label-md text-secondary">Events</th>
                  <th className="px-lg py-md font-label-md text-secondary">Status</th>
                  <th className="px-lg py-md font-label-md text-secondary">Joined</th>
                  <th className="px-lg py-md font-label-md text-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface text-sm">{u.name}</div>
                          <div className="text-secondary text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <span className={`px-sm py-xs rounded-full font-label-sm text-xs font-bold ${u.role === 'ORGANIZER' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-lg py-md text-on-surface font-body-md">{u.events}</td>
                    <td className="px-lg py-md">
                      <span className={`px-sm py-xs rounded-full font-label-sm text-xs font-bold ${u.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : u.status === 'suspended' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-lg py-md text-secondary text-sm">{u.joined}</td>
                    <td className="px-lg py-md text-right">
                      <div className="flex items-center justify-end gap-xs">
                        <button className="p-xs hover:bg-surface-container-high rounded-lg text-secondary" title="Edit User">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="p-xs hover:bg-error-container rounded-lg text-error" title={u.status === 'suspended' ? 'Unsuspend' : 'Suspend'}>
                          <span className="material-symbols-outlined text-[20px]">{u.status === 'suspended' ? 'lock_open' : 'block'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
