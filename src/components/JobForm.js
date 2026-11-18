import { useState } from "react";
import { Link } from "react-router-dom";
import {
  SOURCE_SUGGESTIONS,
  STATUSES,
  TAG_SUGGESTIONS,
  WORK_MODES,
} from "../constants";
import { todayISO } from "../utils/dates";

const parseTags = (value) => {
  const seen = new Set();

  return value
    .split(/[,;]/)
    .map((tag) => tag.trim())
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

function JobForm({
  onSubmit,
  initialData = {},
  existingJobs = [],
  currentId = null,
}) {
  const [job, setJob] = useState({
    company: initialData.company || "",
    title: initialData.title || "",
    status: initialData.status || "Applied",
    appliedDate: initialData.appliedDate || todayISO(),
    followUpDate: initialData.followUpDate || "",
    location: initialData.location || "",
    workMode: initialData.workMode || "",
    salary: initialData.salary || "",
    jobUrl: initialData.jobUrl || "",
    source: initialData.source || "",
    tags: Array.isArray(initialData.tags)
      ? initialData.tags.join(", ")
      : initialData.tags || "",
    notes: initialData.notes || "",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...job,
      source: job.source.trim(),
      tags: parseTags(job.tags),
    });
  };

  const duplicate =
    job.company.trim() !== "" &&
    job.title.trim() !== "" &&
    existingJobs.some(
      (existing) =>
        existing.id !== currentId &&
        existing.company.trim().toLowerCase() ===
          job.company.trim().toLowerCase() &&
        existing.title.trim().toLowerCase() === job.title.trim().toLowerCase()
    );

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-field">
        <label className="form-label" htmlFor="company">
          Company
        </label>
        <input
          id="company"
          className="form-input"
          name="company"
          placeholder="Company"
          value={job.company}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="title">
          Job title
        </label>
        <input
          id="title"
          className="form-input"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />
      </div>

      {duplicate && (
        <p className="form-warning" role="status">
          An application for <strong>{job.title.trim()}</strong> at{" "}
          <strong>{job.company.trim()}</strong> already exists.
        </p>
      )}

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="form-select"
            name="status"
            value={job.status}
            onChange={handleChange}
          >
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="workMode">
            Work mode
          </label>
          <select
            id="workMode"
            className="form-select"
            name="workMode"
            value={job.workMode}
            onChange={handleChange}
          >
            <option value="">Not specified</option>
            {WORK_MODES.map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            className="form-input"
            name="location"
            placeholder="City or region"
            value={job.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="salary">
            Salary
          </label>
          <input
            id="salary"
            className="form-input"
            name="salary"
            placeholder="e.g. $90,000"
            value={job.salary}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="source">
            Source
          </label>
          <input
            id="source"
            className="form-input"
            name="source"
            list="source-options"
            placeholder="LinkedIn, referral, company site..."
            value={job.source}
            onChange={handleChange}
          />
          <datalist id="source-options">
            {SOURCE_SUGGESTIONS.map((source) => (
              <option key={source} value={source} />
            ))}
          </datalist>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            className="form-input"
            name="tags"
            placeholder={TAG_SUGGESTIONS.join(", ")}
            value={job.tags}
            onChange={handleChange}
          />
          <span className="form-hint">Separate custom tags with commas.</span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="appliedDate">
            Applied date
          </label>
          <input
            id="appliedDate"
            className="form-input"
            type="date"
            name="appliedDate"
            value={job.appliedDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="followUpDate">
            Follow-up date
          </label>
          <input
            id="followUpDate"
            className="form-input"
            type="date"
            name="followUpDate"
            value={job.followUpDate}
            onChange={handleChange}
          />
          <span className="form-hint">
            Optional. Due follow-ups appear on the dashboard.
          </span>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="jobUrl">
          Job posting URL
        </label>
        <input
          id="jobUrl"
          className="form-input"
          type="url"
          name="jobUrl"
          placeholder="https://example.com/job"
          value={job.jobUrl}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          className="form-input form-textarea"
          name="notes"
          rows={4}
          placeholder="Contacts, interview prep, next steps..."
          value={job.notes}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <Link to="/" className="button button-secondary">
          Cancel
        </Link>
        <button type="submit" className="button button-primary">
          Save
        </button>
      </div>
    </form>
  );
}

export default JobForm;
