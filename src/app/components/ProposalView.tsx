import { useState, useEffect } from "react";
import { ProposalFormData } from "./ProposalForm";
import { downloadProposalPdf } from "../lib/downloadProposalPdf";
import { evaluateGeneratedProposal } from "../lib/proposalValidation";

interface ProposalViewProps {
  formData: ProposalFormData;
  onRegenerate: () => void;
  onBack: () => void;
}

export interface GeneratedProposal {
  headline: string;
  subtitle: string;
  executiveSummary: string;
  problem: string;
  opportunity: string;
  solution: string;
  whyUs: string;
  close: string;
  scope: string[];
  investment: Array<{ item: string; details: string; cost: number }>;
}

export function ProposalView({ formData, onRegenerate, onBack }: ProposalViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);
  const [error, setError] = useState("");
  const [generationId, setGenerationId] = useState(0);
  const [apiWarnings, setApiWarnings] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sectionToRegenerate, setSectionToRegenerate] = useState<keyof GeneratedProposal>("executiveSummary");
  const [isRegeneratingSection, setIsRegeneratingSection] = useState(false);
  const [sectionError, setSectionError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function generateProposal() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/generate-proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "The proposal could not be generated.");
        }

        setProposal(data.proposal);
        setApiWarnings(Array.isArray(data.warnings) ? data.warnings : []);
        setIsApproved(false);
        setIsEditing(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "The proposal could not be generated.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    generateProposal();
    return () => controller.abort();
  }, [formData, generationId]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleRegenerate = () => {
    onRegenerate();
    setIsApproved(false);
    setSectionError("");
    setGenerationId((value) => value + 1);
  };

  const qualityReport = proposal ? evaluateGeneratedProposal(proposal, formData) : null;
  const canApprove = Boolean(qualityReport && qualityReport.blockingIssues.length === 0);

  const updateProposalText = (field: keyof GeneratedProposal, value: string) => {
    if (!proposal) return;
    if (field === "scope" || field === "investment") return;
    setProposal({ ...proposal, [field]: value } as GeneratedProposal);
    setIsApproved(false);
  };

  const updateScope = (value: string) => {
    if (!proposal) return;
    const scope = value.split("\n").map((item) => item.trim()).filter(Boolean);
    setProposal({ ...proposal, scope });
    setIsApproved(false);
  };

  const handleRegenerateSection = async () => {
    if (!proposal || sectionToRegenerate === "investment") return;
    setIsRegeneratingSection(true);
    setSectionError("");
    try {
      const response = await fetch("/api/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, proposal, section: sectionToRegenerate }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The section could not be regenerated.");
      setProposal({ ...proposal, [sectionToRegenerate]: data.content } as GeneratedProposal);
      setIsApproved(false);
    } catch (err) {
      setSectionError(err instanceof Error ? err.message : "The section could not be regenerated.");
    } finally {
      setIsRegeneratingSection(false);
    }
  };

  const totalBudget = Number(formData.budget) || 0;

  const handleDownloadPDF = () => {
    if (!proposal || !isApproved || !qualityReport || qualityReport.blockingIssues.length > 0) return;

    downloadProposalPdf({
      filename: `${formData.clientName} proposal`,
      businessName: formData.businessName,
      clientName: formData.clientName,
      currentDate,
      headline: proposal.headline.replace("Ã—", "x"),
      subtitle: proposal.subtitle,
      contactLines: [formData.businessName, formData.email, formData.phone, formData.website].filter(
        (value) => value && value.trim().toLowerCase() !== "n/a",
      ),
      sections: [
        { title: "Executive Summary", body: proposal.executiveSummary },
        { title: "The Problem We're Solving", body: proposal.problem },
        { title: "The Opportunity", body: proposal.opportunity },
        { title: "Proposed Solution", body: proposal.solution },
        {
          title: "Timeline",
          body: `This project will be delivered over a ${formData.timeline.toLowerCase()} period, with regular check-ins and milestone reviews to ensure we stay aligned with your goals and expectations. From day one, you will see momentum.`,
        },
        { title: `Why ${formData.businessName}`, body: proposal.whyUs },
        { title: "Next Steps", body: proposal.close },
      ],
      scope: proposal.scope,
      investment: proposal.investment.map((row) => ({
        item: row.item,
        details: row.details,
        cost: `${formData.currency} ${row.cost.toLocaleString()}`,
      })),
      totalInvestment: `Total Investment: ${formData.currency} ${totalBudget.toLocaleString()}`,
      footer: `${formData.businessName} - Prepared exclusively for ${formData.clientName}. Valid for 14 days from date of issue.`,
    });
  };

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-4 page-transition">
        <div className="max-w-xl text-center p-8 rounded-3xl" style={{ background: '#1a1612', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="mb-3" style={{ color: '#f5f0eb', fontSize: '1.5rem', fontWeight: 700 }}>Proposal generation failed</h2>
          <p className="mb-6" style={{ color: '#b7aaa2' }}>{error}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={handleRegenerate} className="px-5 py-3 rounded-full" style={{ background: '#e8712a', color: '#0c0a09' }}>Try Again</button>
            <button onClick={onBack} className="px-5 py-3 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#f5f0eb' }}>Back to Form</button>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal && !isLoading) return null;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center page-transition">
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 pulse"
            style={{
              background: 'radial-gradient(circle, rgba(232, 113, 42, 0.6) 0%, rgba(196, 90, 26, 0.4) 50%, transparent 100%)',
              boxShadow: '0 0 40px rgba(232, 113, 42, 0.4)',
            }}
          />
          <p
            style={{
              fontFamily: 'DM Sans, Inter, sans-serif',
              fontSize: '1.125rem',
              color: '#8a7f78',
            }}
          >
            Writing your proposal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 py-8 lg:px-8 page-transition">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 rounded-full transition-all hover:opacity-80"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#8a7f78',
            fontFamily: 'DM Sans, Inter, sans-serif',
          }}
        >
          ← Back to Form
        </button>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side - Form Summary */}
          <div className="lg:col-span-5 slideInLeft">
            <div
              className="p-6 rounded-3xl sticky top-6"
              style={{
                background: 'rgba(6, 4, 4, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(20px)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5)',
              }}
            >
              <h3
                className="mb-6"
                style={{
                  fontFamily: 'Mona Sans, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#f5f0eb',
                }}
              >
                Proposal Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Business
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.businessName}
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Client
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.clientName}
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Industry
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.clientIndustry}
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Service
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.serviceOffering}
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Budget
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.currency} {formData.budget}
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Timeline
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.timeline}
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Tone
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.tone}
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Main Goal
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.mainGoal}
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Target Audience
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.targetAudience}
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-1 uppercase tracking-wide"
                    style={{
                      fontFamily: 'DM Sans, Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#8a7f78',
                    }}
                  >
                    Urgency
                  </label>
                  <p style={{ color: '#f5f0eb', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                    {formData.urgency} / {formData.language}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Generated Proposal */}
          <div className="lg:col-span-7 slideInRight">
            <div
              className="p-10 rounded-3xl"
              style={{
                background: '#1a1612',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Header */}
              <div className="mb-8 pb-6 fadeInUp stagger-1" style={{ borderBottom: '2px solid #e8712a', opacity: 0 }}>
                <h2
                  className="mb-2"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  {proposal.headline}
                </h2>
                <p className="mb-2" style={{ color: '#e8712a', fontFamily: 'Montserrat, sans-serif' }}>
                  {proposal.subtitle}
                </p>
                <p style={{ color: '#8a7f78', fontFamily: 'Montserrat, sans-serif' }}>
                  Proposal for {formData.clientName} • {currentDate}
                </p>
              </div>

              {/* Executive Summary */}
              <section className="mb-8 fadeInUp stagger-2" style={{ opacity: 0 }}>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  Executive Summary
                </h3>
                <p
                  style={{
                    color: '#8a7f78',
                    fontFamily: 'DM Sans, Inter, sans-serif',
                    lineHeight: '1.7',
                  }}
                >
                  {proposal.executiveSummary}
                </p>
              </section>

              {/* Problem Statement */}
              <section className="mb-8 fadeInUp stagger-3" style={{ opacity: 0 }}>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  Problem Statement
                </h3>
                <p
                  style={{
                    color: '#8a7f78',
                    fontFamily: 'DM Sans, Inter, sans-serif',
                    lineHeight: '1.7',
                  }}
                >
                  {proposal.problem}
                </p>
              </section>

              {/* Opportunity */}
              <section className="mb-8 fadeInUp stagger-4" style={{ opacity: 0 }}>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  The Opportunity
                </h3>
                <p
                  style={{
                    color: '#8a7f78',
                    fontFamily: 'DM Sans, Inter, sans-serif',
                    lineHeight: '1.7',
                  }}
                >
                  {proposal.opportunity}
                </p>
              </section>

              {/* Proposed Solution */}
              <section className="mb-8 fadeInUp stagger-4" style={{ opacity: 0 }}>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  Proposed Solution
                </h3>
                <p
                  style={{
                    color: '#8a7f78',
                    fontFamily: 'DM Sans, Inter, sans-serif',
                    lineHeight: '1.7',
                  }}
                >
                  {proposal.solution}
                </p>
              </section>

              {/* Scope of Work */}
              <section className="mb-8 fadeInUp stagger-5" style={{ opacity: 0 }}>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  Scope of Work
                </h3>
                <ul className="space-y-2">
                  {proposal.scope.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                      style={{
                        color: '#8a7f78',
                        fontFamily: 'DM Sans, Inter, sans-serif',
                        lineHeight: '1.7',
                      }}
                    >
                      <span style={{ color: '#e8712a' }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Timeline */}
              <section className="mb-8 fadeInUp stagger-6" style={{ opacity: 0 }}>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  Timeline
                </h3>
                <p
                  style={{
                    color: '#8a7f78',
                    fontFamily: 'DM Sans, Inter, sans-serif',
                    lineHeight: '1.7',
                  }}
                >
                  This project will be delivered over a {formData.timeline.toLowerCase()} period, with regular check-ins and milestone reviews to ensure we stay aligned with your goals and expectations. From day one, you will see momentum.
                </p>
              </section>

              {/* Investment Table */}
              <section className="mb-8 fadeInUp stagger-7" style={{ opacity: 0 }}>
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  Investment
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                    <thead>
                      <tr
                        style={{
                          background: 'rgba(232, 113, 42, 0.1)',
                          fontFamily: 'DM Sans, Inter, sans-serif',
                        }}
                      >
                        <th
                          className="px-4 py-3 text-left"
                          style={{
                            color: '#f5f0eb',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          Item
                        </th>
                        <th
                          className="px-4 py-3 text-left"
                          style={{
                            color: '#f5f0eb',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          Details
                        </th>
                        <th
                          className="px-4 py-3 text-right"
                          style={{
                            color: '#f5f0eb',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposal.investment.map((row, index) => (
                        <tr key={index}>
                          <td
                            className="px-4 py-3"
                            style={{
                              color: '#f5f0eb',
                              fontFamily: 'DM Sans, Inter, sans-serif',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            {row.item}
                          </td>
                          <td
                            className="px-4 py-3"
                            style={{
                              color: '#8a7f78',
                              fontFamily: 'DM Sans, Inter, sans-serif',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            {row.details}
                          </td>
                          <td
                            className="px-4 py-3 text-right"
                            style={{
                              color: '#f5f0eb',
                              fontFamily: 'DM Sans, Inter, sans-serif',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            {formData.currency} {row.cost.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background: 'rgba(232, 113, 42, 0.05)' }}>
                        <td
                          className="px-4 py-4"
                          colSpan={2}
                          style={{
                            color: '#f5f0eb',
                            fontFamily: 'DM Sans, Inter, sans-serif',
                            fontWeight: '600',
                          }}
                        >
                          Total Investment
                        </td>
                        <td
                          className="px-4 py-4 text-right"
                          style={{
                            color: '#e8712a',
                            fontFamily: 'DM Sans, Inter, sans-serif',
                            fontWeight: '700',
                            fontSize: '1.125rem',
                          }}
                        >
                          {formData.currency} {totalBudget.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Why Us */}
              <section className="mb-8 fadeInUp stagger-8" style={{ opacity: 0 }}>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  Why {formData.businessName}
                </h3>
                <p
                  style={{
                    color: '#8a7f78',
                    fontFamily: 'DM Sans, Inter, sans-serif',
                    lineHeight: '1.7',
                  }}
                >
                  {proposal.whyUs}
                </p>
              </section>

              {/* Call to Action */}
              <section
                className="p-6 rounded-2xl fadeInUp stagger-9"
                style={{
                  background: 'rgba(232, 113, 42, 0.1)',
                  border: '1px solid rgba(232, 113, 42, 0.3)',
                  opacity: 0,
                }}
              >
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#f5f0eb',
                  }}
                >
                  Next Steps
                </h3>
                <p
                  style={{
                    color: '#8a7f78',
                    fontFamily: 'DM Sans, Inter, sans-serif',
                    lineHeight: '1.7',
                  }}
                >
                  {proposal.close}
                </p>
              </section>
            </div>

            {/* Review, editing, and approval controls */}
            <div
              className="mt-6 p-6 rounded-3xl"
              style={{ background: 'rgba(6, 4, 4, 0.55)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div>
                  <h3 style={{ color: '#f5f0eb', fontSize: '1.25rem', fontWeight: 700 }}>Review before PDF</h3>
                  <p style={{ color: '#8a7f78', fontSize: 13 }}>Edit or regenerate sections, then approve the final draft.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing((value) => !value)}
                  className="px-4 py-2 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#f5f0eb' }}
                >
                  {isEditing ? "Close Editor" : "Edit Draft"}
                </button>
              </div>

              {apiWarnings.length > 0 && (
                <div className="mb-4 rounded-2xl p-4" style={{ background: 'rgba(240,168,78,0.1)', border: '1px solid rgba(240,168,78,0.3)' }}>
                  <p style={{ color: '#f5f0eb', fontWeight: 700, marginBottom: 6 }}>Input warnings</p>
                  <ul style={{ color: '#d9c3a6', paddingLeft: 18, listStyle: 'disc', fontSize: 13 }}>
                    {apiWarnings.map((warning) => <li key={warning}>{warning}</li>)}
                  </ul>
                </div>
              )}

              {qualityReport && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  {qualityReport.checks.map((check) => (
                    <div key={check.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.035)', border: `1px solid ${check.passed ? 'rgba(91,184,122,0.28)' : 'rgba(224,92,92,0.35)'}` }}>
                      <p style={{ color: check.passed ? '#9fd5ad' : '#e9b0b0', fontWeight: 700, fontSize: 13 }}>{check.passed ? '✓' : '✕'} {check.label}</p>
                      <p style={{ color: '#8a7f78', fontSize: 12, marginTop: 3 }}>{check.detail}</p>
                    </div>
                  ))}
                </div>
              )}

              {qualityReport && qualityReport.blockingIssues.length > 0 && (
                <div role="alert" className="mb-4 rounded-2xl p-4" style={{ background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.35)' }}>
                  <p style={{ color: '#f5f0eb', fontWeight: 700, marginBottom: 6 }}>PDF approval is blocked</p>
                  <ul style={{ color: '#e9b0b0', paddingLeft: 18, listStyle: 'disc', fontSize: 13 }}>
                    {qualityReport.blockingIssues.map((issue) => <li key={issue}>{issue}</li>)}
                  </ul>
                </div>
              )}

              {isEditing && proposal && (
                <div className="space-y-4 mb-5">
                  {([
                    ["headline", "Headline"],
                    ["subtitle", "Subtitle"],
                    ["executiveSummary", "Executive Summary"],
                    ["problem", "Problem"],
                    ["opportunity", "Opportunity"],
                    ["solution", "Solution"],
                    ["whyUs", "Why Us"],
                    ["close", "Next Steps"],
                  ] as Array<[keyof GeneratedProposal, string]>).map(([field, label]) => (
                    <label key={field} className="block">
                      <span style={{ color: '#b7aaa2', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                      <textarea
                        aria-label={`Edit ${label}`}
                        value={String(proposal[field])}
                        onChange={(event) => updateProposalText(field, event.target.value)}
                        className="w-full mt-2 px-4 py-3 rounded-xl outline-none"
                        style={{ minHeight: field === 'headline' || field === 'subtitle' ? 70 : 120, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f5f0eb' }}
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span style={{ color: '#b7aaa2', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Scope, one item per line</span>
                    <textarea
                      aria-label="Edit Scope"
                      value={proposal.scope.join("\n")}
                      onChange={(event) => updateScope(event.target.value)}
                      className="w-full mt-2 px-4 py-3 rounded-xl outline-none"
                      style={{ minHeight: 150, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f5f0eb' }}
                    />
                  </label>
                </div>
              )}

              <div className="flex gap-3 items-end flex-wrap mb-5">
                <label className="flex-1 min-w-[220px]">
                  <span style={{ color: '#b7aaa2', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Regenerate one section</span>
                  <select
                    aria-label="Section to regenerate"
                    value={sectionToRegenerate}
                    onChange={(event) => setSectionToRegenerate(event.target.value as keyof GeneratedProposal)}
                    className="w-full mt-2 px-4 py-3 rounded-xl outline-none"
                    style={{ background: '#1a1612', border: '1px solid rgba(255,255,255,0.08)', color: '#f5f0eb' }}
                  >
                    <option value="headline">Headline</option>
                    <option value="subtitle">Subtitle</option>
                    <option value="executiveSummary">Executive Summary</option>
                    <option value="problem">Problem</option>
                    <option value="opportunity">Opportunity</option>
                    <option value="solution">Solution</option>
                    <option value="scope">Scope of Work</option>
                    <option value="whyUs">Why Us</option>
                    <option value="close">Next Steps</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateSection}
                  disabled={isRegeneratingSection}
                  className="px-5 py-3 rounded-full"
                  style={{ background: 'rgba(232,113,42,0.14)', border: '1px solid rgba(232,113,42,0.4)', color: '#e8712a', opacity: isRegeneratingSection ? 0.6 : 1 }}
                >
                  {isRegeneratingSection ? "Regenerating..." : "Regenerate Section"}
                </button>
              </div>

              {sectionError && <p role="alert" style={{ color: '#e9b0b0', fontSize: 13, marginBottom: 12 }}>{sectionError}</p>}

              <label className="flex items-start gap-3" style={{ color: canApprove ? '#f5f0eb' : '#776e68', fontSize: 13 }}>
                <input
                  type="checkbox"
                  aria-label="Approve proposal for PDF"
                  checked={isApproved}
                  disabled={!canApprove}
                  onChange={(event) => setIsApproved(event.target.checked)}
                />
                I reviewed the proposal, verified the client details, scope, timeline, claims, and investment, and approve this draft for PDF generation.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6 flex-wrap">
              <button
                onClick={handleRegenerate}
                className="px-6 py-3 rounded-full"
                style={{
                  border: '2px solid #e8712a',
                  color: '#e8712a',
                  fontFamily: 'DM Sans, Inter, sans-serif',
                  fontWeight: '600',
                  background: 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                Regenerate
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={!isApproved || !canApprove}
                title={!canApprove ? "Resolve quality-check issues before downloading" : !isApproved ? "Approve the reviewed proposal before downloading" : "Download the approved proposal"}
                className="px-6 py-3 rounded-full"
                style={{
                  background: '#e8712a',
                  color: '#0c0a09',
                  fontFamily: 'DM Sans, Inter, sans-serif',
                  fontWeight: '700',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  opacity: !isApproved || !canApprove ? 0.45 : 1,
                  cursor: !isApproved || !canApprove ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(232, 113, 42, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
