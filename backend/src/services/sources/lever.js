import axios from 'axios';

/**
 * Lever Postings API — public, no auth required.
 * companySlug is the company's Lever slug, e.g. "netflix".
 */
export async function fetchLeverJobs(companySlug) {
  const url = `https://api.lever.co/v0/postings/${companySlug}?mode=json`;
  const { data } = await axios.get(url, { timeout: 10000 });

  return (data || []).map((job) => ({
    source: 'lever',
    sourceId: job.id,
    company: companySlug,
    title: job.text,
    location: job.categories?.location || 'Unspecified',
    description: stripHtml(job.descriptionPlain || job.description || ''),
    applyUrl: job.applyUrl || job.hostedUrl,
    postedAt: job.createdAt ? new Date(job.createdAt).toISOString() : null
  }));
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
