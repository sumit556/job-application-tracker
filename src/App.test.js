import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";
import { getJobs, saveJobs } from "./utils/storage";

const STORAGE_KEY = "job-application-tracker";

const makeJob = (overrides = {}) => ({
  id: 1,
  company: "Acme",
  title: "Engineer",
  status: "Applied",
  appliedDate: "2026-01-15",
  followUpDate: "",
  ...overrides,
});

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

const addJob = async ({
  company,
  title,
  status,
  location,
  workMode,
  salary,
  jobUrl,
  source,
  tags,
  notes,
}) => {
  fireEvent.click(screen.getByRole("link", { name: /add application/i }));
  fireEvent.change(await screen.findByPlaceholderText("Company"), {
    target: { value: company },
  });
  fireEvent.change(screen.getByPlaceholderText("Job Title"), {
    target: { value: title },
  });
  fireEvent.change(screen.getByLabelText(/^status$/i), {
    target: { value: status },
  });

  if (location !== undefined) {
    fireEvent.change(screen.getByLabelText(/^location$/i), {
      target: { value: location },
    });
  }
  if (workMode !== undefined) {
    fireEvent.change(screen.getByLabelText(/^work mode$/i), {
      target: { value: workMode },
    });
  }
  if (salary !== undefined) {
    fireEvent.change(screen.getByLabelText(/^salary$/i), {
      target: { value: salary },
    });
  }
  if (jobUrl !== undefined) {
    fireEvent.change(screen.getByLabelText(/^job posting url$/i), {
      target: { value: jobUrl },
    });
  }
  if (source !== undefined) {
    fireEvent.change(screen.getByLabelText(/^source$/i), {
      target: { value: source },
    });
  }
  if (tags !== undefined) {
    fireEvent.change(screen.getByLabelText(/^tags$/i), {
      target: { value: tags },
    });
  }
  if (notes !== undefined) {
    fireEvent.change(screen.getByLabelText(/^notes$/i), {
      target: { value: notes },
    });
  }

  fireEvent.click(screen.getByRole("button", { name: /save/i }));
};

const jobHeadings = (names) =>
  screen
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent)
    .filter((text) => names.includes(text));

test("shows an empty state when there are no applications", () => {
  render(<App />);

  expect(screen.getByText("No job applications yet.")).toBeInTheDocument();
});

