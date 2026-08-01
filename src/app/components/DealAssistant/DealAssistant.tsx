import { useMemo, useState, type FormEvent } from "react";
import { AlertTriangle, RefreshCw, Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ScoreDealFitPartView, RequestAgencyIntroPartView } from "./ToolParts";
import type { ChatUIMessage } from "../../lib/ai/types";

const examplePrompts = [
  "Score NovaWorks for the RetailCo e-commerce redesign. They proposed PKR 2,200,000, responded fast, and have similar checkout work.",
  "Compare PixelForge Studio for a healthcare content deal. Budget is PKR 800,000, timeline is 3 months, and their track record is unverified.",
  "Northstar Digital proposed PKR 2,700,000 for a mobile storefront rebuild. Services match, timeline is realistic, and delivery history is strong.",
];

function classifyChatError(error: Error | undefined) {
  const message = error?.message ?? "";
  const lower = message.toLowerCase();

  if (lower.includes("429") || lower.includes("rate limit") || lower.includes("too many requests")) {
    return {
      title: "Propel AI is cooling down",
      detail: "The model is rate-limited right now. Wait a moment, then retry this message.",
    };
  }

  if (lower.includes("network") || lower.includes("fetch") || lower.includes("failed to fetch") || lower.includes("offline")) {
    return {
      title: "Connection dropped",
      detail: "Your message was not completed because the connection failed. Check your network, then retry.",
    };
  }

  if (lower.includes("stream") || lower.includes("aborted") || lower.includes("terminated")) {
    return {
      title: "The AI response stopped early",
      detail: "The model started responding but the stream ended before the score was complete.",
    };
  }

  return {
    title: "Propel AI could not finish",
    detail: "Something interrupted this scoring request. Retry the last message when you are ready.",
  };
}

