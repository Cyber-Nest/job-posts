import fs from 'fs';
import path from 'path';
import { createConnection } from 'mysql2/promise';

const rootDir = process.cwd();
const envPath = path.join(rootDir, '.env');

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key] = rest.join('=').trim();
  }
  return env;
}

const env = fs.existsSync(envPath) ? parseEnvFile(envPath) : {};
const rawUrl = process.env.DATABASE_URL || env.DATABASE_URL;

let host = process.env.DB_HOST || env.DB_HOST || '127.0.0.1';
let port = process.env.DB_PORT || env.DB_PORT || '3306';
let user = process.env.DB_USER || env.DB_USER || 'root';
let password = process.env.DB_PASS || env.DB_PASS || '';
let database = process.env.DB_NAME || env.DB_NAME || 'youthemployment_canada';

if (rawUrl) {
  try {
    const normalized = rawUrl.replace(/^mysql2:|^mysql:/, 'mysql:');
    const url = new URL(normalized);
    host = url.hostname || host;
    port = url.port || port;
    user = url.username || user;
    password = url.password || password;
    const pathname = url.pathname || '';
    if (pathname && pathname !== '/') {
      database = pathname.replace(/^\//, '');
    }
  } catch (error) {
    console.warn('Warning: failed to parse DATABASE_URL. Falling back to DB_HOST/DB_NAME values.');
  }
}

console.log('Resetting local MySQL database with:');
console.log(`  host=${host}`);
console.log(`  port=${port}`);
console.log(`  user=${user}`);
console.log(`  database=${database}`);

const connection = await createConnection({
  host,
  port: Number(port),
  user,
  password,
  multipleStatements: true,
});

try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.query(`USE \`${database}\`;`);

  const [tables] = await connection.query(
    `SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE';`,
    [database]
  );

  const tableNames = tables.map((row) => row.TABLE_NAME || row.table_name || row.Table_name).filter(Boolean);

  if (tableNames.length === 0) {
    console.log('No tables found in database. Nothing to drop.');
  } else {
    console.log(`Dropping ${tableNames.length} table(s) from ${database}...`);
    const dropSql = tableNames
      .map((table) => `\`${table}\``)
      .join(', ');
    await connection.query(`SET FOREIGN_KEY_CHECKS=0; DROP TABLE IF EXISTS ${dropSql}; SET FOREIGN_KEY_CHECKS=1;`);
    console.log('All tables dropped successfully.');
  }

  console.log('\nLocal database reset complete.');
  console.log('Next step: run `npm run db:push` to recreate tables.');
} catch (error) {
  console.error('Error resetting local database:');
  console.error(error);
  process.exit(1);
} finally {
  await connection.end();
}
