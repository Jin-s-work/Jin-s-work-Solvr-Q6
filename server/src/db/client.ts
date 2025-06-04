import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { resolve } from 'path';
import env from '../config/env';
import * as schema from './schema';  // ← schema가 있다면 명시해주는 게 좋음

const databaseFile = env.DATABASE_URL
  ? resolve(process.cwd(), env.DATABASE_URL)
  : resolve(process.cwd(), './data/database.sqlite');

const sqlite = new Database(databaseFile);

// drizzle ORM 인스턴스 (스키마 명시 포함 가능)
export const db = drizzle(sqlite, { schema });  // ★ schema 옵션 추가

// 필요 시, db connection 객체도 export
export { sqlite };
