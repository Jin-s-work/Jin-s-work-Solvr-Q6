import runMigration from './migrate';
import { db } from './client';  // 이미 drizzle 인스턴스를 export 중
import { Database as DrizzleDatabase } from '../types/database';

let initialized = false;

export async function initializeDatabase() {
  if (!initialized) {
    await runMigration();       // 마이그레이션 실행
    initialized = true;
  }
}

export function getDb(): DrizzleDatabase {
  if (!initialized) {
    throw new Error('Database is not initialized. Call initializeDatabase() first.');
  }
  return db;
}
