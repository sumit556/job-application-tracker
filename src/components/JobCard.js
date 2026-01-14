import { Link } from "react-router-dom";

function JobCards({ jobs, onDelete }) {
  if (!jobs || jobs.length === 0) {
    return <p>No job applications found.</p>;
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
            <strong>{job.title}</strong> — {job.status}
          </p>
          <div>
            <Link to={`/edit/${job.id}`} style={{ marginRight: "10px" }}>
              Edit
            </Link>
            <button onClick={() => onDelete(job.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobCards;
