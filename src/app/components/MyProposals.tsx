import { ProposalFormData } from "./ProposalForm";
import { BackgroundOrbs } from "./BackgroundOrbs";
import { downloadProposalPdf } from "../lib/downloadProposalPdf";

interface SavedProposal {
  id: string;
  formData: ProposalFormData;
  dateGenerated: Date;
}

interface MyProposalsProps {
  proposals: SavedProposal[];
  onViewProposal: (proposal: SavedProposal) => void;
  onGenerateNew: () => void;
}

export function MyProposals({ proposals, onViewProposal, onGenerateNew }: MyProposalsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const downloadPDF = (proposal: SavedProposal) => {
    const { formData } = proposal;
    downloadProposalPdf({
      filename: `${formData.clientName} proposal`,
      businessName: formData.businessName,
      clientName: formData.clientName,
      currentDate: formatDate(proposal.dateGenerated),
      headline: `${formData.businessName} x ${formData.clientName}`,
      subtitle: formData.mainGoal || formData.serviceOffering,
      contactLines: [formData.businessName, formData.email, formData.phone, formData.website].filter(Boolean),
      sections: [
        {
          title: "Client",
          body: `${formData.clientName} is a ${formData.clientIndustry} business targeting ${formData.targetAudience || "their ideal customers"}.`,
        },
        { title: "Project Brief", body: formData.projectBrief },
        {
          title: "Recommended Service",
          body: `${formData.serviceOffering} over ${formData.timeline}, in a ${formData.tone.toLowerCase()} tone.`,
        },
        {
          title: "Investment",
          body: `${formData.currency} ${formData.budget}`,
        },
        {
          title: "Next Step",
          body: "Open the full proposal preview for the detailed formatted export.",
        },
      ],
      footer: `${formData.businessName} - Prepared exclusively for ${formData.clientName}.`,
    });
  };

  return (
    <div className="w-full min-h-screen px-6 py-12 page-transition relative">
      {/* Background Gradients */}
      <BackgroundOrbs />

      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
        {/* Page Heading */}
        <div className="mb-12 fadeInUp">
          <h1
            className="mb-3"
            style={{
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              fontSize: "2.5rem",
              color: "#f5f0eb",
            }}
          >
            My Proposals
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "1.125rem",
              color: "#8a7f78",
            }}
          >
            All your previously generated proposals
          </p>
        </div>

        {/* Proposals Grid or Empty State */}
        {proposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 fadeInUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <p
              className="mb-6"
              style={{
                fontFamily: "DM Sans, Inter, sans-serif",
                fontSize: "1.125rem",
                color: "#8a7f78",
              }}
            >
              No proposals yet. Generate your first one.
            </p>
            <button
              onClick={onGenerateNew}
              className="px-6 py-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, #e8712a 0%, #c45a1a 100%)",
                color: "#f5f0eb",
                fontFamily: "DM Sans, Inter, sans-serif",
                fontWeight: "700",
                boxShadow: "0 0 24px rgba(232, 113, 42, 0.4)",
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              Generate Proposal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((proposal, index) => (
              <div
                key={proposal.id}
                className={`p-6 rounded-3xl fadeInUp stagger-${Math.min(index + 1, 10)}`}
                style={{
                  background: "rgba(6, 4, 4, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)",
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(232, 113, 42, 0.3)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(232, 113, 42, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Client Name */}
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: "700",
                    fontSize: "1.25rem",
                    color: "#f5f0eb",
                  }}
                >
                  {proposal.formData.clientName}
                </h3>

                {/* Service Type Tag */}
                <div
                  className="inline-block px-3 py-1 rounded-full mb-4"
                  style={{
                    background: "rgba(232, 113, 42, 0.1)",
                    color: "#e8712a",
                    fontFamily: "DM Sans, Inter, sans-serif",
                    fontSize: "0.688rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {proposal.formData.serviceOffering}
                </div>

                {/* Business Name & Date */}
                <div className="mb-6">
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.875rem",
                      color: "#8a7f78",
                    }}
                  >
                    {proposal.formData.businessName}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      color: "#8a7f78",
                      marginTop: "4px",
                    }}
                  >
                    Generated {formatDate(proposal.dateGenerated)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => onViewProposal(proposal)}
                    className="flex-1 px-4 py-2 rounded-full"
                    style={{
                      border: "2px solid #e8712a",
                      color: "#e8712a",
                      fontFamily: "DM Sans, Inter, sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      background: "transparent",
                      transition: "all 0.2s ease",
                      transform: "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => downloadPDF(proposal)}
                    className="flex-1 px-4 py-2 rounded-full"
                    style={{
                      background: "#e8712a",
                      color: "#0c0a09",
                      fontFamily: "DM Sans, Inter, sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: "700",
                      transition: "all 0.2s ease",
                      transform: "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
