import { STATUSES } from "../constants";

function StatsOverview({ jobs }) {
  const total = jobs.length;

  if (total === 0) return null;

  const counts = STATUSES.reduce((result, status) => {
    result[status] = jobs.filter((job) => job.status === status).length;
    return result;
  }, {});

  const responseRate = Math.round(
    ((counts.Interview + counts.Offer + counts.Rejected) / total) * 100
  );
  const offerRate = Math.round((counts.Offer / total) * 100);
  const inProgress = counts.Applied + counts.Interview;

  return (
    <section className="stats" aria-labelledby="stats-heading">
      <div className="stats__heading">
        <div>
          <h2 id="stats-heading" className="section-title">
            Overview
          </h2>
          <p className="section-subtitle">
            Response rate counts interviews, offers, and rejections.
          </p>
        </div>
      </div>

      <div className="stats__grid">
        <div className="stat-card stat-card--total">
          <span className="stat-card__label">Total</span>
          <strong className="stat-card__value">{total}</strong>
          <span className="stat-card__meta">
            application{total === 1 ? "" : "s"}
          </span>
        </div>

        {STATUSES.map((status) => (
          <div
            key={status}
            className={`stat-card stat-card--${status.toLowerCase()}`}
          >
            <span className="stat-card__label">{status}</span>
            <strong className="stat-card__value">{counts[status]}</strong>
            <span className="stat-card__meta">
              {Math.round((counts[status] / total) * 100)}% of total
            </span>
          </div>
        ))}
      </div>

      <div className="stats__rates">
        <div className="stats__rate">
          <span>Response rate</span>
          <strong>{responseRate}%</strong>
        </div>
        <div className="stats__rate">
          <span>Offer rate</span>
          <strong>{offerRate}%</strong>
        </div>
        <div className="stats__rate">
          <span>In progress</span>
          <strong>{inProgress}</strong>
        </div>
      </div>

      <div
        className="status-bar"
        role="img"
        aria-label={`Status breakdown: ${STATUSES.map(
          (status) => `${counts[status]} ${status.toLowerCase()}`
        ).join(", ")}`}
      >
        {STATUSES.map(
          (status) =>
            counts[status] > 0 && (
              <span
                key={status}
                className={`status-bar__segment status-bar__segment--${status.toLowerCase()}`}
                style={{ width: `${(counts[status] / total) * 100}%` }}
              />
            )
        )}
      </div>
    </section>
  );
}

export default StatsOverview;
