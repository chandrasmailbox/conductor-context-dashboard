// frontend/src/App.test.tsx
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render a dashboard header', () => {
    render(<App />);
    expect(screen.getByRole('banner', { name: /dashboard header/i })).toBeInTheDocument();
  });

  it('should render a main content area', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
