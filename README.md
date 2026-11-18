# Job Application Tracker

A single-page React app for keeping track of job applications. Add an application, update its status, edit details, and delete entries you no longer need. All data is stored in the browser with `localStorage`, so there is no account, backend, or database to set up.

## Problem

Job searching usually means juggling a spreadsheet, bookmarks, and scattered notes. This project is a small, focused tracker that answers one question quickly: **which companies have I applied to, and where does each application stand?**

It is intentionally a client-only app: open it, add applications, and the data stays in your browser.

## Features

Implemented:

- Add a job application with company, job title, and status
- Edit an existing application (the form is pre-filled)
- Delete an application
- Track status with four values: `Applied`, `Interview`, `Offer`, `Rejected`
- Color-coded status badges in the application list
- Responsive layout with a shared header on every page
- Persist applications in `localStorage` across page reloads
- Empty state when there are no applications
- Not-found message for an invalid `/edit/:id` URL
- Client-side routing with React Router

Not implemented (see [Tradeoffs](#tradeoffs-and-limitations)):

- Search, filtering, or sorting
- Charts, statistics, or a real analytics dashboard
- Authentication or multi-user support
- Backend API or database
- Notes, dates, reminders, or file uploads

## Screenshots

No screenshots are committed to the repository yet. Add images under `docs/screenshots/` and replace this section with a table such as:

| Dashboard | Add application |
| --- | --- |
| _placeholder_ | _placeholder_ |

## Tech stack

- **React 19** with function components and hooks (`useState`, `useEffect`)
- **React Router DOM 7** for client-side routing
- **Create React App** (`react-scripts 5`) for development and production builds
- **Jest + React Testing Library** for tests
- **Plain CSS with custom properties** for styling (single `src/App.css`)
- **Browser `localStorage`** for persistence

No backend, database, API, state-management library, or charting library is used.

## Architecture

The app is a client-side SPA. `src/index.js` mounts `App`, which owns the router. Each route is a page, and pages compose the shared form/list components. Storage access is isolated in a small utility module.

```text
src/index.js
  -> App.js (BrowserRouter)
       -> Header (app shell, visible on every route)
       -> /          Dashboard
       -> /add       AddJob
       -> /edit/:id  EditJob

Dashboard -> JobList -> StatusBadge
AddJob    -> JobForm -> saveJobs()
EditJob   -> JobForm -> saveJobs()

All pages read/write through src/utils/storage.js
  -> localStorage key: "job-application-tracker"
```

### Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `Dashboard` | Lists applications, links to add/edit, handles delete |
| `/add` | `AddJob` | Renders an empty form and appends a new application |
| `/edit/:id` | `EditJob` | Loads an application by id and updates it |

### Data model

```js
{
  id: number,
  company: string,
  title: string,
  status: "Applied" | "Interview" | "Offer" | "Rejected"
}
```

`id` is generated with `Date.now()` when an application is created. The full array is serialized as JSON under the `job-application-tracker` key in `localStorage`.

### Project structure

```text
public/
  favicon.svg
  index.html
  manifest.json
src/
  App.css                # Design tokens and all component styles
  App.js                 # Router, header, and route definitions
  App.test.js            # Integration tests
  components/
    Header.js            # App shell header and add-application link
    JobForm.js           # Shared create/edit form
    JobList.js           # Application list and delete action
    StatusBadge.js       # Color-coded status pill
  pages/
    Dashboard.js         # List page
    AddJob.js            # Create page
    EditJob.js           # Edit page
  utils/
    storage.js           # localStorage read/write
  index.js               # React entry point
  setupTests.js          # Testing Library and polyfills
```

## Getting started

### Prerequisites

- Node.js 20 or newer (required by React Router 7)
- npm

### Install and run

```bash
npm install
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Test

```bash
npm test -- --watchAll=false
```

### Production build

```bash
npm run build
```

The static build is written to `build/`.

## Live demo

There is no live deployment yet, and the repository does not contain hosting configuration. To deploy, build the app with `npm run build` and host the `build/` folder on any static host, with unknown paths rewritten to `index.html` so client-side routes work.

## Testing

`src/App.test.js` contains six integration tests that render the real app and exercise it through the UI:

1. Empty state with no applications
2. Adding an application and returning to the dashboard
3. Editing an existing application
4. Deleting an application
5. Persisting applications in `localStorage` across a remount
6. Invalid application id on the edit route

Because this project uses Create React App's Jest 27 with React Router 7, the test setup includes two compatibility shims:

- `package.json` maps `react-router-dom`, `react-router`, and `react-router/dom` to their CommonJS builds via Jest `moduleNameMapper`.
- `src/setupTests.js` polyfills `TextEncoder` and `TextDecoder`, which React Router 7 expects and the Jest jsdom environment does not provide.

## Tradeoffs and limitations

- **Browser-only persistence.** Data lives in one browser's `localStorage`. It is not synced across devices and is lost if browser data is cleared.
- **Single user.** There is no authentication, user model, or authorization.
- **No backend.** All logic runs in the client; there is no API or database.
- **Minimal data model.** Only company, title, and status are stored. There are no dates, notes, URLs, or attachments.
- **No search, filtering, sorting, or dashboard metrics.** The page named `Dashboard` is a list view, not an analytics dashboard.
- **Simple identifiers.** `Date.now()` is adequate for a single-user demo but is not a robust ID strategy.
- **No delete confirmation or undo.** Deleting removes the entry immediately.
- **Styling is a single hand-written CSS file.** There is no design system, component library, or theming.
- **Older tooling.** Create React App is in maintenance mode; the Router 7 test shims exist because of the combination of CRA's Jest 27 and React Router 7.

## What I'd do next

- Add search, status filtering, and sorting by company or date
- Turn the dashboard into a real overview with application counts, response rate, and charts
- Add applied/follow-up dates and reminders
- Add a backend API and database, then scope applications to authenticated users
- Migrate to TypeScript and Vite, with Vitest for tests
- Add end-to-end tests and a CI workflow that runs lint, tests, and the production build
- Improve the UI with a responsive layout, accessible form controls, and loading/error states
- Support JSON import/export for backups
