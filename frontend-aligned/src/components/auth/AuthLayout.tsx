import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">WealthLens</h2>
              <p className="text-xs text-gray-600">Premium Edition</p>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Empower your client relationships with AI
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Streamline your workflow, enhance collaboration, and deliver exceptional results 
              with our intelligent platform designed for modern teams.
            </p>
          </div>
        </div>

        <div className="max-w-md">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <p className="text-sm text-gray-600">
                  Get intelligent recommendations and automated workflows that save time and boost productivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};
