import { useState } from 'react';
import { api } from '../api.js';

const STATUSES = ['saved', 'drafting', 'applied', 'interviewing', 'rejected', 'offer'];

export default function Tracker({ applications, onChange }) {
  const [expandedId, setExpandedId] = useState(null);

  async function updateStatus(id, status) {
    await api.updateApplication(id, { status });
    onChange();
  }

  async function updateDraft(id, draft) {
    await api.updateApplication(id, { draft });
  }

  async function remove(id) {
    await api.deleteApplication(id);
    onChange();
  }

  if (!applications.length) {
    return <div className="empty">Nothing saved yet — save a job from the Jobs tab to start tracking it here.</div>;
  }

  return (
    <div className="job-grid">
      {applications.map((app) => (
        <div key={app.id} className="card">
          <div className="job-card">
            <div style={{ flex: 1 }}>
              <div className="job-title">{app.job.title}</div>
              <div className="job-meta">{app.job.company} · {app.job.location}</div>
            </div>
            <select
              className="status-select"
              value={app.status}
              onChange={(e) => updateStatus(app.id, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button className="ghost" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
              {expandedId === app.id ? 'Hide draft' : 'Show draft'}
            </button>
            <a href={app.job.applyUrl} target="_blank" rel="noreferrer">
              <button className="ghost">Open posting to apply</button>
            </a>
            <button className="ghost" onClick={() => remove(app.id)}>Remove</button>
          </div>

          {expandedId === app.id && (
            <textarea
              style={{ marginTop: 12 }}
              defaultValue={app.draft}
              onBlur={(e) => updateDraft(app.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
