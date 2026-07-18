import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, '..', '..', 'data', 'db.json');

const defaultData = {
  resume: null,       // { text, skills: [], updatedAt }
  jobs: [],            // cached aggregated job postings
  applications: []      // { id, jobId, status, matchScore, notes, createdAt, updatedAt }
};

const adapter = new JSONFile(dbFile);
const db = new Low(adapter, defaultData);

export async function getDb() {
  await db.read();
  db.data ||= structuredClone(defaultData);
  return db;
}

export async function saveDb() {
  await db.write();
}
