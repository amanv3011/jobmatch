export default function JobRow({ job, isSelected, onSelect }) {
  const score = job.matchScore;
  const scoreClass = score === null || score === undefined ? '' : score >= 50 ? 'score-high' : 'score-low';

  return (
    <button
      type="button"
      className={`job-row ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(job)}
    >
      <div className="job-row-main">
        <div className="job-row-title">{job.title}</div>
        <div className="job-row-meta">{job.company} · {job.location}</div>
      </div>
      {score !== null && score !== undefined && (
        <span className={`score-pill ${scoreClass}`}>{score}%</span>
      )}
    </button>
  );
}
