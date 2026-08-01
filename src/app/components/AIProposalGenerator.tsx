import { useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Building2, Check, FileText, Send, Sparkles } from "lucide-react";
import { ProposalFormData } from "./ProposalForm";
import { Sidebar } from "./Sidebar";
import {
  buildProposalFormFromOpportunity,
  createAndSaveProposal,
  getCompanyProfile,
  getOpportunityById,
} from "../lib/marketplace";
import targetIcon from "../../assets/brand/propel-mark-transparent.png";

const labelStyle = { color: "#375534" };
const inputStyle = {
  backgroundColor: "rgba(255,255,255,0.84)",
  borderColor: "rgba(174,195,176,0.45)",
  color: "#0F2A1D",
};

export default function AIProposalGenerator() {
  const navigate = useNavigate();
  const { id } = useParams();
  const opportunity = useMemo(() => getOpportunityById(id), [id]);
  const profile = useMemo(() => getCompanyProfile(), []);
  const [formData, setFormData] = useState<ProposalFormData>(() =>
    buildProposalFormFromOpportunity(opportunity, profile),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [briefError, setBriefError] = useState("");

  const steps = [
    "Reading opportunity brief",
    "Pulling stored company profile",
    "Writing proposal draft",
    "Saving to proposal workspace",
  ];

  const update = <K extends keyof ProposalFormData>(key: K, value: ProposalFormData[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const generateProposal = () => {
    if (!formData.projectBrief.trim()) {
      setBriefError("Add a brief before generating.");
      return;
    }

    setBriefError("");
    setIsGenerating(true);
    setStep(0);

    const interval = window.setInterval(() => {
      setStep((current) => Math.min(current + 1, steps.length - 1));
    }, 450);

    window.setTimeout(() => {
      window.clearInterval(interval);
      const proposal = createAndSaveProposal(formData);
      navigate(`/agency/proposal/${proposal.id}`);
    }, 1900);
  };

  return (
    <div className="flex min-h-screen relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-[60px]"
          style={{ background: "radial-gradient(circle, rgba(174,195,176,1) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[50px]"
          style={{ background: "radial-gradient(circle, rgba(107,144,113,1) 0%, transparent 60%)" }}
        />
      </div>

      <Sidebar userType="agency" />

      <div className="flex-1 ml-60 relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to={`/agency/opportunity/${opportunity.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium mb-6"
            style={{ color: "#375534" }}
          >
            <ArrowLeft size={16} />
            Back to opportunity
          </Link>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[20px] backdrop-blur-[20px]"
              style={{
                backgroundColor: "rgba(255,255,255,0.68)",
                border: "1px solid rgba(174,195,176,0.35)",
                boxShadow: "0 4px 24px rgba(15,42,29,0.06)",
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-sm font-semibold" style={{ color: "#375534" }}>
                    <Sparkles size={18} />
                    AI Proposal Engine
                  </div>
                  <h1
                    className="text-4xl mb-3"
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontStyle: "italic",
                      color: "#0F2A1D",
                    }}
                  >
                    Generate proposal for {opportunity.company}
                  </h1>
                  <p className="max-w-2xl" style={{ color: "#6B9071" }}>
                    We have prefilled this from the posted brief and your stored company profile. Adjust the final details,
                    then generate and send from the preview.
                  </p>
                </div>
                <img src={targetIcon} alt="Propel target icon" className="w-10 h-10" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Your company">
                  <input className="w-full px-4 py-3 rounded-xl border outline-none" style={inputStyle} value={formData.businessName} onChange={(event) => update("businessName", event.target.value)} />
                </Field>
                <Field label="Client company">
                  <input className="w-full px-4 py-3 rounded-xl border outline-none" style={inputStyle} value={formData.clientName} onChange={(event) => update("clientName", event.target.value)} />
                </Field>
                <Field label="Service">
                  <select className="w-full px-4 py-3 rounded-xl border outline-none" style={inputStyle} value={formData.serviceOffering} onChange={(event) => update("serviceOffering", event.target.value)}>
                    {["Social Media Management", "Web Design", "Branding", "Content Creation", "Custom"].map((service) => (
                      <option key={service}>{service}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Budget">
                  <div className="flex gap-2">
                    <input className="min-w-0 flex-1 px-4 py-3 rounded-xl border outline-none" style={inputStyle} value={formData.budget} onChange={(event) => update("budget", event.target.value)} />
                    <select className="w-24 px-3 py-3 rounded-xl border outline-none" style={inputStyle} value={formData.currency} onChange={(event) => update("currency", event.target.value as ProposalFormData["currency"])}>
                      <option>PKR</option>
                      <option>USD</option>
                    </select>
                  </div>
                </Field>
                <Field label="Timeline">
                  <Segmented
                    value={formData.timeline}
                    options={["1 Month", "3 Months", "6 Months"]}
                    onChange={(value) => update("timeline", value as ProposalFormData["timeline"])}
                  />
                </Field>
                <Field label="Tone">
                  <Segmented
                    value={formData.tone}
                    options={["Professional", "Friendly", "Bold"]}
                    onChange={(value) => update("tone", value as ProposalFormData["tone"])}
                  />
                </Field>
                <Field label="Urgency">
                  <Segmented
                    value={formData.urgency}
                    options={["Consultative", "Soon", "Urgent"]}
                    onChange={(value) => update("urgency", value as ProposalFormData["urgency"])}
                  />
                </Field>
                <Field label="Language">
                  <Segmented
                    value={formData.language}
                    options={["English", "Urdu"]}
                    onChange={(value) => update("language", value as ProposalFormData["language"])}
                  />
                </Field>
              </div>

              <div className="mt-6">
                <Field label="Opportunity brief">
                  <textarea
                    value={formData.projectBrief}
                    onChange={(event) => update("projectBrief", event.target.value)}
                    rows={7}
                    className="w-full px-4 py-3 rounded-xl border outline-none resize-none"
                    style={{ ...inputStyle, borderColor: briefError ? "#b45309" : inputStyle.borderColor }}
                  />
                  {briefError && <p className="text-sm mt-2" style={{ color: "#b45309" }}>{briefError}</p>}
                </Field>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={generateProposal}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold transition-all hover:scale-102 disabled:opacity-70"
                  style={{ backgroundColor: "#375534", color: "#FFFFFF" }}
                >
                  {isGenerating ? <Sparkles size={18} className="animate-pulse" /> : <Send size={18} />}
                  {isGenerating ? "Generating..." : "Generate Proposal"}
                </button>
                <Link
                  to="/agency/proposals"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold border"
                  style={{ borderColor: "#375534", color: "#375534" }}
                >
                  <FileText size={18} />
                  My Proposals
                </Link>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div
                className="p-6 rounded-[20px] backdrop-blur-[20px]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.68)",
                  border: "1px solid rgba(174,195,176,0.35)",
                }}
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "#0F2A1D" }}>
                  <Building2 size={18} />
                  Stored agency info
                </h3>
                <Info label="Company" value={profile.companyName} />
                <Info label="Website" value={profile.website || "Not added"} />
                <Info label="Services" value={profile.services.join(", ")} />
                <Info label="Team" value={profile.teamSize || "Not added"} />
              </div>

              <div
                className="p-6 rounded-[20px] backdrop-blur-[20px]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.68)",
                  border: "1px solid rgba(174,195,176,0.35)",
                }}
              >
                <h3 className="font-semibold mb-4" style={{ color: "#0F2A1D" }}>
                  Generation status
                </h3>
                <div className="space-y-3">
                  {steps.map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: isGenerating && index <= step ? "#375534" : "rgba(174,195,176,0.28)",
                          color: isGenerating && index <= step ? "#FFFFFF" : "#6B9071",
                        }}
                      >
                        {isGenerating && index < step ? <Check size={13} /> : index + 1}
                      </span>
                      <span className="text-sm" style={{ color: index <= step && isGenerating ? "#0F2A1D" : "#6B9071" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-2" style={labelStyle}>
        {label}
      </span>
      {children}
    </label>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className="px-3 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: value === option ? "#375534" : "rgba(255,255,255,0.7)",
            color: value === option ? "#FFFFFF" : "#375534",
            border: "1px solid rgba(174,195,176,0.45)",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs mb-1" style={{ color: "#6B9071" }}>
        {label}
      </div>
      <div className="text-sm font-medium" style={{ color: "#0F2A1D" }}>
        {value}
      </div>
    </div>
  );
}
