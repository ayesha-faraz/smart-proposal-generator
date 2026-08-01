import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { BarChart3, Check, CreditCard, FileText, MessageSquare, ShieldCheck, Upload } from "lucide-react";
import { Sidebar } from "./Sidebar";

const initialMilestones = [
  { name: "Discovery and audit", amount: "USD 3,000", status: "Released" },
  { name: "Design system and mobile flows", amount: "USD 7,500", status: "Funded" },
  { name: "Build handoff and launch support", amount: "USD 6,000", status: "Pending" },
];

export default function DealRoom() {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [messages, setMessages] = useState(["RetailCo approved the discovery scope.", "Northstar uploaded the first UX audit notes."]);
  const [message, setMessage] = useState("");
  const [approval, setApproval] = useState("Waiting for design milestone approval");
  const [fileName, setFileName] = useState("");

  const fundMilestone = (name: string) => {
    setMilestones((current) => current.map((item) => (item.name === name ? { ...item, status: "Funded" } : item)));
  };

  const releaseMilestone = (name: string) => {
    setMilestones((current) => current.map((item) => (item.name === name ? { ...item, status: "Released" } : item)));
  };

  return (
    <div className="flex min-h-screen relative">
      <Background />
      <Sidebar userType="agency" />

      <div className="flex-1 ml-60 relative z-10 p-8">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl mb-2" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", color: "#0F2A1D" }}>
              Deal Room
            </h1>
            <p style={{ color: "#6B9071" }}>RetailCo x Northstar Digital - shared execution workspace</p>
          </div>
          <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: "#E3EED4", color: "#375534" }}>
            Escrow protected
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="space-y-6">
            <Panel icon={<CreditCard size={20} />} title="Milestone Payments / Escrow">
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div key={milestone.name} className="flex items-center justify-between gap-4 p-4 rounded-[16px]" style={{ backgroundColor: "rgba(255,255,255,0.72)", border: "1px solid rgba(174,195,176,0.35)" }}>
                    <div>
                      <div className="font-semibold" style={{ color: "#0F2A1D" }}>{milestone.name}</div>
                      <div className="text-sm" style={{ color: "#6B9071" }}>{milestone.amount}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: milestone.status === "Released" ? "#0F2A1D" : "#E3EED4", color: milestone.status === "Released" ? "#E3EED4" : "#375534" }}>
                        {milestone.status}
                      </span>
                      {milestone.status === "Pending" && <button onClick={() => fundMilestone(milestone.name)} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: "#375534", color: "#FFFFFF" }}>Fund</button>}
                      {milestone.status === "Funded" && <button onClick={() => releaseMilestone(milestone.name)} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: "#375534", color: "#FFFFFF" }}>Release</button>}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel icon={<FileText size={20} />} title="Files, Deliverables, and Approvals">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-[16px]" style={{ backgroundColor: "rgba(255,255,255,0.72)", border: "1px solid rgba(174,195,176,0.35)" }}>
                  <Upload size={24} className="mb-3" style={{ color: "#375534" }} />
                  <input type="file" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} />
                  <p className="text-sm mt-3" style={{ color: "#6B9071" }}>{fileName || "Upload proposal assets, invoices, briefs, or deliverables."}</p>
                </div>
                <div className="p-4 rounded-[16px]" style={{ backgroundColor: "rgba(227,238,212,0.45)" }}>
                  <div className="font-semibold mb-2" style={{ color: "#0F2A1D" }}>Current approval</div>
                  <p className="text-sm mb-4" style={{ color: "#375534" }}>{approval}</p>
                  <button onClick={() => setApproval("Design milestone approved")} className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: "#375534", color: "#FFFFFF" }}>
                    Approve Milestone
                  </button>
                </div>
              </div>
            </Panel>

            <Panel icon={<MessageSquare size={20} />} title="Messages">
              <div className="space-y-2 mb-4">
                {messages.map((item, index) => (
                  <div key={index} className="p-3 rounded-xl text-sm" style={{ backgroundColor: "rgba(255,255,255,0.72)", color: "#375534" }}>{item}</div>
                ))}
              </div>
              <div className="flex gap-3">
                <input value={message} onChange={(event) => setMessage(event.target.value)} className="flex-1 px-4 py-3 rounded-xl border" style={{ backgroundColor: "rgba(255,255,255,0.8)", borderColor: "rgba(174,195,176,0.4)", color: "#0F2A1D" }} placeholder="Send a project update..." />
                <button onClick={() => { if (message.trim()) setMessages((current) => [...current, message.trim()]); setMessage(""); }} className="px-5 py-3 rounded-full" style={{ backgroundColor: "#375534", color: "#FFFFFF" }}>Send</button>
              </div>
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel icon={<ShieldCheck size={20} />} title="Trust and Verification">
              {["Verified business profile", "Escrow funded milestone", "Signed proposal stored", "Dispute-safe audit trail"].map((item) => (
                <div key={item} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "rgba(174,195,176,0.2)", color: "#375534" }}>
                  <Check size={17} style={{ color: "#6B9071" }} />
                  <span>{item}</span>
                </div>
              ))}
            </Panel>

            <Panel icon={<BarChart3 size={20} />} title="Agency Sales Analytics">
              <Analytic label="Proposal open rate" value="82%" />
              <Analytic label="Shortlist rate" value="38%" />
              <Analytic label="Win rate" value="21%" />
              <Analytic label="Avg proposal score" value="91%" />
              <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: "rgba(227,238,212,0.45)", color: "#375534" }}>
                Improvement tip: add clearer risk controls and measurable outcomes to increase win probability.
              </div>
            </Panel>

            <Panel icon={<Check size={20} />} title="Outcome-Based Reputation">
              <Analytic label="On-time delivery" value="96%" />
              <Analytic label="Client satisfaction" value="4.8/5" />
              <Analytic label="Repeat business" value="71%" />
              <Analytic label="Dispute rate" value="2%" />
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
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-[20px] backdrop-blur-[20px]" style={{ backgroundColor: "rgba(255,255,255,0.65)", border: "1px solid rgba(174,195,176,0.35)", boxShadow: "0 4px 24px rgba(15,42,29,0.06)" }}>
      <div className="flex items-center gap-2 mb-5" style={{ color: "#375534" }}>
        {icon}
        <h2 className="text-xl font-semibold" style={{ color: "#0F2A1D" }}>{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function Analytic({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "rgba(174,195,176,0.2)" }}>
      <span style={{ color: "#6B9071" }}>{label}</span>
      <span className="font-semibold" style={{ color: "#0F2A1D" }}>{value}</span>
    </div>
  );
}
