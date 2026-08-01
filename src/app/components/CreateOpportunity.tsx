import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Upload } from 'lucide-react';
import { Sidebar } from './Sidebar';

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    industry: '',
    service: '',
    budgetMin: '',
    budgetMax: '',
    currency: 'USD',
    timeline: '3 months',
    brief: '',
  });

  const [charCount, setCharCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('propel_latest_opportunity', JSON.stringify({ ...formData, attachmentName, status: 'published' }));
    navigate('/entrepreneur/dashboard');
  };

  const saveDraft = () => {
    localStorage.setItem('propel_opportunity_draft', JSON.stringify({ ...formData, attachmentName, status: 'draft' }));
    navigate('/entrepreneur/dashboard');
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Background blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-[60px]"
          style={{
            background: 'radial-gradient(circle, rgba(174,195,176,1) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[50px]"
          style={{
            background: 'radial-gradient(circle, rgba(107,144,113,1) 0%, transparent 60%)',
          }}
        />
      </div>

      <Sidebar userType="entrepreneur" />

      <div className="flex-1 ml-60 relative z-10 p-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
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
            <h1
              className="text-3xl mb-8"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                color: '#0F2A1D',
              }}
            >
              Post an Opportunity
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border text-lg"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(174,195,176,0.4)',
                    color: '#0F2A1D',
                  }}
                  placeholder="e.g., Social Media Campaign for Product Launch"
                />
              </div>

              <div className="h-px" style={{ backgroundColor: 'rgba(174,195,176,0.2)' }} />

              {/* Company and Industry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderColor: 'rgba(174,195,176,0.4)',
                    }}
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderColor: 'rgba(174,195,176,0.4)',
                    }}
                  >
                    <option value="">Select industry</option>
                    <option value="tech">Technology</option>
                    <option value="retail">Retail</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>

              {/* Service Needed */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                  Service Needed
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(174,195,176,0.4)',
                  }}
                >
                  <option value="">Select service</option>
                  <option value="social-media">Social Media</option>
                  <option value="web-design">Web Design</option>
                  <option value="branding">Branding</option>
                  <option value="content">Content</option>
                  <option value="development">Development</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="h-px" style={{ backgroundColor: 'rgba(174,195,176,0.2)' }} />

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#375534' }}>
                  Budget Range
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    required
                    placeholder="Min"
                    className="flex-1 px-4 py-3 rounded-xl border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderColor: 'rgba(174,195,176,0.4)',
                    }}
                  />
                  <span style={{ color: '#6B9071' }}>to</span>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    required
                    placeholder="Max"
                    className="flex-1 px-4 py-3 rounded-xl border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderColor: 'rgba(174,195,176,0.4)',
                    }}
                  />
                  <div className="flex rounded-full p-1" style={{ backgroundColor: 'rgba(174,195,176,0.2)' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, currency: 'PKR' })}
                      className="px-3 py-1 text-sm rounded-full transition-all"
                      style={{
                        backgroundColor: formData.currency === 'PKR' ? '#375534' : 'transparent',
                        color: formData.currency === 'PKR' ? '#FFFFFF' : '#6B9071',
                      }}
                    >
                      PKR
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, currency: 'USD' })}
                      className="px-3 py-1 text-sm rounded-full transition-all"
                      style={{
                        backgroundColor: formData.currency === 'USD' ? '#375534' : 'transparent',
                        color: formData.currency === 'USD' ? '#FFFFFF' : '#6B9071',
                      }}
                    >
                      USD
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#375534' }}>
                  Timeline
                </label>
                <div className="flex flex-wrap gap-2">
                  {['1 month', '3 months', '6 months', 'Custom'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: option })}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-104"
                      style={{
                        backgroundColor: formData.timeline === option ? '#375534' : 'rgba(255,255,255,0.6)',
                        color: formData.timeline === option ? '#FFFFFF' : '#375534',
                        border: '1px solid rgba(174,195,176,0.4)',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px" style={{ backgroundColor: 'rgba(174,195,176,0.2)' }} />

              {/* Detailed Brief */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium" style={{ color: '#375534' }}>
                    Detailed Brief
                  </label>
                  <span className="text-xs" style={{ color: '#6B9071' }}>
                    {charCount} characters
                  </span>
                </div>
                <textarea
                  value={formData.brief}
                  onChange={(e) => {
                    setFormData({ ...formData, brief: e.target.value });
                    setCharCount(e.target.value.length);
                  }}
                  required
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border resize-none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(174,195,176,0.4)',
                  }}
                  placeholder="Describe your project, goals, target audience, and any specific requirements..."
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
                  Attachments
                </label>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click();
                  }}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-opacity-60"
                  style={{ borderColor: 'rgba(174,195,176,0.4)' }}
                >
                  <Upload size={32} className="mx-auto mb-2" style={{ color: '#6B9071' }} />
                  <p className="text-sm" style={{ color: '#6B9071' }}>
                    {attachmentName || 'Drag and drop files here or click to browse'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(event) => setAttachmentName(event.target.files?.[0]?.name || '')}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="px-6 py-3 rounded-full font-medium border transition-all hover:scale-102"
                  style={{ borderColor: '#375534', color: '#375534' }}
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full font-medium transition-all hover:scale-102"
                  style={{ backgroundColor: '#375534', color: '#FFFFFF' }}
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
