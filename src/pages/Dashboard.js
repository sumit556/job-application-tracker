import { useEffect, useMemo, useState } from "react";
import { getJobs, saveJobs } from "../utils/storage";
import JobList from "../components/JobList";
import JobToolbar from "../components/JobToolbar";
import StatsOverview from "../components/StatsOverview";
import FollowUpReminders from "../components/FollowUpReminders";
import ConfirmDialog from "../components/ConfirmDialog";
import DataControls from "../components/DataControls";
import Toast from "../components/Toast";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [toast, setToast] = useState(null);

  // Load jobs from localStorage once when the page loads
  useEffect(() => {
    setJobs(getJobs());
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => {
      setToast(null);
      setLastDeleted(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  const sources = useMemo(
    () =>
      [...new Set(jobs.map((job) => job.source).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      ),
    [jobs]
  );

  const tags = useMemo(
    () =>
      [...new Set(jobs.flatMap((job) => job.tags || []))].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      ),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = jobs.filter((job) => {
      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;
      const matchesSource =
        sourceFilter === "All" || job.source === sourceFilter;
      const matchesTag =
        tagFilter === "All" || (job.tags || []).includes(tagFilter);
      const matchesSearch =
        query === "" ||
        `${job.company} ${job.title}`.toLowerCase().includes(query);

      return matchesStatus && matchesSource && matchesTag && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sort === "company") {
        return (
          a.company.localeCompare(b.company, undefined, {
            sensitivity: "base",
          }) || a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
      }

      if (sort === "oldest") {
        return (
          (a.appliedDate || "").localeCompare(b.appliedDate || "") ||
          a.id - b.id
        );
      }

      return (
        (b.appliedDate || "").localeCompare(a.appliedDate || "") || b.id - a.id
      );
    });
  }, [jobs, search, statusFilter, sourceFilter, tagFilter, sort]);

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    sourceFilter !== "All" ||
    tagFilter !== "All" ||
    sort !== "newest";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSourceFilter("All");
    setTagFilter("All");
    setSort("newest");
  };

  const requestDelete = (job) => {
    setPendingDelete(job);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    const index = jobs.findIndex((job) => job.id === pendingDelete.id);
    const updated = jobs.filter((job) => job.id !== pendingDelete.id);

    setJobs(updated);
    saveJobs(updated);
    setLastDeleted(index >= 0 ? { job: pendingDelete, index } : null);
    setPendingDelete(null);
    setToast({ message: "Application deleted.", undo: true });
  };

  const undoDelete = () => {
    if (!lastDeleted) return;

    const next = [...jobs];
    next.splice(Math.min(lastDeleted.index, next.length), 0, lastDeleted.job);
    setJobs(next);
    saveJobs(next);
    setLastDeleted(null);
    setToast(null);
  };

  const confirmImport = () => {
    if (!pendingImport) return;

    setJobs(pendingImport);
    saveJobs(pendingImport);
    setPendingImport(null);
    setLastDeleted(null);
    setToast({
      message: `Imported ${pendingImport.length} application${
        pendingImport.length === 1 ? "" : "s"
      }.`,
    });
  };

  const dismissToast = () => {
    setToast(null);
    setLastDeleted(null);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1 className="page-title">My applications</h1>
          <p className="page-subtitle">
            {jobs.length === 0
              ? "Keep track of every role you apply to."
              : `${jobs.length} application${jobs.length === 1 ? "" : "s"} tracked.`}
          </p>
        </div>
        <DataControls
          jobs={jobs}
          onImport={setPendingImport}
          onError={(message) => setToast({ message })}
        />
      </div>

      <StatsOverview jobs={jobs} />
      <FollowUpReminders jobs={jobs} />

      {jobs.length > 0 && (
        <JobToolbar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          source={sourceFilter}
          onSourceChange={setSourceFilter}
          sources={sources}
          tag={tagFilter}
          onTagChange={setTagFilter}
          tags={tags}
          sort={sort}
          onSortChange={setSort}
          resultCount={filteredJobs.length}
          totalCount={jobs.length}
          hasFilters={hasFilters}
          onClear={clearFilters}
        />
      )}

      {jobs.length === 0 ? (
        <JobList jobs={[]} onRequestDelete={requestDelete} />
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state__title">
            No applications match your filters.
          </h2>
          <p className="empty-state__text">
            Try a different search term or status.
          </p>
          <button
            type="button"
            className="button button-secondary"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <JobList jobs={filteredJobs} onRequestDelete={requestDelete} />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete application?"
          description={
            <>
              This will remove <strong>{pendingDelete.company}</strong> (
              {pendingDelete.title}) from your tracker.
            </>
          }
          confirmLabel="Delete application"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {pendingImport && (
        <ConfirmDialog
          title="Replace applications?"
          danger={false}
          description={`This will replace your ${jobs.length} current application${
            jobs.length === 1 ? "" : "s"
          } with ${pendingImport.length} imported application${
            pendingImport.length === 1 ? "" : "s"
          }.`}
          confirmLabel="Replace applications"
          onConfirm={confirmImport}
          onCancel={() => setPendingImport(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.undo ? "Undo" : undefined}
          onAction={toast.undo ? undoDelete : undefined}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
}

export default Dashboard;
