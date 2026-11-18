import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { getJobs, saveJobs } from "./utils/storage";

const STORAGE_KEY = "job-application-tracker";

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

const addJob = async ({ company, title, status }) => {
  fireEvent.click(screen.getByRole("link", { name: /add application/i }));
  fireEvent.change(await screen.findByPlaceholderText("Company"), {
    target: { value: company },
  });
  fireEvent.change(screen.getByPlaceholderText("Job Title"), {
    target: { value: title },
  });
  fireEvent.change(screen.getByRole("combobox"), { target: { value: status } });
  fireEvent.click(screen.getByRole("button", { name: /save/i }));
};

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
});

test("edits an existing job application", async () => {
  saveJobs([
    { id: 1, company: "Old Co", title: "Developer", status: "Applied" },
  ]);
  render(<App />);

  fireEvent.click(await screen.findByRole("link", { name: /edit/i }));

  const companyInput = await screen.findByPlaceholderText("Company");
  expect(companyInput).toHaveValue("Old Co");

  fireEvent.change(companyInput, { target: { value: "New Co" } });
  fireEvent.change(screen.getByRole("combobox"), {
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
  });
});

test("deletes a job application", async () => {
  saveJobs([{ id: 1, company: "Acme", title: "Developer", status: "Applied" }]);
  render(<App />);

  fireEvent.click(await screen.findByRole("button", { name: /delete/i }));

  expect(
    await screen.findByText("No job applications yet.")
  ).toBeInTheDocument();
  expect(getJobs()).toHaveLength(0);
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
