import { useMemo, useState } from 'react';

const SOURCES = [
  { value: 'greenhouse', label: 'Greenhouse' },
  { value: 'lever', label: 'Lever' },
  { value: 'ashby', label: 'Ashby' },
  { value: 'workable', label: 'Workable' },
  { value: 'recruitee', label: 'Recruitee' },
  { value: 'adzuna', label: 'Adzuna' }
];

const SORTS = [
  { value: 'match', label: 'Best match' },
  { value: 'newest', label: 'Newest posted' },
  { value: 'title', label: 'Title A-Z' }
];

export default function FilterSidebar({ jobs, onFiltered }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [activeSources, setActiveSources] = useState(new Set(SOURCES.map((s) => s.value)));
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState('match');

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const loc = location.trim().toLowerCase();

    let result = jobs.filter((job) => {
      if (kw && !`${job.title} ${job.company} ${job.description || ''}`.toLowerCase().includes(kw)) return false;
      if (loc && !(job.location || '').toLowerCase().includes(loc)) return false;
      if (!activeSources.has(job.source)) return false;
      if (job.matchScore !== null && job.matchScore !== undefined && job.matchScore < minScore) return false;
      return true;
    });

    if (sort === 'match') {
      result = [...result].sort((a, b) => (b.matchScore ?? -1) - (a.matchScore ?? -1));
    } else if (sort === 'newest') {
      result = [...result].sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
    } else if (sort === 'title') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    onFiltered(result);
    return result;
  }, [jobs, keyword, location, activeSources, minScore, sort, onFiltered]);

  function toggleSource(source) {
    setActiveSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });
  }

  const hasFilters = keyword || location || minScore > 0 || activeSources.size < SOURCES.length;

  function reset() {
    setKeyword('');
    setLocation('');
    setActiveSources(new Set(SOURCES.map((s) => s.value)));
    setMinScore(0);
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <label className="sidebar-label" htmlFor="kw">Keyword</label>
        <input
          id="kw"
          type="text"
          className="sidebar-input"
          placeholder="Title, company, skill..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label" htmlFor="loc">Location</label>
        <input
          id="loc"
          type="text"
          className="sidebar-input"
          placeholder="City, remote, region..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label">Sort by</label>
        <select className="sidebar-input" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label">Minimum match &mdash; {minScore}%</label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="sidebar-slider"
        />
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label">Sources</label>
        <div className="source-list">
          {SOURCES.map((s) => (
            <label key={s.value} className="source-checkbox">
              <input
                type="checkbox"
                checked={activeSources.has(s.value)}
                onChange={() => toggleSource(s.value)}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-count">{filtered.length} of {jobs.length} jobs</span>
        {hasFilters && (
          <button className="ghost sidebar-reset" onClick={reset} type="button">Clear filters</button>
        )}
      </div>
    </aside>
  );
}
