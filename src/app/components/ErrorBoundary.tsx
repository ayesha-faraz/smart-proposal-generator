import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Route render failure", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[60dvh] flex items-center justify-center p-6">
        <div
          className="max-w-md w-full p-6 rounded-[20px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(174,195,176,0.35)",
            boxShadow: "0 4px 24px rgba(15,42,29,0.06)",
          }}
        >
          <div className="flex items-start gap-3">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(200,80,80,0.12)", color: "#b94b4b" }}
            >
              <AlertTriangle size={20} />
            </span>
            <div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#0F2A1D" }}>
                Something went wrong
              </h2>
              <p className="text-sm mb-4" style={{ color: "#6B9071" }}>
                This view hit an unexpected problem. Reload the page to reset the workspace.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-full font-medium text-sm"
                style={{ backgroundColor: "#375534", color: "#FFFFFF" }}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
