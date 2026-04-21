import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  title?: string;
  message?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private readonly handleReload = (): void => {
    globalThis.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">
            {this.props.title ?? 'Something went wrong'}
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-gray-600">
            {this.props.message ??
              'This section hit an unexpected issue. Reload to continue, and your data will be fetched again.'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
