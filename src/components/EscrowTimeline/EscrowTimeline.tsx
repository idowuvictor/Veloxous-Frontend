import React, { useEffect, useState } from 'react';
import './EscrowTimeline.css';

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface EscrowTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="vx-timeline-icon">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CurrentIcon = () => (
  <div className="vx-timeline-current-dot" />
);

export const EscrowTimeline: React.FC<EscrowTimelineProps> = ({ steps, className = '' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className={`vx-timeline ${className} ${mounted ? 'vx-timeline--mounted' : ''}`}>
      <div className="vx-timeline__container">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div 
              key={step.id} 
              className={`vx-timeline__item vx-timeline__item--${step.status}`}
              style={{ animationDelay: `calc(var(--stagger-list) * ${index})` }}
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
                {step.date && (
                  <span className="vx-timeline__date">{step.date}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
