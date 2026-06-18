// @ts-nocheck
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsEventnic() {
  const { user } = useAuth();

  return (
    <main className="max-w-container-max mx-auto px-margin py-xxl">
      <div className="mb-xxl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Settings</h1>
        <p className="font-body-md text-body-md text-secondary">Manage your account settings and system preferences in one place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <aside className="lg:col-span-1 space-y-lg">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-xl shadow-sm">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-[0.2em] mb-sm">Quick links</p>
            <div className="space-y-sm">
              <Link to="/settings/account" className="block rounded-2xl px-md py-sm bg-primary/10 text-primary font-medium">Account</Link>
              <Link to="/settings/payout" className="block rounded-2xl px-md py-sm bg-surface-container-high text-on-surface font-medium">Payout / System</Link>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-xl shadow-sm">
            <h2 className="font-headline-sm text-headline-sm mb-sm">Need help?</h2>
            <p className="font-body-sm text-secondary">Visit the help center for FAQs about account security, billing, and verification.</p>
            <Link to="/help" className="mt-md inline-flex items-center gap-xs text-primary font-semibold">Open Help Center</Link>
          </div>
        </aside>

        <section className="lg:col-span-2 space-y-xxl">
          <div className="bg-surface-container-lowest rounded-3xl p-xl border border-outline-variant shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-lg">
              <div>
                <h2 className="font-headline-sm text-headline-sm">Account Settings</h2>
                <p className="font-body-sm text-secondary">Update your personal details, view your account status, and manage account access.</p>
              </div>
                <Link to="/settings/account" className="inline-flex items-center gap-xs text-primary font-semibold">Edit account details</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="rounded-3xl bg-surface p-lg border border-outline-variant">
                <p className="font-label-sm text-on-surface-variant mb-xs">Name</p>
                <p className="font-body-md text-on-surface">{user?.name || 'Unknown'}</p>
              </div>
              <div className="rounded-3xl bg-surface p-lg border border-outline-variant">
                <p className="font-label-sm text-on-surface-variant mb-xs">Email</p>
                <p className="font-body-md text-on-surface">{user?.email || 'Unknown'}</p>
              </div>
              <div className="rounded-3xl bg-surface p-lg border border-outline-variant">
                <p className="font-label-sm text-on-surface-variant mb-xs">Role</p>
                <p className="font-body-md text-on-surface">{user?.role || 'N/A'}</p>
              </div>
              <div className="rounded-3xl bg-surface p-lg border border-outline-variant">
                <p className="font-label-sm text-on-surface-variant mb-xs">Status</p>
                <p className="font-body-md text-on-surface">{user?.status || 'active'}</p>
              </div>
            </div>

            <div className="mt-xl grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="rounded-3xl bg-surface p-lg border border-outline-variant">
                <p className="font-label-sm text-on-surface-variant mb-xs">Verification</p>
                <p className="font-body-md text-on-surface">{user?.verificationStatus || 'Not verified'}</p>
              </div>
              {user?.role === 'ORGANIZER' && (
                <div className="rounded-3xl bg-surface p-lg border border-outline-variant">
                  <p className="font-label-sm text-on-surface-variant mb-xs">Balance</p>
                  <p className="font-body-md text-on-surface">NGN {Number(user.balance || 0).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="mt-xl flex flex-col sm:flex-row gap-md">
              <Link to="/settings/payout" className="inline-flex items-center justify-center gap-xs w-full sm:w-auto px-xl py-md rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-all">
                Manage payout & system settings
              </Link>
              <Link to="/help" className="inline-flex items-center justify-center gap-xs w-full sm:w-auto px-xl py-md rounded-full border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-all">
                Account help
              </Link>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-xl border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between mb-lg gap-md">
              <div>
                <h2 className="font-headline-sm text-headline-sm">System Settings</h2>
                <p className="font-body-sm text-secondary">Review system controls for your account role and platform operations.</p>
              </div>
              {user?.role === 'ADMIN' ? (
                <span className="rounded-full bg-primary/10 px-md py-xs text-primary font-medium">Admin access</span>
              ) : (
                <span className="rounded-full bg-surface-container-high px-md py-xs text-on-surface-variant font-medium">User settings</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="rounded-3xl bg-surface p-lg border border-outline-variant">
                <p className="font-label-sm text-on-surface-variant mb-xs">Account security</p>
                <p className="font-body-sm text-secondary">Update your login details, manage connected sessions, and keep your account secure.</p>
              </div>
              <div className="rounded-3xl bg-surface p-lg border border-outline-variant">
                <p className="font-label-sm text-on-surface-variant mb-xs">Notifications</p>
                <p className="font-body-sm text-secondary">Control how Eventnic sends alerts about event activity, payments, and verification.</p>
              </div>
              {user?.role === 'ADMIN' && (
                <div className="rounded-3xl bg-surface p-lg border border-outline-variant md:col-span-2">
                  <p className="font-label-sm text-on-surface-variant mb-xs">Platform finance</p>
                  <p className="font-body-sm text-secondary">Manage system deduction fees and base vote pricing for all organizers.</p>
                  <Link to="/settings/payout" className="mt-md inline-flex items-center gap-xs text-primary font-semibold">Open finance settings</Link>
                </div>
              )}
              {user?.role === 'ORGANIZER' && (
                <div className="rounded-3xl bg-surface p-lg border border-outline-variant md:col-span-2">
                  <p className="font-label-sm text-on-surface-variant mb-xs">Organizer controls</p>
                  <p className="font-body-sm text-secondary">Update your vote pricing and manage payout preferences.</p>
                  <Link to="/settings/payout" className="mt-md inline-flex items-center gap-xs text-primary font-semibold">Open organizer settings</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
