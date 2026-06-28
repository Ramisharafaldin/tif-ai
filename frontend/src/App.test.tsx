import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

test('renders navigation links', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
  const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
  expect(dashboardLink).toBeInTheDocument();
});


