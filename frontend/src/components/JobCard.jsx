export default function JobCard({ job, onSave }) {
  const score = job.matchScore;
  const scoreClass = score === null || score === undefined ? '' : score >= 50 ? 'score-high' : 'score-low';

  return (
    <div className="card job-card">
      <div style={{ flex: 1 }}>
        <div className="job-title">{job.title}</div>
        <div className="job-meta">{job.company} · {job.location} · via {job.source}</div>
        {!!job.matchedSkills?.length && (
          <div className="skill-tags">
            {job.matchedSkills.map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        )}
        <div className="row" style={{ marginTop: 12 }}>
          <a href={job.applyUrl} target="_blank" rel="noreferrer">
            <button className="ghost">View posting</button>
          </a>
          <button className="ghost" onClick={() => onSave(job)}>Save + draft cover letter</button>
        </div>
      </div>
      {score !== null && score !== undefined && (
        <span className={`score-pill ${scoreClass}`}>{score}% match</span>
      )}
    </div>
  );
}
