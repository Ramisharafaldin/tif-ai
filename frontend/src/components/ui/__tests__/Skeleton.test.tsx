import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton, SkeletonCard, SkeletonTable } from '../Skeleton';

describe('Skeleton', () => {
  it('renders default text skeleton', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('.skeleton-text')).toBeInTheDocument();
  });

  it('renders multiple items with count', () => {
    const { container } = render(<Skeleton count={3} />);
    expect(container.querySelectorAll('.skeleton').length).toBe(3);
  });

  it('renders SkeletonCard', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.skeleton-card')).toBeInTheDocument();
  });

  it('renders SkeletonTable with rows', () => {
    const { container } = render(<SkeletonTable rows={3} cols={4} />);
    expect(container.querySelector('.skeleton-table')).toBeInTheDocument();
  });
});
