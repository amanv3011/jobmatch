import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { getDb, saveDb } from '../services/store.js';
import { generateDraft } from '../services/draftGenerator.js';

const router = Router();

const STATUSES = ['saved', 'drafting', 'applied', 'interviewing', 'rejected', 'offer'];

// GET /api/applications
router.get('/', async (req, res) => {
  const db = await getDb();
  res.json(db.data.applications || []);
});

// POST /api/applications  body: { job: {...}, matchScore }
// Saves a job to the tracker in "saved" status and generates a starter draft.
router.post('/', async (req, res) => {
  const { job } = req.body || {};
  if (!job || !job.title || !job.company) {
    return res.status(400).json({ error: 'A job object with at least title and company is required.' });
  }

  const db = await getDb();
  const resumeText = db.data.resume?.text || '';
  const draft = generateDraft({ resumeText, job });

  const entry = {
    id: uuid(),
    job,
    status: 'saved',
    matchScore: job.matchScore ?? null,
    draft,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.data.applications = db.data.applications || [];
  db.data.applications.push(entry);
  await saveDb();

  res.status(201).json(entry);
});

// PATCH /api/applications/:id  body: { status?, notes?, draft? }
router.patch('/:id', async (req, res) => {
  const { status, notes, draft } = req.body || {};
  if (status && !STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
  }

  const db = await getDb();
  const entry = (db.data.applications || []).find((a) => a.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'Application not found.' });

  if (status !== undefined) entry.status = status;
  if (notes !== undefined) entry.notes = notes;
  if (draft !== undefined) entry.draft = draft;
  entry.updatedAt = new Date().toISOString();

  await saveDb();
  res.json(entry);
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
  const db = await getDb();
  const before = (db.data.applications || []).length;
  db.data.applications = (db.data.applications || []).filter((a) => a.id !== req.params.id);
  await saveDb();

  if (db.data.applications.length === before) {
    return res.status(404).json({ error: 'Application not found.' });
  }
  res.status(204).end();
});

export default router;
