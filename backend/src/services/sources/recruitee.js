import axios from 'axios';

/**
 * Recruitee public offers API — no auth required.
 * companySlug is the subdomain in <slug>.recruitee.com.
 */
export async function fetchRecruiteeJobs(companySlug) {
  const url = `https://${companySlug}.recruitee.com/api/offers/`;
  const { data } = await axios.get(url, { timeout: 10000 });

  return (data.offers || []).map((job) => ({
    source: 'recruitee',
    sourceId: String(job.id),
    company: companySlug,
    title: job.title,
    location: job.city || job.country || 'Unspecified',
    description: stripHtml(job.description || job.requirements || ''),
    applyUrl: job.careers_url || job.url,
    postedAt: job.created_at || null
  }));
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
