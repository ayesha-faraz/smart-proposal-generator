import { useState, useEffect, useRef } from "react";
import { Dropdown } from "./Dropdown";
import { BriefAssistant } from "./BriefAssistant/BriefAssistant";

export interface ProposalFormData {
  businessName: string;
  tagline: string;
  phone: string;
  website: string;
  email: string;
  logo: string | null;
  logoFileName?: string;
  clientName: string;
  clientIndustry: string;
  clientWebsite: string;
  targetAudience: string;
  currentSituation: string;
  mainGoal: string;
  competitors: string;
  serviceOffering: string;
  projectBrief: string;
  budget: string;
  currency: "PKR" | "USD";
  timeline: "1 Month" | "3 Months" | "6 Months";
  tone: "Professional" | "Friendly" | "Bold";
  urgency: "Consultative" | "Soon" | "Urgent";
  language: "English" | "Urdu";
}

interface ProposalFormProps {
  onGenerate: (data: ProposalFormData) => void;
  defaultBusinessName?: string;
}

export function ProposalForm({ onGenerate, defaultBusinessName }: ProposalFormProps) {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<ProposalFormData>({
    businessName: "",
    tagline: "",
    phone: "",
    website: "",
    email: "",
    logo: null,
    logoFileName: "",
    clientName: "",
    clientIndustry: "Real Estate",
    clientWebsite: "",
    targetAudience: "",
    currentSituation: "",
    mainGoal: "",
    competitors: "",
    serviceOffering: "Social Media Management",
    projectBrief: "",
    budget: "",
    currency: "USD",
    timeline: "3 Months",
    tone: "Professional",
    urgency: "Consultative",
    language: "English",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefError, setBriefError] = useState("");
  const [fileError, setFileError] = useState("");
  const [briefCharCount, setBriefCharCount] = useState(0);
  const [showBriefAssistant, setShowBriefAssistant] = useState(false);

  useEffect(() => {
    if (defaultBusinessName) {
      setFormData((prev) => ({ ...prev, businessName: defaultBusinessName }));
    }
  }, [defaultBusinessName]);

  useEffect(() => {
    const isDemoMode = new URLSearchParams(window.location.search).get("demo") === "1";
    if (!isDemoMode) return;

    const demoBrief =
      "Nexa Builders is launching a premium apartment project in Lahore. The project has strong potential, but the brand does not yet look credible enough online to attract serious buyers and overseas investors. They need a powerful social media campaign that builds trust, explains the investment value, creates urgency before the launch event, and generates qualified leads through Facebook, Instagram, and WhatsApp. The proposal should position the campaign as a growth engine, not just content posting.";

    setFormData({
      businessName: "Propel Studio",
      tagline: "We build brands that people remember",
      phone: "+92 300 1234567",
      website: "www.propelstudio.pk",
      email: "hello@propelstudio.pk",
      logo: null,
      logoFileName: "",
      clientName: "Nexa Builders",
      clientIndustry: "Real Estate",
      clientWebsite: "www.nexabuilders.pk",
      targetAudience: "Overseas Pakistanis and upper-middle-class families in Lahore looking for secure, premium apartment investments",
      currentSituation: "Their project has strong investment potential, but their current social media looks generic and does not build enough trust with serious buyers.",
      mainGoal: "Generate qualified buyer inquiries before the launch event and position the project as a premium real estate investment",
      competitors: "Zameen developments, Etihad Town, ParkView City",
      serviceOffering: "Social Media Management",
      projectBrief: demoBrief,
      budget: "250000",
      currency: "PKR",
      timeline: "3 Months",
      tone: "Bold",
      urgency: "Urgent",
      language: "English",
    });
    setBriefCharCount(demoBrief.length);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.projectBrief.trim()) {
      setBriefError("Please add a project brief so we can generate a relevant proposal");
      return;
    }

    const promptInjectionSignals = [
      "ignore previous instructions",
      "ignore all instructions",
      "reveal",
      "system prompt",
      "developer message",
      "hidden instructions",
    ];
    const lowerBrief = formData.projectBrief.toLowerCase();
    if (promptInjectionSignals.some((signal) => lowerBrief.includes(signal))) {
      setBriefError("The brief contains instruction-like text that could interfere with safe proposal generation.");
      return;
    }

    setBriefError("");
    setIsGenerating(true);
    setTimeout(() => {
      onGenerate(formData);
      setIsGenerating(false);
    }, 800);
  };

  const handleBriefChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 2000) {
      setFormData({ ...formData, projectBrief: value });
      setBriefCharCount(value.length);
      setBriefError("");
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    const maxBytes = 2 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only PNG, JPG, WebP, or PDF files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > maxBytes) {
      setFileError("File must be 2 MB or smaller for the MVP.");
      e.target.value = "";
      return;
    }

    setFileError("");
    if (file.type === "application/pdf") {
      setFormData((prev) => ({
        ...prev,
        logo: null,
        logoFileName: file.name,
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({
        ...prev,
        logo: typeof reader.result === "string" ? reader.result : null,
        logoFileName: file.name,
      }));
    reader.readAsDataURL(file);
  };

  const inputStyle = {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#f5f0eb",
    fontFamily: "DM Sans, Inter, sans-serif",
  };

  const labelStyle = {
    fontFamily: "DM Sans, Inter, sans-serif",
    fontSize: "0.75rem",
    color: "#8a7f78",
  };

  const SectionDivider = ({ label }: { label: string }) => (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "24px 0 20px", paddingTop: "16px" }}>
      <span style={{ fontSize: "10px", color: "#8a7f78", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );

  const TextInput = ({
    label,
    value,
    onChange,
    placeholder,
    required,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block mb-2 uppercase tracking-wide" style={labelStyle}>
        {label} {required && <span style={{ color: "#e8712a" }}>*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
        style={inputStyle}
      />
    </div>
  );

  const getCharCountColor = () => {
    if (briefCharCount >= 2000) return "#e05c5c";
    if (briefCharCount > 1700) return "#f0a84e";
    return "#8a7f78";
  };

  const PillToggle = ({
    options,
    value,
    onChange,
  }: {
    options: string[];
    value: string;
    onChange: (val: string) => void;
  }) => (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className="px-4 py-2 rounded-full"
          style={{
            background: value === option ? "#e8712a" : "rgba(255, 255, 255, 0.06)",
            color: value === option ? "#0c0a09" : "#8a7f78",
            fontFamily: "DM Sans, Inter, sans-serif",
            fontWeight: value === option ? "600" : "400",
            transform: value === option ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s ease",
            boxShadow: value === option ? "0 0 16px rgba(232, 113, 42, 0.3)" : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = value === option ? "scale(1.05)" : "scale(1)";
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const splitTitle = "Generate a Proposal".split(" ");

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 pb-12 page-transition">
      <div className="text-center mt-12 mb-8">
        <h1
          className="mb-3"
          style={{
            fontFamily: "Mona Sans, sans-serif",
            fontSize: "3rem",
            fontWeight: "700",
            color: "#f5f0eb",
            lineHeight: "1.1",
          }}
        >
          {splitTitle.map((word, index) => (
            <span
              key={index}
              className="word-animation"
              style={{ animationDelay: `${index * 0.1}s`, marginRight: index < splitTitle.length - 1 ? "0.3em" : "0" }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.125rem", color: "#8a7f78" }}>
          Fill in the details. Get a professional proposal in seconds.
        </p>
      </div>

      <div className="w-full max-w-[680px] mb-5">
        <button
          type="button"
          onClick={() => setShowBriefAssistant((current) => !current)}
          style={{
            color: "#e8712a",
            fontFamily: "DM Sans, Inter, sans-serif",
            fontSize: "0.95rem",
            fontWeight: 700,
            background: "transparent",
            border: 0,
            padding: 0,
            textAlign: "left",
          }}
        >
          Not sure this brief is ready? Ask the brief assistant →
        </button>
        {showBriefAssistant && (
          <div style={{ marginTop: 14 }}>
            <BriefAssistant />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[680px] p-10 rounded-3xl fadeInUp"
        style={{
          background: "rgba(6, 4, 4, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          backdropFilter: "blur(20px)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5)",
          animationDelay: "0.2s",
          opacity: 0,
        }}
      >
        <div className="fadeInUp stagger-1" style={{ opacity: 0 }}>
          <TextInput
            label="Your Business Name"
            value={formData.businessName}
            onChange={(value) => setFormData({ ...formData, businessName: value })}
            required
          />
        </div>

        <SectionDivider label="Your Business" />

        <div className="space-y-5 fadeInUp stagger-2" style={{ opacity: 0 }}>
          <TextInput
            label="Tagline"
            value={formData.tagline}
            onChange={(value) => setFormData({ ...formData, tagline: value })}
            placeholder="e.g. We build brands that people remember"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Phone/WhatsApp"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="+92 300 0000000"
            />
            <TextInput
              label="Website"
              value={formData.website}
              onChange={(value) => setFormData({ ...formData, website: value })}
              placeholder="www.yourbusiness.com"
            />
          </div>
          <TextInput
            label="Email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            placeholder="hello@yourbusiness.com"
          />
          <div
            role="button"
            tabIndex={0}
            onClick={() => logoInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") logoInputRef.current?.click();
            }}
            style={{
              border: "1px dashed rgba(232,113,42,0.4)",
              borderRadius: "12px",
              padding: "20px",
              background: "rgba(255,255,255,0.02)",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {formData.logo || formData.logoFileName ? (
              <div className="flex items-center justify-center gap-3">
                {formData.logo && (
                  <img src={formData.logo} alt="" style={{ width: "44px", height: "44px", objectFit: "contain", borderRadius: "8px" }} />
                )}
                <div style={{ color: "#8a7f78", fontSize: "13px", fontFamily: "DM Sans, Inter, sans-serif" }}>
                  {formData.logoFileName}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData({ ...formData, logo: null, logoFileName: "" });
                    if (logoInputRef.current) logoInputRef.current.value = "";
                  }}
                  style={{ color: "#e8712a", fontSize: "18px" }}
                >
                  x
                </button>
              </div>
            ) : (
              <>
                <div style={{ color: "#e8712a", fontSize: "24px", marginBottom: "8px" }}>↑</div>
                <div style={{ color: "#8a7f78", fontSize: "13px" }}>Click to upload PNG or JPG</div>
                <div style={{ color: "#8a7f78", fontSize: "11px", fontStyle: "italic", marginTop: "4px" }}>Appears on your PDF header</div>
              </>
            )}
            <input ref={logoInputRef} type="file" accept=".png,.jpg,.jpeg,.webp,.pdf" onChange={handleLogoUpload} style={{ display: "none" }} />
          </div>
          {fileError && (
            <p className="mt-2" style={{ color: "#e05c5c", fontSize: "0.75rem", fontFamily: "DM Sans, Inter, sans-serif" }}>
              {fileError}
            </p>
          )}
        </div>

        <SectionDivider label="About The Client" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 fadeInUp stagger-3" style={{ opacity: 0 }}>
          <TextInput
            label="Client Name"
            value={formData.clientName}
            onChange={(value) => setFormData({ ...formData, clientName: value })}
            required
          />
          <div>
            <label className="block mb-2 uppercase tracking-wide" style={labelStyle}>
              Client Industry
            </label>
            <Dropdown
              value={formData.clientIndustry}
              onChange={(value) => setFormData({ ...formData, clientIndustry: value })}
              options={["Real Estate", "Marketing", "E-commerce", "Healthcare", "Education", "Other"]}
            />
          </div>
        </div>

        <div className="space-y-5 mb-6 fadeInUp stagger-4" style={{ opacity: 0 }}>
          <TextInput
            label="Client Website"
            value={formData.clientWebsite}
            onChange={(value) => setFormData({ ...formData, clientWebsite: value })}
            placeholder="www.clientwebsite.com (optional)"
          />
          <TextInput
            label="Target Audience"
            value={formData.targetAudience}
            onChange={(value) => setFormData({ ...formData, targetAudience: value })}
            placeholder="e.g. Women aged 25-35 in Karachi who shop online"
            required
          />
          <TextInput
            label="Current Situation"
            value={formData.currentSituation}
            onChange={(value) => setFormData({ ...formData, currentSituation: value })}
            placeholder="Are they working with anyone currently? What's not working?"
          />
          <TextInput
            label="Main Goal"
            value={formData.mainGoal}
            onChange={(value) => setFormData({ ...formData, mainGoal: value })}
            placeholder="e.g. Grow from 5k to 50k followers in 3 months"
            required
          />
          <TextInput
            label="Competitors"
            value={formData.competitors}
            onChange={(value) => setFormData({ ...formData, competitors: value })}
            placeholder="e.g. Brand X, Brand Y (optional)"
          />
        </div>

        <SectionDivider label="Proposal Settings" />

        <div className="mb-6 fadeInUp stagger-5" style={{ opacity: 0 }}>
          <label className="block mb-2 uppercase tracking-wide" style={labelStyle}>
            Service Offering
          </label>
          <Dropdown
            value={formData.serviceOffering}
            onChange={(value) => setFormData({ ...formData, serviceOffering: value })}
            options={["Social Media Management", "Web Design", "Branding", "Content Creation", "Custom"]}
          />
        </div>

        <div className="mb-6 fadeInUp stagger-6" style={{ opacity: 0 }}>
          <label className="block mb-2 uppercase tracking-wide" style={labelStyle}>
            Project Brief <span style={{ color: "#e8712a" }}>*</span>
          </label>
          <textarea
            value={formData.projectBrief}
            onChange={handleBriefChange}
            placeholder="Describe what this proposal is about - who is the client, what problem are you solving, any specific goals or requirements..."
            className="w-full px-4 py-3.5 rounded-xl outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: briefError ? "1px solid #e05c5c" : "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f5f0eb",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              minHeight: "120px",
              resize: "vertical",
              transition: "border 0.3s ease, box-shadow 0.3s ease",
            }}
            onFocus={(e) => {
              if (!briefError) {
                e.currentTarget.style.borderColor = "#e8712a";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232, 113, 42, 0.15)";
              }
            }}
            onBlur={(e) => {
              if (!briefError) {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          />
          {briefError && (
            <p className="mt-2 shake" style={{ color: "#e05c5c", fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
              {briefError}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <p style={{ color: "#8a7f78", fontSize: "11px", fontFamily: "Inter, sans-serif", fontStyle: "italic" }}>
              The more detail you give, the better your proposal will be.
            </p>
            <p style={{ color: getCharCountColor(), fontSize: "11px", fontFamily: "Inter, sans-serif" }}>
              {briefCharCount} / 2000
            </p>
          </div>
        </div>

        <div className="mb-6 fadeInUp stagger-7" style={{ opacity: 0 }}>
          <label className="block mb-2 uppercase tracking-wide" style={labelStyle}>
            Budget
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
              placeholder="Enter amount"
              className="flex-1 px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
              style={inputStyle}
            />
            <PillToggle
              options={["PKR", "USD"]}
              value={formData.currency}
              onChange={(val) => setFormData({ ...formData, currency: val as "PKR" | "USD" })}
            />
          </div>
        </div>

        <div className="mb-6 fadeInUp stagger-8" style={{ opacity: 0 }}>
          <label className="block mb-2 uppercase tracking-wide" style={labelStyle}>
            Timeline
          </label>
          <PillToggle
            options={["1 Month", "3 Months", "6 Months"]}
            value={formData.timeline}
            onChange={(val) => setFormData({ ...formData, timeline: val as "1 Month" | "3 Months" | "6 Months" })}
          />
        </div>

        <div className="mb-6 fadeInUp stagger-9" style={{ opacity: 0 }}>
          <label className="block mb-2 uppercase tracking-wide" style={labelStyle}>
            Tone
          </label>
          <PillToggle
            options={["Professional", "Friendly", "Bold"]}
            value={formData.tone}
            onChange={(val) => setFormData({ ...formData, tone: val as "Professional" | "Friendly" | "Bold" })}
          />
        </div>

        <div className="mb-6 fadeInUp stagger-10" style={{ opacity: 0 }}>
          <label className="block mb-2 uppercase tracking-wide" style={labelStyle}>
            Urgency
          </label>
          <PillToggle
            options={["Consultative", "Soon", "Urgent"]}
            value={formData.urgency}
            onChange={(val) => setFormData({ ...formData, urgency: val as "Consultative" | "Soon" | "Urgent" })}
          />
        </div>

        <div className="mb-8 fadeInUp stagger-10" style={{ opacity: 0 }}>
          <label className="block mb-2 uppercase tracking-wide" style={labelStyle}>
            Language
          </label>
          <PillToggle
            options={["English", "Urdu"]}
            value={formData.language}
            onChange={(val) => setFormData({ ...formData, language: val as "English" | "Urdu" })}
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 rounded-full fadeInUp stagger-10"
          style={{
            background: "linear-gradient(135deg, #e8712a 0%, #c45a1a 100%)",
            color: "#f5f0eb",
            fontFamily: "DM Sans, Inter, sans-serif",
            fontSize: "1rem",
            fontWeight: "700",
            boxShadow: "0 0 24px rgba(232, 113, 42, 0.4)",
            transition: "all 0.2s ease",
            transform: "scale(1)",
            opacity: 0,
          }}
          onMouseEnter={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.filter = "brightness(1.1)";
              e.currentTarget.style.boxShadow = "0 0 32px rgba(232, 113, 42, 0.6)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "brightness(1)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(232, 113, 42, 0.4)";
            }
          }}
        >
          {isGenerating ? <span className="inline-block spin">⏳</span> : "Generate Proposal"}
        </button>
      </form>
    </div>
  );
}
