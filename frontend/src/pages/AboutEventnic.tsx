// @ts-nocheck
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';

const TEAM = [
  { name: 'Sarah Chen', role: 'CEO & Co-Founder', img: '/images/stitch-9bf3cc8257fe8d98.png' },
  { name: 'Marcus Johnson', role: 'CTO', img: '/images/stitch-14c25d263c930b45.png' },
  { name: 'Priya Patel', role: 'VP of Product', img: '/images/stitch-d87c03b4f4503fee.png' },
];

const STATS = [
  { value: '50K+', label: 'Events Hosted' },
  { value: '12M+', label: 'Tickets Sold' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '140+', label: 'Countries' },
];

export default function AboutEventnic() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative pt-[160px] pb-[100px] overflow-hidden hero-section">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-tertiary/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] -left-[5%] w-[500px] h-[500px] rounded-full bg-primary/30 blur-[100px]" />
        </div>
        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-tertiary font-label-md uppercase tracking-widest mb-md">About Eventnic</p>
            <h1 className="font-display text-[48px] md:text-[64px] leading-[1.1] text-white tracking-tight mb-lg">
              Every event deserves a <br className="hidden md:block" />
              <span className="text-tertiary">stage worth standing on.</span>
            </h1>
            <p className="font-body-lg text-[18px] text-white/70 max-w-[640px] mx-auto">
              Eventnic was born from a simple idea: organizing events should be effortless, and attending them should be unforgettable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-xxl border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-[48px] text-primary mb-xs">{stat.value}</div>
                <p className="text-secondary font-label-md">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-[100px]">
        <div className="max-w-container-max mx-auto px-margin grid grid-cols-1 lg:grid-cols-2 gap-xxl items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-primary font-label-md uppercase tracking-widest mb-md">Our Mission</p>
            <h2 className="font-display text-[40px] text-on-surface leading-tight mb-lg">
              Empowering creators, connecting communities.
            </h2>
            <p className="text-secondary font-body-lg mb-lg">
              We're on a mission to democratize event management. Whether you're hosting a 50-person workshop or a 50,000-person festival, Eventnic gives you the tools, insights, and support to deliver exceptional experiences.
            </p>
            <p className="text-secondary font-body-lg">
              Our platform handles everything from ticket sales and check-ins to real-time analytics and next-day payouts—so you can focus on what matters most: your event.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant">
              <img
                src="/images/stitch-9cf7f93ffe1c0a00.png"
                alt="Event in action"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-panel rounded-2xl p-lg shadow-xl">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 rounded-full bg-gradient-premium flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">rocket_launch</span>
                </div>
                <div>
                  <p className="font-label-md text-on-surface font-bold">Founded in 2021</p>
                  <p className="text-secondary font-body-sm">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-[100px] bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin text-center">
          <p className="text-primary font-label-md uppercase tracking-widest mb-md">Our Team</p>
          <h2 className="font-display text-[40px] text-on-surface leading-tight mb-xxl">Meet the people behind Eventnic</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl max-w-4xl mx-auto">
            {TEAM.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-surface rounded-[24px] p-xl border border-outline-variant shadow-lg text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-lg border-4 border-primary-fixed">
                  <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs">{person.name}</h3>
                <p className="text-secondary font-body-sm">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[100px] px-margin">
        <div className="max-w-container-max mx-auto rounded-[40px] hero-section p-xl md:p-[80px] text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-[50%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/30 blur-[80px]"></div>
          <div className="absolute -bottom-[50%] -right-[10%] w-[500px] h-[500px] rounded-full bg-tertiary/20 blur-[80px]"></div>
          <div className="relative z-10">
            <h2 className="font-display text-[40px] text-white mb-lg">Ready to get started?</h2>
            <p className="text-white/80 font-body-lg mb-xl max-w-[512px] mx-auto">Join thousands of organizers creating unforgettable experiences with Eventnic.</p>
            <Link to="/signup" className="inline-block bg-surface text-primary font-bold font-headline-sm px-[40px] py-[16px] rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
