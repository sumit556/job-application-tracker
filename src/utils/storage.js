import { STATUSES, WORK_MODES } from "../constants";
import { todayISO, toISODate } from "./dates";

const KEY = "job-application-tracker";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const asString = (value) => (typeof value === "string" ? value : "");

const normalizeTags = (value) => {
  const list = Array.isArray(value)
    ? value
    : typeof value === "string"
    ? value.split(/[,;]/)
    : [];
  const seen = new Set();

  return list
    .map((tag) => asString(tag).trim())
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const normalizeActivity = (value) =>
  Array.isArray(value)
    ? value
        .filter(
          (item) =>
            item &&
            typeof item === "object" &&
            typeof item.at === "string" &&
            typeof item.message === "string"
        )
        .map((item, index) => ({
          id:
            typeof item.id === "string" || typeof item.id === "number"
              ? item.id
              : `${item.at}-${index}`,
          at: item.at,
          message: item.message,
        }))
    : [];

const dateFromId = (id) => {
  const timestamp = Number(id);

  if (Number.isFinite(timestamp)) {
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime()) && date.getFullYear() >= 2000) {
      return toISODate(date);
    }
  }

  return todayISO();
};

const migrateJob = (job) => {
  if (!job || typeof job !== "object") return null;

  return {
    ...job,
    company: asString(job.company),
    title: asString(job.title),
    status: STATUSES.includes(job.status) ? job.status : "Applied",
    appliedDate: DATE_PATTERN.test(job.appliedDate)
      ? job.appliedDate
      : dateFromId(job.id),
    followUpDate: DATE_PATTERN.test(job.followUpDate) ? job.followUpDate : "",
    location: asString(job.location),
    workMode: WORK_MODES.includes(job.workMode) ? job.workMode : "",
    jobUrl: asString(job.jobUrl),
    salary: asString(job.salary),
    source: asString(job.source).trim(),
    tags: normalizeTags(job.tags),
    notes: asString(job.notes),
    activity: normalizeActivity(job.activity),
  };
};

export const normalizeJobs = (jobs) =>
  jobs.map(migrateJob).filter(Boolean);

export const getJobs = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(stored) ? normalizeJobs(stored) : [];
  } catch {
    return [];
  }
};

export const saveJobs = (jobs) => {
  localStorage.setItem(KEY, JSON.stringify(normalizeJobs(jobs)));
};
