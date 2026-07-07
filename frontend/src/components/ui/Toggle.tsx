import React from 'react';
import './Toggle.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled, id }) => {
  const toggleId = id || `toggle-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label className={`toggle ${disabled ? 'toggle-disabled' : ''}`} htmlFor={toggleId}>
      <div className="toggle-track">
        <input
          id={toggleId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-checked={checked}
        />
        <span className="toggle-slider" />
      </div>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
};

interface ToggleGroupProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({ options, value, onChange }) => (
  <div className="toggle-group" role="radiogroup">
    {options.map(o => (
      <button
        key={o.value}
        className={`toggle-group-btn ${value === o.value ? 'active' : ''}`}
        onClick={() => onChange(o.value)}
        role="radio"
        aria-checked={value === o.value}
      >
        {o.label}
      </button>
    ))}
  </div>
);
