// @ts-nocheck
import { Link } from 'react-router-dom';

export default function PayoutSettingsEventnic() {
  return (
    <main className="max-w-container-max mx-auto px-margin py-xxl">

<div className="mb-xxl">
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Financial Configuration</h1>
<p className="font-body-md text-body-md text-secondary">Manage your payout methods, tax documents, and track your event earnings.</p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">

<div className="lg:col-span-3 space-y-sm">
<Link className="flex items-center gap-md p-md rounded-xl bg-primary-fixed text-primary font-label-md text-label-md" to="/payout-settings">
<span className="material-symbols-outlined">payments</span> Payout Settings
                </Link>
<Link className="flex items-center gap-md p-md rounded-xl text-secondary hover:bg-surface-container transition-colors font-label-md text-label-md" to="/payout-settings">
<span className="material-symbols-outlined">receipt_long</span> Billing History
                </Link>
<Link className="flex items-center gap-md p-md rounded-xl text-secondary hover:bg-surface-container transition-colors font-label-md text-label-md" to="/payout-settings">
<span className="material-symbols-outlined">account_balance</span> Bank Accounts
                </Link>
<Link className="flex items-center gap-md p-md rounded-xl text-secondary hover:bg-surface-container transition-colors font-label-md text-label-md" to="/dashboard">
<span className="material-symbols-outlined">description</span> Tax Documents
                </Link>
</div>

<div className="lg:col-span-9 space-y-xxl">

<section className="bg-surface-container-lowest p-xl rounded-xl secure-card">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Payout Method</h2>
<p className="font-body-sm text-body-sm text-secondary">Connect your Stripe account or bank details to receive funds.</p>
</div>
<span className="flex items-center gap-xs px-md py-xs bg-green-50 text-green-700 text-label-sm font-label-sm rounded-full border border-green-200">
<span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span> Verified
                        </span>
</div>
<div className="p-lg border border-outline-variant rounded-xl bg-surface-container-low flex items-center justify-between group hover:border-primary transition-colors cursor-pointer">
<div className="flex items-center gap-lg">
<div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm">
<span className="material-symbols-outlined text-primary text-[32px]">account_balance</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Chase Bank •••• 8829</p>
<p className="font-body-sm text-body-sm text-secondary">Checking Account • Updated 2 days ago</p>
</div>
</div>
<button className="font-label-md text-label-md text-primary hover:underline">Edit</button>
</div>
<div className="mt-lg flex flex-col md:flex-row gap-md">
<button className="flex-1 border border-outline-variant p-lg rounded-xl flex items-center justify-center gap-sm font-label-md text-label-md text-secondary hover:bg-surface-container transition-all">
<span className="material-symbols-outlined">add_circle</span> Add New Bank Account
                        </button>
<button className="flex-1 bg-on-primary-fixed text-white p-lg rounded-xl flex items-center justify-center gap-sm font-label-md text-label-md hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-all">
<span className="material-symbols-outlined" style={{fontVariationSettings: '"FILL" 1'}}>bolt</span> Connect Stripe
                        </button>
</div>
</section>

<section className="bg-surface-container-lowest p-xl rounded-xl secure-card">
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Tax Information</h2>
<p className="font-body-sm text-body-sm text-secondary mb-lg">Provide your business details for tax compliance and automated W-9 generation.</p>
<form className="grid grid-cols-1 md:grid-cols-2 gap-lg">
<div className="space-y-xs">
<label className="font-label-md text-label-md text-on-surface">Legal Name / Entity</label>
<input className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-body-md text-body-md" type="text" value="Eventnic Organizers LLC"/>
</div>
<div className="space-y-xs">
<label className="font-label-md text-label-md text-on-surface">Tax ID (EIN/SSN)</label>
<input className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-body-md text-body-md" type="password" value="XXXXXXXXX"/>
</div>
<div className="md:col-span-2 space-y-xs">
<label className="font-label-md text-label-md text-on-surface">Business Address</label>
<input className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-body-md text-body-md" placeholder="123 Tech Boulevard, Suite 500, San Francisco, CA" type="text"/>
</div>
<div className="md:col-span-2 flex items-center justify-between pt-md border-t border-outline-variant">
<p className="font-body-sm text-body-sm text-secondary">Last updated: Oct 12, 2023</p>
<button className="bg-primary text-white px-xl py-md rounded-lg font-label-md text-label-md hover:opacity-90 transition-all" type="submit">Save Changes</button>
</div>
</form>
</section>

<section className="bg-surface-container-lowest rounded-xl secure-card overflow-hidden">
<div className="p-xl">
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Payout History</h2>
<p className="font-body-sm text-body-sm text-secondary">A record of all financial transfers to your connected accounts.</p>
</div>
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead>
<tr className="bg-surface-container-low border-y border-outline-variant">
<th className="text-left p-md font-label-md text-label-md text-on-surface">Date</th>
<th className="text-left p-md font-label-md text-label-md text-on-surface">Amount</th>
<th className="text-left p-md font-label-md text-label-md text-on-surface">Reference</th>
<th className="text-left p-md font-label-md text-label-md text-on-surface">Status</th>
<th className="text-right p-md font-label-md text-label-md text-on-surface">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-md font-body-sm text-body-sm text-on-surface">May 15, 2024</td>
<td className="p-md font-body-sm text-body-sm font-semibold text-on-surface">$12,450.00</td>
<td className="p-md font-body-sm text-body-sm text-secondary">EP-PAY-77291</td>
<td className="p-md">
<span className="px-md py-xs bg-green-100 text-green-800 rounded-full text-[12px] font-bold">COMPLETED</span>
</td>
<td className="p-md text-right">
<button className="text-primary hover:bg-primary-fixed p-sm rounded-lg transition-all"><span className="material-symbols-outlined">download</span></button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-md font-body-sm text-body-sm text-on-surface">May 01, 2024</td>
<td className="p-md font-body-sm text-body-sm font-semibold text-on-surface">$8,120.50</td>
<td className="p-md font-body-sm text-body-sm text-secondary">EP-PAY-77288</td>
<td className="p-md">
<span className="px-md py-xs bg-green-100 text-green-800 rounded-full text-[12px] font-bold">COMPLETED</span>
</td>
<td className="p-md text-right">
<button className="text-primary hover:bg-primary-fixed p-sm rounded-lg transition-all"><span className="material-symbols-outlined">download</span></button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-md font-body-sm text-body-sm text-on-surface">Apr 15, 2024</td>
<td className="p-md font-body-sm text-body-sm font-semibold text-on-surface">$4,500.00</td>
<td className="p-md font-body-sm text-body-sm text-secondary">EP-PAY-77245</td>
<td className="p-md">
<span className="px-md py-xs bg-secondary-container text-on-secondary-container rounded-full text-[12px] font-bold">PENDING</span>
</td>
<td className="p-md text-right">
<button className="text-primary hover:bg-primary-fixed p-sm rounded-lg transition-all"><span className="material-symbols-outlined">download</span></button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-md bg-surface-container-low border-t border-outline-variant flex justify-center">
<button onClick={() => { alert('Viewing History'); }} className="font-label-md text-label-md text-primary hover:underline">View All History</button>
</div>
</section>

<div className="flex items-center gap-md p-lg bg-surface-container rounded-xl">
<span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 1'}}>security</span>
<p className="font-body-sm text-body-sm text-secondary">
<strong className="text-on-surface">Secure Financial Processing.</strong> Your financial data is encrypted and managed through our PCI-DSS compliant partner, Stripe. Eventnic never stores your full bank account or tax ID information on our own servers.
                    </p>
</div>
</div>
</div>
</main>
  );
}
