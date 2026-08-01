import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Check, Upload } from 'lucide-react';
import logoImg from "../../assets/brand/propel-logo-transparent.png";
import targetIcon from "../../assets/brand/propel-mark-transparent.png";
import { saveCompanyProfile } from '../lib/marketplace';

interface ProfileSetupProps {
  userType: 'entrepreneur' | 'agency' | null;
}

export default function ProfileSetup({ userType }: ProfileSetupProps) {
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState(1);
  const totalSteps = userType === 'agency' ? 4 : 3;

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    city: '',
    website: '',
    description: '',
    services: [] as string[],
    teamSize: '',
    pricingStyle: '',
    logoFileName: '',
  });

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      saveCompanyProfile({
        companyName: formData.companyName || "Propel Studio",
        industry: formData.industry,
        city: formData.city,
        website: formData.website,
        description: formData.description,
        services: formData.services,
        teamSize: formData.teamSize,
        pricingStyle: formData.pricingStyle,
        tagline: formData.description,
        phone: "",
        email: "",
        logo: null,
      });
      navigate(userType === 'entrepreneur' ? '/entrepreneur/dashboard' : '/agency/dashboard');
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div
        className="w-72 p-8 backdrop-blur-[16px] border-r flex flex-col"
        style={{
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(174,195,176,0.2)',
        }}
      >
        <img src={logoImg} alt="Propel - Global B2B Marketplace logo" className="h-10 mb-12" />

        <div className="space-y-6">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < step;
            const isActive = stepNum === step;

            return (
              <div key={stepNum} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: isCompleted || isActive ? '#375534' : 'rgba(174,195,176,0.2)',
                    color: '#FFFFFF',
                  }}
                >
                  {isCompleted ? <Check size={16} /> : stepNum}
                </div>
                <div>
                  <div
                    className="font-medium text-sm"
                    style={{
                      color: isActive ? '#375534' : isCompleted ? '#6B9071' : '#AEC3B0',
                    }}
                  >
                    {stepNum === 1 && 'Company Details'}
                    {stepNum === 2 && 'Profile Information'}
                    {stepNum === 3 && userType === 'agency' ? 'Services Offered' : 'Project Preferences'}
                    {stepNum === 4 && 'Team & Pricing'}
                  </div>
                </div>
                {isActive && (
                  <div
                    className="absolute left-0 w-1 h-8 rounded-r"
                    style={{ backgroundColor: '#375534' }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-8 flex justify-center">
          <img
            src={targetIcon}
            alt="Propel target icon"
            className="w-8 h-8 opacity-70"
            style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(11%) saturate(430%) hue-rotate(83deg) brightness(96%) contrast(90%)' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#AEC3B0' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full"
                style={{ backgroundColor: '#375534' }}
              />
            </div>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-10 rounded-[20px] backdrop-blur-[20px]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(174,195,176,0.35)',
              boxShadow: '0 4px 24px rgba(15,42,29,0.06)',
            }}
          >
            <h2
              className="text-3xl mb-8"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                color: '#0F2A1D',
              }}
            >
              {step === 1 && 'Tell us about your company'}
              {step === 2 && 'Complete your profile'}
              {step === 3 && userType === 'agency' && 'What services do you offer?'}
              {step === 3 && userType === 'entrepreneur' && 'Your project preferences'}
              {step === 4 && 'Team details'}
            </h2>

            <div className="space-y-6">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(174,195,176,0.4)',
                      }}
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                      Logo Upload
                    </label>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => logoInputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') logoInputRef.current?.click();
                      }}
                      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-opacity-60"
                      style={{ borderColor: 'rgba(174,195,176,0.4)' }}
                    >
                      <Upload size={32} className="mx-auto mb-2" style={{ color: '#6B9071' }} />
                      <p className="text-sm" style={{ color: '#6B9071' }}>
                        {formData.logoFileName || 'Click to upload or drag and drop'}
                      </p>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(event) => setFormData({ ...formData, logoFileName: event.target.files?.[0]?.name || '' })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                      Industry
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(174,195,176,0.4)',
                      }}
                    >
                      <option value="">Select industry</option>
                      <option value="tech">Technology</option>
                      <option value="marketing">Marketing</option>
                      <option value="finance">Finance</option>
                      <option value="retail">Retail</option>
                      <option value="healthcare">Healthcare</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(174,195,176,0.4)',
                      }}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(174,195,176,0.4)',
                      }}
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                      Company Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border resize-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(174,195,176,0.4)',
                      }}
                      placeholder="Tell us about your company..."
                    />
                  </div>
                </>
              )}

              {step === 3 && userType === 'agency' && (
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#375534' }}>
                    Services Offered
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Web Design', 'Social Media', 'Branding', 'Development', 'Content', 'SEO'].map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => {
                          const newServices = formData.services.includes(service)
                            ? formData.services.filter((s) => s !== service)
                            : [...formData.services, service];
                          setFormData({ ...formData, services: newServices });
                        }}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-104"
                        style={{
                          backgroundColor: formData.services.includes(service)
                            ? '#375534'
                            : 'rgba(255,255,255,0.6)',
                          color: formData.services.includes(service) ? '#FFFFFF' : '#375534',
                          border: '1px solid rgba(174,195,176,0.4)',
                        }}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && userType === 'agency' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: '#375534' }}>
                      Team Size
                    </label>
                    <div className="flex gap-2">
                      {['1-5', '6-10', '11-25', '26-50', '50+'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData({ ...formData, teamSize: size })}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                          style={{
                            backgroundColor: formData.teamSize === size ? '#375534' : 'rgba(255,255,255,0.6)',
                            color: formData.teamSize === size ? '#FFFFFF' : '#375534',
                            border: '1px solid rgba(174,195,176,0.4)',
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: '#375534' }}>
                      Pricing Style
                    </label>
                    <div className="flex gap-2">
                      {['Hourly', 'Fixed', 'Retainer'].map((pricing) => (
                        <button
                          key={pricing}
                          type="button"
                          onClick={() => setFormData({ ...formData, pricingStyle: pricing })}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                          style={{
                            backgroundColor: formData.pricingStyle === pricing ? '#375534' : 'rgba(255,255,255,0.6)',
                            color: formData.pricingStyle === pricing ? '#FFFFFF' : '#375534',
                            border: '1px solid rgba(174,195,176,0.4)',
                          }}
                        >
                          {pricing}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleContinue}
                className="px-8 py-3 rounded-full font-medium transition-all hover:scale-102"
                style={{ backgroundColor: '#375534', color: '#FFFFFF' }}
              >
                {step === totalSteps ? 'Complete Setup' : 'Continue'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
