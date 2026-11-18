const STATUS_CLASSES = {
  Applied: "status-applied",
  Interview: "status-interview",
  Offer: "status-offer",
  Rejected: "status-rejected",
};

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${STATUS_CLASSES[status] || ""}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
