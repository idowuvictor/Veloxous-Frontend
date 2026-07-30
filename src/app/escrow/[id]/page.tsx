"use client";

import { use } from "react";
import { EscrowTimeline, TimelineStep } from "@/components";

export default function EscrowTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Mock data for the timeline
  const timelineSteps: TimelineStep[] = [
    {
      id: "1",
      title: "Agreement Signed",
      description: "Both parties have agreed to the terms of the transaction.",
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
      status: "completed",
    },
    {
      id: "2",
      title: "Escrow Funded",
      description: "Funds have been secured in the Stellar smart contract.",
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      status: "completed",
    },
    {
      id: "3",
      title: "Conditions Met",
      description: "Awaiting confirmation that all conditions are satisfied.",
      status: "current",
    },
    {
      id: "4",
      title: "Funds Released",
      description: "Transaction completed and funds released to the seller.",
      status: "upcoming",
    },
  ];

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
        <EscrowTimeline steps={timelineSteps} />
      </section>
    </div>
  );
}
