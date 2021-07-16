const Database = require("better-sqlite3");
const path = require("path");
const os = require("os");
const mkdirp = require("mkdirp");
const { chain } = require("lodash");

const envPaths = require("env-paths");
const DATA_PATH = envPaths("alfred-infinite-clipboard").data;

mkdirp(DATA_PATH);

// > ts is the timestamp column, this is in seconds since reference date (00:00:00 UTC on 1 January 2001).
// -- https://www.alfredforum.com/topic/9802-any-way-to-search-clipboard-history-by-date/
const REF_DATE = new Date(Date.UTC(2001, 0, 1)).getTime();

const alfredDB = new Database(
  path.join(
    os.homedir(),
    "/Library/Application Support/Alfred/Databases/clipboard.alfdb"
  ),
  { readonly: true }
);

const infiniteClipboardDB = new Database(path.join(DATA_PATH, "clipboard.db"));

infiniteClipboardDB
  .prepare(
    `
      CREATE TABLE IF NOT EXISTS clipboard (
        item TEXT,
        ts DECIMAL,
        app TEXT,
        apppath TEXT,
        UNIQUE(item, ts, app, apppath)
      )
    `
  )
  .run();

const backup = () => {
  const data = alfredDB.prepare(`SELECT * FROM clipboard`).all();

  const insert = infiniteClipboardDB.prepare(`
    INSERT OR REPLACE INTO clipboard(item, ts, app, apppath)
    VALUES (:item, :ts, :app, :apppath)
  `);

  const batchInsert = infiniteClipboardDB.transaction((data) => {
    data.forEach((d) => insert.run(d));
  });

  batchInsert(data);
};

const search = (term = "", limit = 0) => {
  term = String(term);

  const searchSQL = `
    SELECT * FROM clipboard
    ${term.length > 0 ? "WHERE item LIKE :term" : ""}
    ORDER BY ts DESC
    ${limit > 0 ? `LIMIT ${limit}` : ""}
  `;

  let results = chain([alfredDB, infiniteClipboardDB])
    .flatMap((db) => db.prepare(searchSQL).all({ term: `%${term}%` }))
    .map((d) => ({
      ...d,
      item: d.item.trim(),
      ts: d.ts * 1000 + REF_DATE,
    }))
    .uniqBy((d) => [d.item, d.app, d.ts].join("-"));

  if (limit > 0) {
    results = results.slice(0, limit);
  }

  results = results.value();

  return results;
};

module.exports = { backup, search };
