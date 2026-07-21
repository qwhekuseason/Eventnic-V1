// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../config/firebase';
import { generateReference } from '../config/api';

const money = (n) => 'GH₵ ' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CheckoutEventnic() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { getEvent, recordPurchase, castVote } = useEvents();
  
  const type = params.get('type') || 'ticket';
  const isVote = type === 'vote';
  const categoryId = params.get('category');
  const nomineeId = params.get('nominee');

  const [qty, setQty] = useState(Number(params.get('qty')) || 1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [attendeeNames, setAttendeeNames] = useState<string[]>(['']);

  // Keep attendeeNames length in sync with qty
  useEffect(() => {
    setAttendeeNames((prev) => {
      if (prev.length === qty) return prev;
      const newNames = [...prev];
      if (newNames.length < qty) {
        while (newNames.length < qty) newNames.push('');
      } else {
        newNames.length = qty;
      }
      return newNames;
    });
  }, [qty]);

  const event = params.get('event') ? getEvent(params.get('event')) : null;
  const tier = !isVote && event ? event.ticketTiers.find((t) => t.id === params.get('tier')) : null;
  const category = isVote && event ? event.votingCategories?.find(c => c.id === categoryId) : null;
  const nominee = category ? category.nominees.find(n => n.id === nomineeId) : null;

  const [platformSettings, setPlatformSettings] = useState({ deductionFeePercent: 5, baseVotePrice: 0 });
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [paystackError, setPaystackError] = useState('');
  const db = getFirestore(app);

  const unit = isVote ? (event ? event.votePrice : 0) : (tier ? Number(tier.price) : 0);
  const remaining = isVote ? Infinity : (tier ? Math.max(0, tier.quantity - tier.sold) : 0);
  const subtotal = unit * qty;
  const serviceFee = Math.round(subtotal * (platformSettings.deductionFeePercent / 100) * 100) / 100;
  const total = subtotal + serviceFee;

  useEffect(() => {
    const loadScript = () => {
      if (window.PaystackPop) {
        setPaystackLoaded(true);
        return;
      }
      if (document.getElementById('paystack-js')) {
        return;
      }
      const script = document.createElement('script');
      script.id = 'paystack-js';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => setPaystackLoaded(true);
      script.onerror = () => setPaystackError('Unable to load Paystack checkout script.');
      document.body.appendChild(script);
    };

    const fetchSettings = async () => {
      try {
        const financeDoc = await getDoc(doc(db, 'platformSettings', 'finance'));
        if (financeDoc.exists()) {
          const data = financeDoc.data();
          setPlatformSettings({
            deductionFeePercent: Number(data.deductionFeePercent) || 5,
            baseVotePrice: Number(data.baseVotePrice) || 0,
          });
        }
      } catch (error) {
        console.error('Failed to load platform settings:', error);
      }
    };

    loadScript();
    fetchSettings();
  }, []);

  const completePurchase = async () => {
    if (isVote) {
      if (event && categoryId && nomineeId) {
        await castVote(event.id, categoryId, nomineeId, qty);
        navigate('/payment-success', {
          state: {
            type: 'vote',
            eventTitle: event.title,
            categoryName: category?.name,
            nomineeName: nominee?.name,
            quantity: qty,
            total,
            reference: `FREE-${Date.now()}`,
            eventDate: event.date,
            eventLocation: event.location,
          },
        });
      }
    } else {
      if (event && tier) {
        await recordPurchase(event.id, tier.id, qty, attendeeNames);
        navigate('/payment-success', {
          state: {
            type: 'ticket',
            orderNumber: `TCK-${Date.now().toString().slice(-6)}`,
            eventTitle: event.title,
            tierName: tier.name,
            quantity: qty,
            total,
            reference: `FREE-${Date.now()}`,
            eventDate: event.date,
            eventLocation: event.location,
          },
        });
      }
    }
  };

  const payWithPaystack = async () => {
    if (isVote && (!event || !nominee)) return;
    if (!isVote && (!event || !tier)) return;
    if (!window.PaystackPop) {
      setPaystackError('Paystack is not available. Please try again later.');
      return;
    }

    const email = buyerEmail || 'guest@eventnic.com';
    const reference = generateReference('eventnic');
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxx',
      email,
      amount: Math.round(total * 100),
      currency: 'GHS',
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      ref: reference,
      metadata: {
        event_id: event?.id,
        event_title: event?.title,
        type: isVote ? 'vote' : 'ticket',
        ...(isVote
          ? {
              category_id: categoryId,
              category_name: category?.name,
              nominee_id: nomineeId,
              nominee_name: nominee?.name,
            }
          : {
              tier_id: tier?.id,
              tier_name: tier?.name,
            }),
      },
      callback(response: any) {
        (async () => {
          try {
            if (isVote) {
              const success = await castVote(event!.id, categoryId!, nomineeId!, qty);
              if (!success) throw new Error('Unable to record vote after payment.');
              navigate('/payment-success', {
                state: {
                  type: 'vote',
                  eventTitle: event!.title,
                  categoryName: category?.name,
                  nomineeName: nominee?.name,
                  quantity: qty,
                  total,
                  reference: response.reference,
                  eventDate: event!.date,
                  eventLocation: event!.location,
                },
              });
            } else {
              await recordPurchase(event!.id, tier!.id, qty, attendeeNames);
              navigate('/payment-success', {
                state: {
                  type: 'ticket',
                  orderNumber: `TCK-${reference.slice(-6)}`,
                  eventTitle: event!.title,
                  tierName: tier!.name,
                  quantity: qty,
                  total,
                  reference: response.reference,
                  eventDate: event!.date,
                  eventLocation: event!.location,
                },
              });
            }
          } catch (err) {
            console.error('Post-payment action failed:', err);
            setPaystackError('Payment succeeded but finalizing the order failed. Please contact support.');
            navigate('/payment-failed');
          }
        })();
      },
      onClose() {
        setPaystackError('Payment cancelled.');
      },
    });

    handler.openIframe();
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
                <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full bg-surface px-md py-base border border-outline-variant rounded-lg font-body-md text-body-md transition-all" id="full-name" placeholder="Enter your full name" type="text" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">Email Address</label>
                <input value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className="w-full bg-surface px-md py-base border border-outline-variant rounded-lg font-body-md text-body-md transition-all" id="email" placeholder="you@example.com" type="email" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="phone">Phone Number</label>
                <input value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className="w-full bg-surface px-md py-base border border-outline-variant rounded-lg font-body-md text-body-md transition-all" id="phone" placeholder="+1 (555) 000-0000" type="tel" />
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-xl rounded-xl border border-surface-container-high shadow-sm">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary">{isVote ? 'how_to_vote' : 'group'}</span>
              <h2 className="font-headline-sm text-headline-sm">{isVote ? 'Voting Details' : 'Attendee Details'}</h2>
            </div>
            <div className="mb-md">
              <h3 className="font-label-md text-label-md text-primary mb-md">
                {isVote ? `Vote for ${nominee?.name}` : (tier ? `${tier.name} ${tier.admitsCount ? `(Admits ${tier.admitsCount} ${(tier.admitsCount === 1 ? 'person' : 'people')}/ticket)` : ''}` : 'Ticket')}
              </h3>
              {!isVote && (
                <div className="space-y-md">
                  {Array.from({ length: qty }).map((_, i) => (
                    <div key={i} className="bg-surface p-md rounded-lg border border-outline-variant">
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">
                        Attendee {i + 1} Full Name
                      </label>
                      <input 
                        value={attendeeNames[i] || ''}
                        onChange={(e) => {
                          const newNames = [...attendeeNames];
                          newNames[i] = e.target.value;
                          setAttendeeNames(newNames);
                        }}
                        className="w-full bg-surface px-md py-base border border-outline-variant rounded-lg font-body-md text-body-md transition-all" 
                        placeholder={`Name for Ticket ${i + 1}`} 
                        type="text" 
                        required
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-lg p-md bg-secondary-container rounded-lg flex items-center gap-md">
              <span className="material-symbols-outlined text-on-secondary-container">info</span>
              <p className="font-body-sm text-body-sm text-on-secondary-container">{isVote ? 'A confirmation email will be sent to the address provided above.' : 'Tickets will be sent to the primary email address provided above.'}</p>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 sticky top-[100px]">
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
            <div className="p-lg bg-surface-container-low border-b border-surface-container-high">
              <h2 className="font-headline-sm text-headline-sm">Order Summary</h2>
            </div>
            <div className="p-lg space-y-md">
              {!event || (!isVote && !tier) || (isVote && !nominee) ? (
                <div className="text-center py-lg">
                  <p className="text-secondary font-body-md mb-md">No item selected.</p>
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
                    <span className="font-label-md text-on-surface">{isVote ? `Vote: ${nominee.name}` : tier?.name}</span>
                    <div className="flex items-center gap-sm">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container"><span className="material-symbols-outlined text-[16px]">remove</span></button>
                      <span className="font-bold w-6 text-center">{qty}</span>
                      <button onClick={() => setQty((q) => Math.min(remaining || 1, q + 1))} className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container"><span className="material-symbols-outlined text-[16px]">add</span></button>
                    </div>
                  </div>
                  {!isVote && <p className="font-body-sm text-secondary">{remaining.toLocaleString()} remaining</p>}

                  <div className="h-[1px] bg-outline-variant my-md"></div>
                  <div className="space-y-sm">
                    <div className="flex justify-between font-body-md text-body-md"><span className="text-on-surface-variant">Subtotal ({qty}x {money(unit)})</span><span>{money(subtotal)}</span></div>
                    <div className="flex justify-between font-body-md text-body-md"><span className="text-on-surface-variant">Service Fee ({platformSettings.deductionFeePercent}%)</span><span>{money(serviceFee)}</span></div>
                  </div>
                  <div className="h-[1px] bg-outline-variant my-md"></div>
                  <div className="flex justify-between items-center pt-base">
                    <span className="font-headline-sm text-headline-sm">Total</span>
                    <span className="font-headline-md text-headline-md text-primary">{money(total)}</span>
                  </div>
                </>
              )}

              {paystackError && <div className="text-error text-sm mt-md">{paystackError}</div>}
              
              {!buyerName || !buyerEmail || (!isVote && attendeeNames.some(n => !n.trim())) ? (
                 <div className="text-secondary text-sm mt-md text-center">Please fill out all required name and email fields.</div>
              ) : null}

              {total > 0 && (
                <button onClick={payWithPaystack} disabled={(!event || (!isVote && !tier) || (isVote && !nominee)) || !paystackLoaded || !buyerName || !buyerEmail || (!isVote && attendeeNames.some(n => !n.trim()))} className="btn-secondary w-full py-md mt-lg">
                  Pay with Paystack (Card / USSD)
                  <span className="material-symbols-outlined">payment</span>
                </button>
              )}
              {total === 0 && (
                <button onClick={completePurchase} disabled={(!event || (!isVote && !tier) || (isVote && !nominee)) || !buyerName || !buyerEmail || (!isVote && attendeeNames.some(n => !n.trim()))} className="btn-primary w-full py-md mt-md">
                  Complete {isVote ? 'Vote' : 'Purchase'} (Free)
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              )}
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
