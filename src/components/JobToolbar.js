import { STATUSES } from "../constants";

function JobToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  sources,
  tag,
  onTagChange,
  tags,
  sort,
  onSortChange,
  resultCount,
  totalCount,
  hasFilters,
  onClear,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar__fields">
        <div className="form-field">
          <label className="form-label" htmlFor="job-search">
            Search
          </label>
          <input
            id="job-search"
            className="form-input"
            type="search"
            placeholder="Search company or role"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="status-filter">
            Status
          </label>
          <select
            id="status-filter"
            className="form-select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="All">All statuses</option>
            {STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="source-filter">
            Source
          </label>
          <select
            id="source-filter"
            className="form-select"
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
          >
            <option value="All">All sources</option>
            {sources.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="tag-filter">
            Tag
          </label>
          <select
            id="tag-filter"
            className="form-select"
            value={tag}
            onChange={(e) => onTagChange(e.target.value)}
          >
            <option value="All">All tags</option>
            {tags.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="sort-order">
            Sort by
          </label>
          <select
            id="sort-order"
            className="form-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="company">Company A-Z</option>
          </select>
        </div>
      </div>

      <div className="toolbar__summary">
        <span aria-live="polite">
          Showing {resultCount} of {totalCount} application
          {totalCount === 1 ? "" : "s"}
        </span>
        {hasFilters && (
          <button type="button" className="text-button" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

export default JobToolbar;
