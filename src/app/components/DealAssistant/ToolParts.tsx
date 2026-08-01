import { DealScoreCard } from "./DealScoreCard";
import { AgencyIntroConfirmation } from "./AgencyIntroConfirmation";
import type { ChatUIMessage, RequestAgencyIntroOutput } from "../../lib/ai/types";

type MessagePart = ChatUIMessage["parts"][number];
type ScoreDealFitPart = Extract<MessagePart, { type: "tool-scoreDealFit" }>;
type RequestAgencyIntroPart = Extract<MessagePart, { type: "tool-requestAgencyIntro" }>;

function ToolShell({
  accentBg,
  accentColor,
  icon,
  label,
  children,
}: {
  accentBg: string;
  accentColor: string;
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-4 rounded-[16px]"
      style={{
        backgroundColor: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(174,195,176,0.35)",
        transition: "opacity 200ms ease-out",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
          style={{ backgroundColor: accentBg, color: accentColor }}
        >
          {icon}
        </span>
        <span className="text-xs" style={{ color: "#6B9071" }}>{label}</span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Skeleton({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="h-3 rounded mb-1.5"
      style={{ width, backgroundColor: "rgba(174,195,176,0.3)" }}
    />
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-xs mr-1.5 mb-1.5"
      style={{ border: "1px solid rgba(174,195,176,0.5)", color: "#375534" }}
    >
      {children}
    </span>
  );
}

/* ---- scoreDealFit: 4 states ---------------------------------------- */

export function ScoreDealFitPartView({ part }: { part: ScoreDealFitPart }) {
  switch (part.state) {
    case "input-streaming":
      return (
        <ToolShell accentBg="rgba(174,195,176,0.35)" accentColor="#0F2A1D" icon="…" label="Reading the deal">
          {part.input?.agencyName ? (
            <p className="text-sm mb-2" style={{ color: "#0F2A1D" }}>{part.input.agencyName}</p>
          ) : (
            <Skeleton width="130px" />
          )}
          <Skeleton />
          <Skeleton width="65%" />
        </ToolShell>
      );

    case "input-available":
      return (
        <ToolShell accentBg="rgba(174,195,176,0.35)" accentColor="#0F2A1D" icon="…" label="Scoring deal fit">
          <div>
            <Chip>{part.input.agencyName}</Chip>
            <Chip>{part.input.dealTitle}</Chip>
            {part.input.proposedPrice && <Chip>PKR {part.input.proposedPrice.toLocaleString()}</Chip>}
            {part.input.responsiveness && <Chip>{part.input.responsiveness} responses</Chip>}
          </div>
        </ToolShell>
      );

    case "output-available":
      return <DealScoreCard agencyName={part.input.agencyName} dealTitle={part.input.dealTitle} result={part.output} />;

    case "output-error":
      return (
        <ToolShell accentBg="rgba(200,80,80,0.18)" accentColor="#b94b4b" icon="!" label="Couldn't score this deal">
          <p className="text-sm mb-1.5" style={{ color: "#b94b4b" }}>{part.errorText}</p>
          <p className="text-[11px]" style={{ color: "#6B9071" }}>
            Add a bit more detail — price, track record, or timeline — and try again.
          </p>
        </ToolShell>
      );

    default:
      return null;
  }
}

/* ---- requestAgencyIntro: 4 states, input-available -> confirm UI --- */

export function RequestAgencyIntroPartView({
  part,
  onResolve,
}: {
  part: RequestAgencyIntroPart;
  onResolve: (output: RequestAgencyIntroOutput) => void;
}) {
  switch (part.state) {
    case "input-streaming":
      return (
        <ToolShell accentBg="rgba(174,195,176,0.35)" accentColor="#0F2A1D" icon="…" label="Preparing request">
          <Skeleton width="150px" />
        </ToolShell>
      );

    case "input-available":
      return <AgencyIntroConfirmation input={part.input} onResolve={onResolve} />;

    case "output-available":
      return part.output.status === "requested" ? (
        <ToolShell accentBg="rgba(55,85,52,0.18)" accentColor="#375534" icon="✓" label="Intro requested">
          <p className="text-sm" style={{ color: "#375534" }}>
            We'll notify {part.input.agencyName} about {part.input.dealTitle}.
          </p>
        </ToolShell>
      ) : (
        <ToolShell accentBg="rgba(174,195,176,0.35)" accentColor="#6B9071" icon="–" label="Skipped">
          <p className="text-sm" style={{ color: "#6B9071" }}>No introduction requested.</p>
        </ToolShell>
      );

    case "output-error":
      return (
        <ToolShell accentBg="rgba(200,80,80,0.18)" accentColor="#b94b4b" icon="!" label="Couldn't send the request">
          <p className="text-sm" style={{ color: "#b94b4b" }}>{part.errorText}</p>
        </ToolShell>
      );

    default:
      return null;
  }
}
