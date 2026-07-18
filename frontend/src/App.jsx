import { useState, useEffect, useCallback } from 'react';
import { api } from './api.js';
import ResumeUpload from './components/ResumeUpload.jsx';
import SyncPanel from './components/SyncPanel.jsx';
import SearchFilterBar from './components/SearchFilterBar.jsx';
import JobList from './components/JobList.jsx';
import Tracker from './components/Tracker.jsx';

export default function App() {
  const [tab, setTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const loadJobs = useCallback(() => api.getJobs().then(setJobs), []);
  const loadApplications = useCallback(() => api.getApplications().then(setApplications), []);

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, [loadJobs, loadApplications]);

  async function handleSaveJob(job) {
    await api.saveApplication(job);
    loadApplications();
    setTab('tracker');
  }

  return (
    <div className="app">
      <div className="brand">Job<span>Match</span></div>
      <div className="subtitle">Pull postings from public job boards, score them against your resume, and draft applications — you stay in control of every submit.</div>

      <div className="tabs">
        <button className={`tab ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>Jobs</button>
        <button className={`tab ${tab === 'resume' ? 'active' : ''}`} onClick={() => setTab('resume')}>Resume</button>
        <button className={`tab ${tab === 'tracker' ? 'active' : ''}`} onClick={() => setTab('tracker')}>
          Tracker {applications.length > 0 && `(${applications.length})`}
        </button>
      </div>

      {tab === 'jobs' && (
        <>
          <SyncPanel onSynced={loadJobs} />
          {jobs.length > 0 && <SearchFilterBar jobs={jobs} onFiltered={setFilteredJobs} />}
          <JobList jobs={jobs.length > 0 ? filteredJobs : jobs} onSave={handleSaveJob} />
        </>
      )}

      {tab === 'resume' && <ResumeUpload onSaved={loadJobs} />}

      {tab === 'tracker' && <Tracker applications={applications} onChange={loadApplications} />}
    </div>
  );
}
