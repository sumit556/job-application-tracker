// src/components/JobList.js
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function JobList({ jobs, onDelete }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="empty-state">
        <h2 className="empty-state__title">No job applications yet.</h2>
        <p className="empty-state__text">
          Add your first application to start tracking your progress.
        </p>
        <Link to="/add" className="button button-primary">
          Add your first application
        </Link>
      </div>
    );
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <article key={job.id} className="job-card">
          <div className="job-card__main">
            <h2 className="job-card__company">{job.company}</h2>
            <p className="job-card__title">{job.title}</p>
          </div>
          <div className="job-card__meta">
            <StatusBadge status={job.status} />
            <div className="job-card__actions">
              <Link className="text-link" to={`/edit/${job.id}`}>
                Edit
              </Link>
              <button
                type="button"
                className="button button-danger"
                onClick={() => onDelete(job.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default JobList;
