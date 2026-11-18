import { useNavigate } from "react-router-dom";
import JobForm from "../components/JobForm";
import { createdActivity, notesActivity } from "../utils/activity";
import { getJobs, saveJobs } from "../utils/storage";

function AddJob() {
  const navigate = useNavigate();

  const addJob = (job) => {
    const jobs = getJobs();
    const activity = [createdActivity(job.status)];

    if ((job.notes || "").trim() !== "") {
      activity.push(notesActivity(job.notes, "added"));
    }

    jobs.push({
      ...job,
      id: Date.now(),
      activity,
    });
    saveJobs(jobs);
    navigate("/");
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1 className="page-title">Add application</h1>
          <p className="page-subtitle">
            Save a role you have applied to and track its status.
          </p>
        </div>
      </div>
      <div className="card">
        <JobForm onSubmit={addJob} existingJobs={getJobs()} />
      </div>
    </div>
  );
}

export default AddJob;