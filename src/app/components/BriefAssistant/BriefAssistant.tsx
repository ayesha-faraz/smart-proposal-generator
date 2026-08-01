import { FormEvent, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AlertTriangle, RefreshCw, Send, Sparkles } from "lucide-react";
import { BriefScoreSkeleton, ToolParts } from "./ToolParts";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? window.location.origin : "http://localhost:4000");

const examplePrompts = [
  "Score a brief for UrbanNest Realty in real estate. Budget USD 12,000, urgent timeline. They need 120 qualified buyer leads in 90 days.",
  "Check if a SaaS landing page brief for CloudPilot is ready. Budget PKR 900,000, launch needed soon, goal is higher demo bookings.",
  "Review a restaurant branding brief for Ember Table. Budget USD 6,500, consultative pace, target audience is young professionals.",
];

function classifyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const lower = message.toLowerCase();

  if (lower.includes("429") || lower.includes("rate limit")) {
    return {
      title: "AI is rate-limited",
      body: "Groq is receiving too many requests right now. Wait a moment, then retry this brief.",
    };
  }

  if (lower.includes("failed to fetch") || lower.includes("network") || lower.includes("cors") || lower.includes("connection")) {
    return {
      title: "Cannot reach the AI backend",
      body: "The separate backend did not respond. This can happen if the API is offline, cold-starting, blocked by CORS, or your connection dropped.",
    };
  }

  if (lower.includes("aborted") || lower.includes("terminated") || lower.includes("stream")) {
    return {
      title: "Response stopped mid-stream",
      body: "The model started responding but the stream ended early. Retry will resend only the last failed message.",
    };
  }

  return {
    title: "Brief assistant failed",
    body: "The AI assistant hit a temporary problem. Retry will resend the last failed message.",
  };
}

