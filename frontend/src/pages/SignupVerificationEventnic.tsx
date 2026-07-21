import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth, roleHomePath } from '../contexts/AuthContext';
import type { User } from '../contexts/AuthContext';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../config/firebase';

export default function SignupVerificationEventnic() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [ghanaCardNumber, setGhanaCardNumber] = useState('');
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatGhanaCardNumber = (value: string) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const parts: string[] = [];
    if (clean.length <= 3) return clean;
    parts.push(clean.slice(0, 3));
    if (clean.length > 3) {
      parts.push(clean.slice(3, 7));
    }
    if (clean.length > 7) {
      parts.push(clean.slice(7, 11));
    }
    if (clean.length > 11) {
      parts.push(clean.slice(11, 15));
    }
    return parts.filter(Boolean).join('-');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-[448px] rounded-3xl border border-outline-variant bg-surface p-10 shadow-lg">
          <h1 className="font-display text-2xl text-on-surface mb-4">Continue Signup</h1>
          <p className="text-secondary mb-6">Please sign in again or start your signup to continue verification.</p>
          <Link to="/signup" className="inline-flex px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-container transition-colors">Start signup</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!verificationFile) {
      setError('Please upload a verification document.');
      setLoading(false);
      return;
    }

    const rawGhanaCard = ghanaCardNumber.replace(/[^A-Z0-9]/gi, '');
    if (rawGhanaCard.length < 11) {
      setError('Please enter a valid Ghana card number with hyphens.');
      setLoading(false);
      return;
    }

    try {
      const db = getFirestore(app);
      const fileDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') resolve(reader.result);
          else reject(new Error('Unable to read verification file.'));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(verificationFile);
      });

      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        companyName,
        phone,
        ghanaCardNumber: formatGhanaCardNumber(ghanaCardNumber),
        verificationDocumentUrl: fileDataUrl,
        verificationStatus: 'PENDING',
        status: 'pending',
      });

      const updatedUser: User = {
        ...user,
        companyName,
        phone,
        ghanaCardNumber: formatGhanaCardNumber(ghanaCardNumber),
        verificationDocumentUrl: fileDataUrl,
        verificationStatus: 'PENDING',
        status: 'pending',
      };

      login(updatedUser);
      navigate(roleHomePath(user.role));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit verification details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-[384px] lg:w-96">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/">
              <Logo />
            </Link>
            <Link to="/login" className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Login
            </Link>
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold tracking-tight text-on-surface">Complete verification</h2>
          <p className="mt-2 text-sm text-secondary">Submit your organization details and proof so admin can approve your account.</p>

          <div className="mt-8">
            {error && (
              <div className="mb-4 rounded-lg bg-error-container p-4 border border-error/30">
                <p className="text-sm text-on-error-container">{error}</p>
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-on-surface">Organization / Company Name</label>
                <div className="mt-1">
                  <input id="companyName" name="companyName" type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="block w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" placeholder="Acme Events Ltd" />
                </div>
              </div>


              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-on-surface">Phone number</label>
                <div className="mt-1">
                  <input id="phone" name="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" placeholder="+233 123 456 789" />
                </div>
              </div>

              <div>
                <label htmlFor="ghanaCardNumber" className="block text-sm font-medium text-on-surface">Ghana Card Number</label>
                <div className="mt-1">
                  <input id="ghanaCardNumber" name="ghanaCardNumber" type="text" required value={ghanaCardNumber} onChange={(e) => setGhanaCardNumber(formatGhanaCardNumber(e.target.value))} className="block w-full rounded-lg border border-outline-variant px-3 py-2 text-on-surface placeholder-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all" placeholder="GHA-1234-5678" />
                </div>
              </div>

              <div>
                <label htmlFor="verificationDocument" className="block text-sm font-medium text-on-surface">Proof of event / ID Document</label>
                <div className="mt-1">
                  <input id="verificationDocument" name="verificationDocument" type="file" accept="image/*,application/pdf" onChange={(e) => setVerificationFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white" />
                </div>
                <p className="mt-2 text-xs text-secondary">Upload a document or proof image for admin review.</p>
              </div>

              <div>
                <button type="submit" disabled={loading} className="flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-container hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50">
                  {loading ? 'Submitting verification...' : 'Submit verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
