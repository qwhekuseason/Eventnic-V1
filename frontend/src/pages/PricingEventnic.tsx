import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PricingEventnic() {
  return (
    <div className="min-h-screen bg-background pt-[120px] pb-xxl">
      <div className="max-w-container-max mx-auto px-margin">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-xxl"
        >
          <h1 className="font-display text-[48px] md:text-[64px] leading-[1.1] text-on-surface tracking-tight mb-md">
            Simple, Transparent Pricing
          </h1>
          <p className="font-body-lg text-[18px] text-secondary">
            Free for free events. For paid events, pay a small transparent fee. Most importantly, enjoy <span className="text-primary font-bold">Instant Withdrawals</span>. You get paid right away, instead of waiting weeks after your event concludes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl max-w-4xl mx-auto">
          <div className="bg-surface border border-outline-variant rounded-[32px] p-xl flex flex-col h-full">
            <h3 className="font-headline-sm text-on-surface mb-sm">Free Events</h3>
            <div className="text-[48px] font-display text-on-surface mb-lg">GH₵ 0</div>
            <ul className="space-y-sm text-secondary font-body-md mb-xl flex-grow">
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Unlimited Free Tickets</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Basic Analytics</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Event Page Setup</li>
            </ul>
            <Link to="/signup" className="w-full py-3 rounded-full bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container-highest transition-colors text-center">Get Started Free</Link>
          </div>

          <div className="bg-surface border-2 border-primary rounded-[32px] p-xl flex flex-col h-full relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-on-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</div>
            <h3 className="font-headline-sm text-on-surface mb-sm">Paid Events</h3>
            <div className="text-[48px] font-display text-on-surface mb-lg">5% <span className="text-lg text-secondary">+ GH₵ 2</span></div>
            <ul className="space-y-sm text-secondary font-body-md mb-xl flex-grow">
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-[20px]">check</span> <strong className="text-on-surface">Instant Withdrawals</strong></li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Seamless Ticketing &amp; Check-in</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Advanced Analytics &amp; Exports</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Email Broadcasts</li>
            </ul>
            <Link to="/signup" className="w-full py-3 rounded-full bg-primary text-on-primary font-semibold hover:brightness-110 transition-all text-center">Start Selling</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
