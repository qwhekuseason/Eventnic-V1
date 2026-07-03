import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-margin">
          <div className="max-w-md w-full bg-surface border border-outline-variant rounded-3xl p-xl shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-lg text-red-600">
              <span className="material-symbols-outlined text-[32px]">error</span>
            </div>
            <h1 className="font-display text-[28px] text-on-surface mb-sm">Oops! Something went wrong.</h1>
            <p className="text-secondary font-body-md mb-xl">
              We encountered an unexpected error. Our team has been notified. Please try refreshing the page or navigating back to home.
            </p>
            <div className="flex flex-col sm:flex-row gap-sm justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary text-white font-bold px-lg py-md rounded-xl hover:shadow-md transition-all active:scale-95"
              >
                Refresh Page
              </button>
              <Link 
                to="/"
                className="bg-surface-container text-on-surface font-bold px-lg py-md rounded-xl hover:bg-surface-container-high transition-colors"
                onClick={() => this.setState({ hasError: false })}
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
