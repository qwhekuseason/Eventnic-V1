import { motion } from 'framer-motion';

export default function RefundPolicyEventnic() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative pt-[160px] pb-[60px] overflow-hidden bg-gradient-dark">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/15 blur-[120px]" />
        </div>
        <div className="max-w-container-max mx-auto px-margin relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-[48px] text-white tracking-tight mb-md">Refund Policy</h1>
            <p className="text-white/60 font-body-md">Last updated: January 1, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-xxl">
        <div className="max-w-3xl mx-auto px-margin">
          <article className="prose max-w-none space-y-xl text-on-surface">

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">1. General Overview</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>Eventnic operates as a ticketing platform connecting event organizers with attendees. As a third-party platform, Eventnic does not set the refund policies for individual events; these are established and enforced directly by the Event Organizers.</p>
                <p>Before purchasing a ticket, please review the specific refund policy stated on the event page.</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">2. Standard Refund Conditions</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>While organizers determine their own policies, most conform to the following standard conditions:</p>
                <ul className="list-disc pl-xl space-y-xs">
                  <li><strong>Event Cancellation:</strong> If an event is completely cancelled by the organizer, you are typically entitled to a full refund (including ticket price, but potentially excluding non-refundable processing fees).</li>
                  <li><strong>Rescheduled Events:</strong> If an event is postponed or rescheduled, your ticket usually remains valid for the new date. If you cannot attend the new date, organizers may offer a refund window.</li>
                  <li><strong>Change of Mind:</strong> Unless explicitly stated by the organizer as "Fully Refundable", tickets are generally non-refundable for change-of-mind or inability to attend.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">3. How to Request a Refund</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>To request a refund for an upcoming event:</p>
                <ol className="list-decimal pl-xl space-y-xs">
                  <li>Log in to your Eventnic account and navigate to <strong>My Tickets</strong>.</li>
                  <li>Locate the ticket you wish to refund and click "View Receipt & Options".</li>
                  <li>If the organizer allows automated refunds, you will see a "Request Refund" button.</li>
                  <li>If automated refunds are disabled, use the "Contact Organizer" button to send your request directly to the event host.</li>
                </ol>
                <p>Organizers are expected to respond to refund requests within 5 business days.</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">4. Automated Refund Handling (For Organizers)</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>Eventnic provides tools for organizers to issue refunds seamlessly. When an organizer issues a refund:</p>
                <ul className="list-disc pl-xl space-y-xs">
                  <li>Funds are returned to the attendee's original payment method within 5-10 business days.</li>
                  <li>The Eventnic ticketing fee is generally non-refundable unless Eventnic cancels the event due to platform violations.</li>
                  <li>Organizers must maintain a sufficient balance in their Eventnic account or connected Stripe account to cover refunds.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">5. Disputed Charges & Chargebacks</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>If you have an issue with your ticket, we strongly encourage you to contact the organizer or Eventnic Support before filing a chargeback with your bank. Fraudulent chargebacks may result in immediate suspension of your Eventnic account and cancellation of any future event tickets.</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-outline-variant shadow-sm p-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-md">6. Contact Support</h2>
              <div className="text-secondary font-body-md space-y-md">
                <p>If you cannot reach an organizer or suspect an event is fraudulent, please contact our Trust & Safety team immediately:</p>
                <p><strong>Email:</strong> <a href="mailto:support@eventnic.com" className="text-primary hover:underline">support@eventnic.com</a><br /><strong>Subject Line:</strong> Urgent: Refund / Fraud Report</p>
              </div>
            </div>

          </article>
        </div>
      </section>
    </main>
  );
}
