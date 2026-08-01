import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, CreditCard, Download, Upload, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import logoImg from "../../assets/brand/propel-logo-transparent.png";

interface SettingsProps {
  userType: "entrepreneur" | "agency" | null;
}

const glassInput = {
  backgroundColor: "rgba(255,255,255,0.8)",
  borderColor: "rgba(174,195,176,0.4)",
  color: "#0F2A1D",
};

const dividerStyle = { borderColor: "rgba(174,195,176,0.2)" };

const services = [
  "Social Media Management",
  "Web Design",
  "Branding",
  "Content Creation",
  "Software Development",
  "SEO",
  "Video Production",
  "Photography",
  "PR",
  "Copywriting",
  "Consulting",
  "Other",
];

const notificationRows = [
  ["New proposal received", "Get notified when an agency sends you a proposal"],
  ["Proposal opened", "Know when your proposal has been read"],
  ["Opportunity match", "Get matched with relevant new opportunities"],
  ["Weekly digest", "Summary of your activity every Monday"],
  ["Marketing updates", "Product news and feature announcements"],
] as const;

export default function Settings({ userType }: SettingsProps) {
  const effectiveUserType = userType || "agency";
  const [activeSection, setActiveSection] = useState("profile");
  const [selectedServices, setSelectedServices] = useState(["Web Design", "Branding"]);
  const [portfolioLinks, setPortfolioLinks] = useState(["https://yourportfolio.com"]);
  const [teamSize, setTeamSize] = useState("6-15");
  const [currency, setCurrency] = useState("USD");
  const [brandColor, setBrandColor] = useState("#375534");
  const [customHex, setCustomHex] = useState("#375534");
  const [watermark, setWatermark] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [notice, setNotice] = useState("");
  const [plan, setPlan] = useState("Free Plan");
  const [sessions, setSessions] = useState([
    ["Edge on Windows", "Lahore, Pakistan", "Active now"],
    ["Chrome on Android", "Karachi, Pakistan", "2 days ago"],
  ]);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    "New proposal received": true,
    "Proposal opened": true,
    "Opportunity match": true,
    "Weekly digest": false,
    "Marketing updates": false,
  });

  const [formData, setFormData] = useState({
    companyName: "Your Company",
    tagline: "Building great products",
    industry: "technology",
    city: "San Francisco, CA",
    website: "https://yourcompany.com",
    description: "",
    email: "you@company.com",
    phone: "+1 (555) 123-4567",
  });

  const sections = [
    { id: "profile", label: "Profile" },
    ...(effectiveUserType === "agency" ? [{ id: "services", label: "Services" }] : []),
    { id: "branding", label: "Branding" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "billing", label: "Billing" },
  ];

  const toggleService = (service: string) => {
    setSelectedServices((current) =>
      current.includes(service) ? current.filter((item) => item !== service) : [...current, service],
    );
  };

  const showNotice = (message: string) => setNotice(message);

  return (
    <div className="flex min-h-screen relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-[60px]" style={{ background: "radial-gradient(circle, rgba(174,195,176,1) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[50px]" style={{ background: "radial-gradient(circle, rgba(107,144,113,1) 0%, transparent 60%)" }} />
      </div>

      <Sidebar userType={effectiveUserType} />

      <div className="flex-1 ml-60 relative z-10 p-8">
        <div className="mb-8">
          <img src={logoImg} alt="Propel - Global B2B Marketplace logo" className="h-[44px] w-auto mb-5" />
          <h1 className="text-3xl" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", color: "#0F2A1D" }}>
            Settings
          </h1>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-[20px] backdrop-blur-[20px]" style={{ backgroundColor: "rgba(255,255,255,0.65)", border: "1px solid rgba(174,195,176,0.35)" }}>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: activeSection === section.id ? "rgba(55,85,52,0.08)" : "transparent",
                      color: activeSection === section.id ? "#0F2A1D" : "#6B9071",
                    }}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>

          <div className="col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 rounded-[20px] backdrop-blur-[20px]"
              style={{ backgroundColor: "rgba(255,255,255,0.65)", border: "1px solid rgba(174,195,176,0.35)", boxShadow: "0 4px 24px rgba(15,42,29,0.06)" }}
            >
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <SectionTitle title="Profile Information" />
                  <div>
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed" style={{ borderColor: "rgba(174,195,176,0.4)", backgroundColor: "rgba(174,195,176,0.1)" }}>
                        <Upload size={24} style={{ color: "#6B9071" }} />
                      </div>
                      <button
                        type="button"
                        onClick={() => showNotice("Logo upload is ready for file selection in the next backend pass.")}
                        className="px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-102"
                        style={{ borderColor: "#375534", color: "#375534" }}
                      >
                        Upload New
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <TextField label="Company Name" value={formData.companyName} onChange={(value) => setFormData({ ...formData, companyName: value })} />
                    <TextField label="Tagline" value={formData.tagline} onChange={(value) => setFormData({ ...formData, tagline: value })} />
                    <TextField label="City" value={formData.city} onChange={(value) => setFormData({ ...formData, city: value })} />
                    <TextField label="Website" value={formData.website} onChange={(value) => setFormData({ ...formData, website: value })} />
                    <TextField label="Contact Email" value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} />
                    <TextField label="Phone" value={formData.phone} onChange={(value) => setFormData({ ...formData, phone: value })} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} rows={5} className="w-full px-4 py-3 rounded-xl border resize-none" style={glassInput} placeholder="Tell us about your company..." />
                  </div>
                </div>
              )}

              {activeSection === "services" && effectiveUserType === "agency" && (
                <div className="space-y-6">
                  <SectionTitle title="Services Offered" />
                  <div>
                    <Label>Select Services</Label>
                    <div className="flex flex-wrap gap-3">
                      {services.map((service) => {
                        const selected = selectedServices.includes(service);
                        return (
                          <button key={service} type="button" onClick={() => toggleService(service)} className="transition-all hover:scale-104" style={{ backgroundColor: selected ? "#375534" : "rgba(255,255,255,0.65)", border: `1px solid ${selected ? "#375534" : "rgba(174,195,176,0.35)"}`, borderRadius: "100px", padding: "8px 16px", fontFamily: "Inter, sans-serif", fontSize: "14px", color: selected ? "#E3EED4" : "#375534" }}>
                            {service}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Divider />
                  <div>
                    <SectionTitle title="Portfolio Links" small />
                    <div className="space-y-3">
                      {portfolioLinks.map((link, index) => (
                        <div key={index} className="flex gap-3">
                          <input value={link} onChange={(event) => setPortfolioLinks((current) => current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))} className="flex-1 px-4 py-3 rounded-xl border" style={glassInput} placeholder="https://project-link.com" />
                          <button type="button" onClick={() => setPortfolioLinks((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="w-11 h-11 rounded-full flex items-center justify-center border" style={{ borderColor: "rgba(174,195,176,0.35)", color: "#375534" }}>
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setPortfolioLinks((current) => [...current, ""])} className="px-5 py-2 rounded-full font-medium" style={{ backgroundColor: "#375534", color: "#E3EED4" }}>
                        + Add Link
                      </button>
                    </div>
                  </div>

                  <Divider />
                  <div>
                    <Label>Team Size</Label>
                    <Pills options={["1-5", "6-15", "16-50", "50+"]} value={teamSize} onChange={setTeamSize} />
                  </div>
                </div>
              )}

              {activeSection === "branding" && (
                <div className="space-y-6">
                  <SectionTitle title="Branding Settings" />
                  <div>
                    <Label>Default Currency</Label>
                    <Pills options={["USD", "PKR", "AED", "GBP", "SAR"]} value={currency} onChange={setCurrency} />
                  </div>
                  <Divider />
                  <div>
                    <Label>Brand Color</Label>
                    <div className="flex gap-3 mb-4">
                      {["#375534", "#6B9071", "#AEC3B0", "#0F2A1D", "#E3EED4", "#375534"].map((color, index) => (
                        <button key={`${color}-${index}`} type="button" onClick={() => setBrandColor(color)} className="w-8 h-8 rounded-full" style={{ backgroundColor: color, boxShadow: brandColor === color ? "0 0 0 3px #FFFFFF, 0 0 0 5px #375534" : "0 0 0 1px rgba(174,195,176,0.35)" }} />
                      ))}
                    </div>
                    <input value={customHex} onChange={(event) => setCustomHex(event.target.value)} className="w-full px-4 py-3 rounded-xl border" style={glassInput} placeholder="#375534" />
                  </div>
                  <Divider />
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-semibold" style={{ color: "#0F2A1D" }}>Proposal watermark</h3>
                      {!watermark && <p className="text-xs italic mt-1" style={{ color: "#AEC3B0" }}>Propel branding will appear on proposals</p>}
                    </div>
                    <Switch checked={watermark} onChange={() => setWatermark((value) => !value)} />
                  </div>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <SectionTitle title="Notifications" />
                  <div className="space-y-4">
                    {notificationRows.map(([label, description]) => (
                      <ToggleRow key={label} label={label} description={description} checked={notifications[label]} onChange={() => setNotifications((current) => ({ ...current, [label]: !current[label] }))} />
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "security" && (
                <div className="space-y-6">
                  <SectionTitle title="Security" />
                  <div className="grid grid-cols-1 gap-4">
                    <PasswordField label="Current Password" />
                    <PasswordField label="New Password" />
                    <PasswordField label="Confirm New Password" />
                    <button onClick={() => showNotice("Password update saved for this demo session.")} className="w-fit px-6 py-3 rounded-full font-medium" style={{ backgroundColor: "#375534", color: "#FFFFFF" }}>
                      Update Password
                    </button>
                  </div>
                  <Divider />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold" style={{ color: "#0F2A1D" }}>Two-factor authentication</h3>
                      <p className="text-xs mt-1" style={{ color: "#AEC3B0" }}>Add an extra layer of protection to your account</p>
                    </div>
                    <Switch
                      checked={twoFactor}
                      onChange={() => {
                        setTwoFactor((value) => !value);
                        showNotice(twoFactor ? "Two-factor authentication disabled." : "Two-factor authentication enabled.");
                      }}
                    />
                  </div>
                  <Divider />
                  <div>
                    <SectionTitle title="Active Sessions" small />
                    {sessions.map(([device, location, active]) => (
                      <div key={device} className="flex items-center justify-between py-4 border-b" style={dividerStyle}>
                        <div>
                          <div className="font-medium" style={{ color: "#0F2A1D" }}>{device}</div>
                          <div className="text-xs" style={{ color: "#AEC3B0" }}>{location} | {active}</div>
                        </div>
                        <button
                          onClick={() => {
                            setSessions((current) => current.filter(([sessionDevice]) => sessionDevice !== device));
                            showNotice(`${device} revoked.`);
                          }}
                          className="px-4 py-2 rounded-full text-sm transition-colors hover:bg-[rgba(200,80,80,0.7)]"
                          style={{ color: "#b94b4b" }}
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setSessions([]);
                        showNotice("All devices signed out.");
                      }}
                      className="mt-5 px-5 py-2.5 rounded-full border"
                      style={{ borderColor: "rgba(200,80,80,0.7)", color: "#b94b4b" }}
                    >
                      Sign out all devices
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "billing" && (
                <div className="space-y-6">
                  <SectionTitle title="Billing" />
                  <div className="p-6 rounded-[20px]" style={{ backgroundColor: "rgba(255,255,255,0.65)", border: "1px solid rgba(174,195,176,0.35)" }}>
                    <div className="flex items-center justify-between mb-5">
                      <span className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: "#375534", color: "#FFFFFF" }}>{plan}</span>
                      <button
                        onClick={() => {
                          setPlan("Pro Plan");
                          showNotice("Plan upgraded to Pro for this demo session.");
                        }}
                        className="px-5 py-2 rounded-full font-medium"
                        style={{ backgroundColor: "#375534", color: "#FFFFFF" }}
                      >
                        Upgrade Plan
                      </button>
                    </div>
                    {["5 AI proposals per month", "Basic opportunity browsing", "Standard proposal templates"].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 mb-2" style={{ color: "#375534" }}>
                        <Check size={16} style={{ color: "#6B9071" }} />
                        <span>{feature}</span>
                      </div>
                    ))}
                    <div className="mt-5 text-sm" style={{ color: "#6B9071" }}>Next billing date: July 1, 2026 | Amount: PKR 0</div>
                  </div>
                  <Divider />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard size={22} style={{ color: "#375534" }} />
                      <div>
                        <div className="font-medium" style={{ color: "#0F2A1D" }}>Visa ending in 4242</div>
                        <div className="text-xs" style={{ color: "#AEC3B0" }}>Expires 08/28</div>
                      </div>
                    </div>
                    <button onClick={() => showNotice("Payment method update flow opened for this demo session.")} className="text-sm font-medium" style={{ color: "#375534" }}>Update</button>
                  </div>
                  <Divider />
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ color: "#6B9071" }}>
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Amount</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-right py-3">PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["June 1, 2026", "May 1, 2026"].map((date) => (
                        <tr key={date} className="border-t" style={dividerStyle}>
                          <td className="py-4" style={{ color: "#0F2A1D" }}>{date}</td>
                          <td className="py-4" style={{ color: "#375534" }}>PKR 0</td>
                          <td className="py-4"><span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: "#E3EED4", color: "#375534" }}>Paid</span></td>
                          <td className="py-4 text-right">
                            <button onClick={() => showNotice(`Invoice from ${date} downloaded.`)} title="Download invoice PDF">
                              <Download size={17} className="inline" style={{ color: "#6B9071" }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t mt-8" style={dividerStyle}>
                {notice && (
                  <p className="mr-4 text-sm self-center" style={{ color: "#6B9071" }}>
                    {notice}
                  </p>
                )}
                <button onClick={() => showNotice("Settings saved.")} className="px-8 py-3 rounded-full font-medium transition-all hover:scale-102" style={{ backgroundColor: "#375534", color: "#FFFFFF" }}>
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, small = false }: { title: string; small?: boolean }) {
  return <h2 className={small ? "text-lg font-semibold mb-4" : "text-2xl font-semibold mb-6"} style={{ color: "#0F2A1D" }}>{title}</h2>;
}

function Label({ children }: { children: ReactNode }) {
  return <label className="block text-sm font-medium mb-3" style={{ color: "#375534" }}>{children}</label>;
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full px-4 py-3 rounded-xl border" style={glassInput} />
    </div>
  );
}

function PasswordField({ label }: { label: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type="password" className="w-full px-4 py-3 rounded-xl border" style={glassInput} />
    </div>
  );
}

function Pills({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button key={option} type="button" onClick={() => onChange(option)} className="px-4 py-2 rounded-full text-sm font-medium transition-all" style={{ backgroundColor: selected ? "#375534" : "rgba(255,255,255,0.65)", color: selected ? "#FFFFFF" : "#375534", border: `1px solid ${selected ? "#375534" : "rgba(174,195,176,0.35)"}` }}>
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className="relative w-11 h-6 rounded-full transition-colors" style={{ backgroundColor: checked ? "#375534" : "rgba(174,195,176,0.4)" }}>
      <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: checked ? "22px" : "4px" }} />
    </button>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b" style={dividerStyle}>
      <div>
        <div className="font-medium" style={{ color: "#0F2A1D" }}>{label}</div>
        <div className="text-xs mt-1" style={{ color: "#AEC3B0" }}>{description}</div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function Divider() {
  return <div className="border-t" style={dividerStyle} />;
}
