import axios from 'axios';

/**
 * Workable public widget API — no auth required.
 * accountSlug is the account identifier used at apply.workable.com/<slug>/.
 */
export async function fetchWorkableJobs(accountSlug) {
  const url = `https://apply.workable.com/api/v1/widget/accounts/${accountSlug}`;
  const { data } = await axios.get(url, { timeout: 10000 });

  return (data.jobs || []).map((job) => ({
    source: 'workable',
    sourceId: job.shortcode || job.id,
    company: accountSlug,
    title: job.title,
    location: job.location?.location_str || job.location?.city || 'Unspecified',
    description: stripHtml(job.description || ''),
    applyUrl: job.url || job.application_url,
    postedAt: job.published_on || null
  }));
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
