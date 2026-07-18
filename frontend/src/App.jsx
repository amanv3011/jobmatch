import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from './api.js';
import ResumeUpload from './components/ResumeUpload.jsx';
import SyncPanel from './components/SyncPanel.jsx';
import FilterSidebar from './components/FilterSidebar.jsx';
import JobRow from './components/JobRow.jsx';
import JobDetail from './components/JobDetail.jsx';
import Tracker from './components/Tracker.jsx';

export default function App() {
  const [tab, setTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showSync, setShowSync] = useState(true);

  const loadJobs = useCallback(() => api.getJobs().then(setJobs), []);
  const loadApplications = useCallback(() => api.getApplications().then(setApplications), []);

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, [loadJobs, loadApplications]);

  useEffect(() => {
    if (jobs.length > 0) setShowSync(false);
  }, [jobs.length]);

  const savedJobKeys = useMemo(
    () => new Set(applications.map((a) => `${a.job.source}-${a.job.sourceId}`)),
    [applications]
  );

  async function handleSaveJob(job) {
    await api.saveApplication(job);
    loadApplications();
  }

  const handleFiltered = useCallback((list) => {
    setFilteredJobs(list);
    setSelectedJob((current) => {
      if (current && list.some((j) => j.source === current.source && j.sourceId === current.sourceId)) {
        return current;
      }
      return list[0] || null;
    });
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Job<span>Match</span></div>
        <div className="tabs">
          <button className={`tab ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>Jobs</button>
          <button className={`tab ${tab === 'resume' ? 'active' : ''}`} onClick={() => setTab('resume')}>Resume</button>
          <button className={`tab ${tab === 'tracker' ? 'active' : ''}`} onClick={() => setTab('tracker')}>
            Tracker {applications.length > 0 && `(${applications.length})`}
          </button>
        </div>
      </header>

      {tab === 'jobs' && (
        <>
          <div className="jobs-toolbar">
            <button className="ghost" onClick={() => setShowSync((v) => !v)}>
              {showSync ? 'Hide sources' : 'Add / edit sources'}
            </button>
          </div>

          {showSync && <SyncPanel onSynced={loadJobs} />}

          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="detail-empty-icon">📋</div>
              <p>No jobs yet. Add company slugs above and click "Fetch jobs" to get started.</p>
            </div>
          ) : (
            <div className="jobs-layout">
              <FilterSidebar jobs={jobs} onFiltered={handleFiltered} />

              <div className="job-list-pane">
                {filteredJobs.length === 0 ? (
                  <div className="empty">No jobs match your filters.</div>
                ) : (
                  filteredJobs.map((job) => (
                    <JobRow
                      key={`${job.source}-${job.sourceId}`}
                      job={job}
                      isSelected={selectedJob?.source === job.source && selectedJob?.sourceId === job.sourceId}
                      onSelect={setSelectedJob}
                    />
                  ))
                )}
              </div>

              <div className="detail-pane">
                <JobDetail
                  job={selectedJob}
                  onSave={handleSaveJob}
                  saved={selectedJob ? savedJobKeys.has(`${selectedJob.source}-${selectedJob.sourceId}`) : false}
                />
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'resume' && (
        <div className="single-pane">
          <ResumeUpload onSaved={loadJobs} />
        </div>
      )}

      {tab === 'tracker' && (
        <div className="single-pane">
          <Tracker applications={applications} onChange={loadApplications} />
        </div>
      )}
    </div>
  );
}
