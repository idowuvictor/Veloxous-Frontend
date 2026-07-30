"use client";

import { use, useState } from "react";
import { EscrowTimeline, TimelineStep } from "@/components";

export default function EscrowTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Mock data for the timeline
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([
    {
      id: "1",
      title: "Agreement Signed",
      description: "Both parties have agreed to the terms of the transaction.",
      date: "Jul 28, 2026",
      status: "completed",
      txHash: "mocktxhash1111"
    },
    {
      id: "2",
      title: "Escrow Funded",
      description: "Funds have been secured in the Stellar smart contract.",
      date: "Jul 29, 2026",
      status: "completed",
      txHash: "mocktxhash2222"
    },
    {
      id: "3",
      title: "Conditions Met",
      description: "Awaiting confirmation that all conditions are satisfied.",
      status: "current",
      actionRequired: "buyer_confirm"
    },
    {
      id: "4",
      title: "Funds Released",
      description: "Transaction completed and funds released to the seller.",
      status: "upcoming",
    },
  ]);

  const handleAction = (stepId: string, actionType: 'release' | 'dispute') => {
     alert(`Action: ${actionType} triggered for step ${stepId} by ${userRole}`);
     if (actionType === 'release') {
         setTimelineSteps((steps: TimelineStep[]) => steps.map((s: TimelineStep) => {
             if (s.id === '3') return { ...s, status: 'completed' };
             if (s.id === '4') return { ...s, status: 'released', timestamp: Date.now(), txHash: 'mocktxhashfinal' };
             return s;
         }));
     } else if (actionType === 'dispute') {
         setTimelineSteps((steps: TimelineStep[]) => steps.map((s: TimelineStep) => {
             if (s.id === '3') return { ...s, status: 'disputed', description: "Transaction is currently in dispute." };
             return s;
         }));
     }
  };

  return (
    <div className="vx-shell__main" style={{ padding: "var(--space-xl)" }}>
      <header style={{ marginBottom: "var(--space-2xl)" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", color: "var(--text-strong)" }}>
          Escrow Transaction
        </h1>
        <p style={{ margin: "var(--space-xs) 0 0", color: "var(--text-secondary)" }}>
          ID: {id}
        </p>
      </header>

      <section style={{ maxWidth: "600px" }}>
        <div style={{ marginBottom: "var(--space-md)" }}>
           <label style={{ marginRight: "var(--space-sm)", fontWeight: "bold" }}>View As:</label>
           <select 
             value={userRole} 
             onChange={(e) => setUserRole(e.target.value as 'buyer' | 'seller')}
             style={{ padding: "var(--space-xs)", borderRadius: "4px" }}
           >
             <option value="buyer">Buyer</option>
             <option value="seller">Seller</option>
           </select>
        </div>
        <EscrowTimeline 
           steps={timelineSteps} 
           userRole={userRole} 
           onAction={handleAction} 
        />
      </section>
    </div>
  );
}
