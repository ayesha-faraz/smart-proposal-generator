import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { BadgeCheck, Brain, CheckCircle, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { agencyMatches, getOpportunityById } from "../lib/marketplace";
import { askGroqJSON } from "../lib/ai";
import { DealAssistant } from "./DealAssistant/DealAssistant";

interface BriefResult {
  title: string;
  objective: string;
  deliverables: string[];
  successMetrics: string[];
  suggestedBudget: string;
  timeline: string;
}

const fallbackBrief: BriefResult = {
  title: "Mobile-first e-commerce redesign for stronger conversion",
  objective: "Improve customer trust, simplify product discovery, and reduce checkout friction.",
  deliverables: ["UX audit", "Mobile storefront redesign", "Checkout optimization", "Design system", "Launch support"],
  successMetrics: ["30% higher mobile conversion", "20% lower cart abandonment", "Faster product discovery"],
  suggestedBudget: "PKR 2,000,000 - 3,000,000",
  timeline: "12-16 weeks",
};

export default function DealIntelligence() {
  const opportunity = getOpportunityById("1");
  const [briefInput, setBriefInput] = useState("We need help redesigning our online store so more mobile users buy from us.");
  const [brief, setBrief] = useState<BriefResult>(fallbackBrief);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBrief = async () => {
    setIsGenerating(true);
    const result = await askGroqJSON<BriefResult>(
      `Turn this vague business need into a structured B2B services brief. Return JSON with title, objective, deliverables array, successMetrics array, suggestedBudget, timeline. Need: ${briefInput}`,
      fallbackBrief,
    );
    setBrief(result);
    setIsGenerating(false);
  };

  return (
    <div className="flex min-h-[100dvh] relative">
      <Background />
      <Sidebar userType="entrepreneur" />

      <div className="flex-1 md:ml-60 relative z-10 p-4 sm:p-6 md:p-8 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl mb-2" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", color: "#0F2A1D" }}>
              AI Deal Intelligence
            </h1>
            <p style={{ color: "#6B9071" }}>
              Turn a vague need into a scored, trusted, execution-ready services deal.
            </p>
          </div>
          <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: "#E3EED4", color: "#375534" }}>
            Powered by Propel AI
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
          <div className="space-y-6">
            <Panel icon={<Brain size={20} />} title="AI Brief Builder">
              <textarea
                value={briefInput}
                onChange={(event) => setBriefInput(event.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border resize-none mb-4"
                style={{ backgroundColor: "rgba(255,255,255,0.8)", borderColor: "rgba(174,195,176,0.4)", color: "#0F2A1D" }}
              />
              <button onClick={generateBrief} className="px-5 py-2.5 rounded-full font-medium mb-5" style={{ backgroundColor: "#375534", color: "#FFFFFF" }}>
                {isGenerating ? "Building Brief..." : "Build Smart Brief"}
              </button>
              <div className="p-5 rounded-[16px]" style={{ backgroundColor: "rgba(227,238,212,0.45)" }}>
                <h3 className="font-semibold mb-2" style={{ color: "#0F2A1D" }}>{brief.title}</h3>
                <p className="mb-4" style={{ color: "#375534" }}>{brief.objective}</p>
                <div className="grid grid-cols-2 gap-4">
                  <MiniList title="Deliverables" items={brief.deliverables} />
                  <MiniList title="Success Metrics" items={brief.successMetrics} />
                </div>
                <div className="flex gap-3 mt-4">
                  <Tag>{brief.suggestedBudget}</Tag>
                  <Tag>{brief.timeline}</Tag>
                </div>
              </div>
            </Panel>

            <Panel icon={<Sparkles size={20} />} title="AI Agency Matchmaking">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {agencyMatches.map((agency) => (
                  <motion.div key={agency.id} whileHover={{ y: -4 }} className="p-5 rounded-[16px]" style={{ backgroundColor: "rgba(255,255,255,0.72)", border: "1px solid rgba(174,195,176,0.35)" }}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold" style={{ color: "#0F2A1D" }}>{agency.name}</h3>
                      {agency.verified && <BadgeCheck size={18} style={{ color: "#375534" }} />}
                    </div>
                    <Score label="Match" value={agency.matchScore} />
                    <Score label="Delivery" value={agency.deliveryConfidence} />
                    <Score label="Price Fit" value={agency.priceFit} />
                    <p className="text-xs mt-3" style={{ color: "#6B9071" }}>{agency.proof}</p>
                  </motion.div>
                ))}
              </div>
            </Panel>

            <Panel icon={<Star size={20} />} title="AI Proposal Scoring">
              <DealAssistant />
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel icon={<ShieldCheck size={20} />} title="Verified Business Profiles">
              {["Business registration", "Portfolio outcomes", "Domain ownership", "Client references", "Payment method"].map((item) => (
                <div key={item} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "rgba(174,195,176,0.2)", color: "#375534" }}>
                  <CheckCircle size={17} style={{ color: "#6B9071" }} />
                  <span>{item}</span>
                </div>
              ))}
            </Panel>

            <Panel icon={<BadgeCheck size={20} />} title="Outcome-Based Reputation">
              <Score label="On-time delivery" value={96} />
              <Score label="Repeat client rate" value={71} />
              <Score label="Dispute-free projects" value={98} />
              <Score label="Verified outcomes" value={88} />
              <p className="text-xs mt-4" style={{ color: "#6B9071" }}>
                Agencies rank by completed work, verified delivery, and outcomes rather than generic star ratings.
              </p>
            </Panel>

            <Panel icon={<Sparkles size={20} />} title="Current Brief">
              <h3 className="font-semibold mb-2" style={{ color: "#0F2A1D" }}>{opportunity.title}</h3>
              <p className="text-sm mb-3" style={{ color: "#375534" }}>{opportunity.brief}</p>
              <Tag>{opportunity.budget}</Tag>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-[60px]" style={{ background: "radial-gradient(circle, rgba(174,195,176,1) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[50px]" style={{ background: "radial-gradient(circle, rgba(107,144,113,1) 0%, transparent 60%)" }} />
    </div>
  );
}

function Panel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="p-6 rounded-[20px] backdrop-blur-[20px]" style={{ backgroundColor: "rgba(255,255,255,0.65)", border: "1px solid rgba(174,195,176,0.35)", boxShadow: "0 4px 24px rgba(15,42,29,0.06)" }}>
      <div className="flex items-center gap-2 mb-5" style={{ color: "#375534" }}>
        {icon}
        <h2 className="text-xl font-semibold" style={{ color: "#0F2A1D" }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-2" style={{ color: "#0F2A1D" }}>{title}</div>
      <ul className="space-y-1">
        {items.map((item) => <li key={item} className="text-sm" style={{ color: "#375534" }}>- {item}</li>)}
      </ul>
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-block px-3 py-1 rounded-full text-xs" style={{ backgroundColor: "rgba(174,195,176,0.28)", color: "#375534" }}>{children}</span>;
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1" style={{ color: "#6B9071" }}>
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(174,195,176,0.25)" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: "#375534" }} />
      </div>
    </div>
  );
}
