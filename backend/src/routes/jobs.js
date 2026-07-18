import { Router } from 'express';
import { fetchGreenhouseJobs } from '../services/sources/greenhouse.js';
import { fetchLeverJobs } from '../services/sources/lever.js';
import { fetchAdzunaJobs } from '../services/sources/adzuna.js';
import { fetchAshbyJobs } from '../services/sources/ashby.js';
import { fetchWorkableJobs } from '../services/sources/workable.js';
import { fetchRecruiteeJobs } from '../services/sources/recruitee.js';
import { rankJobs } from '../services/matcher.js';
import { getDb, saveDb } from '../services/store.js';

const router = Router();

/**
 * POST /api/jobs/sync
 * body: { greenhouseBoards: string[], leverCompanies: string[], adzunaQuery?: string }
 * Pulls fresh postings from configured public sources and caches them.
 */
router.post('/sync', async (req, res) => {
  const {
    greenhouseBoards = [],
    leverCompanies = [],
    ashbyCompanies = [],
    workableAccounts = [],
    recruiteeCompanies = [],
    adzunaQuery
  } = req.body || {};

  try {
    const results = await Promise.allSettled([
      ...greenhouseBoards.map((board) => fetchGreenhouseJobs(board)),
      ...leverCompanies.map((company) => fetchLeverJobs(company)),
      ...ashbyCompanies.map((company) => fetchAshbyJobs(company)),
      ...workableAccounts.map((account) => fetchWorkableJobs(account)),
      ...recruiteeCompanies.map((company) => fetchRecruiteeJobs(company)),
      adzunaQuery ? fetchAdzunaJobs({ query: adzunaQuery }) : Promise.resolve([])
    ]);

    const jobs = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    const errors = results
      .filter((r) => r.status === 'rejected')
      .map((r) => r.reason?.message || 'Unknown source error');

    const db = await getDb();
    db.data.jobs = jobs;
    await saveDb();

    res.json({ count: jobs.length, errors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/jobs
 * Returns cached jobs, ranked against the stored resume if one exists.
 */
router.get('/', async (req, res) => {
  const db = await getDb();
  const jobs = db.data.jobs || [];
  const resumeText = db.data.resume?.text;

  const ranked = resumeText ? rankJobs(resumeText, jobs) : jobs.map((j) => ({ ...j, matchScore: null, matchedSkills: [] }));
  res.json(ranked);
});

export default router;
