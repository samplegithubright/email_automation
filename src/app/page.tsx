"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirement: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [capturedLead, setCapturedLead] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setCapturedLead(data.lead);
        setFormData({ name: '', email: '', phone: '', company: '', requirement: '' });
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page-main">
      <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-category" style={{ marginBottom: '12px' }}>Lead Generation</span>
          <h1 className="hero-heading">
            Request a <span className="text-gradient">Personalized Solution</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
            Submit your requirements below. Our system will immediately process your details and generate a personalized response.
          </p>
        </div>

        {submitted ? (
          <div className="panel" style={{ textAlign: 'center', padding: '40px 30px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-success-glow)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)', fontSize: '30px' }}>
              ✓
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Submission Successful!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Thank you, <strong>{capturedLead?.name}</strong>. A personalized email has been sent to your inbox.
              </p>
            </div>

            {capturedLead?.emailPreviewUrl && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--border-color)', width: '100%', marginTop: '10px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Developer Local Testing
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '15px', lineHeight: '1.4' }}>
                  Since you are running locally without SMTP credentials, an Ethereal mock email was generated. Open it to test email open & link click tracking!
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={capturedLead.emailPreviewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                    ✉ View Mock Email
                  </a>
                  <Link href="/dashboard" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                    📊 Open Dashboard
                  </Link>
                </div>
              </div>
            )}

            {!capturedLead?.emailPreviewUrl && (
              <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Go to Dashboard
              </Link>
            )}

            <button onClick={() => setSubmitted(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }}>
              Submit another requirement
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {error && (
              <div style={{ padding: '12px 16px', background: 'var(--color-danger-glow)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
                ⚠ {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="form-input"
                  placeholder="rahul@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="company" className="form-label">Company Name (Optional)</label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-input"
                placeholder="ABC Pvt Ltd"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirement" className="form-label">Message / Requirement *</label>
              <textarea
                id="requirement"
                name="requirement"
                required
                className="form-textarea"
                placeholder="Describe your requirements (e.g. 'I need a chatbot for my website')"
                value={formData.requirement}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '10px', height: '48px' }}>
              {loading ? (
                <>
                  <span className="spinner" style={{ marginRight: '8px' }}></span>
                  Processing...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
