// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EventnicEventManagementPlatform() {
  const navigate = useNavigate();

  return (
    <main>

<section className="relative overflow-hidden bg-surface py-xxl md:py-[120px]">
<div className="max-w-container-max mx-auto px-margin grid grid-cols-1 lg:grid-cols-2 gap-xl items-center relative z-10">
<div className="space-y-lg">
<h1 className="font-display text-[40px] md:text-display leading-tight text-on-surface">
                        Host <span className="text-gradient">unforgettable</span> events with ease.
                    </h1>
<p className="font-body-lg text-secondary max-w-[540px]">
                        The all-in-one platform for ticketing, attendee management, and real-time analytics. Build, manage, and scale your events with professional confidence.
                    </p>
<div className="flex flex-wrap gap-md pt-md">
<button onClick={() => navigate('/signup')} className="bg-primary text-on-primary font-headline-sm px-xl py-md rounded-xl shadow-lg hover:bg-primary-container transition-all">Get Started for Free</button>
<button onClick={() => toast.success('Demo video coming soon!')} className="bg-surface border border-outline-variant text-on-surface font-headline-sm px-xl py-md rounded-xl hover:bg-surface-container-low transition-all flex items-center gap-sm">
<span className="material-symbols-outlined">play_circle</span>
                            Watch Demo
                        </button>
</div>
</div>

<div className="hidden lg:grid grid-cols-6 grid-rows-6 gap-md h-[560px]">
<div className="col-span-4 row-span-4 rounded-xxl overflow-hidden shadow-xl">
<img className="w-full h-full object-cover" data-alt="A high-energy, crowded professional conference auditorium with vibrant purple and blue stage lighting. The shot is taken from behind the audience, showing a large screen with abstract data visualizations. The atmosphere is sophisticated, modern, and perfectly captures a premium corporate event environment." src="/images/stitch-9bf3cc8257fe8d98.png"/>
</div>
<div className="col-span-2 row-span-3 rounded-xxl overflow-hidden shadow-lg mt-xl">
<img className="w-full h-full object-cover" data-alt="A close-up shot of a modern digital check-in kiosk at a high-end corporate event. A tablet displays a clean UI with a QR code scanner, positioned on a sleek wooden table next to elegant conference badges. The lighting is soft and natural, emphasizing a frictionless attendee experience." src="/images/stitch-d87c03b4f4503fee.png"/>
</div>
<div className="col-span-2 row-span-3 rounded-xxl overflow-hidden shadow-lg">
<img className="w-full h-full object-cover" data-alt="A professional woman organizer smiling while holding a digital tablet that displays colorful analytics charts. She is standing in a brightly lit, contemporary venue foyer with blurred attendees in the background. The scene conveys reliability, control, and successful professional management." src="/images/stitch-f76be2086127355c.png"/>
</div>
<div className="col-span-4 row-span-2 rounded-xxl overflow-hidden shadow-lg -mt-lg">
<div className="w-full h-full bg-primary-container flex items-center justify-center p-xl">
<div className="text-white space-y-xs">
<p className="text-label-md opacity-80 uppercase tracking-widest">Real-time Sales</p>
<p className="text-headline-lg font-bold">$124,500.00</p>
<div className="w-full h-2 bg-white/20 rounded-full mt-md">
<div className="w-[75%] h-full bg-surface rounded-full"></div>
</div>
</div>
</div>
</div>
</div>
</div>

<div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 pointer-events-none">
<svg className="w-full h-full fill-primary" viewBox="0 0 100 100">
<circle cx="80" cy="20" r="40"></circle>
</svg>
</div>
</section>

<section className="py-xxl bg-surface-container-lowest">
<div className="max-w-container-max mx-auto px-margin">
<div className="text-center mb-xl">
<h2 className="font-headline-lg text-on-surface mb-sm">Everything you need to succeed</h2>
<p className="text-secondary max-w-2xl mx-auto">Powerful tools designed for event professionals who demand efficiency and data-driven results.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">

<div className="p-xl rounded-xxl bg-surface border border-outline-variant hover:border-primary hover:shadow-lg transition-all group">
<div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-lg group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">confirmation_number</span>
</div>
<h3 className="font-headline-sm text-on-surface mb-sm">Easy Ticketing</h3>
<p className="text-secondary body-md">Launch customized ticket tiers in minutes. Multi-currency support and secure checkout come standard.</p>
</div>

<div className="p-xl rounded-xxl bg-surface border border-outline-variant hover:border-primary hover:shadow-lg transition-all group">
<div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-lg group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">analytics</span>
</div>
<h3 className="font-headline-sm text-on-surface mb-sm">Powerful Analytics</h3>
<p className="text-secondary body-md">Track conversions, source attribution, and attendee demographics with real-time dashboard updates.</p>
</div>

<div className="p-xl rounded-xxl bg-surface border border-outline-variant hover:border-primary hover:shadow-lg transition-all group">
<div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-lg group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">how_to_reg</span>
</div>
<h3 className="font-headline-sm text-on-surface mb-sm">Attendee Check-in</h3>
<p className="text-secondary body-md">Frictionless entry with our mobile scanner app. Manage VIP lists and track attendance in real-time.</p>
</div>
</div>
</div>
</section>

<section className="py-xxl bg-background overflow-hidden">
<div className="max-w-container-max mx-auto px-margin">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
<div>
<h2 className="font-headline-lg text-on-surface mb-md">Simple pricing that grows with you.</h2>
<p className="text-secondary body-lg mb-xl">No hidden fees or complex calculations. Start for free and upgrade as your audience expands.</p>
<div className="space-y-md">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
<span className="text-on-surface font-medium">Unlimited free tickets</span>
</div>
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
<span className="text-on-surface font-medium">24/7 dedicated support</span>
</div>
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
<span className="text-on-surface font-medium">Global payment processing</span>
</div>
</div>
</div>

<div className="relative">

<div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full"></div>
<div className="relative bg-surface p-xl rounded-xxl border-2 border-primary shadow-2xl max-w-[448px] mx-auto">
<div className="absolute top-0 right-12 -translate-y-1/2 bg-primary text-on-primary text-label-md px-lg py-1 rounded-full uppercase tracking-widest">Most Popular</div>
<div className="mb-xl">
<h4 className="font-headline-sm text-primary mb-xs">Pro Plan</h4>
<div className="flex items-baseline gap-xs">
<span className="text-display text-on-surface">$49</span>
<span className="text-secondary">/month</span>
</div>
</div>
<ul className="space-y-md mb-xl">
<li className="flex items-center justify-between text-body-md border-b border-outline-variant pb-sm">
<span className="text-secondary">Ticket Fee</span>
<span className="font-bold">1.5% + $0.50</span>
</li>
<li className="flex items-center justify-between text-body-md border-b border-outline-variant pb-sm">
<span className="text-secondary">Attendees</span>
<span className="font-bold">Up to 5,000</span>
</li>
<li className="flex items-center justify-between text-body-md border-b border-outline-variant pb-sm">
<span className="text-secondary">Advanced Analytics</span>
<span className="font-bold">Included</span>
</li>
<li className="flex items-center justify-between text-body-md">
<span className="text-secondary">Custom Branding</span>
<span className="font-bold">Full Access</span>
</li>
</ul>
<button onClick={() => toast.success('Pro Plan selected! Proceeding to checkout...')} className="w-full bg-primary text-on-primary font-headline-sm py-md rounded-xl shadow-lg hover:bg-primary-container transition-all">Select Pro Plan</button>
</div>
</div>
</div>
</div>
</section>

<section className="py-xxl px-margin">
<div className="max-w-container-max mx-auto rounded-[32px] bg-inverse-surface p-xl md:p-[80px] text-center relative overflow-hidden">

<div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
<div className="relative z-10">
<h2 className="font-display text-inverse-on-surface mb-lg">Ready to launch your event?</h2>
<p className="text-inverse-on-surface font-body-lg mb-xl max-w-2xl mx-auto opacity-80">
                        Join over 10,000+ event organizers worldwide. From local workshops to global summits, Eventnic scales with you.
                    </p>
<button onClick={() => navigate('/create-event/basic-info')} className="bg-surface text-primary font-headline-sm px-[48px] py-[20px] rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all">Create Event Now</button>
</div>
</div>
</section>
</main>
  );
}