export function DealAssistant() {
  const [input, setInput] = useState("");
  const [lastError, setLastError] = useState<Error | undefined>();
  const [isRetrying, setIsRetrying] = useState(false);
  const { messages, sendMessage, status, addToolResult, error, regenerate } = useChat<ChatUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
    onError: (chatError) => {
      console.error("DealAssistant chat failure", chatError);
      setLastError(chatError);
      setIsRetrying(false);
    },
  });

  const visibleError = error ?? lastError;
  const errorCopy = classifyChatError(visibleError);
  const isBusy = status === "streaming" || status === "submitted";
  const isWaitingForFirstResponse = useMemo(() => {
    if (status !== "submitted") return false;
    const lastMessage = messages[messages.length - 1];
    return !lastMessage || lastMessage.role === "user" || lastMessage.parts.length === 0;
  }, [messages, status]);
  const hasNoUsefulAssistantResult = useMemo(() => {
    if (isBusy || visibleError || messages.length === 0) return false;
    const assistantMessages = messages.filter((message) => message.role === "assistant");
    const lastAssistant = assistantMessages[assistantMessages.length - 1];
    if (!lastAssistant) return false;
    return lastAssistant.parts.every((part) => part.type === "text" && !part.text.trim());
  }, [isBusy, messages, visibleError]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLastError(undefined);
    sendMessage({ text: input });
    setInput("");
  };

  const handleRetry = async () => {
    if (isBusy || isRetrying) return;
    setIsRetrying(true);
    setLastError(undefined);
    try {
      await regenerate();
    } catch (retryError) {
      setLastError(retryError instanceof Error ? retryError : new Error("Retry failed"));
    } finally {
      setIsRetrying(false);
    }
  };

  const chooseExample = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 max-h-[min(420px,calc(100dvh-260px))] overflow-y-auto overscroll-contain pr-1">
        {messages.length === 0 && <EmptyState onSelect={chooseExample} />}
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-2">
            {message.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <p key={i} className="text-sm" style={{ color: "#375534" }}>
                    {part.text}
                  </p>
                );
              }
              if (part.type === "tool-scoreDealFit") {
                return <ScoreDealFitPartView key={part.toolCallId} part={part} />;
              }
              if (part.type === "tool-requestAgencyIntro") {
                return (
                  <RequestAgencyIntroPartView
                    key={part.toolCallId}
                    part={part}
                    onResolve={(output) =>
                      addToolResult({ tool: "requestAgencyIntro", toolCallId: part.toolCallId, output })
                    }
                  />
                );
              }
              return null;
            })}
          </div>
        ))}
        {isWaitingForFirstResponse && <DealScoreSkeleton />}
        {hasNoUsefulAssistantResult && <NoResultsState onSelect={chooseExample} />}
        {visibleError && (
          <ChatErrorCard
            title={errorCopy.title}
            detail={errorCopy.detail}
            isRetrying={isRetrying || isBusy}
            onRetry={handleRetry}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the agency and the deal..."
          className="flex-1 px-4 py-2.5 rounded-full text-sm min-w-0"
          style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(174,195,176,0.4)", color: "#0F2A1D" }}
        />
        <button
          type="submit"
          disabled={isBusy || !input.trim()}
          className="px-5 py-2.5 rounded-full font-medium text-sm"
          style={{ backgroundColor: "#375534", color: "#FFFFFF", opacity: isBusy || !input.trim() ? 0.6 : 1 }}
        >
          {status === "submitted" ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}

function EmptyState({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div
      className="p-5 rounded-[16px]"
      style={{ backgroundColor: "rgba(255,255,255,0.55)", border: "1px solid rgba(174,195,176,0.35)" }}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(174,195,176,0.28)", color: "#375534" }}>
          <Sparkles size={18} />
        </span>
        <div>
          <h3 className="font-semibold mb-1" style={{ color: "#0F2A1D" }}>Score an agency proposal</h3>
          <p className="text-sm" style={{ color: "#6B9071" }}>Give me the agency, deal, price, and one trust signal. I will score the fit and flag missing proof.</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {examplePrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelect(prompt)}
            className="text-left p-3 rounded-xl text-sm transition-all hover:scale-[1.01]"
            style={{ backgroundColor: "rgba(227,238,212,0.42)", color: "#375534", border: "1px solid rgba(174,195,176,0.35)" }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function DealScoreSkeleton() {
  const metricWidths = ["70%", "62%", "76%", "54%", "68%"];
  return (
    <div
      className="p-5 rounded-[16px]"
      style={{ backgroundColor: "rgba(255,255,255,0.72)", border: "1px solid rgba(174,195,176,0.35)", boxShadow: "0 4px 24px rgba(15,42,29,0.06)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <SkeletonLine width="130px" height="16px" />
        <SkeletonLine width="92px" height="24px" radius="999px" />
      </div>
      <SkeletonLine width="160px" height="12px" className="mb-3" />
      <div className="grid grid-cols-5 gap-3 mb-3">
        {metricWidths.map((width) => (
          <div key={width} className="p-3 rounded-xl text-center" style={{ backgroundColor: "rgba(227,238,212,0.55)" }}>
            <SkeletonLine width={width} height="18px" className="mx-auto mb-2" />
            <SkeletonLine width="58%" height="10px" className="mx-auto" />
          </div>
        ))}
      </div>
      <SkeletonLine width="94%" height="11px" />
      <SkeletonLine width="82%" height="11px" />
      <SkeletonLine width="70%" height="11px" className="mb-3" />
      <SkeletonLine width="88%" height="13px" />
    </div>
  );
}

function SkeletonLine({ width, height, radius = "6px", className = "mb-1.5" }: { width: string; height: string; radius?: string; className?: string }) {
  return <div className={className} style={{ width, height, borderRadius: radius, backgroundColor: "rgba(174,195,176,0.3)" }} />;
}

function NoResultsState({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="p-4 rounded-[16px]" style={{ backgroundColor: "rgba(227,238,212,0.35)", border: "1px solid rgba(174,195,176,0.35)" }}>
      <p className="text-sm font-medium mb-1" style={{ color: "#0F2A1D" }}>I need one more signal to score this well.</p>
      <p className="text-xs mb-3" style={{ color: "#6B9071" }}>Try adding price, timeline realism, responsiveness, or whether the agency has done similar work.</p>
      <button type="button" onClick={() => onSelect(examplePrompts[0])} className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: "#375534", color: "#FFFFFF" }}>
        Use an example
      </button>
    </div>
  );
}

function ChatErrorCard({ title, detail, isRetrying, onRetry }: { title: string; detail: string; isRetrying: boolean; onRetry: () => void }) {
  return (
    <div
      className="p-4 rounded-[16px] transition-all"
      style={{ backgroundColor: "rgba(200,80,80,0.08)", border: "1px solid rgba(200,80,80,0.18)", color: "#b94b4b" }}
    >
      <div className="flex items-start gap-3">
        <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(200,80,80,0.14)" }}>
          <AlertTriangle size={17} />
        </span>
        <div className="flex-1">
          <h3 className="font-semibold mb-1" style={{ color: "#b94b4b" }}>{title}</h3>
          <p className="text-sm mb-3" style={{ color: "#6B9071" }}>{detail}</p>
          <button
            type="button"
            disabled={isRetrying}
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#FFFFFF", color: "#b94b4b", opacity: isRetrying ? 0.65 : 1, border: "1px solid rgba(200,80,80,0.2)" }}
          >
            <RefreshCw size={14} />
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
        </div>
      </div>
    </div>
  );
}
