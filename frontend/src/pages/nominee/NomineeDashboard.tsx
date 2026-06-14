import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventsContext';

export default function NomineeDashboard() {
  const { user } = useAuth();
  const { nomineeStandings } = useEvents();
  const [bio, setBio] = useState('Passionate builder and creator. Thank you for your support!');

  const standings = nomineeStandings(user?.name || '');
  const totalVotes = standings.reduce((n, s) => n + s.votes, 0);
  const bestRank = standings.length ? Math.min(...standings.map((s) => s.rank)) : null;

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <h1 className="font-display text-[40px] text-on-surface leading-tight">Nominee Dashboard</h1>
            <p className="text-secondary font-body-lg">Manage your campaign, {user?.name}.</p>
          </div>
          <div className="flex gap-sm flex-wrap">
            <Link to="/nominee/results" className="bg-surface border border-outline-variant text-on-surface font-bold px-lg py-sm rounded-full hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">bar_chart</span> View Results
            </Link>
            <button onClick={() => { alert('Campaign link copied to clipboard!'); }} className="bg-primary text-white font-bold px-lg py-sm rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">share</span> Share Campaign
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {/* Left Column - Stats */}
          <div className="md:col-span-1 space-y-lg">
            <div className="bg-gradient-premium rounded-2xl p-xl text-white shadow-lg text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h2 className="font-body-md uppercase tracking-wider mb-sm font-bold text-white/80">Total Votes</h2>
              <div className="font-display text-[64px] leading-none mb-xs">{totalVotes.toLocaleString()}</div>
              <div className="font-body-sm bg-white/20 inline-block px-sm py-xs rounded-full">
                {bestRank ? `Best rank: #${bestRank}` : 'No nominations yet'}
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-lg border border-outline-variant shadow-sm">
              <h3 className="font-bold text-on-surface mb-sm">Current Nominations</h3>
              {standings.length === 0 ? (
                <p className="text-secondary font-body-sm">You aren't nominated in any active events yet. When an organizer adds you to a voting category, it will show up here.</p>
              ) : (
                <div className="space-y-sm">
                  {standings.map((s) => (
                    <div key={s.categoryId} className="flex justify-between items-center bg-surface-container-lowest p-sm rounded-lg">
                      <div>
                        <div className="font-bold text-on-surface text-sm">{s.category}</div>
                        <div className="text-secondary text-xs">{s.eventTitle}</div>
                      </div>
                      <span className={`text-xs font-bold px-sm py-xs rounded-full ${s.rank === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary-container text-on-secondary-container'}`}>#{s.rank} of {s.totalNominees}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Edit */}
          <div className="md:col-span-2">
            <div className="bg-surface rounded-2xl p-lg md:p-xl border border-outline-variant shadow-sm">
              <h2 className="font-headline-sm font-bold text-on-surface mb-lg">Public Campaign Profile</h2>

              <div className="flex flex-col sm:flex-row gap-lg mb-xl">
                <div className="w-32 h-32 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0 text-[40px] font-bold overflow-hidden">
                  {user?.name?.charAt(0) || 'N'}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-lg">{user?.name}</h3>
                  <p className="text-secondary font-body-sm mb-md">{user?.email}</p>
                  <button onClick={() => { alert('Photo upload coming soon.'); }} className="text-primary font-bold font-label-md border border-primary px-md py-sm rounded-full hover:bg-primary-container">
                    Upload New Photo
                  </button>
                </div>
              </div>

              <div className="space-y-md">
                <div>
                  <label className="block text-on-surface font-bold font-label-md mb-xs">Campaign Bio / Message</label>
                  <textarea
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                  <p className="text-secondary text-xs mt-xs">This message will be visible to everyone on the voting page.</p>
                </div>

                <div>
                  <label className="block text-on-surface font-bold font-label-md mb-xs">Social Links</label>
                  <input type="text" placeholder="https://twitter.com/yourhandle" className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>

                <div className="pt-sm">
                  <button onClick={() => { alert('Profile saved!'); }} className="bg-primary text-white font-bold px-xl py-sm rounded-full shadow-md hover:scale-105 transition-transform w-full sm:w-auto">
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
