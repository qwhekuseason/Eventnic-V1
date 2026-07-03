import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';

export default function PublicVotingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getEvent } = useEvents();

  const event = getEvent(slug || '');
  const votePrice = event?.votePrice || 0;

  if (!event || !event.votingEnabled) {
    return (
      <main className="pt-[140px] pb-xxl max-w-container-max mx-auto px-margin text-center min-h-[60vh]">
        <h1 className="font-headline-lg text-on-surface mb-sm">Voting Not Available</h1>
        <p className="text-secondary mb-lg">This event does not have active voting or it has been removed.</p>
        <Link to="/explore" className="bg-primary text-on-primary px-lg py-md rounded-lg font-bold">Browse Events</Link>
      </main>
    );
  }

  const handleVoteClick = (categoryId: string, nomineeId: string) => {
    navigate(`/event/${event.slug}/vote/${categoryId}/${nomineeId}`);
  };

  return (
    <main className="pt-[140px] pb-xxl max-w-container-max mx-auto px-margin min-h-screen">
      <div className="mb-xl text-center">
        <Link to={`/event/${event.slug}`} className="text-primary hover:underline font-label-md mb-md inline-block">&larr; Back to Event</Link>
        <h1 className="font-display text-[40px] text-on-surface mb-sm">{event.title} — Voting</h1>
        <p className="text-secondary font-body-lg max-w-2xl mx-auto">Cast your vote for the innovators shaping the future. Support your favorite nominees below.</p>
      </div>

      {/* USSD Instructions */}
      <div className="max-w-2xl mx-auto mb-xl bg-surface-container border-2 border-primary/20 p-lg rounded-2xl">
        <div className="flex items-center justify-center gap-sm mb-sm">
          <span className="material-symbols-outlined text-primary text-[28px]">dialpad</span>
          <h4 className="font-headline-sm text-on-surface">USSD Voting</h4>
        </div>
        <p className="text-secondary font-body-md text-center leading-relaxed">
          Dial <strong className="text-on-surface">*347*88*<span className="text-primary">{event.id.slice(0,4).toUpperCase()}</span>#</strong> on your mobile phone to vote via USSD.
        </p>
        <p className="text-secondary font-body-sm text-center mt-xs opacity-70">
          Follow the prompts to enter nominee code and number of votes.
        </p>
      </div>

      {votePrice > 0 && (
        <div className="text-center mb-xl">
          <span className="bg-primary/10 text-primary px-md py-xs rounded-full font-label-sm uppercase tracking-widest">
            Paid Voting — GH₵ {votePrice} per vote
          </span>
        </div>
      )}

      {event.votingCategories.map((cat) => {
        const total = cat.nominees.reduce((n, x) => n + x.votes, 0);
        
        return (
          <div key={cat.id} className="mb-xxl">
            <div className="flex items-center justify-between mb-md border-b border-outline-variant pb-sm">
              <h3 className="font-headline-md text-on-surface">{cat.name}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-lg">
              {cat.nominees.map((nom) => {
                const share = total > 0 ? Math.round((nom.votes / total) * 100) : 0;
                return (
                  <div key={nom.id} className="bg-surface p-lg rounded-xl border border-outline-variant flex flex-col text-center shadow-sm hover:border-primary transition-all">
                    <div className="w-24 h-24 rounded-full mb-md overflow-hidden mx-auto bg-surface-container-high flex items-center justify-center border-4 border-surface">
                      {nom.imageUrl ? (
                        <img className="w-full h-full object-cover" src={nom.imageUrl} alt={nom.name || 'Nominee'} />
                      ) : (
                        <span className="material-symbols-outlined text-[40px] text-secondary">emoji_events</span>
                      )}
                    </div>
                    <h4 className="font-headline-sm font-bold text-on-surface">{nom.name}</h4>
                    <div className="bg-surface-container text-secondary text-[10px] font-bold uppercase px-xs py-0.5 rounded inline-block mx-auto mb-sm mt-xs">
                      CODE: <span className="text-primary">{nom.id.slice(0, 4).toUpperCase()}</span>
                    </div>
                    <p className="text-secondary font-body-sm mb-md flex-grow">{nom.description}</p>
                    
                    <div className="mb-md">
                      <div className="flex justify-between text-label-sm mb-xs"><span className="text-on-surface font-bold">{nom.votes.toLocaleString()} votes</span><span className="text-secondary">{share}%</span></div>
                      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden"><div className="bg-tertiary h-2 rounded-full transition-all" style={{ width: `${share}%` }}></div></div>
                    </div>
                    
                    <button
                      onClick={() => handleVoteClick(cat.id, nom.id)}
                      className="mt-auto w-full py-sm font-bold rounded-full transition-all flex items-center justify-center gap-xs border-2 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[18px]">how_to_vote</span> Vote
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </main>
  );
}
