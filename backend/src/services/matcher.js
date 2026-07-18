const STOPWORDS = new Set([
  'the', 'and', 'a', 'an', 'to', 'of', 'in', 'for', 'on', 'with', 'is', 'are',
  'as', 'at', 'by', 'be', 'this', 'that', 'or', 'we', 'you', 'our', 'will',
  'from', 'have', 'has', 'their', 'it', 'your', 'us', 'job', 'work', 'role'
]);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * Very small, transparent scorer: keyword overlap between the resume text
 * and a job description/title, weighted so title matches count more.
 * Returns { score: 0-100, matchedSkills: string[] }.
 * This is intentionally simple and explainable rather than a black box —
 * swap in a smarter model later without changing the API shape.
 */
export function scoreJob(resumeText, job) {
  const resumeTokens = new Set(tokenize(resumeText));
  const titleTokens = new Set(tokenize(job.title));
  const descTokens = new Set(tokenize(job.description));

  const titleOverlap = [...titleTokens].filter((t) => resumeTokens.has(t));
  const descOverlap = [...descTokens].filter((t) => resumeTokens.has(t));

  const titleScore = titleTokens.size ? titleOverlap.length / titleTokens.size : 0;
  const descScore = descTokens.size ? descOverlap.length / descTokens.size : 0;

  const rawScore = titleScore * 0.6 + descScore * 0.4;
  const score = Math.round(Math.min(rawScore * 100 * 1.8, 100)); // scaled up, capped at 100

  const matchedSkills = [...new Set([...titleOverlap, ...descOverlap])].slice(0, 12);

  return { score, matchedSkills };
}

export function rankJobs(resumeText, jobs) {
  return jobs
    .map((job) => {
      const { score, matchedSkills } = scoreJob(resumeText, job);
      return { ...job, matchScore: score, matchedSkills };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
