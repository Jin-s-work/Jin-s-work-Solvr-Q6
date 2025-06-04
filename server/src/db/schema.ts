import {
  sqliteTable,
  text,
  integer,
  timestamp,
} from "drizzle-orm/sqlite-core";

/**
 * 기존에 있던 users 테이블 스키마 (질문에서 주신 코드 그대로 유지)
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["ADMIN", "USER", "GUEST"] })
    .notNull()
    .default("USER"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * 새로 추가하는 sleeps 테이블 스키마
 * - date: ISO 날짜 문자열 ("YYYY-MM-DD")
 * - sleepStart: 시작 시간 ("HH:mm")
 * - sleepEnd: 종료 시간 ("HH:mm")
 * - note: 특이사항 (기본값 "")
 * - createdAt/updatedAt: ISO timestamp
 */
export const sleeps = sqliteTable("sleeps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  sleepStart: text("sleep_start").notNull(),
  sleepEnd: text("sleep_end").notNull(),
  note: text("note").notNull().default(""),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * 서비스 레이어에서 사용할 타입 추론용
 */
export type Sleep = typeof sleeps.$inferSelect;
export type NewSleep = typeof sleeps.$inferInsert;
export type UpdateSleep = Partial<Omit<NewSleep, "id" | "createdAt">>;
