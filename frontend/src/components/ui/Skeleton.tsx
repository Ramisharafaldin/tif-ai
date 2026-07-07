import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ variant = 'text', width, height, count = 1, className = '' }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`skeleton skeleton-${variant} ${className}`.trim()}
        style={{ width, height }}
        aria-hidden="true"
      />
    ))}
  </>
);

export const SkeletonCard: React.FC = () => (
  <div className="skeleton-card">
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="40%" height="1.8rem" />
    <Skeleton variant="text" width="80%" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="skeleton-table">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="skeleton-table-row">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} variant="text" width="90%" />
        ))}
      </div>
    ))}
  </div>
);
