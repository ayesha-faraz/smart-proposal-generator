import { useState } from "react";
import type { RequestAgencyIntroInput, RequestAgencyIntroOutput } from "../../lib/ai/types";

export function AgencyIntroConfirmation({
  input,
  onResolve,
}: {
  input: RequestAgencyIntroInput;
  onResolve: (output: RequestAgencyIntroOutput) => void;
}) {
  const [pending, setPending] = useState<"approve" | "decline" | null>(null);

  return (
    <div
      className="p-5 rounded-[16px]"
      style={{ backgroundColor: "rgba(255,255,255,0.72)", border: "1px solid rgba(174,195,176,0.35)" }}
    >
      <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "#6B9071" }}>
        Confirm action
      </p>
      <p className="text-sm mb-4" style={{ color: "#375534" }}>
        Request an introduction to{" "}
        <span className="font-semibold" style={{ color: "#0F2A1D" }}>{input.agencyName}</span> for{" "}
        <span className="font-semibold" style={{ color: "#0F2A1D" }}>{input.dealTitle}</span> (score {input.dealScore})?
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => {
            setPending("approve");
            onResolve({ status: "requested" });
          }}
          className="flex-1 px-4 py-2 rounded-full text-sm font-medium"
          style={{ backgroundColor: "#375534", color: "#FFFFFF", opacity: pending ? 0.6 : 1 }}
        >
          {pending === "approve" ? "Requesting…" : "Request intro"}
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => {
            setPending("decline");
            onResolve({ status: "skipped" });
          }}
          className="flex-1 px-4 py-2 rounded-full text-sm font-medium"
          style={{ backgroundColor: "transparent", border: "1px solid rgba(174,195,176,0.5)", color: "#375534", opacity: pending ? 0.6 : 1 }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
