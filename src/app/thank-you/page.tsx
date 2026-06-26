"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';

  return (
    <div className="animate-slide-up" style={{ maxWidth: '580px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
      <div className="panel" style={{ padding: '50px 30px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--color-primary-glow)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontSize: '32px' }}>
          ✦
        </div>
        
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
            Thank You{name ? `, ${name}` : ''}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
            You have successfully verified your inquiry and visited our portal. We have recorded your visit details in our tracking system.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}>
            <span style={{ color: 'var(--text-muted)' }}>Status:</span>
            <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>✓ Link Click Tracked</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}>
            <span style={{ color: 'var(--text-muted)' }}>Action:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Redirected from Email Link</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-secondary" style={{ flex: 1 }}>
            Capture Form
          </Link>
          <Link href="/dashboard" className="btn btn-primary" style={{ flex: 1 }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYou() {
  return (
    <main className="container page-main">
      <Suspense fallback={
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <span className="spinner" style={{ marginBottom: '12px' }}></span>
          <p>Loading validation details...</p>
        </div>
      }>
        <ThankYouContent />
      </Suspense>
    </main>
  );
}
