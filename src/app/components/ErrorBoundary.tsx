import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Screen render failed", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: "var(--background, #060404)",
          color: "var(--foreground, #f5f0eb)",
          fontFamily: "DM Sans, Inter, sans-serif",
        }}
      >
        <div
          className="w-full max-w-md rounded-[20px] p-6"
          style={{
            background: "var(--card, #141210)",
            border: "1px solid var(--border, rgba(255,255,255,0.06))",
            boxShadow: "0 18px 60px rgba(0,0,0,0.32)",
          }}
        >
          <div
            className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full"
            style={{
              background: "rgba(232,113,42,0.12)",
              color: "var(--primary, #e8712a)",
            }}
          >
            <AlertTriangle size={22} aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold" style={{ color: "var(--foreground, #f5f0eb)" }}>
            Something went wrong
          </h1>
          <p className="mb-5 text-sm leading-6" style={{ color: "var(--muted-foreground, #8a7f78)" }}>
            The proposal screen hit an unexpected display problem. Reload to return to a clean state.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full px-5 py-3 text-sm font-semibold transition-all"
            style={{
              background: "var(--primary, #e8712a)",
              color: "var(--foreground, #f5f0eb)",
              boxShadow: "0 0 22px rgba(232,113,42,0.28)",
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
