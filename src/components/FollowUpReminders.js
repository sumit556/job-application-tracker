import { useState } from "react";
import { CLOSED_STATUSES } from "../constants";
import {
  daysFromToday,
  formatDate,
  isDueToday,
  isOverdue,
  isWithinDays,
} from "../utils/dates";

const supportsNotifications =
  typeof window !== "undefined" && "Notification" in window;

function FollowUpReminders({ jobs }) {
  const [permission, setPermission] = useState(
    supportsNotifications ? window.Notification.permission : "unsupported"
  );

  const activeReminders = jobs
    .filter(
      (job) =>
        job.followUpDate &&
        !CLOSED_STATUSES.includes(job.status) &&
        daysFromToday(job.followUpDate) !== null
    )
    .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));

  const due = activeReminders.filter(
    (job) => daysFromToday(job.followUpDate) <= 0
  );
  const upcoming = activeReminders.filter((job) =>
    isWithinDays(job.followUpDate, 7)
  );

  if (due.length === 0 && upcoming.length === 0) return null;

  const enableNotifications = async () => {
    if (!supportsNotifications) return;

    try {
      const result = await window.Notification.requestPermission();
      setPermission(result);

      if (result === "granted" && due.length > 0) {
        new window.Notification(
          `${due.length} follow-up${due.length === 1 ? "" : "s"} due`,
          {
            body: due
              .slice(0, 3)
              .map((job) => `${job.company} - ${job.title}`)
              .join("\n"),
          }
        );
      }
    } catch {
      setPermission("unsupported");
    }
  };

  return (
    <section className="reminders" aria-labelledby="reminders-heading">
      <div className="reminders__heading">
        <div>
          <h2 id="reminders-heading" className="section-title">
            Follow-ups
          </h2>
          <p className="section-subtitle">
            {due.length > 0
              ? `${due.length} follow-up${due.length === 1 ? "" : "s"} need attention.`
              : `${upcoming.length} upcoming follow-up${
                  upcoming.length === 1 ? "" : "s"
                } in the next 7 days.`}
          </p>
        </div>

        {permission === "default" && (
          <button
            type="button"
            className="button button-secondary button-small"
            onClick={enableNotifications}
          >
            Enable browser reminders
          </button>
        )}
        {permission === "granted" && (
          <span className="reminders__status">Browser reminders on</span>
        )}
        {permission === "denied" && (
          <span className="reminders__status">Browser reminders blocked</span>
        )}
      </div>

      <ul className="reminder-list">
        {due.map((job) => (
          <li key={job.id} className="reminder reminder--due">
            <div className="reminder__job">
              <strong>{job.company}</strong>
              <span>{job.title}</span>
            </div>
            <span
              className={`reminder__date ${
                isOverdue(job.followUpDate) ? "reminder__date--overdue" : ""
              }`}
            >
              {isDueToday(job.followUpDate)
                ? "Due today"
                : `Overdue since ${formatDate(job.followUpDate)}`}
            </span>
          </li>
        ))}

        {upcoming.map((job) => (
          <li key={job.id} className="reminder">
            <div className="reminder__job">
              <strong>{job.company}</strong>
              <span>{job.title}</span>
            </div>
            <span className="reminder__date">
              Follow up on {formatDate(job.followUpDate)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FollowUpReminders;
