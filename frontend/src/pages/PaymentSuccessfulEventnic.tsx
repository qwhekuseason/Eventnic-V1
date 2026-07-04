// @ts-nocheck
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function PaymentSuccessfulEventnic() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    type?: 'ticket' | 'vote';
    orderNumber?: string;
    reference?: string;
    eventTitle?: string;
    tierName?: string;
    categoryName?: string;
    nomineeName?: string;
    quantity?: number;
    total?: number;
    eventDate?: string;
    eventLocation?: string;
  } | null;

  const title = state?.eventTitle || 'Your event';
  const summary = state?.type === 'vote'
    ? `${state.quantity || 1} vote${state.quantity === 1 ? '' : 's'} for ${state.nomineeName || 'the nominee'}`
    : `${state.quantity || 1} ticket${state.quantity === 1 ? '' : 's'} for ${state.tierName || 'the selected tier'}`;
  const badges = state?.type === 'vote' ? 'Vote Recorded' : 'Paid';

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-margin py-xxl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-primary-container/10 to-transparent blur-3xl rounded-full -z-10"></div>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-container/10 text-primary rounded-full mb-lg animate-bounce">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
          </div>
          <h1 className="font-display text-display text-on-surface mb-xs md:text-[48px] text-[32px] leading-tight">Success!</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-[512px] mx-auto">
            Your payment was processed successfully{state?.type === 'vote' ? ' and your vote has been recorded.' : ' and your ticket purchase is complete.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex justify-between items-start mb-lg border-b border-outline-variant pb-md">
              <div>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Order Number</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">{state?.orderNumber || state?.reference || '—'}</p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Date</span>
                <p className="font-body-md text-body-md text-on-surface">
                  {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-lg mb-lg">
              <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <img alt={title} className="w-full h-full object-cover" src="/images/stitch-504f3f574d181f3a.png" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-sm mb-xs">
                  <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded text-[10px] font-bold uppercase tracking-tighter">{state?.type === 'vote' ? 'Voting' : 'Ticket'}</span>
                  <span className="bg-green-100 text-emerald-600 dark:text-emerald-400 px-sm py-xs rounded text-[10px] font-bold uppercase tracking-tighter">{badges}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">{title}</h3>
                <div className="flex items-center gap-xs text-secondary font-body-sm text-body-sm mb-xs">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>{state?.eventDate || 'Date not available'}</span>
                </div>
                <div className="flex items-center gap-xs text-secondary font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span>{state?.eventLocation || 'Location not available'}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-lg p-md">
              <div className="flex justify-between items-center mb-xs">
                <span className="font-body-md text-body-md text-secondary">{summary}</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">GH₵ {(state?.total ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-md">
                <span className="font-body-md text-body-md text-secondary">Payment reference</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">{state?.reference || '—'}</span>
              </div>
              <div className="flex justify-between items-center border-t border-outline-variant pt-md">
                <span className="font-headline-sm text-headline-sm text-on-surface">Total</span>
                <span className="font-headline-sm text-headline-sm text-primary">GH₵ {(state?.total ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-lg">
            <div className="bg-primary text-on-primary rounded-xl p-lg shadow-sm flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-[48px] mb-md">confirmation_number</span>
              <h4 className="font-headline-sm text-headline-sm mb-md">Your ticket is ready</h4>
              <button onClick={() => navigate('/my-tickets')} className="w-full bg-surface text-primary font-label-md text-label-md py-md rounded-lg hover:bg-surface-container-low transition-colors mb-sm flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined">download</span>
                Download Ticket
              </button>
              <button onClick={() => navigate('/dashboard')} className="w-full border border-white/30 text-white font-label-md text-label-md py-md rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined">calendar_add_on</span>
                Add to Calendar
              </button>
            </div>

            <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant">
              <h4 className="font-label-md text-label-md text-on-surface mb-md flex items-center gap-sm uppercase">
                <span className="material-symbols-outlined text-[20px] text-primary">info</span>
                What to expect
              </h4>
              <ul className="space-y-md">
                <li className="flex gap-md">
                  <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center text-[12px] font-bold flex-shrink-0">1</div>
                  <p className="font-body-sm text-body-sm text-secondary">A confirmation email has been sent to your registered address.</p>
                </li>
                <li className="flex gap-md">
                  <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center text-[12px] font-bold flex-shrink-0">2</div>
                  <p className="font-body-sm text-body-sm text-secondary">Present your digital QR code at the entrance for fast-track entry.</p>
                </li>
                <li className="flex gap-md">
                  <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center text-[12px] font-bold flex-shrink-0">3</div>
                  <p className="font-body-sm text-body-sm text-secondary">Check our app for workshop schedules and networking opportunities.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-xxl text-center p-xl border-t border-outline-variant">
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Need any help?</h4>
          <p className="font-body-md text-body-md text-secondary mb-lg">Our support team is available 24/7 to assist with your booking.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-md">
            <Link className="inline-flex items-center justify-center gap-sm px-lg py-md rounded-lg border border-outline text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors" to="mailto:support@eventnic.com">
              <span className="material-symbols-outlined">mail</span>
              Email Support
            </Link>
            <Link className="inline-flex items-center justify-center gap-sm px-lg py-md rounded-lg border border-outline text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors" to="/dashboard">
              <span className="material-symbols-outlined">help</span>
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
