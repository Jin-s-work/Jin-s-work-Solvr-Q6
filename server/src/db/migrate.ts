// server/src/db/migrate.ts

import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { mkdir } from "fs/promises";
import { dirname } from "path";
import env from "../config/env";
import { users } from "./schema";
import { UserRole } from "../types";
import { sleeps, NewSleep } from "./schema"; // ★ 추가

// 데이터베이스 디렉토리 생성 함수 (기존 코드)
async function ensureDatabaseDirectory() {
  const dir = dirname(env.DATABASE_URL);
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

// 초기 사용자 데이터 (기존 코드)
const initialUsers = [
  { name: "관리자", email: "admin@example.com", role: UserRole.ADMIN, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: "일반 사용자", email: "user@example.com", role: UserRole.USER, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { name: "게스트", email: "guest@example.com", role: UserRole.GUEST, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// 더미 수면 기록 데이터를 생성하는 헬퍼 함수
function generateDummySleeps(): NewSleep[] {
  const dummy: NewSleep[] = [];
  // 오늘부터 14일 전까지
  for (let i = 14; i >= 1; i--) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - i);
    const yyyy = dateObj.toISOString().split("T")[0]; // "YYYY-MM-DD"
    // 랜덤 수면 시작: 오후 22시~익일 1시 사이
    const startHour = 22 + Math.floor(Math.random() * 3); // 22,23,24 인덱스 24은 실제 00시
    const startMin = Math.floor(Math.random() * 60);
    const sleep_start = `${(startHour % 24).toString().padStart(2, "0")}:${startMin.toString().padStart(2, "0")}`;
    // 랜덤 수면 종료: 오전 6시~9시 사이
    const endHour = 6 + Math.floor(Math.random() * 4); // 6,7,8,9
    const endMin = Math.floor(Math.random() * 60);
    const sleep_end = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;
    const note = ["", "딴생각이 많았음", "코골이 심함", "기상 악몽", "숙면"].sort(() => 0.5 - Math.random())[0];
    dummy.push({
      date: yyyy,
      sleep_start,
      sleep_end,
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return dummy;
}

async function runMigration() {
  try {
    // 1) DB 디렉토리 생성
    await ensureDatabaseDirectory();

    // 2) DB 연결
    const sqlite = new Database(env.DATABASE_URL);
    const db = drizzle(sqlite);

    // 3) users 테이블 생성 (기존)
    console.log("users 테이블 생성 중...");
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'USER',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // 4) 초기 사용자 데이터 삽입 (기존)
    console.log("초기 사용자 데이터 삽입 중...");
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      for (const user of initialUsers) {
        await db.insert(users).values(user);
      }
      console.log(`${initialUsers.length}명의 사용자가 추가되었습니다.`);
    } else {
      console.log("사용자 데이터가 이미 존재합니다. 초기 데이터 삽입을 건너뜁니다.");
    }

    // 5) sleeps 테이블 생성 (기존)
    console.log("sleeps 테이블 생성 중...");
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sleeps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        sleep_start TEXT NOT NULL,
        sleep_end TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // 6) 더미 수면 기록 삽입 (추가)
    console.log("더미 수면 기록이 있는지 확인 중...");
    const existingSleeps = await db.select().from(sleeps);
    if (existingSleeps.length === 0) {
      console.log("🛌 더미 수면 기록 데이터 삽입 중...");
      const dummyRecords = generateDummySleeps();
      for (const rec of dummyRecords) {
        await db.insert(sleeps).values(rec);
      }
      console.log(`${dummyRecords.length}개의 더미 수면 기록이 삽입되었습니다.`);
    } else {
      console.log("기존 수면 데이터가 이미 존재합니다. 더미 데이터 삽입 건너뜁니다.");
    }

    console.log("데이터베이스 마이그레이션이 완료되었습니다.");
  } catch (error) {
    console.error("데이터베이스 마이그레이션 중 오류가 발생했습니다:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigration();
}

export default runMigration;
