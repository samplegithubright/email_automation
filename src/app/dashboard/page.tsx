"use client";

import { useEffect, useState } from 'react';

interface Stats {
  totalLeads: number;
  emailsSent: number;
  emailsOpened: number;
  linksClicked: number;
  openRate: number;
  clickRate: number;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  requirement: string;
  createdAt: string;
  aiCategory: string;
  aiPriority: 'Low' | 'Medium' | 'High';
  trackingId: string;
  emailSent: boolean;
  emailSentAt?: string;
  emailOpened: boolean;
  emailOpenedAt?: string;
  linkClicked: boolean;
  linkClickedAt?: string;
  emailPreviewUrl?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    emailsSent: 0,
    emailsOpened: 0,
    linksClicked: 0,
    openRate: 0,
    clickRate: 0,
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All');

  const fetchData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
        setLeads(data.leads);
        setFilteredLeads(data.leads);
        
        if (selectedLead) {
          const updatedSelected = data.leads.find((l: Lead) => l._id === selectedLead._id);
          if (updatedSelected) {
            setSelectedLead(updatedSelected);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/leads?id=${leadId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setLeads(leads.filter(lead => lead._id !== leadId));
        if (selectedLead?._id === leadId) {
          setSelectedLead(null);
        }
        fetchData(true);
      } else {
        alert(data.error || 'Failed to delete lead.');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('An error occurred while attempting to delete the lead.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = leads;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term) ||
          lead.requirement.toLowerCase().includes(term) ||
          lead.aiCategory.toLowerCase().includes(term)
      );
    }

    if (filterPriority !== 'All') {
      result = result.filter((lead) => lead.aiPriority === filterPriority);
    }

    setFilteredLeads(result);
  }, [searchTerm, filterPriority, leads]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <main className="container page-main" style={{ justifyContent: 'flex-start' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="dashboard-heading">
            Analytics <span className="text-gradient">Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Real-time insights on captured leads and email engagement metrics.
          </p>
        </div>

        <button 
          onClick={() => fetchData(true)} 
          disabled={refreshing} 
          className="btn btn-secondary" 
          style={{ display: 'flex', gap: '8px', padding: '10px 18px', fontSize: '14px', alignItems: 'center' }}
        >
          {refreshing ? (
            <>
              <span className="spinner" style={{ width: '14px', height: '14px', borderTopColor: 'var(--text-primary)' }}></span>
              Syncing...
            </>
          ) : (
            '🔄 Sync Data'
          )}
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
          <span className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px' }}></span>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontWeight: '500' }}>Loading analytics panel...</p>
        </div>
      ) : (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="metrics-grid">
            <div className="metric-card info">
              <span className="metric-label">Total Leads Captured</span>
              <span className="metric-value">{stats.totalLeads}</span>
              <span className="metric-meta info">Unique inquiries</span>
            </div>
            
            <div className="metric-card">
              <span className="metric-label">Automated Emails Sent</span>
              <span className="metric-value">{stats.emailsSent}</span>
              <span className="metric-meta success">✓ {stats.emailsSent > 0 ? '100%' : '0%'} Delivery</span>
            </div>

            <div className="metric-card success">
              <span className="metric-label">Emails Opened</span>
              <span className="metric-value">{stats.emailsOpened}</span>
              <span className="metric-meta success">
                📈 {stats.openRate}% Open Rate
              </span>
            </div>

            <div className="metric-card warning">
              <span className="metric-label">Links Clicked</span>
              <span className="metric-value">{stats.linksClicked}</span>
              <span className="metric-meta success">
                🖱 {stats.clickRate}% Click Rate
              </span>
            </div>
          </div>

          <div className={`dashboard-layout ${selectedLead ? 'has-selected' : ''}`}>
            
            <div className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="filter-row">
                <input
                  type="text"
                  placeholder="Search leads by name, email, requirement..."
                  className="form-input"
                  style={{ flex: 1, minWidth: '240px', padding: '10px 14px', fontSize: '14px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <select
                  className="form-input"
                  style={{ padding: '10px 14px', fontSize: '14px', minWidth: '160px', background: 'rgba(13, 19, 33, 0.6)' }}
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {filteredLeads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>No leads matched your criteria.</p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Lead Info</th>
                        <th>Classification</th>
                        <th>Tracking Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr 
                          key={lead._id} 
                          onClick={() => setSelectedLead(lead)}
                          className={selectedLead?._id === lead._id ? 'selected' : ''}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{lead.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lead.email}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <span className="badge badge-category" style={{ fontSize: '10px' }}>{lead.aiCategory}</span>
                              <span className={`badge badge-${lead.aiPriority.toLowerCase()}`} style={{ fontSize: '10px' }}>
                                {lead.aiPriority}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                              <span className="status-indicator">
                                <span className={`dot ${lead.emailOpened ? 'dot-green' : 'dot-gray'}`}></span>
                                Opened
                              </span>
                              <span className="status-indicator">
                                <span className={`dot ${lead.linkClicked ? 'dot-green' : 'dot-gray'}`}></span>
                                Clicked
                              </span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => setSelectedLead(lead)} 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                              >
                                Details
                              </button>
                              {lead.emailPreviewUrl && (
                                <a 
                                  href={lead.emailPreviewUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="btn btn-primary" 
                                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                                >
                                  ✉ Mock
                                </a>
                              )}
                              <button 
                                onClick={() => handleDelete(lead._id)} 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', background: 'rgba(239, 68, 68, 0.05)' }}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selectedLead && (
              <>
                <div className="drawer-backdrop" onClick={() => setSelectedLead(null)}></div>
                <div className="panel lead-detail-panel animate-slide-up" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '3px solid var(--color-primary)' }}>
                  <div className="drawer-handle" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Lead Profile</h3>
                  <button 
                    onClick={() => setSelectedLead(null)} 
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{selectedLead.name}</h4>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                    <div>📧 {selectedLead.email}</div>
                    <div>📞 {selectedLead.phone}</div>
                    {selectedLead.company && <div>🏢 {selectedLead.company}</div>}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h5 style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Requirement Message
                  </h5>
                  <p style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '8px', fontSize: '14px', fontStyle: 'italic', border: '1px solid var(--border-color)', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    "{selectedLead.requirement}"
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h5 style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    AI Analysis Result
                  </h5>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{selectedLead.aiCategory}</div>
                    </div>
                    <div style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Priority</div>
                      <div style={{ marginTop: '4px' }}>
                        <span className={`badge badge-${selectedLead.aiPriority.toLowerCase()}`} style={{ fontSize: '11px', padding: '2px 8px' }}>
                          {selectedLead.aiPriority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h5 style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tracking Timeline
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Submitted:</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{formatDate(selectedLead.createdAt)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Email Sent:</span>
                      <span style={{ fontWeight: '600', color: selectedLead.emailSent ? 'var(--color-success)' : 'var(--text-muted)' }}>
                        {selectedLead.emailSent ? formatDate(selectedLead.emailSentAt) : 'No'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Email Opened:</span>
                      <span style={{ fontWeight: '600', color: selectedLead.emailOpened ? 'var(--color-success)' : 'var(--text-muted)' }}>
                        {selectedLead.emailOpened ? formatDate(selectedLead.emailOpenedAt) : 'No'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Link Clicked:</span>
                      <span style={{ fontWeight: '600', color: selectedLead.linkClicked ? 'var(--color-success)' : 'var(--text-muted)' }}>
                        {selectedLead.linkClicked ? formatDate(selectedLead.linkClickedAt) : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedLead.emailPreviewUrl && (
                  <a 
                    href={selectedLead.emailPreviewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '10px', fontSize: '13px' }}
                  >
                    ✉ Open Mock Email Preview
                  </a>
                )}
                <button 
                  onClick={() => handleDelete(selectedLead._id)} 
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '10px', fontSize: '13px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', background: 'rgba(239, 68, 68, 0.05)' }}
                >
                  🗑 Delete Lead Profile
                </button>
              </div>
            </>)}
          </div>
        </div>
      )}
    </main>
  );
}
