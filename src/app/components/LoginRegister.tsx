import { useState, useEffect } from "react";
import { Zap, Eye, EyeOff } from "lucide-react";
import { BackgroundOrbs } from "./BackgroundOrbs";
import {
  sendPasswordReset,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  validateStrongPassword,
  type UserRole,
} from "../lib/supabase";

interface LoginRegisterProps {
  onLogin: () => void;
}

export function LoginRegister({ onLogin }: LoginRegisterProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
    role: "agency" as Exclude<UserRole, "admin">,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [fadeContent, setFadeContent] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleTabSwitch = (tab: "login" | "register") => {
    setFadeContent(true);
    setTimeout(() => {
      setActiveTab(tab);
      setErrors({});
      setFadeContent(false);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    setNotice("");

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (activeTab === "register") {
      const passwordError = validateStrongPassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (activeTab === "register") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.businessName) {
        newErrors.businessName = "Business name is required";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        if (activeTab === "register") {
          await signUpWithEmail({
            email: formData.email,
            password: formData.password,
            name: formData.fullName,
            businessName: formData.businessName,
            role: formData.role,
          });
          setNotice("Check your email to verify your account before signing in.");
          setActiveTab("login");
          return;
        }

        await signInWithEmail(formData.email, formData.password);
        onLogin();
      } catch (error) {
        console.error("Supabase login/register failed", error);
        const message = error instanceof Error ? error.message : "Authentication failed. Please try again.";
        setErrors({ credentials: message });
        setShakeError(true);
        setTimeout(() => setShakeError(false), 400);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      setErrors({ email: "Enter your account email first" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setNotice("");
    try {
      await sendPasswordReset(formData.email);
      setNotice("Password reset link sent. Check your email.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send reset email.";
      setErrors({ credentials: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrors({});
    setNotice("");
    try {
      await signInWithGoogle();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google login is not available yet.";
      setErrors({ credentials: message });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 page-transition"
      style={{ background: "#060404" }}
    >
      {/* Background Gradients */}
      <BackgroundOrbs />

      {/* Login/Register Card */}
      <div
        className="relative w-full max-w-[440px] p-10 rounded-3xl fadeInUp"
        style={{
          background: "rgba(6, 4, 4, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          backdropFilter: "blur(20px)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5)",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Zap className="w-6 h-6" style={{ color: "#e8712a" }} />
          <span
            className="text-2xl"
            style={{
              fontFamily: "Mona Sans, sans-serif",
              fontWeight: "700",
              color: "#f5f0eb",
            }}
          >
            Propel
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={() => handleTabSwitch("login")}
            className="flex-1 py-3 rounded-full"
            style={{
              background: activeTab === "login" ? "#e8712a" : "rgba(255, 255, 255, 0.04)",
              color: activeTab === "login" ? "#0c0a09" : "#8a7f78",
              fontFamily: "DM Sans, Inter, sans-serif",
              fontWeight: activeTab === "login" ? "700" : "400",
              transform: activeTab === "login" ? "scale(1.02)" : "scale(1)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "login") e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "login") e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("register")}
            className="flex-1 py-3 rounded-full"
            style={{
              background: activeTab === "register" ? "#e8712a" : "rgba(255, 255, 255, 0.04)",
              color: activeTab === "register" ? "#0c0a09" : "#8a7f78",
              fontFamily: "DM Sans, Inter, sans-serif",
              fontWeight: activeTab === "register" ? "700" : "400",
              transform: activeTab === "register" ? "scale(1.02)" : "scale(1)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "register") e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "register") e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Register
          </button>
        </div>

        {/* Credentials Error */}
        {errors.credentials && (
          <div
            className={shakeError ? "shake" : ""}
            style={{
              background: "rgba(224, 92, 92, 0.1)",
              border: "1px solid #e05c5c",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                color: "#e05c5c",
                fontSize: "0.875rem",
                fontFamily: "DM Sans, Inter, sans-serif",
                textAlign: "center",
              }}
            >
              {errors.credentials}
            </p>
          </div>
        )}

        {notice && (
          <div
            style={{
              background: "rgba(57, 181, 120, 0.1)",
              border: "1px solid #39b578",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                color: "#7ee0a6",
                fontSize: "0.875rem",
                fontFamily: "DM Sans, Inter, sans-serif",
                textAlign: "center",
              }}
            >
              {notice}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ opacity: fadeContent ? 0 : 1, transition: "opacity 0.2s ease" }}>
          {activeTab === "register" && (
            <>
              {/* Full Name */}
              <div className="mb-5">
                <label
                  className="block mb-2 uppercase tracking-wide"
                  style={{
                    fontFamily: "DM Sans, Inter, sans-serif",
                    fontSize: "0.75rem",
                    color: "#8a7f78",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    setErrors({ ...errors, fullName: "" });
                  }}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: `1px solid ${errors.fullName ? "#e05c5c" : "rgba(255, 255, 255, 0.08)"}`,
                    color: "#f5f0eb",
                    fontFamily: "DM Sans, Inter, sans-serif",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#e8712a";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232, 113, 42, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.fullName && (
                  <p
                    className="mt-1"
                    style={{
                      color: "#e05c5c",
                      fontSize: "0.75rem",
                      fontFamily: "DM Sans, Inter, sans-serif",
                    }}
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Business Name */}
              <div className="mb-5">
                <label
                  className="block mb-2 uppercase tracking-wide"
                  style={{
                    fontFamily: "DM Sans, Inter, sans-serif",
                    fontSize: "0.75rem",
                    color: "#8a7f78",
                  }}
                >
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => {
                    setFormData({ ...formData, businessName: e.target.value });
                    setErrors({ ...errors, businessName: "" });
                  }}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: `1px solid ${errors.businessName ? "#e05c5c" : "rgba(255, 255, 255, 0.08)"}`,
                    color: "#f5f0eb",
                    fontFamily: "DM Sans, Inter, sans-serif",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#e8712a";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232, 113, 42, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.businessName && (
                  <p
                    className="mt-1"
                    style={{
                      color: "#e05c5c",
                      fontSize: "0.75rem",
                      fontFamily: "DM Sans, Inter, sans-serif",
                    }}
                  >
                    {errors.businessName}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label
                  className="block mb-2 uppercase tracking-wide"
                  style={{
                    fontFamily: "DM Sans, Inter, sans-serif",
                    fontSize: "0.75rem",
                    color: "#8a7f78",
                  }}
                >
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["agency", "entrepreneur"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className="py-3 rounded-xl capitalize"
                      style={{
                        background: formData.role === role ? "#e8712a" : "rgba(255, 255, 255, 0.04)",
                        color: formData.role === role ? "#0c0a09" : "#8a7f78",
                        fontFamily: "DM Sans, Inter, sans-serif",
                        fontWeight: formData.role === role ? "700" : "500",
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="mb-5">
            <label
              className="block mb-2 uppercase tracking-wide"
              style={{
                fontFamily: "DM Sans, Inter, sans-serif",
                fontSize: "0.75rem",
                color: "#8a7f78",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: "" });
              }}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${errors.email ? "#e05c5c" : "rgba(255, 255, 255, 0.08)"}`,
                color: "#f5f0eb",
                fontFamily: "DM Sans, Inter, sans-serif",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#e8712a";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232, 113, 42, 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {errors.email && (
              <p
                className="mt-1"
                style={{
                  color: "#e05c5c",
                  fontSize: "0.75rem",
                  fontFamily: "DM Sans, Inter, sans-serif",
                }}
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              className="block mb-2 uppercase tracking-wide"
              style={{
                fontFamily: "DM Sans, Inter, sans-serif",
                fontSize: "0.75rem",
                color: "#8a7f78",
              }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setErrors({ ...errors, password: "" });
                }}
                className="w-full px-4 py-3 pr-12 rounded-xl outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: `1px solid ${errors.password ? "#e05c5c" : "rgba(255, 255, 255, 0.08)"}`,
                  color: "#f5f0eb",
                  fontFamily: "DM Sans, Inter, sans-serif",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#e8712a";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232, 113, 42, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "#8a7f78" }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p
                className="mt-1"
                style={{
                  color: "#e05c5c",
                  fontSize: "0.75rem",
                  fontFamily: "DM Sans, Inter, sans-serif",
                }}
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full"
            style={{
              background: "linear-gradient(135deg, #e8712a 0%, #c45a1a 100%)",
              color: "#f5f0eb",
              fontFamily: "DM Sans, Inter, sans-serif",
              fontSize: "1rem",
              fontWeight: "700",
              boxShadow: "0 0 24px rgba(232, 113, 42, 0.4)",
              transition: "all 0.2s ease",
              transform: "scale(1)",
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.filter = "brightness(1.1)";
              e.currentTarget.style.boxShadow = "0 0 32px rgba(232, 113, 42, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "brightness(1)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(232, 113, 42, 0.4)";
            }}
          >
            {isSubmitting ? "Please wait..." : activeTab === "login" ? "Login" : "Create Account"}
          </button>

          {activeTab === "login" && (
            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={isSubmitting}
                style={{
                  color: "#e8712a",
                  fontFamily: "DM Sans, Inter, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                }}
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full py-3 rounded-full"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#f5f0eb",
                  fontFamily: "DM Sans, Inter, sans-serif",
                  fontWeight: "600",
                }}
              >
                Continue with Google
              </button>
            </div>
          )}

          {/* Toggle Link */}
          <p
            className="text-center mt-6"
            style={{
              fontFamily: "DM Sans, Inter, sans-serif",
              fontSize: "0.875rem",
              color: "#8a7f78",
            }}
          >
            {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => handleTabSwitch(activeTab === "login" ? "register" : "login")}
              style={{ color: "#e8712a", fontWeight: "600", transition: "opacity 0.2s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {activeTab === "login" ? "Register" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
