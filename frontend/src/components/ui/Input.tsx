import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className={`input-group ${error ? 'input-error' : ''}`}>
        {label && <label htmlFor={inputId} className="input-label">{label}</label>}
        <input ref={ref} id={inputId} className={`input-field ${className}`} {...props} />
        {error && <span className="input-error-text">{error}</span>}
        {helper && !error && <span className="input-helper">{helper}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
