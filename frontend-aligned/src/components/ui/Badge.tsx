import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    brand: 'bg-blue-100 text-brand',
    success: 'bg-green-100 text-success',
    warning: 'bg-orange-100 text-warning',
    danger: 'bg-red-100 text-danger',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  return (
    <span
      className={`inline-flex items-center font-medium rounded-xl ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
