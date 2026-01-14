import { useState } from "react";

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
    <form onSubmit={submit}>
      <input
        name="company"
        placeholder="Company"
        value={job.company}
        onChange={handleChange}
        required
      />

      <input
        name="title"
        placeholder="Job Title"
        value={job.title}
        onChange={handleChange}
        required
      />

      <select name="status" value={job.status} onChange={handleChange}>
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>

      <button type="submit">Save</button>
    </form>
  );
}

export default JobForm;
