const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const truncate = (value, length) =>
  value.length > length ? `${value.slice(0, length).trim()}...` : value;

export const createActivity = (message) => ({
  id: makeId(),
  at: new Date().toISOString(),
  message,
});

export const createdActivity = (status) =>
  createActivity(`Application added with status ${status}.`);

export const notesActivity = (notes, verb = "updated") => {
  const value = (notes || "").trim().replace(/\s+/g, " ");

  return createActivity(
    value ? `Notes ${verb}: "${truncate(value, 80)}"` : "Notes cleared."
  );
};

export const buildActivityChanges = (previous, next) => {
  const entries = [];

  if (previous.status !== next.status) {
    entries.push(
      createActivity(
        `Status changed from ${previous.status} to ${next.status}.`
      )
    );
  }

  if ((previous.notes || "") !== (next.notes || "")) {
    entries.push(notesActivity(next.notes));
  }

  return entries;
};
