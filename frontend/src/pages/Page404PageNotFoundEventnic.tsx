// @ts-nocheck
import { Link } from 'react-router-dom';

export default function Page404PageNotFoundEventnic() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center py-xxl px-margin">
<div className="max-w-4xl w-full text-center">

<div className="mb-xl relative">
<div className="flex justify-center mb-lg">
<div className="w-64 h-64 md:w-80 md:h-80 bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant relative overflow-hidden">
<span className="material-symbols-outlined text-[120px] text-primary opacity-20 select-none">event_busy</span>
<div className="absolute inset-0 flex items-center justify-center">
<div className="text-[120px] md:text-[160px] font-display text-primary tracking-tighter opacity-10">404</div>
</div>
<img alt="404" className="absolute w-48 h-48 object-contain mix-blend-multiply opacity-80" data-alt="A clean, minimalist 3D isometric illustration of a broken stage spotlight casting a soft indigo glow on an empty wooden floor. The background is a vast, airy light-grey studio space with soft ambient occlusion. The aesthetic is corporate and professional, using a primary palette of deep indigo and slate greys to create a calm yet authoritative error state visualization." src="/images/stitch-e0cc96083044c7e1.png"/>
</div>
</div>
<h1 className="font-display text-display mb-sm text-on-surface">Oops! That page went off-script.</h1>
<p className="font-body-lg text-body-lg text-secondary max-w-[576px] mx-auto mb-xl">
                    The event you're looking for might have been rescheduled, moved, or never existed in this timeline. Let's get you back to the front row.
                </p>
<div className="flex flex-col sm:flex-row items-center justify-center gap-md">
<Link className="w-full sm:w-auto h-[56px] px-xl flex items-center justify-center bg-primary text-on-primary rounded-xl font-bold font-body-md text-body-md hover:bg-primary-container transition-all shadow-sm" to="/">
                        Back to Home
                    </Link>
<div className="relative w-full sm:w-72">
<span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="w-full h-[56px] pl-[48px] pr-md bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md text-body-md" placeholder="Search for events..." type="text"/>
</div>
</div>
</div>

<div className="mt-xxl text-left max-w-container-max mx-auto">
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg px-xs border-l-4 border-primary">Popular Right Now</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">

<div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:border-primary hover:shadow-lg transition-all cursor-pointer">
<div className="flex justify-between items-start mb-md">
<span className="bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded font-label-sm text-label-sm uppercase tracking-wider">Conference</span>
<span className="material-symbols-outlined text-outline group-hover:text-primary">arrow_forward</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">TechPulse Global 2024</h3>
<p className="font-body-sm text-body-sm text-secondary mb-md">The flagship event for digital innovators and creators.</p>
<div className="flex items-center gap-sm text-outline">
<span className="material-symbols-outlined text-[18px]">calendar_today</span>
<span className="font-label-md text-label-md">Oct 12-14</span>
</div>
</div>

<div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:border-primary hover:shadow-lg transition-all cursor-pointer">
<div className="flex justify-between items-start mb-md">
<span className="bg-tertiary-fixed text-on-tertiary-fixed px-sm py-xs rounded font-label-sm text-label-sm uppercase tracking-wider">Workshop</span>
<span className="material-symbols-outlined text-outline group-hover:text-primary">arrow_forward</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">UI Design Masterclass</h3>
<p className="font-body-sm text-body-sm text-secondary mb-md">Advanced visual design systems for modern enterprises.</p>
<div className="flex items-center gap-sm text-outline">
<span className="material-symbols-outlined text-[18px]">videocam</span>
<span className="font-label-md text-label-md">Online Session</span>
</div>
</div>

<div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:border-primary hover:shadow-lg transition-all cursor-pointer">
<div className="flex justify-between items-start mb-md">
<span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded font-label-sm text-label-sm uppercase tracking-wider">Networking</span>
<span className="material-symbols-outlined text-outline group-hover:text-primary">arrow_forward</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Founder's Mixer NYC</h3>
<p className="font-body-sm text-body-sm text-secondary mb-md">Connect with the next generation of venture-backed startups.</p>
<div className="flex items-center gap-sm text-outline">
<span className="material-symbols-outlined text-[18px]">location_on</span>
<span className="font-label-md text-label-md">New York, NY</span>
</div>
</div>
</div>
</div>
</div>
</main>
  );
}
