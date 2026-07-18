import { useState } from 'react';
import { api } from '../api.js';

export default function SyncPanel({ onSynced }) {
  const [boards, setBoards] = useState('');
  const [companies, setCompanies] = useState('');
  const [ashbyCompanies, setAshbyCompanies] = useState('');
  const [workableAccounts, setWorkableAccounts] = useState('');
  const [recruiteeCompanies, setRecruiteeCompanies] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const split = (s) => s.split(',').map((v) => v.trim()).filter(Boolean);

  async function handleSync() {
    setLoading(true);
    setError(null);
    try {
      const result = await api.syncJobs({
        greenhouseBoards: split(boards),
        leverCompanies: split(companies),
        ashbyCompanies: split(ashbyCompanies),
        workableAccounts: split(workableAccounts),
        recruiteeCompanies: split(recruiteeCompanies),
        adzunaQuery: query.trim() || undefined
      });
      if (result.errors?.length) setError(result.errors.join('; '));
      onSynced?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Pull in job postings</h2>
      <p className="hint">
        Enter company slugs from their public Greenhouse or Lever job boards (e.g. the "stripe" in
        boards.greenhouse.io/stripe), plus an optional Adzuna keyword search.
      </p>

      <label>Greenhouse board tokens (comma-separated)</label>
      <input type="text" value={boards} onChange={(e) => setBoards(e.target.value)} placeholder="stripe, airbnb" />

      <label>Lever company slugs (comma-separated)</label>
      <input type="text" value={companies} onChange={(e) => setCompanies(e.target.value)} placeholder="netflix" />

      <label>Ashby company slugs (comma-separated) — from jobs.ashbyhq.com/&lt;slug&gt;</label>
      <input type="text" value={ashbyCompanies} onChange={(e) => setAshbyCompanies(e.target.value)} placeholder="ramp, linear" />

      <label>Workable account slugs (comma-separated) — from apply.workable.com/&lt;slug&gt;</label>
      <input type="text" value={workableAccounts} onChange={(e) => setWorkableAccounts(e.target.value)} placeholder="huggingface" />

      <label>Recruitee company slugs (comma-separated) — from &lt;slug&gt;.recruitee.com</label>
      <input type="text" value={recruiteeCompanies} onChange={(e) => setRecruiteeCompanies(e.target.value)} placeholder="acme" />

      <label>Adzuna keyword search (optional, needs API keys configured)</label>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="full stack engineer" />

      <button className="primary" onClick={handleSync} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch jobs'}
      </button>

      {error && <div className="error-banner" style={{ marginTop: 12 }}>{error}</div>}
    </div>
  );
}
