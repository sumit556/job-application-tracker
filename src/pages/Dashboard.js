import { useEffect, useState } from "react";
import { getJobs, saveJobs } from "../utils/storage";
import JobList from "../components/JobList";

function Dashboard() {
  const [jobs, setJobs] = useState([]);

  // Load jobs from localStorage once when the page loads
  useEffect(() => {
    setJobs(getJobs());
  }, []);

  // Delete job handler
  const deleteJob = (id) => {
    const updated = jobs.filter((job) => job.id !== id);
    setJobs(updated);
    saveJobs(updated);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1 className="page-title">My applications</h1>
          <p className="page-subtitle">
            {jobs.length === 0
              ? "Keep track of every role you apply to."
              : `${jobs.length} application${jobs.length === 1 ? "" : "s"} tracked.`}
          </p>
        </div>
      </div>

      <JobList jobs={jobs} onDelete={deleteJob} />
    </div>
  );
}

export default Dashboard;
