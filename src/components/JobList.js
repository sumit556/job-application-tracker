import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import {
  formatDate,
  formatDateTime,
  isDueToday,
  isOverdue,
} from "../utils/dates";

const isSafeUrl = (url) => /^https?:\/\//i.test(url || "");

function JobList({ jobs, onRequestDelete }) {
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
      {jobs.map((job) => {
        const followUpOverdue = isOverdue(job.followUpDate);

        return (
          <article key={job.id} className="job-card">
            <div className="job-card__main">
              <div className="job-card__top">
                <h2 className="job-card__company">{job.company}</h2>
                <StatusBadge status={job.status} />
                {job.workMode && (
                  <span className="work-mode-badge">{job.workMode}</span>
                )}
              </div>
              <p className="job-card__title">{job.title}</p>
              <p className="job-card__dates">
                <span>Applied {formatDate(job.appliedDate)}</span>
                {job.followUpDate && (
                  <span
                    className={
                      followUpOverdue ? "job-card__date--alert" : undefined
                    }
                  >
                    {followUpOverdue
                      ? `Follow-up overdue (${formatDate(job.followUpDate)})`
                      : isDueToday(job.followUpDate)
                      ? "Follow-up due today"
                      : `Follow-up ${formatDate(job.followUpDate)}`}
                  </span>
                )}
                {job.location && <span>{job.location}</span>}
                {job.salary && <span>{job.salary}</span>}
                {job.source && <span>Source: {job.source}</span>}
              </p>
              {job.tags && job.tags.length > 0 && (
                <ul className="job-card__tags" aria-label="Tags">
                  {job.tags.map((tag) => (
                    <li key={tag} className="job-card__tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              {job.notes && (
                <details className="job-card__notes">
                  <summary>Notes</summary>
                  <p>{job.notes}</p>
                </details>
              )}
              {job.activity && job.activity.length > 0 && (
                <details className="job-card__activity">
                  <summary>Activity ({job.activity.length})</summary>
                  <ol className="activity-list">
                    {job.activity.map((entry) => (
                      <li key={entry.id} className="activity-item">
                        <time
                          className="activity-item__time"
                          dateTime={entry.at}
                        >
                          {formatDateTime(entry.at)}
                        </time>
                        <span>{entry.message}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </div>

            <div className="job-card__actions">
              {isSafeUrl(job.jobUrl) && (
                <a
                  className="text-link"
                  href={job.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View posting
                </a>
              )}
              <Link className="text-link" to={`/edit/${job.id}`}>
                Edit
              </Link>
              <button
                type="button"
                className="button button-danger"
                onClick={() => onRequestDelete(job)}
              >
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default JobList;
