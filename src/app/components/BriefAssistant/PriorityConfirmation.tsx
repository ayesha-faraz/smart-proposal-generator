interface PriorityConfirmationProps {
  input: {
    clientName: string;
    tier: string;
    score: number;
  };
  onResolve: (output: { status: "marked" } | { status: "skipped" }) => void;
}

export function PriorityConfirmation({ input, onResolve }: PriorityConfirmationProps) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0, color: "#f5f0eb", fontWeight: 700 }}>
        Mark {input.clientName} as priority?
      </p>
      <p style={{ margin: 0, color: "#8a7f78", fontSize: 13 }}>
        This brief scored {input.score}% and is tagged {input.tier}.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => onResolve({ status: "marked" })}
          style={{
            borderRadius: 999,
            border: 0,
            padding: "9px 14px",
            background: "#e8712a",
            color: "#f5f0eb",
            fontWeight: 700,
          }}
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => onResolve({ status: "skipped" })}
          style={{
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "9px 14px",
            background: "rgba(255,255,255,0.04)",
            color: "#f5f0eb",
            fontWeight: 700,
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
