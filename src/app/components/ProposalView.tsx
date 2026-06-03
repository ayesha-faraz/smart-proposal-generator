import { useState, useEffect } from "react";
import { AppProposal, downloadPDF } from "../lib/proposals";

interface ProposalViewProps {
  proposal: AppProposal;
  onRegenerate: () => void;
  onBack: () => void;
}

export function ProposalView({ proposal: savedProposal, onRegenerate, onBack }: ProposalViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const formData = savedProposal.formData;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [savedProposal.id]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generateProposal = () => {
    const serviceDetails = {
      "Social Media Management": {
        problem:
          "Your brand's social media presence is inconsistent, leading to reduced engagement and missed opportunities to connect with your target audience.",
        solution:
          "We will develop and execute a comprehensive social media strategy across all major platforms, ensuring consistent posting, engagement with followers, and data-driven content optimization.",
        scope: [
          "Platform management (Instagram, Facebook, LinkedIn, Twitter)",
          "Content calendar creation and execution",
          "Community management and engagement",
          "Monthly analytics and reporting",
          "Paid social advertising campaigns",
        ],
      },
      "Web Design": {
        problem: "Your current website doesn't effectively showcase your brand or convert visitors into customers.",
        solution:
          "We will design and develop a modern, responsive website that captures your brand essence and drives conversions through strategic UX/UI design.",
        scope: [
          "Custom website design",
          "Responsive development",
          "CMS integration",
          "SEO optimization",
          "Performance optimization",
          "1 month post-launch support",
        ],
      },
      Branding: {
        problem: "Your brand identity lacks consistency and fails to differentiate you from competitors in the market.",
        solution:
          "We will create a comprehensive brand identity system that communicates your unique value proposition and resonates with your target audience.",
        scope: [
          "Brand strategy and positioning",
          "Logo design and variations",
          "Color palette and typography system",
          "Brand guidelines document",
          "Marketing collateral templates",
          "Brand launch support",
        ],
      },
      "Content Creation": {
        problem: "You lack high-quality, engaging content to attract and retain your audience.",
        solution:
          "We will produce professional content that tells your brand story and drives engagement across all your marketing channels.",
        scope: [
          "Content strategy development",
          "Professional photography/videography",
          "Copywriting for web and social",
          "Graphic design assets",
          "Content optimization and editing",
          "Monthly content delivery",
        ],
      },
      Custom: {
        problem: "You need tailored solutions to address your unique business challenges and goals.",
        solution:
          "We will work closely with you to understand your specific needs and deliver customized services that drive measurable results.",
        scope: [
          "Custom solution design",
          "Dedicated project management",
          "Regular strategy sessions",
          "Flexible deliverables",
          "Ongoing optimization",
          "Performance tracking",
        ],
      },
    };

    const service = serviceDetails[formData.serviceOffering as keyof typeof serviceDetails] ?? serviceDetails.Custom;

    return {
      problem: service.problem,
      solution: service.solution,
      scope: service.scope,
      investment: [
        {
          item: "Strategy & Planning",
          details: "Initial research, strategy development, and planning",
          cost: Math.round(parseInt(formData.budget) * 0.15),
        },
        {
          item: "Core Deliverables",
          details: "Primary service execution and deliverables",
          cost: Math.round(parseInt(formData.budget) * 0.6),
        },
        {
          item: "Management & Support",
          details: "Project management, revisions, and ongoing support",
          cost: Math.round(parseInt(formData.budget) * 0.25),
        },
      ],
    };
  };

  const proposal = generateProposal();
  const totalBudget = parseInt(formData.budget);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center page-transition">
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(232, 113, 42, 0.6) 0%, rgba(196, 90, 26, 0.4) 50%, transparent 100%)",
              boxShadow: "0 0 40px rgba(232, 113, 42, 0.4)",
            }}
          />
          <p style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "1.125rem", color: "#8a7f78" }}>
            Writing your proposal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 py-8 lg:px-8 page-transition">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 rounded-full transition-all hover:opacity-80"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            color: "#8a7f78",
            fontFamily: "DM Sans, Inter, sans-serif",
          }}
        >
          ← Back to Form
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 slideInLeft">
            <div
              className="p-6 rounded-3xl sticky top-6"
              style={{
                background: "rgba(6, 4, 4, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                backdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5)",
              }}
            >
              <h3
                className="mb-6"
                style={{
                  fontFamily: "Mona Sans, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#f5f0eb",
                }}
              >
                Proposal Details
              </h3>

              <div className="space-y-4">
                {[
                  ["Business", formData.businessName],
                  ["Client", formData.clientName],
                  ["Industry", formData.clientIndustry],
                  ["Service", formData.serviceOffering],
                  ["Budget", `${formData.currency} ${formData.budget}`],
                  ["Timeline", formData.timeline],
                  ["Tone", formData.tone],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label
                      className="block mb-1 uppercase tracking-wide"
                      style={{
                        fontFamily: "DM Sans, Inter, sans-serif",
                        fontSize: "0.75rem",
                        color: "#8a7f78",
                      }}
                    >
                      {label}
                    </label>
                    <p style={{ color: "#f5f0eb", fontFamily: "DM Sans, Inter, sans-serif" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 slideInRight">
            <div
              className="p-10 rounded-3xl"
              style={{
                background: "#1a1612",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="mb-8 pb-6 fadeInUp stagger-1" style={{ borderBottom: "2px solid #e8712a", opacity: 0 }}>
                <h2
                  className="mb-2"
                  style={{
                    fontFamily: "Mona Sans, sans-serif",
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#f5f0eb",
                  }}
                >
                  {formData.businessName}
                </h2>
                <p style={{ color: "#8a7f78", fontFamily: "Montserrat, sans-serif" }}>
                  Proposal for {formData.clientName} • {currentDate}
                </p>
              </div>

              <ProposalSection title="Executive Summary" stagger="stagger-2">
                We are pleased to present this proposal for {formData.serviceOffering.toLowerCase()} services tailored
                specifically for {formData.clientName} in the {formData.clientIndustry.toLowerCase()} industry. Our{" "}
                {formData.timeline.toLowerCase()} engagement is designed to deliver measurable results that align with
                your business objectives.
              </ProposalSection>

              <ProposalSection title="Problem Statement" stagger="stagger-3">
                {proposal.problem}
              </ProposalSection>

              <ProposalSection title="Proposed Solution" stagger="stagger-4">
                {proposal.solution}
              </ProposalSection>

              <section className="mb-8 fadeInUp stagger-5" style={{ opacity: 0 }}>
                <SectionTitle>Scope of Work</SectionTitle>
                <ul className="space-y-2">
                  {proposal.scope.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                      style={{
                        color: "#8a7f78",
                        fontFamily: "DM Sans, Inter, sans-serif",
                        lineHeight: "1.7",
                      }}
                    >
                      <span style={{ color: "#e8712a" }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <ProposalSection title="Timeline" stagger="stagger-6">
                This project will be delivered over a {formData.timeline.toLowerCase()} period, with regular check-ins
                and milestone reviews to ensure we stay aligned with your goals and expectations.
              </ProposalSection>

              <section className="mb-8 fadeInUp stagger-7" style={{ opacity: 0 }}>
                <SectionTitle>Investment</SectionTitle>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
                    <thead>
                      <tr style={{ background: "rgba(232, 113, 42, 0.1)", fontFamily: "DM Sans, Inter, sans-serif" }}>
                        {["Item", "Details", "Cost"].map((heading) => (
                          <th
                            key={heading}
                            className={`px-4 py-3 ${heading === "Cost" ? "text-right" : "text-left"}`}
                            style={{ color: "#f5f0eb", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {proposal.investment.map((row, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3" style={tablePrimaryStyle}>
                            {row.item}
                          </td>
                          <td className="px-4 py-3" style={tableMutedStyle}>
                            {row.details}
                          </td>
                          <td className="px-4 py-3 text-right" style={tablePrimaryStyle}>
                            {formData.currency} {row.cost.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background: "rgba(232, 113, 42, 0.05)" }}>
                        <td className="px-4 py-4" colSpan={2} style={{ ...tablePrimaryStyle, fontWeight: "600" }}>
                          Total Investment
                        </td>
                        <td
                          className="px-4 py-4 text-right"
                          style={{
                            color: "#e8712a",
                            fontFamily: "DM Sans, Inter, sans-serif",
                            fontWeight: "700",
                            fontSize: "1.125rem",
                          }}
                        >
                          {formData.currency} {totalBudget.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <ProposalSection title={`Why ${formData.businessName}`} stagger="stagger-8">
                We bring deep expertise in {formData.clientIndustry.toLowerCase()} and a proven track record of
                delivering exceptional results. Our team is committed to understanding your unique challenges and
                crafting solutions that drive real business impact.
              </ProposalSection>

              <section
                className="p-6 rounded-2xl fadeInUp stagger-9"
                style={{
                  background: "rgba(232, 113, 42, 0.1)",
                  border: "1px solid rgba(232, 113, 42, 0.3)",
                  opacity: 0,
                }}
              >
                <SectionTitle>Next Steps</SectionTitle>
                <p style={{ color: "#8a7f78", fontFamily: "DM Sans, Inter, sans-serif", lineHeight: "1.7" }}>
                  We're excited to partner with {formData.clientName} and help you achieve your goals. Let's schedule a
                  call to discuss this proposal in detail and answer any questions you may have.
                </p>
              </section>
            </div>

            <div className="flex gap-4 mt-6 flex-wrap">
              <button
                onClick={onRegenerate}
                className="px-6 py-3 rounded-full"
                style={{
                  border: "2px solid #e8712a",
                  color: "#e8712a",
                  fontFamily: "DM Sans, Inter, sans-serif",
                  fontWeight: "600",
                  background: "transparent",
                }}
              >
                Regenerate
              </button>
              <button
                onClick={() => downloadPDF(savedProposal).catch((error) => console.error("Could not download PDF", error))}
                className="px-6 py-3 rounded-full"
                style={{
                  background: "#e8712a",
                  color: "#0c0a09",
                  fontFamily: "DM Sans, Inter, sans-serif",
                  fontWeight: "700",
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-3"
      style={{
        fontFamily: "Mona Sans, sans-serif",
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#f5f0eb",
      }}
    >
      {children}
    </h3>
  );
}

function ProposalSection({ title, children, stagger }: { title: string; children: React.ReactNode; stagger: string }) {
  return (
    <section className={`mb-8 fadeInUp ${stagger}`} style={{ opacity: 0 }}>
      <SectionTitle>{title}</SectionTitle>
      <p style={{ color: "#8a7f78", fontFamily: "DM Sans, Inter, sans-serif", lineHeight: "1.7" }}>{children}</p>
    </section>
  );
}

const tablePrimaryStyle = {
  color: "#f5f0eb",
  fontFamily: "DM Sans, Inter, sans-serif",
  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
};

const tableMutedStyle = {
  color: "#8a7f78",
  fontFamily: "DM Sans, Inter, sans-serif",
  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
};
