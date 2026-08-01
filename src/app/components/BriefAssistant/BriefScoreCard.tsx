interface BriefScoreCardProps {
  result: {
    score: number;
    tier: "needs-info" | "promising" | "strong";
    reasons: string[];
    missingSignals: string[];
    recommendedNextStep: string;
  };
}

const tierLabels = {
  "needs-info": "Needs info",
  promising: "Promising",
  strong: "Strong",
};

export function BriefScoreCard({ result }: BriefScoreCardProps) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p style={{ margin: 0, color: "#8a7f78", fontSize: 12 }}>Brief readiness</p>
          <strong style={{ color: "#f5f0eb", fontSize: 28 }}>{result.score}%</strong>
        </div>
        <span
          style={{
            borderRadius: 999,
            padding: "6px 10px",
            color: "#f5f0eb",
            background: result.tier === "strong" ? "rgba(232,113,42,0.22)" : "rgba(240,168,78,0.16)",
            border: "1px solid rgba(232,113,42,0.32)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {tierLabels[result.tier]}
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div
          style={{
            width: `${result.score}%`,
            height: "100%",
            background: "linear-gradient(90deg, #e8712a, #f0a84e)",
          }}
        />
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, color: "#d8d0c8", lineHeight: 1.6 }}>
        {result.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      {result.missingSignals.length > 0 && (
        <p style={{ margin: 0, color: "#8a7f78", fontSize: 13 }}>
          Missing: {result.missingSignals.join(", ")}
        </p>
      )}
      <div
        style={{
          borderRadius: 14,
          padding: 14,
          background: "rgba(232,113,42,0.1)",
          border: "1px solid rgba(232,113,42,0.22)",
          color: "#f5f0eb",
          fontSize: 13,
          lineHeight: 1.55,
        }}
      >
        {result.recommendedNextStep}
      </div>
    </div>
  );
}