function ChatErrorCard({ error, busy, onRetry }: { error: unknown; busy: boolean; onRetry: () => void }) {
  const copy = classifyError(error);

  return (
    <div
      style={{
        borderRadius: 18,
        padding: 16,
        background: "rgba(212,24,61,0.08)",
        border: "1px solid rgba(212,24,61,0.24)",
        transition: "opacity 180ms ease, transform 180ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <AlertTriangle size={20} style={{ color: "#d4183d", flex: "0 0 auto", marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 4px", color: "#f5f0eb", fontWeight: 800 }}>{copy.title}</p>
          <p style={{ margin: "0 0 12px", color: "#c7bdb5", fontSize: 13, lineHeight: 1.55 }}>{copy.body}</p>
          <button
            type="button"
            onClick={onRetry}
            disabled={busy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              border: "1px solid rgba(212,24,61,0.28)",
              background: "rgba(20,18,16,0.78)",
              color: "#f5f0eb",
              padding: "9px 13px",
              fontSize: 13,
              fontWeight: 800,
              opacity: busy ? 0.65 : 1,
            }}
          >
            <RefreshCw size={15} />
            {busy ? "Retrying..." : "Retry"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 18,
        background: "#141210",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Sparkles size={18} style={{ color: "#e8712a" }} />
        <p style={{ margin: 0, color: "#f5f0eb", fontWeight: 800 }}>Check if this brief is ready</p>
      </div>
      <p style={{ margin: "0 0 14px", color: "#8a7f78", fontSize: 13, lineHeight: 1.55 }}>
        Paste client context, budget, urgency, and the goal. I will score what is strong and what still needs proof.
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {examplePrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPick(prompt)}
            style={{
              textAlign: "left",
              borderRadius: 14,
              border: "1px solid rgba(232,113,42,0.18)",
              background: "rgba(232,113,42,0.08)",
              color: "#f5f0eb",
              padding: 12,
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BriefAssistant() {
  const [input, setInput] = useState("");
  const [lastError, setLastError] = useState<unknown>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage, status, error, regenerate, addToolResult } = useChat({
    transport: new DefaultChatTransport({ api: `${API_BASE}/api/ai/chat` }),
    onError: (chatError) => {
      console.error("Brief assistant failed", chatError);
      setLastError(chatError);
      setIsRetrying(false);
    },
  });

  const busy = status === "submitted" || status === "streaming";
  const visibleError = error || lastError;
  const hasMessages = messages.length > 0;
  const lastMessage = messages[messages.length - 1];
  const waitingForFirstPart = busy && lastMessage?.role === "user";
  const noUsefulResult = useMemo(() => {
    if (busy || visibleError || messages.length < 2) return false;
    const last = messages[messages.length - 1] as any;
    if (last.role !== "assistant") return false;
    return !last.parts?.some((part: any) => {
      if (part.type === "text") return part.text?.trim().length > 8;
      return part.type?.startsWith("tool-");
    });
  }, [busy, messages, visibleError]);

  const sendPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || busy) return;
    setInput("");
    setLastError(null);
    await sendMessage({ text: trimmed });
    window.requestAnimationFrame(() => listRef.current?.scrollIntoView({ block: "end" }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendPrompt(input);
  };

  const handleRetry = async () => {
    if (busy || isRetrying) return;
    setIsRetrying(true);
    setLastError(null);
    try {
      await regenerate();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <section
      style={{
        borderRadius: 20,
        padding: 16,
        background: "rgba(20,18,16,0.84)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
        display: "grid",
        gap: 14,
      }}
    >
      <div>
        <p style={{ margin: 0, color: "#f5f0eb", fontWeight: 800 }}>Brief assistant</p>
        <p style={{ margin: "4px 0 0", color: "#8a7f78", fontSize: 13 }}>
          Score the brief before generating the proposal.
        </p>
      </div>

      <div style={{ display: "grid", gap: 12, overflow: "visible" }}>
        {!hasMessages && <EmptyState onPick={setInput} />}
        {messages.map((message: any) => (
          <div key={message.id} style={{ display: "grid", justifyItems: message.role === "user" ? "end" : "start", gap: 10 }}>
            {message.parts?.map((part: any, index: number) => {
              if (part.type === "text" && part.text?.trim()) {
                return (
                  <div
                    key={`${message.id}-${index}`}
                    style={{
                      maxWidth: "min(100%, 680px)",
                      borderRadius: 16,
                      padding: "12px 14px",
                      background: message.role === "user" ? "rgba(232,113,42,0.16)" : "#141210",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#f5f0eb",
                      fontSize: 14,
                      lineHeight: 1.55,
                    }}
                  >
                    {part.text}
                  </div>
                );
              }

              return <ToolParts key={`${message.id}-${index}`} part={part} addToolResult={addToolResult} />;
            })}
          </div>
        ))}
        {waitingForFirstPart && <BriefScoreSkeleton />}
        {noUsefulResult && (
          <div style={{ borderRadius: 16, padding: 14, background: "#141210", border: "1px solid rgba(255,255,255,0.06)", color: "#8a7f78" }}>
            No clear recommendation yet. Add the client name, industry, budget, urgency, and goal, then send again.
          </div>
        )}
        {visibleError && <ChatErrorCard error={visibleError} busy={busy || isRetrying} onRetry={handleRetry} />}
        <div ref={listRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={3}
          placeholder="Paste a brief with client, industry, budget, urgency, and goal..."
          style={{
            flex: "1 1 260px",
            minWidth: 0,
            resize: "vertical",
            borderRadius: 16,
            padding: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#f5f0eb",
            outline: "none",
            fontFamily: "DM Sans, Inter, sans-serif",
          }}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          style={{
            borderRadius: 999,
            border: 0,
            padding: "12px 16px",
            background: "#e8712a",
            color: "#f5f0eb",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            opacity: busy || !input.trim() ? 0.58 : 1,
          }}
        >
          <Send size={16} />
          Send
        </button>
      </form>
    </section>
  );
}
