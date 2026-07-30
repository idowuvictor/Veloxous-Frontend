import { render, screen, fireEvent } from '@testing-library/react';
import { EscrowTimeline, TimelineStep } from './EscrowTimeline';
import { describe, it, expect, vi } from 'vitest';

describe('EscrowTimeline', () => {
  const steps: TimelineStep[] = [
    { id: '1', title: 'Funded', description: 'desc', status: 'completed' },
    { id: '2', title: 'Current Step', description: 'desc', status: 'current', actionRequired: 'buyer_confirm' },
  ];

  it('renders steps and handles actions based on role', () => {
    const handleAction = vi.fn();

    const { rerender } = render(
      <EscrowTimeline steps={steps} userRole="seller" onAction={handleAction} />
    );

    // As seller, buyer_confirm action should disable the release button
    const releaseBtn = screen.getByText('Release Funds');
    expect(releaseBtn).toBeDisabled();

    // Rerender as buyer
    rerender(<EscrowTimeline steps={steps} userRole="buyer" onAction={handleAction} />);
    expect(releaseBtn).not.toBeDisabled();

    // Test action
    fireEvent.click(releaseBtn);
    expect(handleAction).toHaveBeenCalledWith('2', 'release');
  });

  it('handles double confirmation for disputes', () => {
    const handleAction = vi.fn();

    render(<EscrowTimeline steps={steps} onAction={handleAction} />);
    const disputeBtn = screen.getByText('Open Dispute');
    
    // First click shows confirmation
    fireEvent.click(disputeBtn);
    expect(screen.getByText(/Are you sure\? Opening a dispute is irreversible/i)).toBeInTheDocument();
    
    // Second click confirms
    const confirmBtn = screen.getByText('Yes, open dispute');
    fireEvent.click(confirmBtn);
    
    expect(handleAction).toHaveBeenCalledWith('2', 'dispute');
  });

  it('does not render action buttons for released or disputed steps', () => {
    const handleAction = vi.fn();
    const finalSteps: TimelineStep[] = [
      { id: '1', title: 'Funded', description: 'desc', status: 'completed' },
      { id: '2', title: 'Released Step', description: 'desc', status: 'released' },
      { id: '3', title: 'Disputed Step', description: 'desc', status: 'disputed' },
    ];
    render(<EscrowTimeline steps={finalSteps} onAction={handleAction} />);
    
    expect(screen.queryByText('Release Funds')).not.toBeInTheDocument();
    expect(screen.queryByText('Open Dispute')).not.toBeInTheDocument();
  });
});
