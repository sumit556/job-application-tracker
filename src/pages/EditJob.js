import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import JobForm from "../components/JobForm";
import { getJobs, saveJobs } from "../utils/storage";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const jobs = getJobs();
    const existingJob = jobs.find((j) => j.id === Number(id));
    setJob(existingJob);
  }, [id]);

  const updateJob = (updatedJob) => {
    const jobs = getJobs().map((j) =>
      j.id === Number(id) ? { ...updatedJob, id: Number(id) } : j
    );
    saveJobs(jobs);
    navigate("/");
  };

  if (!job) return <p>Loading...</p>;

  return <JobForm onSubmit={updateJob} initialData={job} />;
}

export default EditJob;
