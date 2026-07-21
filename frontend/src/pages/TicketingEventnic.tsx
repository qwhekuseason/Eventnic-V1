import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TicketingEventnic() {
  return (
    <div className="min-h-screen bg-background pt-[120px] pb-xxl">
      <div className="max-w-container-max mx-auto px-margin">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-xxl"
        >
          <h1 className="font-display text-[48px] md:text-[64px] leading-[1.1] text-on-surface tracking-tight mb-md">
            Seamless Ticketing for Modern Events
          </h1>
          <p className="font-body-lg text-[18px] text-secondary mb-lg">
            Create, manage, and sell tickets with zero friction. From launch to check-in, Eventnic handles the heavy lifting so you can focus on the experience.
          </p>
          <div className="flex justify-center gap-sm">
            <Link to="/signup" className="px-6 py-3 rounded-full bg-primary text-on-primary font-semibold hover:brightness-110 transition-all">Start Selling Tickets</Link>
            <Link to="/contact" className="px-6 py-3 rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors">Contact Sales</Link>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg max-w-5xl mx-auto">
          <div className="bg-surface border border-outline-variant p-xl rounded-[24px]">
            <span className="material-symbols-outlined text-primary text-[32px] mb-md">speed</span>
            <h3 className="font-headline-sm text-on-surface mb-sm">Quick Setup</h3>
            <p className="text-secondary font-body-sm">Launch your event page and start selling tickets in under 5 minutes with our intuitive builder.</p>
          </div>
          <div className="bg-surface border border-outline-variant p-xl rounded-[24px]">
            <span className="material-symbols-outlined text-primary text-[32px] mb-md">qr_code_scanner</span>
            <h3 className="font-headline-sm text-on-surface mb-sm">Fast Check-in</h3>
            <p className="text-secondary font-body-sm">Scan QR codes securely and quickly at the door using our built-in organizer scanner app.</p>
          </div>
          <div className="bg-surface border border-outline-variant p-xl rounded-[24px]">
            <span className="material-symbols-outlined text-primary text-[32px] mb-md">payments</span>
            <h3 className="font-headline-sm text-on-surface mb-sm">Instant Payouts</h3>
            <p className="text-secondary font-body-sm">Don't wait for your funds. Access your revenue immediately with our instant withdrawal system.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
