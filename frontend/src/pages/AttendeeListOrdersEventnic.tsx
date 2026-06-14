// @ts-nocheck
import { Link } from 'react-router-dom';

export default function AttendeeListOrdersEventnic() {
  return (
    <main className="max-w-container-max mx-auto px-margin py-xxl">

<div className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-xxl items-end">
<div className="md:col-span-8">
<h1 className="font-display text-display text-on-surface mb-xs">Attendee Management</h1>
<p className="font-body-lg text-body-lg text-secondary">Monitor registrations, manage orders, and export attendee data for Global Tech Summit 2024.</p>
</div>
<div className="md:col-span-4 flex justify-end gap-md">
<button className="flex items-center gap-sm bg-surface-container-low border border-outline-variant px-lg h-[44px] rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-variant transition-all">
<span className="material-symbols-outlined" data-icon="download">download</span>
                    Export CSV
                </button>
<button className="flex items-center gap-sm bg-primary text-on-primary px-lg h-[44px] rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all shadow-md">
<span className="material-symbols-outlined" data-icon="person_add">person_add</span>
                    Add Attendee
                </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xxl">
<div className="bg-surface border border-outline-variant p-lg rounded-xl shadow-sm">
<div className="flex justify-between items-start mb-base">
<span className="text-secondary font-label-md text-label-md uppercase tracking-wider">Total Attendees</span>
<span className="material-symbols-outlined text-primary" data-icon="groups">groups</span>
</div>
<div className="text-headline-lg font-headline-lg text-on-surface">1,284</div>
<div className="flex items-center gap-xs mt-sm">
<span className="text-primary font-bold text-label-sm">+12%</span>
<span className="text-secondary font-label-sm">vs last week</span>
</div>
</div>
<div className="bg-surface border border-outline-variant p-lg rounded-xl shadow-sm">
<div className="flex justify-between items-start mb-base">
<span className="text-secondary font-label-md text-label-md uppercase tracking-wider">Tickets Sold</span>
<span className="material-symbols-outlined text-secondary" data-icon="confirmation_number">confirmation_number</span>
</div>
<div className="text-headline-lg font-headline-lg text-on-surface">1,450</div>
<div className="flex items-center gap-xs mt-sm">
<div className="h-2 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{width: '85%'}}></div>
</div>
<span className="text-secondary font-label-sm ml-sm">85% Capacity</span>
</div>
</div>
<div className="bg-surface border border-outline-variant p-lg rounded-xl shadow-sm">
<div className="flex justify-between items-start mb-base">
<span className="text-secondary font-label-md text-label-md uppercase tracking-wider">Revenue</span>
<span className="material-symbols-outlined text-tertiary" data-icon="payments">payments</span>
</div>
<div className="text-headline-lg font-headline-lg text-on-surface">$84,200</div>
<div className="flex items-center gap-xs mt-sm">
<span className="text-on-secondary-fixed-variant font-bold text-label-sm">Live</span>
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
</div>
</div>
<div className="bg-surface border border-outline-variant p-lg rounded-xl shadow-sm">
<div className="flex justify-between items-start mb-base">
<span className="text-secondary font-label-md text-label-md uppercase tracking-wider">Check-in Rate</span>
<span className="material-symbols-outlined text-outline" data-icon="check_circle">check_circle</span>
</div>
<div className="text-headline-lg font-headline-lg text-on-surface">0%</div>
<div className="flex items-center gap-xs mt-sm">
<span className="text-secondary font-label-sm italic">Opens in 4 days</span>
</div>
</div>
</div>

<div className="bg-surface border border-outline-variant rounded-xl shadow-sm mb-lg overflow-hidden">
<div className="p-lg border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-md">
<div className="relative w-full md:w-96">
<span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
<input className="w-full pl-xxl pr-md h-[44px] bg-white border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all" placeholder="Search attendees by name, email, or order ID..." type="text"/>
</div>
<div className="flex items-center gap-md w-full md:w-auto overflow-x-auto pb-xs md:pb-0">
<div className="flex items-center gap-sm bg-white border border-outline-variant px-md h-[44px] rounded-lg shrink-0">
<span className="font-label-md text-secondary">Ticket:</span>
<select className="bg-transparent border-none outline-none font-label-md text-on-surface cursor-pointer">
<option>All Types</option>
<option>VIP Pass</option>
<option>General Admission</option>
<option>Early Bird</option>
</select>
</div>
<div className="flex items-center gap-sm bg-white border border-outline-variant px-md h-[44px] rounded-lg shrink-0">
<span className="font-label-md text-secondary">Status:</span>
<select className="bg-transparent border-none outline-none font-label-md text-on-surface cursor-pointer">
<option>All Status</option>
<option>Confirmed</option>
<option>Pending</option>
<option>Cancelled</option>
</select>
</div>
<button className="bg-white border border-outline-variant p-base rounded-lg hover:bg-surface-variant transition-all">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="filter_list">filter_list</span>
</button>
</div>
</div>

<div className="overflow-x-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest text-secondary uppercase font-label-sm tracking-wider text-label-sm">
<th className="px-lg py-md border-b border-outline-variant">
<input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
</th>
<th className="px-lg py-md border-b border-outline-variant font-semibold">Attendee Name</th>
<th className="px-lg py-md border-b border-outline-variant font-semibold">Ticket Type</th>
<th className="px-lg py-md border-b border-outline-variant font-semibold">Order Date</th>
<th className="px-lg py-md border-b border-outline-variant font-semibold">Status</th>
<th className="px-lg py-md border-b border-outline-variant font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-bright transition-colors group">
<td className="px-lg py-lg">
<input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
</td>
<td className="px-lg py-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold">JD</div>
<div>
<div className="font-headline-sm text-body-md text-on-surface">Julianne Devis</div>
<div className="text-body-sm text-secondary">j.devis@example.com</div>
</div>
</div>
</td>
<td className="px-lg py-lg">
<span className="px-md py-xs bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-label-sm font-semibold">VIP Pass</span>
</td>
<td className="px-lg py-lg text-body-md text-secondary">Oct 24, 2023</td>
<td className="px-lg py-lg">
<span className="flex items-center gap-xs text-primary font-semibold text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    Confirmed
                                </span>
</td>
<td className="px-lg py-lg text-right">
<button className="p-base rounded-full hover:bg-surface-variant transition-all text-secondary group-hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-bright transition-colors group">
<td className="px-lg py-lg">
<input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
</td>
<td className="px-lg py-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold">MK</div>
<div>
<div className="font-headline-sm text-body-md text-on-surface">Marcus Kane</div>
<div className="text-body-sm text-secondary">marcus@kane-digital.io</div>
</div>
</div>
</td>
<td className="px-lg py-lg">
<span className="px-md py-xs bg-surface-container-highest text-on-surface-variant rounded-full text-label-sm font-semibold">Early Bird</span>
</td>
<td className="px-lg py-lg text-body-md text-secondary">Oct 25, 2023</td>
<td className="px-lg py-lg">
<span className="flex items-center gap-xs text-secondary font-semibold text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                    Pending
                                </span>
</td>
<td className="px-lg py-lg text-right">
<button className="p-base rounded-full hover:bg-surface-variant transition-all text-secondary group-hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-bright transition-colors group">
<td className="px-lg py-lg">
<input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
</td>
<td className="px-lg py-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim flex items-center justify-center text-on-tertiary-fixed font-bold">SL</div>
<div>
<div className="font-headline-sm text-body-md text-on-surface">Sarah Lopez</div>
<div className="text-body-sm text-secondary">sarah.l@studio.com</div>
</div>
</div>
</td>
<td className="px-lg py-lg">
<span className="px-md py-xs bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-label-sm font-semibold">VIP Pass</span>
</td>
<td className="px-lg py-lg text-body-md text-secondary">Oct 26, 2023</td>
<td className="px-lg py-lg">
<span className="flex items-center gap-xs text-primary font-semibold text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    Confirmed
                                </span>
</td>
<td className="px-lg py-lg text-right">
<button className="p-base rounded-full hover:bg-surface-variant transition-all text-secondary group-hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-bright transition-colors group">
<td className="px-lg py-lg">
<input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
</td>
<td className="px-lg py-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container font-bold">RB</div>
<div>
<div className="font-headline-sm text-body-md text-on-surface">Robert Brown</div>
<div className="text-body-sm text-secondary">robert.b@webmail.net</div>
</div>
</div>
</td>
<td className="px-lg py-lg">
<span className="px-md py-xs bg-surface-container-highest text-on-surface-variant rounded-full text-label-sm font-semibold">Gen. Admission</span>
</td>
<td className="px-lg py-lg text-body-md text-secondary">Oct 26, 2023</td>
<td className="px-lg py-lg">
<span className="flex items-center gap-xs text-error font-semibold text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                    Cancelled
                                </span>
</td>
<td className="px-lg py-lg text-right">
<button className="p-base rounded-full hover:bg-surface-variant transition-all text-secondary group-hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-lg flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-low border-t border-outline-variant">
<span className="text-body-sm text-secondary">Showing <span className="text-on-surface font-semibold">1-50</span> of <span className="text-on-surface font-semibold">1,284</span> attendees</span>
<div className="flex items-center gap-sm">
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-white text-secondary hover:bg-surface-variant transition-all disabled:opacity-50" disabled="">
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-primary bg-primary text-on-primary font-label-md text-label-md">1</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-variant transition-all">2</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-variant transition-all">3</button>
<span className="px-xs text-secondary">...</span>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-variant transition-all">26</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-white text-secondary hover:bg-surface-variant transition-all">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
<div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Sales Distribution</h3>
<div className="flex flex-col gap-md">
<div className="space-y-sm">
<div className="flex justify-between items-center text-label-md">
<span className="text-on-surface">VIP Pass</span>
<span className="text-secondary">420 tickets ($33,600)</span>
</div>
<div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{width: '32%'}}></div>
</div>
</div>
<div className="space-y-sm">
<div className="flex justify-between items-center text-label-md">
<span className="text-on-surface">Early Bird</span>
<span className="text-secondary">600 tickets ($24,000)</span>
</div>
<div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-secondary" style={{width: '48%'}}></div>
</div>
</div>
<div className="space-y-sm">
<div className="flex justify-between items-center text-label-md">
<span className="text-on-surface">General Admission</span>
<span className="text-secondary">430 tickets ($26,600)</span>
</div>
<div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-tertiary" style={{width: '20%'}}></div>
</div>
</div>
</div>
</div>
<div className="bg-primary-container text-on-primary-container rounded-xl p-lg shadow-lg relative overflow-hidden flex flex-col justify-between">
<div className="relative z-10">
<h3 className="font-headline-sm text-headline-sm mb-sm">Need help managing your guest list?</h3>
<p className="font-body-md opacity-90 mb-lg max-w-[384px]">Use our automation tools to send personalized email invites, bulk check-in attendees, or generate thermal badges instantly.</p>
</div>
<div className="relative z-10 flex gap-md">
<button className="bg-white text-primary px-lg h-[44px] rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-sm">Explore Tools</button>
<button className="border border-white border-opacity-30 text-white px-lg h-[44px] rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all">Documentation</button>
</div>

<div className="absolute -right-12 -top-12 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
<div className="absolute -right-4 -bottom-4 w-32 h-32 bg-secondary opacity-20 rounded-full blur-2xl"></div>
</div>
</div>
</main>
  );
}
