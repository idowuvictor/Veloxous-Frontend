import React, { useEffect, useState } from 'react';
import './EscrowTimeline.css';

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date?: string;
  timestamp?: number;
  status: 'completed' | 'current' | 'upcoming' | 'awaiting_funds' | 'released' | 'disputed';
  txHash?: string;
  actionRequired?: 'buyer_confirm' | 'seller_confirm' | 'both_confirm';
  buyerConfirmed?: boolean;
  sellerConfirmed?: boolean;
}

export interface EscrowTimelineProps {
  steps: TimelineStep[];
  className?: string;
  userRole?: 'buyer' | 'seller';
  network?: 'testnet' | 'public';
  onAction?: (stepId: string, actionType: 'release' | 'dispute') => void;
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="vx-timeline-icon">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CurrentIcon = () => (
  <div className="vx-timeline-current-dot" />
);

export const EscrowTimeline: React.FC<EscrowTimelineProps> = ({ steps, className = '', userRole, network = 'testnet', onAction }) => {
  const [mounted, setMounted] = useState(false);
  const [disputeConfirming, setDisputeConfirming] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`vx-timeline ${className} ${mounted ? 'vx-timeline--mounted' : ''}`}>
      <div className="vx-timeline__container">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.status === 'completed' || step.status === 'released';
          const isCurrent = step.status === 'current' || step.status === 'awaiting_funds' || step.status === 'disputed';
          
          let actionDisabled = false;
          if (step.actionRequired === 'buyer_confirm' && userRole !== 'buyer') actionDisabled = true;
          if (step.actionRequired === 'seller_confirm' && userRole !== 'seller') actionDisabled = true;
          if (step.actionRequired === 'both_confirm') {
             if (userRole === 'buyer' && step.buyerConfirmed) actionDisabled = true;
             if (userRole === 'seller' && step.sellerConfirmed) actionDisabled = true;
          }

          return (
            <div 
              key={step.id} 
              className={`vx-timeline__item vx-timeline__item--${step.status}`}
              style={{ animationDelay: `calc(var(--dur-sheet) * ${index})` }}
            >
              {/* Left column: Icon and connecting line */}
              <div className="vx-timeline__visual">
                <div className={`vx-timeline__node vx-timeline__node--${step.status}`}>
                  {isCompleted && <CheckIcon />}
                  {isCurrent && <CurrentIcon />}
                </div>
                {!isLast && (
                  <div className={`vx-timeline__line ${isCompleted ? 'vx-timeline__line--active' : ''}`} />
                )}
              </div>

              {/* Right column: Content */}
              <div className="vx-timeline__content">
                <h3 className="vx-timeline__title">{step.title}</h3>
                <p className="vx-timeline__desc">{step.description}</p>
                
                {step.timestamp && (
                  <span className="vx-timeline__timestamp">
                    {new Date(step.timestamp).toLocaleString('en-US', { timeZone: 'UTC' })}
                  </span>
                )}
                {step.date && !step.timestamp && (
                  <span className="vx-timeline__date">{step.date}</span>
                )}
                
                {step.txHash && (
                  <a href={`https://stellar.expert/explorer/${network}/tx/${step.txHash}`} target="_blank" rel="noopener noreferrer" className="vx-timeline__tx-link">
                    View on Stellar Expert
                  </a>
                )}

                {step.status === 'current' && onAction && (
                  <div className="vx-timeline__actions">
                    <button 
                      className="vx-btn vx-btn--primary"
                      disabled={actionDisabled}
                      onClick={() => onAction(step.id, 'release')}
                    >
                      Release Funds
                    </button>
                    {disputeConfirming === step.id ? (
                      <div className="vx-timeline__dispute-confirm">
                        <span className="vx-timeline__dispute-warning">Are you sure? Opening a dispute is irreversible and funds will be frozen pending resolution.</span>
                        <button className="vx-btn vx-btn--danger" onClick={() => { setDisputeConfirming(null); onAction(step.id, 'dispute'); }}>Yes, open dispute</button>
                        <button className="vx-btn vx-btn--ghost" onClick={() => setDisputeConfirming(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button 
                        className="vx-btn vx-btn--secondary"
                        onClick={() => setDisputeConfirming(step.id)}
                      >
                        Open Dispute
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
