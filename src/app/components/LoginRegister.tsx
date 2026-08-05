import { useState, useEffect } from "react";
import { Zap, Eye, EyeOff } from "lucide-react";
import { BackgroundOrbs } from "./BackgroundOrbs";

interface LoginRegisterProps {
  onLogin: (email: string, name: string, businessName: string) => void;
}

const HARDCODED_CREDENTIALS = {
  email: "demo@propel.com",
  password: "propel123",
  name: "Alex",
  businessName: "Propel Studio",
};

export function LoginRegister({ onLogin }: LoginRegisterProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fadeContent, setFadeContent] = useState(false);
  const [shakeError, setShakeError] = useState(false);

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

  const handleDemoLogin = () => {
    const userData = {
      email: HARDCODED_CREDENTIALS.email,
      name: HARDCODED_CREDENTIALS.name,
      businessName: HARDCODED_CREDENTIALS.businessName,
    };

    setFormData({
      fullName: userData.name,
      businessName: userData.businessName,
      email: HARDCODED_CREDENTIALS.email,
      password: HARDCODED_CREDENTIALS.password,
    });
    setErrors({});
    localStorage.setItem("propel_user", JSON.stringify(userData));
    onLogin(userData.email, userData.name, userData.businessName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (activeTab === "register") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.businessName) {
        newErrors.businessName = "Business name is required";
      }
    }

    if (activeTab === "login") {
      // Check hardcoded credentials
      if (formData.email !== HARDCODED_CREDENTIALS.email || formData.password !== HARDCODED_CREDENTIALS.password) {
        newErrors.credentials = "Invalid email or password";
        setShakeError(true);
        setTimeout(() => setShakeError(false), 400);
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Store user data in localStorage
      const userData = {
        email: HARDCODED_CREDENTIALS.email,
        name: HARDCODED_CREDENTIALS.name,
        businessName: HARDCODED_CREDENTIALS.businessName,
      };
      localStorage.setItem("propel_user", JSON.stringify(userData));
      onLogin(userData.email, userData.name, userData.businessName);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 page-transition"
      style={{ background: "#060404" }}
    >
      {/* Background Gradients */}
      <BackgroundOrbs />

      <button
        type="button"
        onClick={handleDemoLogin}
        className="fixed right-6 top-6 z-20 rounded-full px-5 py-3"
        style={{
          background: "rgba(232, 113, 42, 0.14)",
          border: "1px solid rgba(232, 113, 42, 0.45)",
          color: "#f5f0eb",
          fontFamily: "DM Sans, Inter, sans-serif",
          fontSize: "0.875rem",
          fontWeight: 700,
          boxShadow: "0 12px 30px rgba(232, 113, 42, 0.16)",
          backdropFilter: "blur(14px)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#e8712a";
          e.currentTarget.style.color = "#0c0a09";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(232, 113, 42, 0.14)";
          e.currentTarget.style.color = "#f5f0eb";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Demo login
      </button>

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
            {activeTab === "login" ? "Login" : "Create Account"}
          </button>

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
