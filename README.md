# JobMatch

A job-aggregation and application-assist tool. It pulls postings from **public,
documented** job board APIs, scores them against your resume, and drafts a
starter cover letter — but it never automates the actual "Submit application"
click. That step stays yours, by design: LinkedIn (and most platforms) prohibit
automated applications in their terms of service, and the risk is your account,
not just the automation.

## Architecture

```
React frontend  --REST/JSON-->  Express backend
                                   |-- Job aggregator   (Greenhouse, Lever, Ashby, Workable, Recruitee, Adzuna)
                                   |-- Matching engine  (keyword-overlap scoring, resume vs JD)
                                   |-- Draft generator  (template-based cover letter starter)
                                   '-- Application tracker + JSON file store
```

- **Job aggregator** — calls public, no-auth ATS APIs (Greenhouse Job Board
  API, Lever Postings API, Ashby Posting API, Workable's public widget API,
  Recruitee's public offers API) plus the Adzuna search API (needs free API
  keys) and normalizes results into one schema.
- **Matching engine** — simple, transparent keyword-overlap scorer between your
  resume text and each job's title/description. Swap `services/matcher.js` for
  a smarter model later without changing the API shape.
- **Draft generator** — produces a starter cover letter template per job. Wire
  in a real LLM call here (e.g. the Anthropic API) for genuinely tailored
  drafts; the function signature is already isolated for that swap.
- **Tracker** — a lightweight kanban-style list (saved → drafting → applied →
  interviewing → rejected/offer), backed by a JSON file via `lowdb`. Swap for
  Postgres/SQLite if you need multi-user support.

## Why no LinkedIn / no auto-submit

LinkedIn's Easy Apply is an undocumented, session-based internal flow with
active bot detection — there's no public, sanctioned API for submitting
applications on a user's behalf, and using session-replay tools to fake it
risks account suspension. This app instead leans on ATS platforms
(Greenhouse, Lever) that **intentionally** publish open, documented,
no-auth APIs for their job listings, and leaves the final submission as a
manual, human click — which is also what keeps you clearly within every
platform's terms.

## Running it

### Backend

```bash
cd backend
npm install
npm run dev        # http://localhost:4000
```

Optional: set `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` env vars (free at
https://developer.adzuna.com/) to enable the Adzuna search source.

### Frontend

```bash
cd frontend
npm install
npm run dev         # http://localhost:5173, proxies /api to :4000
```

### Try it

1. Open the **Resume** tab and paste your resume text.
2. Open the **Jobs** tab and enter company slugs for whichever sources you
   want:
   - Greenhouse: the token in `boards.greenhouse.io/<token>` (e.g. `stripe`)
   - Lever: the slug in `jobs.lever.co/<slug>`
   - Ashby: the slug in `jobs.ashbyhq.com/<slug>`
   - Workable: the account slug in `apply.workable.com/<slug>`
   - Recruitee: the subdomain in `<slug>.recruitee.com`

   Then click "Fetch jobs".
3. Jobs are scored against your resume and sorted by match %.
4. Click "Save + draft cover letter" on any job to send it to the **Tracker**,
   where you can edit the draft, move it through stages, and open the real
   posting to apply.

## Extending this

- **Better matching**: replace the keyword scorer in `matcher.js` with an
  embedding-based similarity (e.g. call an embeddings API and compare cosine
  similarity between resume and job description).
- **Real AI-tailored drafts**: replace `draftGenerator.js` with a call to the
  Anthropic Messages API, passing the resume + job description and asking for
  a tailored cover letter.
- **More sources**: Personio (XML feed) is another common one in European
  hiring — add an adapter following the same shape as the others in
  `services/sources/`.
- **Persistence**: swap the `lowdb` JSON file for Postgres if you want
  multi-user accounts or need it to survive across deployments cleanly.
