export default function JobDetail({ job, onSave, saved }) {
  if (!job) {
    return (
      <div className="detail-empty">
        <div className="detail-empty-icon">🔎</div>
        <p>Select a job from the list to see the full posting here.</p>
      </div>
    );
  }

  const score = job.matchScore;
  const scoreClass = score === null || score === undefined ? '' : score >= 50 ? 'score-high' : 'score-low';

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div>
          <h2 className="detail-title">{job.title}</h2>
          <div className="detail-meta">{job.company} · {job.location} · via {job.source}</div>
        </div>
        {score !== null && score !== undefined && (
          <span className={`score-pill ${scoreClass} detail-score`}>{score}% match</span>
        )}
      </div>

      {!!job.matchedSkills?.length && (
        <div className="skill-tags detail-skills">
          {job.matchedSkills.map((s) => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
        </div>
      )}

      <div className="row detail-actions">
        <a href={job.applyUrl} target="_blank" rel="noreferrer">
          <button className="ghost">View original posting</button>
        </a>
        <button className="primary detail-save-btn" onClick={() => onSave(job)} disabled={saved}>
          {saved ? 'Saved to tracker' : 'Save + draft cover letter'}
        </button>
      </div>

      <div className="detail-description">
        {job.description ? job.description : 'No description provided by this posting.'}
      </div>
    </div>
  );
}
