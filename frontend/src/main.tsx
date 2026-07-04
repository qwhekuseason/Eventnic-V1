import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'

const root = createRoot(document.getElementById('root')!);

const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const missing = required.filter((k) => !(import.meta.env[k] && import.meta.env[k].length));

if (missing.length > 0) {
  const human = missing.join(', ');
  root.render(
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center bg-white/90 p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Missing Firebase configuration</h1>
        <p className="mb-4">The app was built without the required Firebase environment variables.</p>
        <p className="text-sm text-left mb-4">Missing: <strong>{human}</strong></p>
        <p className="text-sm">Please add these variables to your Vercel project (or build env) and redeploy. See <a href="/README.md" className="text-primary underline">frontend README</a> for details.</p>
      </div>
    </div>,
  );
} else {
  // Defer loading the Firebase initializer and the App so imports that rely on Firebase
  // don't execute when env vars are missing (prevents the invalid-api-key crash).
  Promise.all([import('./config/firebase'), import('./App')])
    .then(([, module]) => {
      const App = module.default;
      root.render(
        <StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </StrictMode>,
      );
    })
    .catch((err) => {
      console.error('Failed to initialize app:', err);
      root.render(
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl text-center bg-white/90 p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Application initialization failed</h1>
            <pre className="text-left text-sm break-words">{String(err?.message || err)}</pre>
          </div>
        </div>,
      );
    });
}
