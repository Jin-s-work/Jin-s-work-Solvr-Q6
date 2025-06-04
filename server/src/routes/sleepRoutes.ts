import { FastifyPluginAsync } from "fastify";
import { AppContext } from "../types/context";

interface SleepBody {
    date: string;
    sleep_start: string;
    sleep_end: string;
    note?: string;
  }
  
/**
 * sleepRoutes: Fastify 플러그인 함수
 * : Fastify.register(sleepRoutes, { prefix: "/api/sleeps" });
 */
export const sleepRoutes: FastifyPluginAsync<{
  context: AppContext;
}> = async (fastify, opts) => {
  const { sleepService } = opts.context;

  // 1) GET /             → 전체 수면 기록 조회
  fastify.get("/", async (request, reply) => {
    try {
      const data = await sleepService.getAll();
      return data;
    } catch (err) {
      request.log.error(err);
      reply.status(500).send({ message: "Server Error" });
    }
  });

  // 2) GET /:id          → 특정 ID의 기록 조회
  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    try {
      const record = await sleepService.getById(id);
      if (!record) {
        reply.status(404).send({ message: "Record not found" });
        return;
      }
      return record;
    } catch (err) {
      request.log.error(err);
      reply.status(500).send({ message: "Server Error" });
    }
  });

  // 3) POST /            → 새로운 기록 생성
  fastify.post<{ Body: SleepBody }>("/", async (request, reply) => {
    const { date, sleepStart, sleepEnd, note } = request.body;
  
    if (!date || !sleepStart || !sleepEnd) {
      reply.status(400).send({ message: "Required: date, sleepStart, sleepEnd" });
      return;
    }
  
    try {
      const newRecord = await sleepService.create({
        date,
        sleep_start: sleepStart, // ✅ 여기
        sleep_end: sleepEnd,     // ✅ 여기
        note: note || "",
      } as any); // NewSleep 타입은 snake_case 기준이기 때문에 as any 또는 매핑 필요
      reply.status(201).send(newRecord);
    } catch (err) {
      request.log.error(err);
      reply.status(500).send({ message: "Server Error" });
    }
  });
  

  // 4) PUT /:id          → 기존 기록 수정
  fastify.put<{ Params: { id: string }; Body: SleepBody }>(
    "/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      const { date, sleepStart, sleepEnd, note } = request.body;
      if (!date || !sleepStart || !sleepEnd) {
        reply.status(400).send({ message: "Required: date, sleepStart, sleepEnd" });
        return;
      }

      try {
        const updated = await sleepService.update(id, {
          date,
          sleepStart,
          sleepEnd,
          note: note || "",
        });
        return updated;
      } catch (err: any) {
        if (err.message === "Record not found") {
          reply.status(404).send({ message: "Record not found" });
        } else {
          request.log.error(err);
          reply.status(500).send({ message: "Server Error" });
        }
      }
    }
  );

  // 5) DELETE /:id       → 기록 삭제
  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    try {
      await sleepService.delete(id);
      reply.status(204).send();
    } catch (err: any) {
      if (err.message === "Record not found") {
        reply.status(404).send({ message: "Record not found" });
      } else {
        request.log.error(err);
        reply.status(500).send({ message: "Server Error" });
      }
    }
  });
};
