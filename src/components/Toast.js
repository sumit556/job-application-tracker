function Toast({ message, actionLabel, onAction, onDismiss }) {
  return (
    <div className="toast" role="status">
      <span className="toast__message">{message}</span>
      {actionLabel && (
        <button type="button" className="toast__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
      <button
        type="button"
        className="toast__close"
        aria-label="Dismiss notification"
        onClick={onDismiss}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
