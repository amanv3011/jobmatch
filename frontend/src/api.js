const BASE = '/api';

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  saveResume: (text) =>
    fetch(`${BASE}/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    }).then(handle),

  getResume: () => fetch(`${BASE}/resume`).then(handle),

  syncJobs: (payload) =>
    fetch(`${BASE}/jobs/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(handle),

  getJobs: () => fetch(`${BASE}/jobs`).then(handle),

  getApplications: () => fetch(`${BASE}/applications`).then(handle),

  saveApplication: (job) =>
    fetch(`${BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job })
    }).then(handle),

  updateApplication: (id, patch) =>
    fetch(`${BASE}/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    }).then(handle),

  deleteApplication: (id) =>
    fetch(`${BASE}/applications/${id}`, { method: 'DELETE' }).then(handle)
};
