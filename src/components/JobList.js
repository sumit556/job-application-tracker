// src/components/JobList.js
import { Link } from "react-router-dom";

function JobList({ jobs, onDelete }) {
  if (!jobs || jobs.length === 0) {
    return <p>No job applications yet.</p>;
  }

  return (
    <div>
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px",
          }}
        >
          <h3>{job.company}</h3>
          <p>
            {job.title} — <strong>{job.status}</strong>
          </p>
          <div>
            <Link
              to={`/edit/${job.id}`}
              style={{ marginRight: "10px", color: "#007bff", textDecoration: "none" }}
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(job.id)}
              style={{
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobList;
