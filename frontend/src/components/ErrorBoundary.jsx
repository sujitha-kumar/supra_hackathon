import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, countdown: 30 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      this.startCountdown();
    }
  }

  startCountdown = () => {
    const interval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.countdown <= 1) {
          clearInterval(interval);
          return { countdown: 0 };
        }
        return { countdown: prevState.countdown - 1 };
      });
    }, 1000);
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Server is waking up
            </h1>
            <p className="text-gray-600 mb-4">
              Render free tier sleeps after 15 min. Please wait 30 seconds and refresh.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-4xl font-bold text-blue-600">
                {this.state.countdown}s
              </p>
            </div>
            <button
              onClick={this.handleRefresh}
              className="w-full px-6 py-3 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Refresh Now
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
