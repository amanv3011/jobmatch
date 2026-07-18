import axios from 'axios';

/**
 * Ashby public Job Posting API — no auth required.
 * companySlug is the name that appears in jobs.ashbyhq.com/<slug>.
 * Docs: https://developers.ashbyhq.com/docs/public-job-posting-api
 */
export async function fetchAshbyJobs(companySlug) {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${companySlug}?includeCompensation=true`;
  const { data } = await axios.get(url, { timeout: 10000 });

  return (data.jobs || []).map((job) => ({
    source: 'ashby',
    sourceId: job.id,
    company: companySlug,
    title: job.title,
    location: job.location || job.address?.postalAddress?.addressLocality || 'Unspecified',
    description: stripHtml(job.descriptionPlain || job.descriptionHtml || ''),
    applyUrl: job.applyUrl || job.jobUrl,
    postedAt: job.publishedAt || null
  }));
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
