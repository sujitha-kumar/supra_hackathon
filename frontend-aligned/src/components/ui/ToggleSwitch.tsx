import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}) => {
  const sizes = {
    sm: {
      switch: 'w-9 h-5',
      circle: 'w-4 h-4',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'w-11 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-5',
    },
  };
  
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };
  
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleToggle}
          disabled={disabled}
        />
        <div
          className={`${sizes[size].switch} rounded-xl transition-colors duration-200 ${
            checked ? 'bg-brand' : 'bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div
          className={`absolute left-0.5 top-0.5 bg-white rounded-full ${
            sizes[size].circle
          } transition-transform duration-200 ${
            checked ? sizes[size].translate : 'translate-x-0'
          }`}
        />
      </div>
      {label && (
        <span className={`ml-3 text-sm font-medium text-gray-700 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </label>
  );
};
