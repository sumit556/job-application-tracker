// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    <div style={{ padding: "20px" }}>
      <h2>My Job Applications</h2>
      <Link to="/add" style={{ display: "inline-block", marginBottom: "15px" }}>
        Add Job
      </Link>

      {/* 👇 Only one component handles displaying jobs */}
      <JobList jobs={jobs} onDelete={deleteJob} />
    </div>
  );
}

export default Dashboard;
