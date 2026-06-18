// @ts-nocheck
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ContactEventnic() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative pt-[160px] pb-[80px] overflow-hidden bg-gradient-dark">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-tertiary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] -right-[5%] w-[400px] h-[400px] rounded-full bg-primary/30 blur-[100px]" />
        </div>
        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-[48px] md:text-[64px] leading-[1.1] text-white tracking-tight mb-md">
              Get in <span className="text-tertiary">Touch</span>
            </h1>
            <p className="font-body-lg text-[18px] text-white/70 max-w-[512px] mx-auto">
              Have a question, feedback, or need help? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-[80px]">
        <div className="max-w-container-max mx-auto px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-xxl">

            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-lg">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
                className="bg-white rounded-[20px] p-xl border border-outline-variant shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined text-white">mail</span>
                </div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs">Email Us</h3>
                <p className="text-secondary font-body-sm mb-md">We typically respond within 24 hours.</p>
                <a href="mailto:support@eventnic.com" className="text-primary font-label-md hover:underline">support@eventnic.com</a>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-[20px] p-xl border border-outline-variant shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined text-white">chat</span>
                </div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs">Live Chat</h3>
                <p className="text-secondary font-body-sm mb-md">Available Mon–Fri, 9 AM – 6 PM EST.</p>
                <button onClick={() => toast('Live chat agent is connecting...', { icon: '💬' })} className="text-primary font-label-md hover:underline">Start a Conversation</button>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-[20px] p-xl border border-outline-variant shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined text-white">location_on</span>
                </div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-xs">Office</h3>
                <p className="text-secondary font-body-sm">548 Market St, Suite 92<br/>San Francisco, CA 94104</p>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3 bg-white rounded-[24px] p-xl md:p-xxl border border-outline-variant shadow-xl"
            >
              <h2 className="font-display text-[32px] text-on-surface mb-xs">Send us a message</h2>
              <p className="text-secondary font-body-md mb-xl">Fill out the form below and we'll get back to you shortly.</p>

              <form className="space-y-lg" onSubmit={(e) => { e.preventDefault(); toast.success('Your message has been sent successfully! We will get back to you soon.'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-xs">
                    <label className="font-label-md text-on-surface" htmlFor="contact-first">First Name</label>
                    <input id="contact-first" type="text" placeholder="John" className="w-full h-12 px-md rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all font-body-md" />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-md text-on-surface" htmlFor="contact-last">Last Name</label>
                    <input id="contact-last" type="text" placeholder="Doe" className="w-full h-12 px-md rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all font-body-md" />
                  </div>
                </div>

                <div className="space-y-xs">
                  <label className="font-label-md text-on-surface" htmlFor="contact-email">Email</label>
                  <input id="contact-email" type="email" placeholder="john@example.com" className="w-full h-12 px-md rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all font-body-md" />
                </div>

                <div className="space-y-xs">
                  <label className="font-label-md text-on-surface" htmlFor="contact-subject">Subject</label>
                  <select id="contact-subject" className="w-full h-12 px-md rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all font-body-md appearance-none bg-white">
                    <option value="">Select a topic</option>
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Partnership Opportunity</option>
                    <option>Feature Request</option>
                  </select>
                </div>

                <div className="space-y-xs">
                  <label className="font-label-md text-on-surface" htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" rows={5} placeholder="Tell us how we can help..." className="w-full px-md py-md rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all font-body-md resize-none" />
                </div>

                <button type="submit" className="w-full h-14 bg-gradient-premium text-white rounded-xl font-bold font-label-md shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
