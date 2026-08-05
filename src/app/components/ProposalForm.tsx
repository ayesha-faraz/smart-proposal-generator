import { useState, useEffect } from "react";
import { Dropdown } from "./Dropdown";
import { validateProposalForm, ValidationWarning } from "../lib/proposalValidation";

export interface ProposalFormData {
  businessName: string;
  tagline: string;
  phone: string;
  website: string;
  email: string;
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

type LiveConnectionState = "checking" | "connected" | "disconnected";

interface LiveConnectionStatus {
  state: LiveConnectionState;
  configured?: boolean;
  model?: string;
  message: string;
}

export function ProposalForm({ onGenerate, defaultBusinessName }: ProposalFormProps) {
  const [formData, setFormData] = useState<ProposalFormData>({
    businessName: "Propel Studio",
    tagline: "Performance marketing for brands ready to scale",
    phone: "+1 415 555 0198",
    website: "www.propelstudio.co",
    email: "hello@propelstudio.co",
    clientName: "UrbanNest Realty",
    clientIndustry: "Real Estate",
    clientWebsite: "www.urbannestrealty.com",
    targetAudience: "First-time homebuyers and young families in Austin searching for modern starter homes",
    currentSituation: "They post listings inconsistently, rely heavily on referrals, and have low engagement from serious buyers",
    mainGoal: "Generate 120 qualified buyer leads in 90 days and increase booked property consultations by 35%",
    competitors: "Compass, Redfin local agents, Keller Williams neighborhood teams",
    serviceOffering: "Social Media Management",
    projectBrief: "UrbanNest Realty needs a 90-day social media growth campaign that turns Instagram and Facebook into a reliable lead source. The focus is positioning the agency as the trusted guide for first-time homebuyers, creating listing content, buyer education posts, short-form video, lead magnets, and weekly reporting.",
    budget: "12000",
    currency: "USD",
    timeline: "3 Months",
    tone: "Professional",
    urgency: "Consultative",
    language: "English",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefError, setBriefError] = useState("");
  const [briefCharCount, setBriefCharCount] = useState(formData.projectBrief.length);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationWarning[]>([]);
  const [warningsAcknowledged, setWarningsAcknowledged] = useState(false);
  const [liveConnection, setLiveConnection] = useState<LiveConnectionStatus>({
    state: "checking",
    message: "Checking the live Groq tool connection...",
  });

  const verifyLiveConnection = async () => {
    setLiveConnection({ state: "checking", message: "Checking the live Groq tool connection..." });
    try {
      const response = await fetch("/api/health", { method: "GET", headers: { Accept: "application/json" } });
      const data = await response.json();
      setLiveConnection({
        state: data.connected ? "connected" : "disconnected",
        configured: Boolean(data.configured),
        model: typeof data.model === "string" ? data.model : undefined,
        message: typeof data.message === "string" ? data.message : data.connected ? "Groq API connection verified." : "Groq API is unavailable.",
      });
    } catch {
      setLiveConnection({
        state: "disconnected",
        message: "The live connection check could not reach the server API.",
      });
    }
  };

  // Pre-fill business name from localStorage
  useEffect(() => {
    if (defaultBusinessName) {
      setFormData((prev) => ({ ...prev, businessName: defaultBusinessName }));
    }
  }, [defaultBusinessName]);

  useEffect(() => {
    void verifyLiveConnection();
  }, []);

  useEffect(() => {
    setWarningsAcknowledged(false);
    setValidationWarnings([]);
    setValidationErrors([]);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateProposalForm(formData);
    const errorMessages = Object.entries(result.errors).map(([field, message]) => `${field}: ${message}`);
    setValidationErrors(errorMessages);
    setValidationWarnings(result.warnings);
    setBriefError(result.errors.projectBrief || "");

    if (!result.isValid) return;
    if (result.warnings.length > 0 && !warningsAcknowledged) return;

    setBriefError("");
    setIsGenerating(true);
    setTimeout(() => {
      onGenerate(formData);
      setIsGenerating(false);
    }, 500);
  };

  const handleBriefChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setFormData({ ...formData, projectBrief: value });
      setBriefCharCount(value.length);
      setBriefError("");
      setWarningsAcknowledged(false);
    }
  };

  const getCharCountColor = () => {
    if (briefCharCount >= 500) return '#e05c5c';
    if (briefCharCount > 400) return '#f0a84e';
    return '#8a7f78';
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#f5f0eb',
    fontFamily: 'DM Sans, Inter, sans-serif',
  };

  const SectionDivider = ({ label }: { label: string }) => (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '24px 0 20px', paddingTop: '16px' }}>
      <span style={{ fontSize: '10px', color: '#8a7f78', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label
      className="block mb-2 uppercase tracking-wide"
      style={{
        fontFamily: 'DM Sans, Inter, sans-serif',
        fontSize: '0.75rem',
        color: '#8a7f78',
      }}
    >
      {children}
    </label>
  );

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
            fontFamily: 'DM Sans, Inter, sans-serif',
            fontWeight: value === option ? '600' : '400',
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
      {/* Hero Section */}
      <div className="text-center mt-12 mb-8">
        <h1
          className="mb-3"
          style={{
            fontFamily: 'Mona Sans, sans-serif',
            fontSize: '3rem',
            fontWeight: '700',
            color: '#f5f0eb',
            lineHeight: '1.1',
          }}
        >
          {splitTitle.map((word, index) => (
            <span
              key={index}
              className="word-animation"
              style={{ animationDelay: `${index * 0.1}s`, marginRight: index < splitTitle.length - 1 ? '0.3em' : '0' }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1.125rem',
            color: '#8a7f78',
          }}
        >
          Complete every field. Use N/A only when a field does not apply.
        </p>
      </div>

      <div
        aria-live="polite"
        className="w-full max-w-[680px] mb-5 rounded-2xl px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: liveConnection.state === "connected" ? "rgba(67, 160, 71, 0.10)" : liveConnection.state === "checking" ? "rgba(232, 113, 42, 0.09)" : "rgba(224, 92, 92, 0.10)",
          border: liveConnection.state === "connected" ? "1px solid rgba(102, 187, 106, 0.35)" : liveConnection.state === "checking" ? "1px solid rgba(232, 113, 42, 0.30)" : "1px solid rgba(224, 92, 92, 0.35)",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              marginTop: 5,
              borderRadius: "999px",
              flexShrink: 0,
              background: liveConnection.state === "connected" ? "#66bb6a" : liveConnection.state === "checking" ? "#e8712a" : "#e05c5c",
              boxShadow: liveConnection.state === "connected" ? "0 0 12px rgba(102, 187, 106, 0.65)" : "none",
            }}
          />
          <div>
            <p style={{ color: "#f5f0eb", fontSize: 13, fontWeight: 700 }}>
              {liveConnection.state === "connected" ? "Live tool connected: Groq API" : liveConnection.state === "checking" ? "Checking live tool connection" : "Live tool connection unavailable"}
            </p>
            <p style={{ color: "#a99d95", fontSize: 12, marginTop: 2 }}>
              {liveConnection.message}{liveConnection.model ? ` Model: ${liveConnection.model}.` : ""}
            </p>
          </div>
        </div>
        {liveConnection.state !== "checking" && (
          <button
            type="button"
            onClick={() => void verifyLiveConnection()}
            className="px-3 py-2 rounded-full self-start sm:self-auto"
            style={{ color: "#f5f0eb", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)", fontSize: 12 }}
          >
            Check again
          </button>
        )}
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[680px] p-10 rounded-3xl fadeInUp"
        style={{
          background: 'rgba(6, 4, 4, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5)',
          animationDelay: '0.2s',
          opacity: 0,
        }}
      >
        {validationErrors.length > 0 && (
          <div
            role="alert"
            className="mb-6 rounded-2xl p-4"
            style={{ background: 'rgba(224, 92, 92, 0.1)', border: '1px solid rgba(224, 92, 92, 0.35)' }}
          >
            <p style={{ color: '#f5f0eb', fontWeight: 700, marginBottom: 8 }}>Please correct the form before generating.</p>
            <ul style={{ color: '#e9b0b0', fontSize: 13, paddingLeft: 18, listStyle: 'disc' }}>
              {validationErrors.map((message) => <li key={message}>{message}</li>)}
            </ul>
          </div>
        )}

        <SectionDivider label="Your business" />

        {/* Business Name - Full Width */}
        <div className="mb-6 fadeInUp stagger-1" style={{ opacity: 0 }}>
          <FieldLabel>Your Business Name</FieldLabel>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
            style={inputStyle}
          />
        </div>

        <div className="mb-6 fadeInUp stagger-1" style={{ opacity: 0 }}>
          <FieldLabel>Tagline</FieldLabel>
          <input
            type="text"
            value={formData.tagline}
              required
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="e.g. We build brands that people remember"
            className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
            style={inputStyle}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="fadeInUp stagger-1" style={{ opacity: 0 }}>
            <FieldLabel>Phone / WhatsApp</FieldLabel>
            <input
              type="text"
              value={formData.phone}
              required
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+92 300 0000000"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
              style={inputStyle}
            />
          </div>

          <div className="fadeInUp stagger-1" style={{ opacity: 0 }}>
            <FieldLabel>Website</FieldLabel>
            <input
              type="text"
              value={formData.website}
              required
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="www.yourbusiness.com"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
              style={inputStyle}
            />
          </div>

          <div className="fadeInUp stagger-1" style={{ opacity: 0 }}>
            <FieldLabel>Email</FieldLabel>
            <input
              type="email"
              value={formData.email}
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="hello@yourbusiness.com"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
              style={inputStyle}
            />
          </div>
        </div>

        <SectionDivider label="About the client" />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Client Name */}
          <div className="fadeInUp stagger-2" style={{ opacity: 0 }}>
            <label
              className="block mb-2 uppercase tracking-wide"
              style={{
                fontFamily: 'DM Sans, Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#8a7f78',
              }}
            >
              Client Name
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f5f0eb',
                fontFamily: 'DM Sans, Inter, sans-serif',
              }}
            />
          </div>

          {/* Client Industry */}
          <div className="fadeInUp stagger-3" style={{ opacity: 0 }}>
            <label
              className="block mb-2 uppercase tracking-wide"
              style={{
                fontFamily: 'DM Sans, Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#8a7f78',
              }}
            >
              Client Industry
            </label>
            <Dropdown
              value={formData.clientIndustry}
              onChange={(value) => setFormData({ ...formData, clientIndustry: value })}
              options={["Real Estate", "Marketing", "E-commerce", "Healthcare", "Education", "Other"]}
            />
          </div>
        </div>

        <div className="mb-6 fadeInUp stagger-3" style={{ opacity: 0 }}>
          <FieldLabel>Client Website</FieldLabel>
          <input
            type="text"
            value={formData.clientWebsite}
              required
            onChange={(e) => setFormData({ ...formData, clientWebsite: e.target.value })}
            placeholder="www.clientwebsite.com or N/A"
            className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
            style={inputStyle}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="fadeInUp stagger-3" style={{ opacity: 0 }}>
            <FieldLabel>Target Audience <span style={{ color: '#e8712a' }}>*</span></FieldLabel>
            <input
              type="text"
              aria-label="Target Audience"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              required
              placeholder="e.g. Women aged 25-35 who shop online"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
              style={inputStyle}
            />
          </div>

          <div className="fadeInUp stagger-3" style={{ opacity: 0 }}>
            <FieldLabel>Main Goal <span style={{ color: '#e8712a' }}>*</span></FieldLabel>
            <input
              type="text"
              aria-label="Main Goal"
              value={formData.mainGoal}
              onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
              required
              placeholder="e.g. Grow from 5k to 50k followers in 3 months"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="fadeInUp stagger-3" style={{ opacity: 0 }}>
            <FieldLabel>Current Situation</FieldLabel>
            <input
              type="text"
              value={formData.currentSituation}
              required
              onChange={(e) => setFormData({ ...formData, currentSituation: e.target.value })}
              placeholder="What's happening now? What's not working?"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
              style={inputStyle}
            />
          </div>

          <div className="fadeInUp stagger-3" style={{ opacity: 0 }}>
            <FieldLabel>Competitors</FieldLabel>
            <input
              type="text"
              value={formData.competitors}
              required
              onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
              placeholder="e.g. Brand X, Brand Y, or None"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:border-[#e8712a]"
              style={inputStyle}
            />
          </div>
        </div>

        <SectionDivider label="Proposal details" />

        {/* Service Offering */}
        <div className="mb-6 fadeInUp stagger-4" style={{ opacity: 0 }}>
          <label
            className="block mb-2 uppercase tracking-wide"
            style={{
              fontFamily: 'DM Sans, Inter, sans-serif',
              fontSize: '0.75rem',
              color: '#8a7f78',
            }}
          >
            Service Offering
          </label>
          <Dropdown
            value={formData.serviceOffering}
            onChange={(value) => setFormData({ ...formData, serviceOffering: value })}
            options={["Social Media Management", "Web Design", "Branding", "Content Creation", "Custom"]}
          />
        </div>

        {/* Project Brief */}
        <div className="mb-6 fadeInUp stagger-5" style={{ opacity: 0 }}>
          <label
            className="block mb-2 uppercase tracking-wide"
            style={{
              fontFamily: 'DM Sans, Inter, sans-serif',
              fontSize: '0.75rem',
              color: '#8a7f78',
            }}
          >
            Project Brief <span style={{ color: '#e8712a' }}>*</span>
          </label>
          <textarea
            aria-label="Project Brief"
            value={formData.projectBrief}
            onChange={handleBriefChange}
            placeholder="Describe what this proposal is about — who is the client, what problem are you solving, any specific goals or requirements..."
            className="w-full px-4 py-3.5 rounded-xl outline-none"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: briefError ? '1px solid #e05c5c' : '1px solid rgba(255, 255, 255, 0.08)',
              color: '#f5f0eb',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              minHeight: '120px',
              resize: 'vertical',
              transition: 'border 0.3s ease, box-shadow 0.3s ease',
            }}
            onFocus={(e) => {
              if (!briefError) {
                e.currentTarget.style.borderColor = '#e8712a';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232, 113, 42, 0.15)';
              }
            }}
            onBlur={(e) => {
              if (!briefError) {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          />

          {/* Error Message */}
          {briefError && (
            <p
              className="mt-2 shake"
              style={{
                color: '#e05c5c',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {briefError}
            </p>
          )}

          {/* Helper Text and Character Counter */}
          <div className="flex items-center justify-between mt-2">
            <p
              style={{
                color: '#8a7f78',
                fontSize: '11px',
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'italic',
              }}
            >
              The more detail you give, the better your proposal will be.
            </p>
            <p
              style={{
                color: getCharCountColor(),
                fontSize: '11px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {briefCharCount} / 500
            </p>
          </div>
        </div>

        {/* Budget with Currency Toggle */}
        <div className="mb-6 fadeInUp stagger-6" style={{ opacity: 0 }}>
          <label
            className="block mb-2 uppercase tracking-wide"
            style={{
              fontFamily: 'DM Sans, Inter, sans-serif',
              fontSize: '0.75rem',
              color: '#8a7f78',
            }}
          >
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
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f5f0eb',
                fontFamily: 'DM Sans, Inter, sans-serif',
              }}
            />
            <PillToggle
              options={["PKR", "USD"]}
              value={formData.currency}
              onChange={(val) => setFormData({ ...formData, currency: val as "PKR" | "USD" })}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6 fadeInUp stagger-7" style={{ opacity: 0 }}>
          <label
            className="block mb-2 uppercase tracking-wide"
            style={{
              fontFamily: 'DM Sans, Inter, sans-serif',
              fontSize: '0.75rem',
              color: '#8a7f78',
            }}
          >
            Timeline
          </label>
          <PillToggle
            options={["1 Month", "3 Months", "6 Months"]}
            value={formData.timeline}
            onChange={(val) =>
              setFormData({ ...formData, timeline: val as "1 Month" | "3 Months" | "6 Months" })
            }
          />
        </div>

        {/* Tone */}
        <div className="mb-8 fadeInUp stagger-8" style={{ opacity: 0 }}>
          <label
            className="block mb-2 uppercase tracking-wide"
            style={{
              fontFamily: 'DM Sans, Inter, sans-serif',
              fontSize: '0.75rem',
              color: '#8a7f78',
            }}
          >
            Tone
          </label>
          <PillToggle
            options={["Professional", "Friendly", "Bold"]}
            value={formData.tone}
            onChange={(val) =>
              setFormData({ ...formData, tone: val as "Professional" | "Friendly" | "Bold" })
            }
          />
        </div>

        <SectionDivider label="Proposal settings" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="fadeInUp stagger-8" style={{ opacity: 0 }}>
            <FieldLabel>Urgency</FieldLabel>
            <PillToggle
              options={["Consultative", "Soon", "Urgent"]}
              value={formData.urgency}
              onChange={(val) =>
                setFormData({ ...formData, urgency: val as "Consultative" | "Soon" | "Urgent" })
              }
            />
          </div>

          <div className="fadeInUp stagger-8" style={{ opacity: 0 }}>
            <FieldLabel>Language</FieldLabel>
            <PillToggle
              options={["English", "Urdu"]}
              value={formData.language}
              onChange={(val) =>
                setFormData({ ...formData, language: val as "English" | "Urdu" })
              }
            />
          </div>
        </div>

        {validationWarnings.length > 0 && (
          <div
            className="mb-6 rounded-2xl p-4"
            style={{ background: 'rgba(240, 168, 78, 0.1)', border: '1px solid rgba(240, 168, 78, 0.35)' }}
          >
            <p style={{ color: '#f5f0eb', fontWeight: 700, marginBottom: 8 }}>Review checks</p>
            <ul style={{ color: '#d9c3a6', fontSize: 13, paddingLeft: 18, listStyle: 'disc', marginBottom: 12 }}>
              {validationWarnings.map((warning) => <li key={warning.id}>{warning.message}</li>)}
            </ul>
            <label className="flex items-start gap-3" style={{ color: '#f5f0eb', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={warningsAcknowledged}
                onChange={(event) => setWarningsAcknowledged(event.target.checked)}
                aria-label="Acknowledge form warnings"
              />
              I reviewed these warnings and confirm the entered information may be used to generate the draft.
            </label>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 rounded-full fadeInUp stagger-9"
          style={{
            background: 'linear-gradient(135deg, #e8712a 0%, #c45a1a 100%)',
            color: '#f5f0eb',
            fontFamily: 'DM Sans, Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: '700',
            boxShadow: '0 0 24px rgba(232, 113, 42, 0.4)',
            transition: 'all 0.2s ease',
            transform: 'scale(1)',
            opacity: 0,
          }}
          onMouseEnter={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.boxShadow = '0 0 32px rgba(232, 113, 42, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(232, 113, 42, 0.4)';
            }
          }}
        >
          {isGenerating ? (
            <span className="inline-block spin">⏳</span>
          ) : (
            "Generate Proposal"
          )}
        </button>
      </form>
    </div>
  );
}
