import { useNavigate } from "react-router-dom";
import JobForm from "../components/JobForm";
import { getJobs, saveJobs } from "../utils/storage";

function AddJob() {
  const navigate = useNavigate();

  const addJob = (job) => {
    const jobs = getJobs();
    jobs.push({ ...job, id: Date.now() });
    saveJobs(jobs);
    navigate("/");
  };

  return <JobForm onSubmit={addJob} />;
}

export default AddJob;
