import axios from 'axios';

/**
 * Greenhouse Job Board API — public, no auth required.
 * Docs: https://developers.greenhouse.io/job-board.html
 * boardToken is the company's Greenhouse slug, e.g. "stripe".
 */
export async function fetchGreenhouseJobs(boardToken) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;
  const { data } = await axios.get(url, { timeout: 10000 });

  return (data.jobs || []).map((job) => ({
    source: 'greenhouse',
    sourceId: String(job.id),
    company: boardToken,
    title: job.title,
    location: job.location?.name || 'Unspecified',
    description: stripHtml(job.content || ''),
    applyUrl: job.absolute_url,
    postedAt: job.first_published || job.updated_at || null
  }));
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
