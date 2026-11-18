import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import JobForm from "../components/JobForm";
import { buildActivityChanges } from "../utils/activity";
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
    const jobs = getJobs();
    const existingJob = jobs.find((j) => j.id === Number(id)) || job;
    const changes = buildActivityChanges(existingJob, updatedJob);

    const nextJobs = jobs.map((j) =>
      j.id === Number(id)
        ? {
            ...updatedJob,
            id: Number(id),
            activity: [...(existingJob.activity || []), ...changes],
          }
        : j
    );

    saveJobs(nextJobs);
    navigate("/");
  };

  if (!loaded) return <p className="page-subtitle">Loading...</p>;

  if (!job) {
    return (
      <div className="empty-state">
        <h1 className="empty-state__title">Job application not found.</h1>
        <p className="empty-state__text">
          It may have been deleted, or the link may be incorrect.
        </p>
        <Link to="/" className="button button-primary">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1 className="page-title">Edit application</h1>
          <p className="page-subtitle">
            Update the company, role, or current status.
          </p>
        </div>
      </div>
      <div className="card">
        <JobForm
          onSubmit={updateJob}
          initialData={job}
          existingJobs={getJobs()}
          currentId={job.id}
        />
      </div>
    </div>
  );
}

export default EditJob;
