import { useState } from "react";
import { Link } from "react-router-dom";

function JobForm({ onSubmit, initialData = {} }) {
  const [job, setJob] = useState({
    company: initialData.company || "",
    title: initialData.title || "",
    status: initialData.status || "Applied",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(job);
  };

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
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
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
