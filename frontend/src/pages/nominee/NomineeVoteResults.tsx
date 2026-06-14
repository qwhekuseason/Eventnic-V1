import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventsContext';

export default function NomineeVoteResults() {
  const { user } = useAuth();
  const { nomineeStandings } = useEvents();
  const results = nomineeStandings(user?.name || '');

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <Link to="/nominee" className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <h1 className="font-display text-[36px] text-on-surface leading-tight">Voting Results</h1>
            </div>
            <p className="text-secondary font-body-lg">Track your performance across all nominated categories.</p>
          </div>
          <button onClick={() => { alert('Report exported.'); }} className="bg-primary text-white font-bold px-lg py-sm rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">download</span> Export Report
          </button>
        </div>

        {results.length === 0 ? (
          <div className="bg-surface rounded-3xl border border-outline-variant shadow-sm p-xxl text-center text-secondary">
            You have no nominations yet. Results will appear here once you're entered into a voting category.
          </div>
        ) : (
          <div className="space-y-lg">
            {results.map((result) => {
              const behind = Math.max(0, result.leaderVotes - result.votes);
              const progress = result.leaderVotes > 0 ? Math.round((result.votes / result.leaderVotes) * 100) : 100;
              return (
                <div key={result.categoryId} className="bg-surface rounded-3xl border border-outline-variant shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className="bg-gradient-premium p-xl text-white flex flex-col justify-center items-center md:w-64 flex-shrink-0 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="font-body-sm uppercase tracking-widest font-bold mb-xs opacity-80">Current Rank</div>
                    <div className="font-display text-[72px] leading-none mb-xs">#{result.rank}</div>
                    <div className="text-sm bg-white/20 px-sm py-xs rounded-full">Out of {result.totalNominees}</div>
                  </div>

                  <div className="p-xl flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-md">
                      <div>
                        <h2 className="font-headline-md font-bold text-on-surface mb-xs">{result.category}</h2>
                        <p className="text-secondary font-body-sm">{result.eventTitle}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-3xl text-primary">{result.votes.toLocaleString()}</div>
                        <div className="text-xs text-secondary">Total Votes</div>
                      </div>
                    </div>

                    <div className="space-y-xs mt-md">
                      <div className="flex justify-between text-sm font-bold text-on-surface">
                        <span>Progress vs. leader</span>
                        <span className="text-secondary">{progress}%</span>
                      </div>
                      <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      {result.rank > 1 ? (
                        <p className="text-xs text-secondary mt-xs">You are approx. {behind.toLocaleString()} votes behind the leader.</p>
                      ) : (
                        <p className="text-xs text-emerald-600 mt-xs flex items-center gap-[2px]"><span className="material-symbols-outlined text-[14px]">trending_up</span> You're in the lead!</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
