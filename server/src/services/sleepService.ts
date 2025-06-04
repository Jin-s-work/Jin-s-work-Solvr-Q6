/**
 * SleepService: Drizzle ORM을 통해 sleeps 테이블에 CRUD를 수행하는 클래스
 */

import { db } from "../db/client";
import { sleeps, NewSleep, UpdateSleep, Sleep } from "../db/schema";

export class SleepService {
  constructor() {
    // 필요한 경우 생성자에서 종속성 주입 등을 할 수 있습니다.
  }

  /**
   * 모든 수면 기록을 날짜 오름차순으로 조회
   */
  async getAll(): Promise<Sleep[]> {
    return await db.select().from(sleeps).orderBy(sleeps.date, "asc");
  }

  /**
   * id에 해당하는 단일 레코드 조회
   */
  async getById(id: number): Promise<Sleep | null> {
    return await db.select().from(sleeps).where(sleeps.id.eq(id)).get();
  }

  /**
   * 새로운 수면 기록 생성
   */
  async create(data: NewSleep): Promise<Sleep> {
    const insertResult = await db.insert(sleeps).values(data).run();
    const newId = insertResult.lastInsertRowid as number;
    const newRecord = await this.getById(newId);
    if (!newRecord) throw new Error("Failed to fetch newly created record.");
    return newRecord;
  }

  /**
   * 기존 수면 기록 수정
   */
  async update(id: number, data: UpdateSleep): Promise<Sleep> {
    // 존재 여부 체크
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("Record not found");
    }
    await db.update(sleeps).set(data).where(sleeps.id.eq(id)).run();
    const updated = await this.getById(id);
    if (!updated) throw new Error("Failed to fetch updated record.");
    return updated;
  }

  /**
   * 수면 기록 삭제
   */
  async delete(id: number): Promise<void> {
    // 존재 여부 체크
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("Record not found");
    }
    await db.delete(sleeps).where(sleeps.id.eq(id)).run();
  }
}

/**
 * 편의 함수: Fastify 라우터에 주입할 때 new SleepService() 형태로 사용
 */
export function createSleepService() {
  return new SleepService();
}

export type SleepServiceType = SleepService;
