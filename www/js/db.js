import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);

let db = null;

export async function initDatabase() {
try {
db = await sqlite.createConnection(
'forest.db',
false,
'no-encryption',
1,
false
);

await db.open();

await db.execute(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_time TEXT,
    temperature REAL,
    wind_speed REAL,
    weather TEXT,
    people_helped INTEGER,
    guard_location TEXT,
    id_user TEXT,
    full_name TEXT,
    sync_status INTEGER DEFAULT 0
  );
`);

console.log('SQLite berhasil dibuat');
return true;

} catch (err) {
console.error('Gagal membuat SQLite', err);
return false;
}
}

export function getDatabase() {
return db;
}