test("adds a job application and returns to the dashboard", async () => {
  render(<App />);

  await addJob({ company: "Acme", title: "Engineer", status: "Interview" });

  expect(
    await screen.findByRole("heading", { name: "Acme" })
  ).toBeInTheDocument();
  expect(getJobs()).toHaveLength(1);
  expect(getJobs()[0]).toMatchObject({
    company: "Acme",
    title: "Engineer",
    status: "Interview",
  });
  expect(getJobs()[0].appliedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test("edits an existing job application", async () => {
  saveJobs([makeJob({ company: "Old Co", title: "Developer" })]);
  render(<App />);

  fireEvent.click(await screen.findByRole("link", { name: /edit/i }));

  const companyInput = await screen.findByPlaceholderText("Company");
  expect(companyInput).toHaveValue("Old Co");

  fireEvent.change(companyInput, { target: { value: "New Co" } });
  fireEvent.change(screen.getByLabelText(/^status$/i), {
    target: { value: "Interview" },
  });
  fireEvent.click(screen.getByRole("button", { name: /save/i }));

  expect(
    await screen.findByRole("heading", { name: "New Co" })
  ).toBeInTheDocument();
  expect(getJobs()[0]).toMatchObject({
    company: "New Co",
    title: "Developer",
    status: "Interview",
    appliedDate: "2026-01-15",
  });
});

test("filters applications by search and status", async () => {
  saveJobs([
    makeJob({
      id: 1,
      company: "Alpha",
      title: "Frontend Engineer",
      status: "Applied",
      appliedDate: "2026-01-01",
    }),
    makeJob({
      id: 2,
      company: "Beta",
      title: "Backend Engineer",
      status: "Interview",
      appliedDate: "2026-02-01",
    }),
  ]);
  render(<App />);

  expect(
    await screen.findByRole("heading", { name: "Alpha" })
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/search/i), {
    target: { value: "beta" },
  });

  expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "Alpha" })
  ).not.toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/search/i), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByLabelText(/^status$/i), {
    target: { value: "Applied" },
  });

  expect(screen.getByRole("heading", { name: "Alpha" })).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "Beta" })
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /clear filters/i }));

  expect(screen.getByRole("heading", { name: "Alpha" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument();
});

test("sorts applications by date and company", async () => {
  saveJobs([
    makeJob({
      id: 1,
      company: "Alpha",
      appliedDate: "2026-01-01",
      status: "Applied",
    }),
    makeJob({
      id: 2,
      company: "Beta",
      appliedDate: "2026-03-01",
      status: "Applied",
    }),
  ]);
  render(<App />);

  await screen.findByRole("heading", { name: "Alpha" });
  expect(jobHeadings(["Alpha", "Beta"])).toEqual(["Beta", "Alpha"]);

  fireEvent.change(screen.getByLabelText(/sort by/i), {
    target: { value: "company" },
  });

  expect(jobHeadings(["Alpha", "Beta"])).toEqual(["Alpha", "Beta"]);
});

test("shows real status counts and rates", async () => {
  saveJobs([
    makeJob({ id: 1, company: "One", status: "Applied" }),
    makeJob({ id: 2, company: "Two", status: "Interview" }),
    makeJob({ id: 3, company: "Three", status: "Offer" }),
    makeJob({ id: 4, company: "Four", status: "Rejected" }),
  ]);
  render(<App />);

  const overview = await screen.findByRole("region", { name: /overview/i });

  expect(within(overview).getByText("Total")).toBeInTheDocument();
  expect(within(overview).getByText("4")).toBeInTheDocument();
  expect(within(overview).getByText("Response rate")).toBeInTheDocument();
  expect(within(overview).getByText("75%")).toBeInTheDocument();
  expect(within(overview).getByText("Offer rate")).toBeInTheDocument();
  expect(within(overview).getByText("25%")).toBeInTheDocument();
  expect(within(overview).getByText("In progress")).toBeInTheDocument();
  expect(within(overview).getByText("2")).toBeInTheDocument();
});

test("migrates legacy records and surfaces overdue follow-ups", async () => {
  saveJobs([
    {
      id: Date.now(),
      company: "Legacy Co",
      title: "Analyst",
      status: "Applied",
      followUpDate: "2000-01-01",
    },
  ]);

  const [migrated] = getJobs();
  expect(migrated.appliedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(migrated.followUpDate).toBe("2000-01-01");

  render(<App />);

  const reminders = await screen.findByRole("region", {
    name: /follow-ups/i,
  });

  expect(within(reminders).getByText("Legacy Co")).toBeInTheDocument();
  expect(within(reminders).getByText(/overdue/i)).toBeInTheDocument();
});

test("confirms before deleting and supports undo", async () => {
  saveJobs([makeJob()]);
  render(<App />);

  fireEvent.click(await screen.findByRole("button", { name: /^delete$/i }));

  const dialog = await screen.findByRole("dialog");
  expect(dialog).toHaveTextContent("Delete application?");

  fireEvent.click(within(dialog).getByRole("button", { name: /cancel/i }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(getJobs()).toHaveLength(1);

  fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
  fireEvent.click(
    await screen.findByRole("button", { name: /delete application/i })
  );

  expect(
    await screen.findByText("No job applications yet.")
  ).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Application deleted.");
  expect(getJobs()).toHaveLength(0);

  fireEvent.click(screen.getByRole("button", { name: /undo/i }));

  expect(
    await screen.findByRole("heading", { name: "Acme" })
  ).toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(getJobs()).toHaveLength(1);
});

test("persists applications in localStorage across reloads", async () => {
  const { unmount } = render(<App />);

  await addJob({ company: "Persisted Co", title: "Tester", status: "Offer" });
  expect(
    await screen.findByRole("heading", { name: "Persisted Co" })
  ).toBeInTheDocument();

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  expect(stored).toHaveLength(1);
  expect(stored[0]).toMatchObject({ company: "Persisted Co" });

  unmount();
  render(<App />);

  expect(
    await screen.findByRole("heading", { name: "Persisted Co" })
  ).toBeInTheDocument();
});

test("shows a not-found message for an unknown job id", async () => {
  window.history.pushState({}, "", "/edit/999");
  render(<App />);

  expect(
    await screen.findByText("Job application not found.")
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /back to dashboard/i })
  ).toHaveAttribute("href", "/");
});

test("saves additional job details", async () => {
  render(<App />);

  await addJob({
    company: "Detail Co",
    title: "Product Manager",
    status: "Interview",
    location: "London",
    workMode: "Hybrid",
    salary: "£80,000",
    jobUrl: "https://example.com/job",
    notes: "Met at a meetup.",
  });

  expect(
    await screen.findByRole("heading", { name: "Detail Co" })
  ).toBeInTheDocument();
  expect(getJobs()[0]).toMatchObject({
    company: "Detail Co",
    title: "Product Manager",
    status: "Interview",
    location: "London",
    workMode: "Hybrid",
    salary: "£80,000",
    jobUrl: "https://example.com/job",
    notes: "Met at a meetup.",
  });
  expect(screen.getByText("London")).toBeInTheDocument();
  expect(screen.getByText("Hybrid")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view posting/i })).toHaveAttribute(
    "href",
    "https://example.com/job"
  );
});

