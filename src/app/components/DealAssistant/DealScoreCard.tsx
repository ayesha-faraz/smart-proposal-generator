import type { ScoreDealFitOutput } from "../../lib/ai/types";

function Metric({ label, value, inverse = false }: { label: string; value: number; inverse?: boolean }) {
  return (
    <div
      className="p-3 rounded-xl text-center"
      style={{ backgroundColor: inverse ? "rgba(200,80,80,0.08)" : "rgba(227,238,212,0.55)" }}
    >
      <div className="text-lg font-bold" style={{ color: inverse ? "#b94b4b" : "#375534" }}>
        {value}%
      </div>
      <div className="text-[11px]" style={{ color: "#6B9071" }}>{label}</div>
    </div>
  );
}

export function DealScoreCard({
  agencyName,
  dealTitle,
  result,
}: {
  agencyName: string;
  dealTitle: string;
  result: ScoreDealFitOutput;
}) {
  return (
    <div
      className="p-5 rounded-[16px]"
      style={{
        backgroundColor: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(174,195,176,0.35)",
        boxShadow: "0 4px 24px rgba(15,42,29,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold" style={{ color: "#0F2A1D" }}>{agencyName}</h3>
        <span
          className="px-3 py-1 rounded-full text-xs"
          style={{ backgroundColor: "#375534", color: "#FFFFFF" }}
        >
          Deal Score {result.dealScore}
        </span>
      </div>
      <p className="text-xs mb-3" style={{ color: "#6B9071" }}>for {dealTitle}</p>

      <div className="grid grid-cols-5 gap-3 mb-3">
        <Metric label="Fit" value={result.fit} />
        <Metric label="Quality" value={result.quality} />
        <Metric label="Fair Price" value={result.priceFairness} />
        <Metric label="Risk" value={result.risk} inverse />
        <Metric label="Delivery" value={result.deliveryConfidence} />
      </div>

      {result.reasons.length > 0 && (
        <ul className="space-y-1 mb-3">
          {result.reasons.map((reason, i) => (
            <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "#375534" }}>
              <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "#6B9071" }} />
              {reason}
            </li>
          ))}
        </ul>
      )}

      {result.missingSignals.length > 0 && (
        <p className="text-[11px] mb-3" style={{ color: "#6B9071" }}>
          Not yet known: {result.missingSignals.join(", ")}
        </p>
      )}

      <p className="text-sm" style={{ color: "#375534" }}>{result.recommendation}</p>
    </div>
  );
}
