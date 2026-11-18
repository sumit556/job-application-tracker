import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import JobForm from "../components/JobForm";
import { getJobs, saveJobs } from "../utils/storage";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const jobs = getJobs();
    const existingJob = jobs.find((j) => j.id === Number(id));
    setJob(existingJob || null);
    setLoaded(true);
  }, [id]);

  const updateJob = (updatedJob) => {
    const jobs = getJobs().map((j) =>
      j.id === Number(id) ? { ...updatedJob, id: Number(id) } : j
    );
    saveJobs(jobs);
    navigate("/");
  };

  if (!loaded) return <p>Loading...</p>;

  if (!job) {
    return (
      <div style={{ padding: "20px" }}>
        <p>Job application not found.</p>
        <Link to="/">Back to dashboard</Link>
      </div>
    );
  }

  return <JobForm onSubmit={updateJob} initialData={job} />;
}

export default EditJob;
