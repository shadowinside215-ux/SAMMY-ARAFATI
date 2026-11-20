import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare readonly props: Readonly<ErrorBoundaryProps>;
  public state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('UI ErrorBoundary caught an error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#050505] border border-[#FF0000]/45 p-8 text-center chamfer-card">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2020] mb-3">
              System Recovery
            </p>
            <h1 className="font-display font-bold text-2xl text-white mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-neutral-400 mb-6">
              An unexpected display issue occurred. Reload to restore the interface.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="chamfer-btn px-6 py-3 bg-[#FF0000] hover:bg-[#FF2020] text-white text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