test("imports a JSON backup after confirmation", async () => {
  render(<App />);

  const backup = [
    {
      company: "Imported Co",
      title: "Designer",
      status: "Interview",
      appliedDate: "2026-05-01",
      location: "Berlin",
      workMode: "Remote",
      salary: "€70,000",
      jobUrl: "https://example.com/role",
      source: "LinkedIn",
      tags: ["Remote-friendly", "Dream role"],
      notes: "Referred by Ana.",
      activity: [
        {
          id: "imported-1",
          at: "2026-05-02T10:30:00.000Z",
          message: "Application added with status Interview.",
        },
      ],
    },
  ];
  const file = new File([JSON.stringify(backup)], "backup.json", {
    type: "application/json",
  });

  fireEvent.change(screen.getByLabelText(/import json file/i), {
    target: { files: [file] },
  });

  const dialog = await screen.findByRole("dialog");
  expect(dialog).toHaveTextContent(/replace applications/i);

  fireEvent.click(
    within(dialog).getByRole("button", { name: /replace applications/i })
  );

  expect(
    await screen.findByRole("heading", { name: "Imported Co" })
  ).toBeInTheDocument();
  expect(getJobs()).toHaveLength(1);
  expect(getJobs()[0]).toMatchObject({
    company: "Imported Co",
    status: "Interview",
    location: "Berlin",
    workMode: "Remote",
    source: "LinkedIn",
    tags: ["Remote-friendly", "Dream role"],
    notes: "Referred by Ana.",
  });
  expect(getJobs()[0].activity).toHaveLength(1);
  expect(screen.getByRole("status")).toHaveTextContent(
    "Imported 1 application."
  );
});

test("toggles the theme and persists the choice", () => {
  render(<App />);

  const initialTheme = localStorage.getItem("job-application-tracker-theme");
  expect(["light", "dark"]).toContain(initialTheme);

  fireEvent.click(
    screen.getByRole("button", { name: /switch to (dark|light) mode/i })
  );

  const toggledTheme = localStorage.getItem("job-application-tracker-theme");
  expect(toggledTheme).not.toBe(initialTheme);
  expect(["light", "dark"]).toContain(toggledTheme);
});

test("logs status changes and notes in an activity timeline", async () => {
  render(<App />);

  await addJob({
    company: "Timeline Co",
    title: "Engineer",
    status: "Applied",
    notes: "First note",
  });

  expect(
    await screen.findByRole("heading", { name: "Timeline Co" })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("link", { name: /edit/i }));
  await screen.findByPlaceholderText("Company");

  fireEvent.change(screen.getByLabelText(/^status$/i), {
    target: { value: "Interview" },
  });
  fireEvent.change(screen.getByLabelText(/^notes$/i), {
    target: { value: "Second note" },
  });
  fireEvent.click(screen.getByRole("button", { name: /save/i }));

  expect(
    await screen.findByRole("heading", { name: "Timeline Co" })
  ).toBeInTheDocument();

  const [job] = getJobs();
  expect(job.activity.map((entry) => entry.message)).toEqual([
    "Application added with status Applied.",
    'Notes added: "First note"',
    "Status changed from Applied to Interview.",
    'Notes updated: "Second note"',
  ]);
  job.activity.forEach((entry) => {
    expect(entry.at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  expect(screen.getByText("Activity (4)")).toBeInTheDocument();
  expect(
    screen.getByText("Status changed from Applied to Interview.")
  ).toBeInTheDocument();
});

test("filters applications by source and tag", async () => {
  saveJobs([
    makeJob({
      id: 1,
      company: "Alpha",
      source: "LinkedIn",
      tags: ["Startup", "Dream role"],
    }),
    makeJob({
      id: 2,
      company: "Beta",
      source: "Referral",
      tags: ["Remote-friendly"],
    }),
  ]);
  render(<App />);

  expect(
    await screen.findByRole("heading", { name: "Alpha" })
  ).toBeInTheDocument();
  expect(screen.getByText("Source: LinkedIn")).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/^source$/i), {
    target: { value: "Referral" },
  });

  expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "Alpha" })
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /clear filters/i }));
  fireEvent.change(screen.getByLabelText(/^tag$/i), {
    target: { value: "Startup" },
  });

  expect(screen.getByRole("heading", { name: "Alpha" })).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "Beta" })
  ).not.toBeInTheDocument();
});

test("warns when company and title already exist", async () => {
  saveJobs([makeJob({ company: "Acme", title: "Engineer" })]);
  render(<App />);

  fireEvent.click(
    await screen.findByRole("link", { name: /add application/i })
  );
  fireEvent.change(await screen.findByPlaceholderText("Company"), {
    target: { value: "acme" },
  });
  fireEvent.change(screen.getByPlaceholderText("Job Title"), {
    target: { value: "engineer" },
  });

  expect(await screen.findByRole("status")).toHaveTextContent(
    /already exists/i
  );
});
