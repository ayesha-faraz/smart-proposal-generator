import { BriefScoreCard } from "./BriefScoreCard";
import { PriorityConfirmation } from "./PriorityConfirmation";

interface ToolPartsProps {
  part: any;
  addToolResult: (result: any) => void;
}

function ToolShell({ title, children, accent = "#e8712a" }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 16,
        background: "#141210",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
      }}
    >
      <p style={{ margin: "0 0 12px", color: accent, fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export function BriefScoreSkeleton() {
  const block = (width: string, height = 12) => (
    <div style={{ width, height, borderRadius: 999, background: "rgba(255,255,255,0.08)" }} />
  );

  return (
    <ToolShell title="Scoring brief">
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "grid", gap: 8 }}>
            {block("96px", 10)}
            {block("64px", 30)}
          </div>
          {block("92px", 28)}
        </div>
        {block("100%", 8)}
        <div style={{ display: "grid", gap: 8 }}>
          {block("88%")}
          {block("76%")}
          {block("68%")}
        </div>
        <div
          style={{
            height: 58,
            borderRadius: 14,
            background: "rgba(232,113,42,0.08)",
            border: "1px solid rgba(232,113,42,0.16)",
          }}
        />
      </div>
    </ToolShell>
  );
}

export function ToolParts({ part, addToolResult }: ToolPartsProps) {
  if (part.type === "tool-scoreBrief") {
    if (part.state === "input-streaming" || part.state === "input-available") {
      return <BriefScoreSkeleton />;
    }

    if (part.state === "output-available") {
      return (
        <ToolShell title="Brief score ready">
          <BriefScoreCard result={part.output} />
        </ToolShell>
      );
    }

    if (part.state === "output-error") {
      return (
        <ToolShell title="Brief score failed" accent="#d4183d">
          <p style={{ margin: 0, color: "#d8d0c8" }}>The score tool failed. Try again with a shorter brief.</p>
        </ToolShell>
      );
    }
  }

  if (part.type === "tool-markPriorityOpportunity") {
    if (part.state === "input-streaming") {
      return (
        <ToolShell title="Preparing confirmation">
          <p style={{ margin: 0, color: "#8a7f78" }}>Checking whether this should be marked as priority...</p>
        </ToolShell>
      );
    }

    if (part.state === "input-available") {
      return (
        <ToolShell title="Confirm action">
          <PriorityConfirmation
            input={part.input}
            onResolve={(output) =>
              addToolResult({
                tool: "markPriorityOpportunity",
                toolCallId: part.toolCallId,
                output,
              })
            }
          />
        </ToolShell>
      );
    }

    if (part.state === "output-available") {
      return (
        <ToolShell title="Priority updated">
          <p style={{ margin: 0, color: "#d8d0c8" }}>
            {part.output?.status === "marked" ? "Marked as priority." : "Skipped priority marking."}
          </p>
        </ToolShell>
      );
    }

    if (part.state === "output-error") {
      return (
        <ToolShell title="Priority action failed" accent="#d4183d">
          <p style={{ margin: 0, color: "#d8d0c8" }}>The confirmation action failed. You can keep working without it.</p>
        </ToolShell>
      );
    }
  }

  return null;
}
