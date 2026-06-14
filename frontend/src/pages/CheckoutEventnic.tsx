// @ts-nocheck
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';

const money = (n) => '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CheckoutEventnic() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { getEvent, recordPurchase } = useEvents();
  const [qty, setQty] = useState(1);

  const event = params.get('event') ? getEvent(params.get('event')) : null;
  const tier = event ? event.ticketTiers.find((t) => t.id === params.get('tier')) : null;

  const unit = tier ? Number(tier.price) : 0;
  const remaining = tier ? Math.max(0, tier.quantity - tier.sold) : 0;
  const subtotal = unit * qty;
  const serviceFee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + serviceFee;

  const completePurchase = () => {
    if (event && tier) recordPurchase(event.id, tier.id, qty);
    navigate('/payment-success');
  };

  return (
    <main className="max-w-container-max mx-auto px-margin pt-[120px] pb-xxl">
      <div className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg mb-md">Checkout</h1>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md">1</div>
            <span className="font-label-md text-primary">Information</span>
          </div>
          <div className="h-[2px] w-12 bg-outline-variant"></div>
          <div className="flex items-center gap-sm opacity-40">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-md">2</div>
            <span className="font-label-md">Payment</span>
          </div>
          <div className="h-[2px] w-12 bg-outline-variant"></div>
          <div className="flex items-center gap-sm opacity-40">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-md">3</div>
            <span className="font-label-md">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xxl items-start">
        <div className="lg:col-span-8 space-y-xl">
          <section className="bg-surface-container-lowest p-xl rounded-xl border border-surface-container-high shadow-sm">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary">person</span>
              <h2 className="font-headline-sm text-headline-sm">Buyer Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="md:col-span-2">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="full-name">Full Name</label>
                <input className="w-full bg-surface px-md py-base border border-outline-variant rounded-lg font-body-md text-body-md transition-all" id="full-name" placeholder="Enter your full name" type="text" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">Email Address</label>
                <input className="w-full bg-surface px-md py-base border border-outline-variant rounded-lg font-body-md text-body-md transition-all" id="email" placeholder="you@example.com" type="email" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="phone">Phone Number</label>
                <input className="w-full bg-surface px-md py-base border border-outline-variant rounded-lg font-body-md text-body-md transition-all" id="phone" placeholder="+1 (555) 000-0000" type="tel" />
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-xl rounded-xl border border-surface-container-high shadow-sm">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary">group</span>
              <h2 className="font-headline-sm text-headline-sm">Attendee Details</h2>
            </div>
            <div className="mb-md">
              <h3 className="font-label-md text-label-md text-primary mb-md">{tier ? `${tier.name}` : 'Ticket'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">First Name</label>
                  <input className="w-full bg-surface px-md py-base border border-outline-variant rounded-lg font-body-md text-body-md transition-all" placeholder="First Name" type="text" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Last Name</label>
                  <input className="w-full bg-surface px-md py-base border border-outline-variant rounded-lg font-body-md text-body-md transition-all" placeholder="Last Name" type="text" />
                </div>
              </div>
            </div>
            <div className="mt-lg p-md bg-secondary-container rounded-lg flex items-center gap-md">
              <span className="material-symbols-outlined text-on-secondary-container">info</span>
              <p className="font-body-sm text-body-sm text-on-secondary-container">Tickets will be sent to the primary email address provided above.</p>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 sticky top-[100px]">
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
            <div className="p-lg bg-surface-container-low border-b border-surface-container-high">
              <h2 className="font-headline-sm text-headline-sm">Order Summary</h2>
            </div>
            <div className="p-lg space-y-md">
              {!event || !tier ? (
                <div className="text-center py-lg">
                  <p className="text-secondary font-body-md mb-md">No ticket selected.</p>
                  <Link to="/explore" className="text-primary font-bold">Browse events</Link>
                </div>
              ) : (
                <>
                  <div className="flex gap-md mb-lg">
                    <div className="w-20 h-20 bg-surface-container-high rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {event.coverImage ? <img alt={event.title} className="w-full h-full object-cover" src={event.coverImage} /> : <span className="material-symbols-outlined text-secondary">image</span>}
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md text-primary leading-tight">{event.title}</h4>
                      <p className="font-body-sm text-body-sm text-secondary mt-xs">{[event.date, event.time].filter(Boolean).join(' • ')}</p>
                      <p className="font-body-sm text-body-sm text-secondary">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-on-surface">{tier.name}</span>
                    <div className="flex items-center gap-sm">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container"><span className="material-symbols-outlined text-[16px]">remove</span></button>
                      <span className="font-bold w-6 text-center">{qty}</span>
                      <button onClick={() => setQty((q) => Math.min(remaining || 1, q + 1))} className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container"><span className="material-symbols-outlined text-[16px]">add</span></button>
                    </div>
                  </div>
                  <p className="font-body-sm text-secondary">{remaining.toLocaleString()} remaining</p>

                  <div className="h-[1px] bg-outline-variant my-md"></div>
                  <div className="space-y-sm">
                    <div className="flex justify-between font-body-md text-body-md"><span className="text-on-surface-variant">Subtotal ({qty}x {money(unit)})</span><span>{money(subtotal)}</span></div>
                    <div className="flex justify-between font-body-md text-body-md"><span className="text-on-surface-variant">Service Fee (5%)</span><span>{money(serviceFee)}</span></div>
                  </div>
                  <div className="h-[1px] bg-outline-variant my-md"></div>
                  <div className="flex justify-between items-center pt-base">
                    <span className="font-headline-sm text-headline-sm">Total</span>
                    <span className="font-headline-md text-headline-md text-primary">{money(total)}</span>
                  </div>
                </>
              )}

              <button onClick={completePurchase} disabled={!event || !tier} className={`w-full py-md rounded-lg font-bold font-body-lg text-body-lg mt-lg shadow-md transition-all flex items-center justify-center gap-md ${!event || !tier ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98]'}`}>
                Complete Purchase
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <p className="p-lg pt-0 text-center font-body-sm text-body-sm text-on-surface-variant">
              By completing your purchase, you agree to Eventnic's <Link className="text-primary underline" to="/terms-of-service">Terms of Service</Link> and <Link className="text-primary underline" to="/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
