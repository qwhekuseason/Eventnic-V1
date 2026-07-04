import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../config/firebase';

export default function PublicNomineeVotingPage() {
  const { slug, categoryId, nomineeId } = useParams();
  const { getEvent, castVote } = useEvents();

  const event = getEvent(slug || '');
  const category = event?.votingCategories?.find(c => c.id === categoryId);
  const nominee = category?.nominees.find(n => n.id === nomineeId);

  const [platformSettings, setPlatformSettings] = useState({ deductionFeePercent: 5, baseVotePrice: 0 });
  const db = getFirestore(app);

  const [qty, setQty] = useState(1);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'momo' | ''>('');

  useEffect(() => {
    const loadScript = () => {
      // @ts-ignore
      if (window.PaystackPop) return;
      if (document.getElementById('paystack-js')) return;
      const script = document.createElement('script');
      script.id = 'paystack-js';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    };

    const fetchSettings = async () => {
      try {
        const docRef = await getDoc(doc(db, 'platformSettings', 'finance'));
        if (docRef.exists()) {
          setPlatformSettings({
            deductionFeePercent: Number(docRef.data().deductionFeePercent) || 5,
            baseVotePrice: Number(docRef.data().baseVotePrice) || 0,
          });
        }
      } catch (err) {}
    };

    loadScript();
    fetchSettings();
  }, [db]);

  if (!event || !category || !nominee) {
    return (
      <main className="pt-[140px] pb-xxl max-w-container-max mx-auto px-margin text-center min-h-[60vh]">
        <h1 className="font-headline-lg text-on-surface mb-sm">Nominee Not Found</h1>
        <Link to={`/event/${slug}/vote`} className="bg-primary text-on-primary px-lg py-md rounded-lg font-bold">Back to Voting</Link>
      </main>
    );
  }

  const totalCategoryVotes = category.nominees.reduce((sum, n) => sum + n.votes, 0);
  const share = totalCategoryVotes > 0 ? Math.round((nominee.votes / totalCategoryVotes) * 100) : 0;
  
  const votePrice = event.votePrice || 0;
  const subtotal = votePrice * qty;
  const serviceFee = Math.round(subtotal * (platformSettings.deductionFeePercent / 100) * 100) / 100;
  const total = subtotal + serviceFee;

  const processPayment = () => {
    if (!buyerEmail) {
      alert("Email is required to process payment.");
      return;
    }
    setShowCheckoutModal(true);
  };

  const confirmPayment = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method.');
      return;
    }

    const paystack = (window as any).PaystackPop;
    if (!paystack) {
      alert('Paystack is not available. Please try again later.');
      return;
    }

    setProcessing(true);
    const reference = `vote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const handler = paystack.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxx',
      email: buyerEmail,
      amount: Math.round(total * 100),
      currency: 'GHS',
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      ref: reference,
      metadata: {
        event_id: event.id,
        event_title: event.title,
        category_id: category.id,
        category_name: category.name,
        nominee_id: nominee.id,
        nominee_name: nominee.name,
        selected_method: selectedMethod,
      },
      callback() {
        (async () => {
          try {
            const success = await castVote(event.id, category.id, nominee.id, qty);
            if (!success) throw new Error('Unable to record vote after payment.');
            setProcessing(false);
            setShowCheckoutModal(false);
            setPaymentSuccess(true);
          } catch (err) {
            console.error('Vote recording failed:', err);
            alert('Payment was successful, but recording your vote failed. Please contact support.');
            setProcessing(false);
            setShowCheckoutModal(false);
          }
        })();
      },
      onClose() {
        setProcessing(false);
        setShowCheckoutModal(false);
      },
    });

    handler.openIframe();
  };

  return (
    <main className="min-h-screen bg-background pt-[120px] pb-xxl px-margin">
      <div className="max-w-[1024px] mx-auto">
        <Link to={`/event/${event.slug}/vote`} className="inline-flex items-center gap-xs text-primary font-label-md hover:underline mb-xl">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to all nominees
        </Link>

        {paymentSuccess ? (
          <div className="bg-surface-container-lowest border border-outline-variant p-xxl rounded-3xl shadow-xl text-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-[48px] text-emerald-500">task_alt</span>
            </div>
            <h1 className="font-display text-[40px] text-on-surface mb-sm">Vote Recorded!</h1>
            <p className="text-secondary font-body-lg mb-xl max-w-md mx-auto">
              Thank you for supporting <strong>{nominee.name}</strong>! Your vote has been successfully cast.
            </p>
            <Link to={`/event/${event.slug}/vote`} className="bg-primary text-on-primary px-xl py-md rounded-full font-bold shadow-md hover:shadow-lg transition-all">
              Return to Voting Page
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xxl items-start">
            
            {/* Left Side: Nominee Info */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-xl shadow-sm">
              <div className="w-48 h-48 rounded-full mx-auto overflow-hidden bg-surface-container-high border-4 border-surface shadow-md mb-lg flex items-center justify-center">
                {nominee.imageUrl ? (
                  <img src={nominee.imageUrl} alt={nominee.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[64px] text-secondary">person</span>
                )}
              </div>
              
              <div className="text-center">
                <h1 className="font-display text-[32px] text-on-surface mb-xs">{nominee.name}</h1>
                <p className="text-primary font-label-md uppercase tracking-wider mb-lg">{category.name}</p>
                <div className="bg-surface-container text-secondary text-sm font-bold uppercase px-md py-xs rounded inline-block mb-lg">
                  VOTING CODE: <span className="text-primary text-lg">{nominee.id.slice(0, 4).toUpperCase()}</span>
                </div>
                {nominee.description && (
                  <p className="text-secondary font-body-md mb-xl leading-relaxed text-left">
                    {nominee.description}
                  </p>
                )}

                <div className="bg-surface-variant p-lg rounded-2xl text-left">
                  <div className="flex justify-between text-label-md mb-sm">
                    <span className="text-on-surface font-bold">{nominee.votes.toLocaleString()} Total Votes</span>
                    <span className="text-primary">{share}% of category</span>
                  </div>
                  <div className="w-full bg-outline-variant h-3 rounded-full overflow-hidden">
                    <div className="bg-primary h-3 rounded-full transition-all duration-1000" style={{ width: `${share}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Voting/Checkout Form */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-xl shadow-lg sticky top-[120px]">
              <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px] text-primary">how_to_vote</span>
                </div>
                <div>
                  <h2 className="font-headline-sm font-bold text-on-surface">Cast Your Vote</h2>
                  <p className="text-secondary text-sm">GH₵ {votePrice} per vote</p>
                </div>
              </div>

              <div className="space-y-xl">
                  {/* Quantity Selector */}
                  <div>
                    <label className="block font-label-md text-secondary mb-sm">Number of Votes</label>
                    <div className="flex items-center border-2 border-outline-variant rounded-xl overflow-hidden w-full max-w-[200px]">
                      <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 py-sm bg-surface hover:bg-surface-variant transition-colors text-xl font-bold">-</button>
                      <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center py-sm text-lg font-bold bg-transparent outline-none border-x-2 border-outline-variant" />
                      <button type="button" onClick={() => setQty(qty + 1)} className="flex-1 py-sm bg-surface hover:bg-surface-variant transition-colors text-xl font-bold">+</button>
                    </div>
                  </div>

                  {/* Email Input */}
                      <div className="space-y-md">
                        <div>
                          <label className="block font-label-sm text-secondary mb-xs">Email Address *</label>
                          <input type="email" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} required placeholder="you@example.com" className="w-full bg-surface border border-outline-variant rounded-lg px-md py-md text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-md">
                          <div>
                            <label className="block font-label-sm text-secondary mb-xs">Full Name (Optional)</label>
                            <input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="John Doe" className="w-full bg-surface border border-outline-variant rounded-lg px-md py-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                          </div>
                          <div>
                            <label className="block font-label-sm text-secondary mb-xs">Phone (Optional)</label>
                            <input type="tel" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} placeholder="055 000 0000" className="w-full bg-surface border border-outline-variant rounded-lg px-md py-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                          </div>
                        </div>
                      </div>

                      {/* Calculation Box */}
                      <div className="bg-surface-variant rounded-2xl p-lg border border-outline-variant">
                        <h4 className="font-label-sm text-secondary mb-md uppercase tracking-wider">Order Summary</h4>
                        <div className="space-y-sm mb-md">
                          <div className="flex justify-between text-on-surface">
                            <span>{qty} Vote{qty > 1 ? 's' : ''} × GH₵ {votePrice.toFixed(2)}</span>
                            <span className="font-medium">GH₵ {subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-secondary text-sm">
                            <span>Processing Fee ({platformSettings.deductionFeePercent}%)</span>
                            <span>GH₵ {serviceFee.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end border-t border-outline pt-md">
                          <span className="font-bold text-on-surface text-lg">Total Amount</span>
                          <span className="font-display text-[28px] text-primary leading-none">GH₵ {total.toFixed(2)}</span>
                        </div>
                      </div>

                  <button 
                    onClick={processPayment} 
                    className="w-full bg-primary text-on-primary py-lg rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-sm"
                  >
                    <span className="material-symbols-outlined text-[24px]">lock</span>
                    Pay Securely with Paystack
                  </button>
                    <p className="text-center text-xs text-secondary mt-sm flex items-center justify-center gap-xs">
                      <span className="material-symbols-outlined text-[14px]">verified_user</span> Payments are securely processed.
                    </p>
                </div>
              </div>
            
          </div>
        )}
      </div>
      {/* Paystack Checkout Modal Template */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-margin">
          <div className="bg-white dark:bg-[#1a1a2e] w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden">
            {/* Paystack-style Header */}
            <div className="bg-[#0A1F44] p-lg flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 bg-[#00C3F7]/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00C3F7] text-[20px]">lock</span>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Pay</p>
                  <p className="text-white font-bold text-lg">GH₵ {total.toFixed(2)}</p>
                </div>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="text-white/50 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-lg space-y-lg">
              {/* Email display */}
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-md">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-xs">Email</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{buyerEmail}</p>
              </div>

              {/* Payment Methods */}
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-md">Select Payment Method</p>
                <div className="space-y-sm">
                  <button
                    onClick={() => setSelectedMethod('card')}
                    className={`w-full flex items-center gap-md p-md rounded-xl border-2 transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[#00C3F7] bg-[#00C3F7]/5'
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedMethod === 'card' ? 'bg-[#00C3F7]/10' : 'bg-gray-100 dark:bg-white/5'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]" style={{ color: selectedMethod === 'card' ? '#00C3F7' : '#888' }}>credit_card</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Card Payment</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Visa, Mastercard, Verve</p>
                    </div>
                    {selectedMethod === 'card' && (
                      <span className="material-symbols-outlined text-[#00C3F7] ml-auto">check_circle</span>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedMethod('momo')}
                    className={`w-full flex items-center gap-md p-md rounded-xl border-2 transition-all ${
                      selectedMethod === 'momo'
                        ? 'border-[#FFCB05] bg-[#FFCB05]/5'
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedMethod === 'momo' ? 'bg-[#FFCB05]/10' : 'bg-gray-100 dark:bg-white/5'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]" style={{ color: selectedMethod === 'momo' ? '#FFCB05' : '#888' }}>smartphone</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Mobile Money</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">MTN MoMo, Vodafone Cash, AirtelTigo</p>
                    </div>
                    {selectedMethod === 'momo' && (
                      <span className="material-symbols-outlined text-[#FFCB05] ml-auto">check_circle</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Card Details (shown when card is selected) */}
              {selectedMethod === 'card' && (
                <div className="space-y-md">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-xs">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-md py-sm text-sm font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-xs">Expiry</label>
                      <input type="text" placeholder="MM / YY" maxLength={7} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-md py-sm text-sm font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-xs">CVV</label>
                      <input type="text" placeholder="123" maxLength={4} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-md py-sm text-sm font-mono" />
                    </div>
                  </div>
                </div>
              )}

              {/* MoMo Details (shown when momo is selected) */}
              {selectedMethod === 'momo' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-xs">Mobile Money Number</label>
                  <input type="tel" placeholder="024 000 0000" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-md py-sm text-sm" />
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={confirmPayment}
                disabled={!selectedMethod || processing}
                className={`w-full py-md rounded-xl font-bold text-base transition-all flex items-center justify-center gap-sm ${
                  !selectedMethod || processing
                    ? 'bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-[#0A1F44] text-white hover:bg-[#0d2a5c] shadow-lg hover:shadow-xl'
                }`}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    Pay GH₵ {total.toFixed(2)}
                  </>
                )}
              </button>

              {/* Footer */}
              <div className="flex items-center justify-center gap-xs pt-sm border-t border-gray-100 dark:border-white/5">
                <span className="material-symbols-outlined text-[14px] text-gray-400">verified_user</span>
                <p className="text-[11px] text-gray-400">Secured by <strong>Paystack</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
