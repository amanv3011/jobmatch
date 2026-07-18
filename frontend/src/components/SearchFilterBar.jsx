import { useMemo, useState } from 'react';

const SOURCES = ['greenhouse', 'lever', 'ashby', 'workable', 'recruitee', 'adzuna'];
const SORTS = [
  { value: 'match', label: 'Best match' },
  { value: 'newest', label: 'Newest posted' },
  { value: 'title', label: 'Title A-Z' }
];

export default function SearchFilterBar({ jobs, onFiltered }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [activeSources, setActiveSources] = useState(new Set(SOURCES));
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

  return (
    <div className="card search-panel">
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search title, company, or keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="text"
          className="search-input search-input-narrow"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select className="status-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-row">
        <div className="source-pills">
          {SOURCES.map((s) => (
            <button
              key={s}
              className={`source-pill ${activeSources.has(s) ? 'active' : ''}`}
              onClick={() => toggleSource(s)}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="score-filter">
          <label className="score-filter-label">Min match {minScore}%</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
          />
        </div>
      </div>

      <p className="hint" style={{ marginTop: 10, marginBottom: 0 }}>
        {filtered.length} of {jobs.length} jobs shown
      </p>
    </div>
  );
}
