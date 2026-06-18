// @ts-nocheck
import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TermsOfServiceEventnic() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <main className="max-w-container-max mx-auto px-margin py-xxl">
<div className="flex flex-col md:flex-row gap-xxl">

<aside className="hidden md:block w-64 flex-shrink-0">
<div className="sticky sticky-sidebar">
<h3 className="font-label-md text-label-md text-outline uppercase tracking-wider mb-lg">Documents</h3>
<nav className="flex flex-col gap-sm">
<Link className="flex items-center gap-sm p-sm rounded-lg bg-secondary-container text-on-secondary-container font-medium transition-all" to="/terms-of-service">
<span className="material-symbols-outlined text-md">description</span>
<span className="font-body-md text-body-md">Terms of Service</span>
</Link>
<Link className="flex items-center gap-sm p-sm rounded-lg text-secondary hover:bg-surface-container transition-all" to="/privacy-policy">
<span className="material-symbols-outlined text-md">shield</span>
<span className="font-body-md text-body-md">Privacy Policy</span>
</Link>
<Link className="flex items-center gap-sm p-sm rounded-lg text-secondary hover:bg-surface-container transition-all" to="/refund-policy">
<span className="material-symbols-outlined text-md">payments</span>
<span className="font-body-md text-body-md">Refund Policy</span>
</Link>
<Link className="flex items-center gap-sm p-sm rounded-lg text-secondary hover:bg-surface-container transition-all" to="/terms-of-service">
<span className="material-symbols-outlined text-md">cookie</span>
<span className="font-body-md text-body-md">Cookie Settings</span>
</Link>
</nav>
<div className="mt-xxl p-lg bg-surface-container-high rounded-xl border border-outline-variant">
<p className="font-headline-sm text-headline-sm text-on-surface mb-sm">Need help?</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">Have questions about our legal terms? Contact our compliance team.</p>
<button onClick={() => toast.success('Support ticket created! We will email you shortly.')} className="w-full bg-surface-container-lowest border border-outline text-on-surface py-sm rounded-lg font-bold hover:bg-surface transition-all">
                            Contact Support
                        </button>
</div>
</div>
</aside>

<article className="flex-grow max-w-3xl legal-content">
<div className="bg-surface-container-lowest p-lg md:p-xxl rounded-xl border border-outline-variant shadow-sm">
<section id="introduction">
<h2>1. Introduction</h2>
<p>Welcome to Eventnic. These Terms of Service ("Terms") govern your access to and use of the Eventnic website, mobile applications, and services. By using our platform, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.</p>
<p>Eventnic provides a platform for event organizers ("Hosts") to list, promote, and sell tickets for events, and for users ("Attendees") to discover and purchase tickets for those events.</p>
</section>
<section id="eligibility">
<h2>2. Eligibility and Account</h2>
<p>You must be at least 18 years old to create an account on Eventnic. When you create an account, you must provide us with accurate and complete information. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
<ul>
<li>You agree to notify us immediately of any unauthorized use of your account.</li>
<li>We reserve the right to suspend or terminate accounts that provide false information.</li>
<li>Users are permitted only one active account unless explicitly authorized by Eventnic.</li>
</ul>
</section>
<section id="fees">
<h2>3. Fees and Payments</h2>
<p>Eventnic charges service fees for certain transactions on the platform. These fees will be clearly disclosed at the time of purchase or listing. All payments are processed through our secure third-party payment processors.</p>
<p>Hosts are responsible for determining any applicable taxes for their events and for including those taxes in the ticket price. Eventnic is not responsible for the collection or remittance of taxes on behalf of Hosts, except where required by law.</p>
</section>
<section id="cancellations">
<h2>4. Cancellations and Refunds</h2>
<p>Refund policies for events are set by the individual Hosts. Eventnic will facilitate refunds according to the specific policy stated on the event page. In the event of a cancellation by the Host, Attendees are generally entitled to a full refund of the ticket price, excluding certain service fees.</p>
<div className="my-lg p-lg bg-primary-container/10 border-l-4 border-primary rounded-r-lg">
<p className="font-headline-sm text-headline-sm text-primary mb-xs">Important Note</p>
<p className="font-body-md text-body-md m-0">Eventnic reserves the right to issue refunds in cases of documented fraud or event misrepresentation, regardless of the Host's stated policy.</p>
</div>
</section>
<section id="prohibited">
<h2>5. Prohibited Conduct</h2>
<p>You agree not to engage in any of the following prohibited activities:</p>
<ul>
<li>Using the service for any illegal purpose or in violation of any local, state, or international law.</li>
<li>Violating the intellectual property rights of Eventnic or any third party.</li>
<li>Attempting to interfere with the proper functioning of the service.</li>
<li>Using automated systems (bots, scrapers) to access the service without our permission.</li>
</ul>
</section>
<section id="liability">
<h2>6. Limitation of Liability</h2>
<p>To the maximum extent permitted by law, Eventnic shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.</p>
</section>
<div className="mt-xxl pt-xl border-t border-outline-variant flex justify-between items-center">
<span className="font-body-sm text-body-sm text-secondary">Did this help you?</span>
<div className="flex gap-sm">
<button className="flex items-center gap-xs px-md py-sm border border-outline rounded-lg text-on-surface hover:bg-surface-container transition-all" onClick={() => toast.success('Thanks for your feedback!')}>
<span className="material-symbols-outlined text-md">thumb_up</span>
<span className="font-label-md text-label-md">Yes</span>
</button>
<button className="flex items-center gap-xs px-md py-sm border border-outline rounded-lg text-on-surface hover:bg-surface-container transition-all" onClick={() => toast.success('Thanks for your feedback! We will try to improve.')}>
<span className="material-symbols-outlined text-md">thumb_down</span>
<span className="font-label-md text-label-md">No</span>
</button>
</div>
</div>
</div>
</article>

<div className="md:hidden order-first">
<div className="p-lg bg-surface-container-low rounded-xl border border-outline-variant">
<button className="w-full flex justify-between items-center" id="mobileNavToggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
<span className="font-headline-sm text-headline-sm text-on-surface">Legal Documents</span>
<span className="material-symbols-outlined">{mobileMenuOpen ? 'expand_less' : 'expand_more'}</span>
</button>
<div className={`${mobileMenuOpen ? 'flex' : 'hidden'} mt-md flex-col gap-sm`} id="mobileNavMenu">
<Link className="text-primary font-bold py-sm" to="/terms-of-service">Terms of Service</Link>
<Link className="text-secondary py-sm border-t border-outline-variant" to="/privacy-policy">Privacy Policy</Link>
<Link className="text-secondary py-sm border-t border-outline-variant" to="/refund-policy">Refund Policy</Link>
<Link className="text-secondary py-sm border-t border-outline-variant" to="/terms-of-service">Cookie Settings</Link>
</div>
</div>
</div>
</div>
</main>
  );
}
