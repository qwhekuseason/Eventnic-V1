// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FAQ_ITEMS = [
  { q: 'How do I create an event?', a: 'Click "Create Event" from your dashboard or the homepage. You\'ll be guided through a 4-step process: Basic Info, Tickets, Schedule, and Review. Once published, your event will be live and ready to accept ticket purchases.' },
  { q: 'How do I get paid after my event?', a: 'Eventnic offers next-day payouts. Navigate to Dashboard → Payout Settings to add your bank account or payment method. After your event concludes, funds are automatically transferred within 1 business day.' },
  { q: 'Can I issue refunds to attendees?', a: 'Yes! Go to your Event Dashboard → Attendees, select the orders you want to refund, and click "Issue Refund." You can choose full or partial refunds. Refunds are processed within 5-10 business days.' },
  { q: 'What payment methods do attendees have?', a: 'Attendees can pay using credit/debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and PayPal. We support 135+ currencies for international events.' },
  { q: 'Is there a fee for using Eventnic?', a: 'Eventnic charges 0% setup fees. We take a small service fee per ticket sold (2.5% + $0.99). Free events have no fees at all. Check our Pricing page for detailed plan information.' },
  { q: 'Can I customize my event page?', a: 'Absolutely! You can upload cover images, add detailed descriptions, embed videos, customize your color scheme, and add custom fields to your registration forms.' },
  { q: 'How does check-in work at the event?', a: 'Each ticket generates a unique QR code. Use our free Eventnic Scanner app (iOS & Android) to scan attendees in at the door. You can also use manual check-in from the Attendees page.' },
  { q: 'Can I transfer or sell my ticket?', a: 'If the organizer has enabled ticket transfers, you can transfer your ticket to another person from the My Tickets page. Simply click "Transfer" and enter the recipient\'s email.' },
];

const CATEGORIES = [
  { icon: 'rocket_launch', title: 'Getting Started', desc: 'Account setup, first event, basics', count: 12 },
  { icon: 'confirmation_number', title: 'Tickets & Payments', desc: 'Buying, selling, refunds, payouts', count: 18 },
  { icon: 'event', title: 'Event Management', desc: 'Creating, editing, publishing events', count: 15 },
  { icon: 'qr_code_scanner', title: 'Check-In & Scanning', desc: 'QR codes, scanner app, manual check-in', count: 8 },
  { icon: 'bar_chart', title: 'Analytics & Reports', desc: 'Dashboards, exports, insights', count: 10 },
  { icon: 'security', title: 'Account & Security', desc: 'Login, 2FA, privacy, data', count: 7 },
];

export default function HelpCenterEventnic() {
  const navigate = useNavigate();

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative pt-[160px] pb-[80px] overflow-hidden bg-gradient-dark">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] left-[30%] w-[600px] h-[600px] rounded-full bg-tertiary/15 blur-[120px]" />
          <div className="absolute bottom-[-20%] -right-[5%] w-[400px] h-[400px] rounded-full bg-primary/25 blur-[100px]" />
        </div>
        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-[48px] md:text-[64px] leading-[1.1] text-white tracking-tight mb-md">
              Help <span className="text-tertiary">Center</span>
            </h1>
            <p className="font-body-lg text-[18px] text-white/70 max-w-[512px] mx-auto mb-xl">
              Find answers, learn best practices, and get support.
            </p>
            <div className="glass-panel-dark max-w-[576px] mx-auto rounded-full p-2 flex items-center shadow-2xl">
              <span className="material-symbols-outlined text-white/50 ml-md mr-sm">search</span>
              <input type="text" placeholder="Search for help articles..." className="flex-grow bg-transparent border-none outline-none text-white placeholder-white/50 font-body-md" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-xxl">
        <div className="max-w-container-max mx-auto px-margin">
          <h2 className="font-display text-[32px] text-on-surface mb-xl text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-[20px] p-xl border border-outline-variant shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white">{cat.icon}</span>
                </div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs">{cat.title}</h3>
                <p className="text-secondary font-body-sm mb-md">{cat.desc}</p>
                <span className="text-primary font-label-sm">{cat.count} articles →</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-xxl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="text-center mb-xxl">
            <h2 className="font-display text-[32px] text-on-surface mb-md">Frequently Asked Questions</h2>
            <p className="text-secondary font-body-lg max-w-[576px] mx-auto">Quick answers to the most common questions.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-md">
            {FAQ_ITEMS.map((item, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-white rounded-[16px] border border-outline-variant shadow-sm group"
              >
                <summary className="flex items-center justify-between p-lg cursor-pointer font-label-md text-on-surface list-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-lg">{item.q}</span>
                  <span className="material-symbols-outlined text-primary flex-shrink-0 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-lg pb-lg text-secondary font-body-md border-t border-outline-variant pt-md">
                  {item.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-[80px] px-margin">
        <div className="max-w-container-max mx-auto rounded-[32px] bg-gradient-dark p-xl md:p-[60px] text-center relative overflow-hidden">
          <div className="absolute -top-[50%] -left-[10%] w-[400px] h-[400px] rounded-full bg-primary/30 blur-[80px]" />
          <div className="absolute -bottom-[50%] -right-[10%] w-[400px] h-[400px] rounded-full bg-tertiary/20 blur-[80px]" />
          <div className="relative z-10">
            <h2 className="font-display text-[32px] text-white mb-md">Still need help?</h2>
            <p className="text-white/80 font-body-lg mb-xl max-w-[448px] mx-auto">Our support team is available 24/7. Reach out and we'll get back to you in no time.</p>
            <Link to="/contact" className="inline-block bg-white text-primary font-bold font-headline-sm px-[32px] py-[14px] rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
