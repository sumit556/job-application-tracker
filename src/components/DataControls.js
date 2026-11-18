import { useRef } from "react";
import { todayISO } from "../utils/dates";
import { normalizeJobs } from "../utils/storage";

const downloadFile = (content, type, filename) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

function DataControls({ jobs, onImport, onError }) {
  const jsonInputRef = useRef(null);

  const exportJson = () => {
    if (jobs.length === 0) return;

    downloadFile(
      JSON.stringify(jobs, null, 2),
      "application/json",
      `job-applications-${todayISO()}.json`
    );
  };

  const importJson = (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const content = String(reader.result);
        const records = JSON.parse(content);

        if (!Array.isArray(records)) {
          throw new Error("Backup is not an array.");
        }

        const valid = records.filter(
          (job) =>
            job &&
            typeof job.company === "string" &&
            job.company.trim() !== "" &&
            typeof job.title === "string" &&
            job.title.trim() !== ""
        );

        if (valid.length === 0) {
          throw new Error("Backup contains no valid applications.");
        }

        onImport(normalizeJobs(valid));
      } catch {
        onError(
          "Could not import that JSON file. Choose a valid JSON export from this app."
        );
      }
    };

    reader.onerror = () => onError("Could not read that file.");
    reader.readAsText(file);
  };

  return (
    <div className="data-controls">
      <button
        type="button"
        className="button button-secondary button-small"
        onClick={exportJson}
        disabled={jobs.length === 0}
      >
        Export JSON
      </button>
      <button
        type="button"
        className="button button-secondary button-small"
        onClick={() => jsonInputRef.current?.click()}
      >
        Import JSON
      </button>
      <input
        ref={jsonInputRef}
        className="visually-hidden"
        type="file"
        accept="application/json,.json"
        aria-label="Import JSON file"
        onChange={importJson}
      />
    </div>
  );
}

export default DataControls;