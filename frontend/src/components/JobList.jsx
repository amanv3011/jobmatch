import JobCard from './JobCard.jsx';

export default function JobList({ jobs, onSave }) {
  if (!jobs.length) {
    return <div className="empty">No jobs yet — fetch some postings above to get started.</div>;
  }

  return (
    <div className="job-grid">
      {jobs.map((job) => (
        <JobCard key={`${job.source}-${job.sourceId}`} job={job} onSave={onSave} />
      ))}
    </div>
  );
}
