import React from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  value?: string | number;
  trend?: string;
  accent?: string;
  variant?: 'default' | 'out' | 'low' | 'over';
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, value, trend, accent, variant = 'default', children, className = '' }) => (
  <div className={`card card-${variant} ${className}`.trim()} style={accent ? { borderInlineStartColor: accent } : undefined}>
    {title && <h3>{title}</h3>}
    {value !== undefined && <div className="card-value">{value}</div>}
    {trend && <div className="card-trend">{trend}</div>}
    {children && <p className="card-body">{children}</p>}
  </div>
);
