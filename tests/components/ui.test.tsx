import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/ui/button';
import { InputNumber } from '../src/components/ui/input';
import { Badge } from '../src/components/ui/badge';
import { TextDisplay } from '../src/components/ui/typography';
import React from 'react';

describe('UI Base Components', () => {
  it('Button renders primary and danger variants with correct classes (AC 1)', () => {
    const { rerender } = render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-accent-primary');

    rerender(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-status-danger');
  });

  it('Interactive elements show focus ring on keyboard focus (AC 2)', () => {
    render(<Button>Focus</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('focus:ring-focus-ring');
  });

  it('InputNumber enforces minimum bounds for attendees and rates (AC 3)', () => {
    render(<InputNumber label="Attendees" min={1} defaultValue={1} onChange={() => {}} />);
    const input = screen.getByLabelText('Attendees') as HTMLInputElement;
    expect(input.min).toBe('1');
    
    render(<InputNumber label="Rate" min={0} defaultValue={50} onChange={() => {}} />);
    const rateInputs = screen.getAllByLabelText('Rate');
    const rateInput = rateInputs[rateInputs.length - 1] as HTMLInputElement;
    expect(rateInput.min).toBe('0');
  });

  it('Components use CSS variables for theme support (AC 4)', () => {
    render(<TextDisplay variant="body">Theme test</TextDisplay>);
    expect(screen.getByText('Theme test')).toHaveClass('text-text-secondary');
  });
});