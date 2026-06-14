// @ts-nocheck
import { motion } from 'framer-motion';

export default function PrivacyPolicyEventnic() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative pt-[160px] pb-[60px] overflow-hidden bg-gradient-dark">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-tertiary/15 blur-[120px]" />
        </div>
        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-[48px] text-white tracking-tight mb-md">Privacy Policy</h1>
            <p className="text-white/60 font-body-md">Last updated: January 1, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-3xl mx-auto px-margin">
          <article className="prose max-w-none space-y-xl text-on-surface">

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">1. Information We Collect</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>We collect information you provide directly to us when you create an account, purchase tickets, organize events, or contact our support team. This includes:</p>
                <ul className="list-disc pl-xl space-y-xs">
                  <li>Name, email address, and phone number</li>
                  <li>Payment and billing information (processed securely via Stripe)</li>
                  <li>Event details and attendee lists (for organizers)</li>
                  <li>Communications you send to us</li>
                </ul>
                <p>We also automatically collect certain information when you use our platform, including IP address, browser type, device information, and usage patterns through cookies and similar technologies.</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">2. How We Use Your Information</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-xl space-y-xs">
                  <li>Process ticket purchases and event registrations</li>
                  <li>Facilitate payouts to event organizers</li>
                  <li>Send transactional emails (confirmations, reminders, receipts)</li>
                  <li>Improve and personalize your experience on our platform</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Detect, prevent, and address fraud and security issues</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">3. Information Sharing</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>We do not sell your personal information. We may share your information with:</p>
                <ul className="list-disc pl-xl space-y-xs">
                  <li><strong>Event Organizers:</strong> When you purchase a ticket, the organizer receives your name, email, and ticket details to manage their event.</li>
                  <li><strong>Service Providers:</strong> Third-party vendors that help us operate our platform (payment processing, email delivery, hosting).</li>
                  <li><strong>Legal Requirements:</strong> When required by law, subpoena, or to protect our rights and safety.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">4. Data Security</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>We implement industry-standard security measures including encryption in transit (TLS 1.3), encryption at rest (AES-256), and regular security audits. Payment information is processed by PCI DSS-compliant providers and never stored on our servers.</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">5. Your Rights</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>Depending on your location, you may have rights including:</p>
                <ul className="list-disc pl-xl space-y-xs">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Correct or update inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
                <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@eventnic.com" className="text-primary hover:underline">privacy@eventnic.com</a>.</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">6. Cookies</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>We use essential cookies for platform functionality and optional cookies for analytics and personalization. You can manage your cookie preferences through your browser settings at any time.</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">7. Contact Us</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>If you have questions about this Privacy Policy, please contact us at:</p>
                <p><strong>Eventnic Inc.</strong><br />548 Market St, Suite 92<br />San Francisco, CA 94104<br /><a href="mailto:privacy@eventnic.com" className="text-primary hover:underline">privacy@eventnic.com</a></p>
              </div>
            </div>

          </article>
        </div>
      </section>
    </main>
  );
}
