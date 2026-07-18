import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function ResumeUpload({ onSaved }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    api.getResume().then((r) => {
      if (r?.text) {
        setText(r.text);
        setSavedAt(r.updatedAt);
      }
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await api.saveResume(text);
      setSavedAt(new Date().toISOString());
      onSaved?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2>Your resume</h2>
      <p className="hint">Paste your resume as plain text. This is what jobs get matched against.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your resume text here..."
      />
      <button className="primary" onClick={handleSave} disabled={saving || text.trim().length < 20}>
        {saving ? 'Saving...' : 'Save resume'}
      </button>
      {savedAt && <p className="hint" style={{ marginTop: 10 }}>Last saved {new Date(savedAt).toLocaleString()}</p>}
    </div>
  );
}
