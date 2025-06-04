import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { sleeps, NewSleep, UpdateSleep, Sleep } from "../db/schema";

export class SleepService {
  constructor() {}

  async getAll(): Promise<Sleep[]> {
    return await db.select().from(sleeps).orderBy(sleeps.date, "asc");
  }

  async getById(id: number): Promise<Sleep | null> {
    const result = await db.select().from(sleeps).where(eq(sleeps.id, id));
    return result[0] ?? null;
  }

  async create(data: NewSleep): Promise<Sleep> {
    const insertResult = await db.insert(sleeps).values(data).run();
    const newId = insertResult.lastInsertRowid as number;
    const newRecord = await this.getById(newId);
    if (!newRecord) throw new Error("Failed to fetch newly created record.");
    return newRecord;
  }

  async update(id: number, data: UpdateSleep): Promise<Sleep> {
    const existing = await this.getById(id);
    if (!existing) throw new Error("Record not found");
    await db.update(sleeps).set(data).where(eq(sleeps.id, id)).run();
    const updated = await this.getById(id);
    if (!updated) throw new Error("Failed to fetch updated record.");
    return updated;
  }

  async delete(id: number): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) throw new Error("Record not found");
    await db.delete(sleeps).where(eq(sleeps.id, id)).run();
  }
}

export function createSleepService() {
  return new SleepService();
}

export type SleepServiceType = SleepService;
