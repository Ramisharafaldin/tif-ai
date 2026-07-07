import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props
}) => (
  <button
    className={`btn btn-${variant} btn-${size} ${className}`.trim()}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <span className="btn-spinner" /> : icon ? <span className="btn-icon">{icon}</span> : null}
    {children && <span>{children}</span>}
  </button>
);
