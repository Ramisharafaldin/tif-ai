import React from 'react';
import './Select.css';

interface SelectOption { value: string; label: string; }

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, placeholder, error, className = '', id, ...props }) => {
  const selectId = id || props.name;
  return (
    <div className={`select-group ${error ? 'select-error' : ''}`}>
      {label && <label htmlFor={selectId} className="select-label">{label}</label>}
      <select id={selectId} className={`select-field ${className}`} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <span className="select-error-text">{error}</span>}
    </div>
  );
};
