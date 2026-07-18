import { Router } from 'express';
import { getDb, saveDb } from '../services/store.js';

const router = Router();

// POST /api/resume  body: { text: string }
router.post('/', async (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== 'string' || text.trim().length < 20) {
    return res.status(400).json({ error: 'Provide resume text of at least 20 characters.' });
  }

  const db = await getDb();
  db.data.resume = { text, updatedAt: new Date().toISOString() };
  await saveDb();

  res.json({ ok: true });
});

// GET /api/resume
router.get('/', async (req, res) => {
  const db = await getDb();
  res.json(db.data.resume || null);
});

export default router;
