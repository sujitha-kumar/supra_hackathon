import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8">
        {(title || subtitle || actions) && (
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-gray-600">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
