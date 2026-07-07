import React from 'react';
import './Badge.css';

interface BadgeProps {
  variant?: 'normal' | 'overstocked' | 'low' | 'out_of_stock' | 'info' | 'success' | 'warning' | 'danger';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'normal', dot, children, className = '', style }) => (
  <span className={`badge badge-${variant} ${dot ? 'badge-dot' : ''} ${className}`.trim()} style={style}>
    {dot && <span className="badge-dot-indicator" />}
    {children}
  </span>
);
