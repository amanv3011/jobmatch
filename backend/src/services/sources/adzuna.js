import axios from 'axios';

/**
 * Adzuna job search API — requires a free app_id + app_key from
 * https://developer.adzuna.com/. Aggregates listings across many boards.
 * country is a 2-letter Adzuna country code, e.g. "in", "gb", "us".
 */
export async function fetchAdzunaJobs({ country = 'in', query = 'software engineer', page = 1, resultsPerPage = 20 }) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    // No credentials configured — return empty rather than throwing,
    // so the aggregator can still work with Greenhouse/Lever alone.
    return [];
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
  const { data } = await axios.get(url, {
    timeout: 10000,
    params: {
      app_id: appId,
      app_key: appKey,
      results_per_page: resultsPerPage,
      what: query
    }
  });

  return (data.results || []).map((job) => ({
    source: 'adzuna',
    sourceId: String(job.id),
    company: job.company?.display_name || 'Unknown',
    title: job.title,
    location: job.location?.display_name || 'Unspecified',
    description: job.description || '',
    applyUrl: job.redirect_url,
    postedAt: job.created || null
  }));
}
