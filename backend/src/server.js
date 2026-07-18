import express from 'express';
import cors from 'cors';
import jobsRouter from './routes/jobs.js';
import resumeRouter from './routes/resume.js';
import applicationsRouter from './routes/applications.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/jobs', jobsRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/applications', applicationsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`jobmatch backend listening on http://localhost:${PORT}`);
});
