// @ts-nocheck
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function AccountSettingsEventnic() {
  const { user, login } = useAuth();
  const db = getFirestore(app);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [registrationNumber, setRegistrationNumber] = useState(user?.registrationNumber || '');
  const [ghanaCardNumber, setGhanaCardNumber] = useState(user?.ghanaCardNumber || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setPhone(user.phone || '');
    setCompanyName(user.companyName || '');
    setRegistrationNumber(user.registrationNumber || '');
    setGhanaCardNumber(user.ghanaCardNumber || '');
  }, [user]);

  if (!user) {
    return (
      <main className="max-w-container-max mx-auto px-margin py-xxl">
        <div className="rounded-3xl border border-outline-variant bg-surface p-12 text-center">
          <h1 className="font-display text-headline-lg mb-sm">Not signed in</h1>
          <p className="text-secondary">Please sign in to view and update your account settings.</p>
          <Link to="/login" className="mt-md inline-flex rounded-full bg-primary px-lg py-sm text-white font-bold">Sign in</Link>
        </div>
      </main>
    );
  }

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        name: name.trim(),
        phone: phone.trim() || null,
        companyName: companyName.trim() || null,
        registrationNumber: registrationNumber.trim() || null,
        ghanaCardNumber: ghanaCardNumber.trim() || null,
      });

      const updatedUser = {
        ...user,
        name: name.trim(),
        phone: phone.trim() || undefined,
        companyName: companyName.trim() || undefined,
        registrationNumber: registrationNumber.trim() || undefined,
        ghanaCardNumber: ghanaCardNumber.trim() || undefined,
      };
      login(updatedUser);
      setMessage('Account information saved successfully.');
    } catch (error) {
      console.error('Failed to save account settings:', error);
      setMessage('Unable to save account settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-container-max mx-auto px-margin py-xxl">
      <div className="mb-xxl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Account Settings</h1>
        <p className="font-body-md text-body-md text-secondary">Update your profile details and review your account metadata.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <aside className="lg:col-span-3 space-y-lg">
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

        <section className="lg:col-span-9 space-y-xxl">
          <div className="bg-surface-container-lowest rounded-3xl p-xl border border-outline-variant shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-lg">
              <div>
                <h2 className="font-headline-sm text-headline-sm">Profile Information</h2>
                <p className="font-body-sm text-secondary">Keep your account profile up to date and accurate.</p>
              </div>
              <Link to="/settings/payout" className="inline-flex items-center gap-xs text-primary font-semibold">Payout settings</Link>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-lg" onSubmit={handleSave}>
              <div className="rounded-3xl bg-surface p-lg border border-outline-variant space-y-md">
                <label className="font-label-md text-label-md text-on-surface">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="rounded-3xl bg-surface p-lg border border-outline-variant space-y-md">
                <label className="font-label-md text-label-md text-on-surface">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-outline-variant p-md rounded-lg bg-surface-container-high text-on-surface-variant"
                />
              </div>

              <div className="rounded-3xl bg-surface p-lg border border-outline-variant space-y-md md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="+233 24 000 0000"
                />
              </div>

              <div className="rounded-3xl bg-surface p-lg border border-outline-variant space-y-md">
                <label className="font-label-md text-label-md text-on-surface">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Company or organization"
                />
              </div>

              <div className="rounded-3xl bg-surface p-lg border border-outline-variant space-y-md">
                <label className="font-label-md text-label-md text-on-surface">Registration Number</label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Company registration number"
                />
              </div>

              <div className="rounded-3xl bg-surface p-lg border border-outline-variant space-y-md md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface">Ghana Card Number</label>
                <input
                  type="text"
                  value={ghanaCardNumber}
                  onChange={(e) => setGhanaCardNumber(e.target.value)}
                  className="w-full border border-outline-variant p-md rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Ghana card or national ID"
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-md pt-md border-t border-outline-variant">
                <div>
                  <p className="font-body-sm text-secondary">Role: {user.role}</p>
                  <p className="font-body-sm text-secondary">Account status: {user.status || 'active'}</p>
                </div>
                <button type="submit" disabled={saving} className="bg-primary text-white px-xl py-md rounded-lg font-bold transition-all disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>

              {message && <div className="md:col-span-2 text-secondary">{message}</div>}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
