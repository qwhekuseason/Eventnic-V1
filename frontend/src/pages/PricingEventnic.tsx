// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PricingEventnic() {
  const navigate = useNavigate();

  return (
    <main className="bg-background min-h-screen pt-[140px] pb-xxl px-margin">
      <div className="max-w-container-max mx-auto relative z-10">
        <section className="text-center mb-[80px]">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-[48px] md:text-[64px] mb-md text-on-surface">Transparent <span className="text-tertiary bg-clip-text text-transparent bg-gradient-premium">Pricing</span></h1>
            <p className="font-body-lg text-[20px] text-secondary max-w-2xl mx-auto">
              From local meetups to global conferences, Eventnic scales with your needs. Start free, upgrade when you're ready.
            </p>
          </motion.div>
        </section>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl relative"
        >
          {/* Starter Plan */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-[32px] p-xl flex flex-col shadow-lg border border-outline-variant hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="mb-lg">
              <span className="inline-block px-sm py-xs bg-surface-container-high rounded-full text-secondary font-label-sm uppercase tracking-widest mb-md">Starter</span>
              <h2 className="font-display text-[40px] text-on-surface mb-sm">Free</h2>
              <p className="text-secondary font-body-md h-[48px]">Perfect for free events and small community gatherings.</p>
            </div>
            <ul className="space-y-md mb-xl flex-grow font-body-md text-on-surface-variant">
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> Unlimited Free Tickets
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> Basic Analytics
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> Email Support
              </li>
            </ul>
            <button onClick={() => navigate('/create-event/basic-info')} className="w-full py-[16px] border border-outline text-on-surface font-headline-sm rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">Get Started</button>
          </motion.div>

          {/* Pro Plan (Highlighted) */}
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1.05 } }} className="bg-gradient-dark rounded-[32px] p-xl flex flex-col shadow-2xl relative overflow-hidden z-10 md:scale-105 border border-tertiary/20">
            <div className="absolute top-0 right-0 p-lg opacity-10">
              <span className="material-symbols-outlined text-[120px] text-tertiary" data-icon="auto_awesome">auto_awesome</span>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-premium rounded-b-full"></div>
            
            <div className="mb-lg relative z-10">
              <span className="inline-block px-sm py-xs glass-panel text-tertiary font-label-sm uppercase tracking-widest mb-md border-tertiary/30">Most Popular</span>
              <h2 className="font-display text-[40px] text-white mb-sm">$49<span className="text-[20px] text-white/60">/mo</span></h2>
              <p className="text-white/80 font-body-md h-[48px]">For professional organizers hosting paid events.</p>
            </div>
            <ul className="space-y-md mb-xl flex-grow font-body-md text-white/90 relative z-10">
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-tertiary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> 1.5% + $0.50 per ticket
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-tertiary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> Advanced Analytics Dashboard
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-tertiary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> Priority 24/7 Support
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-tertiary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> Custom Branding
              </li>
            </ul>
            <button onClick={() => navigate('/checkout')} className="w-full py-[16px] bg-gradient-premium text-white font-headline-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10">Select Pro</button>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-[32px] p-xl flex flex-col shadow-lg border border-outline-variant hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="mb-lg">
              <span className="inline-block px-sm py-xs bg-surface-container-high rounded-full text-secondary font-label-sm uppercase tracking-widest mb-md">Enterprise</span>
              <h2 className="font-display text-[40px] text-on-surface mb-sm">Custom</h2>
              <p className="text-secondary font-body-md h-[48px]">For high-volume organizers and global agencies.</p>
            </div>
            <ul className="space-y-md mb-xl flex-grow font-body-md text-on-surface-variant">
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> Custom Ticket Fees
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> Dedicated Account Manager
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary mt-xs" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> API Access & Webhooks
              </li>
            </ul>
            <button onClick={() => navigate('/contact')} className="w-full py-[16px] border border-outline text-on-surface font-headline-sm rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">Contact Sales</button>
          </motion.div>
        </motion.div>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto py-xxl">
          <h2 className="font-display text-[40px] text-center mb-xl text-on-surface">Frequently Asked Questions</h2>
          <div className="space-y-md">
            <div className="bg-white border border-outline-variant rounded-xl p-lg cursor-pointer hover:border-primary hover:shadow-md transition-all group">
              <div className="flex justify-between items-center" onClick={(e) => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}>
                <h3 className="font-headline-sm text-on-surface">Are there any hidden monthly fees?</h3>
                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">expand_more</span>
              </div>
              <div className="hidden mt-md font-body-md text-secondary">
                No. We only charge when you sell a paid ticket. For free events, our platform is completely free to use with all standard features.
              </div>
            </div>
            <div className="bg-white border border-outline-variant rounded-xl p-lg cursor-pointer hover:border-primary hover:shadow-md transition-all group">
              <div className="flex justify-between items-center" onClick={(e) => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}>
                <h3 className="font-headline-sm text-on-surface">When do I get paid for ticket sales?</h3>
                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">expand_more</span>
              </div>
              <div className="hidden mt-md font-body-md text-secondary">
                Payouts are processed 3-5 business days after your event concludes. Enterprise customers can request weekly or monthly disbursement schedules.
              </div>
            </div>
            <div className="bg-white border border-outline-variant rounded-xl p-lg cursor-pointer hover:border-primary hover:shadow-md transition-all group">
              <div className="flex justify-between items-center" onClick={(e) => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}>
                <h3 className="font-headline-sm text-on-surface">Can I pass the fees on to my buyers?</h3>
                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">expand_more</span>
              </div>
              <div className="hidden mt-md font-body-md text-secondary">
                Yes! You have the option to absorb the fees or pass them directly to your attendees at checkout. This can be configured per event.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
