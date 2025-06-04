import { FastifyPluginAsync } from "fastify";
import { AppContext } from "../types/context";
import { execFile } from "child_process";
import path from "path";

interface SleepBody {
  date: string;
  sleep_start: string;
  sleep_end: string;
  note?: string;
}

export const sleepRoutes: FastifyPluginAsync<{
  context: AppContext;
}> = async (fastify, opts) => {
  const { sleepService } = opts.context;

  // 1) GET / → 전체 수면 기록 조회
  fastify.get("/", async (request, reply) => {
    try {
      const data = await sleepService.getAll();
      return data;
    } catch (err) {
      request.log.error(err);
      reply.status(500).send({ message: "Server Error" });
    }
  });

  // 2) GET /:id → 특정 ID의 기록 조회
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

  // 3) POST / → 새로운 기록 생성
  fastify.post<{ Body: SleepBody }>("/", async (request, reply) => {
    const { date, sleep_start, sleep_end, note } = request.body;

    if (!date || !sleep_start || !sleep_end) {
      reply.status(400).send({ message: "Required: date, sleep_start, sleep_end" });
      return;
    }

    try {
      const newRecord = await sleepService.create({
        date,
        sleep_start,
        sleep_end,
        note: note || "",
      });
      reply.status(201).send(newRecord);
    } catch (err) {
      request.log.error(err);
      reply.status(500).send({ message: "Server Error" });
    }
  });

  // 4) PUT /:id → 기존 기록 수정
  fastify.put<{ Params: { id: string }; Body: SleepBody }>(
    "/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      const { date, sleep_start, sleep_end, note } = request.body;

      if (!date || !sleep_start || !sleep_end) {
        reply.status(400).send({ message: "Required: date, sleep_start, sleep_end" });
        return;
      }

      try {
        const updated = await sleepService.update(id, {
          date,
          sleep_start,
          sleep_end,
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

  // 5) DELETE /:id → 기록 삭제
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

  // 6) POST /advice → 최근 수면 기록 기반 AI 조언 생성
  fastify.post<{ Body: { days?: number } }>("/advice", async (request, reply) => {
    const days = request.body.days ?? 7;

    try {
      const allRecords = await sleepService.getAll();
      const recentRecords = allRecords
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, days);

      const sleepSummary = recentRecords
        .map(
          (r) =>
            `• ${r.date}: ${r.sleep_start} → ${r.sleep_end} (${r.note || "특이사항 없음"})`
        )
        .join("\n");

      const scriptPath = path.join(__dirname, "../../llm/generate_advice.py");

      return new Promise((resolve, reject) => {
        const pythonProcess = execFile(
          "python3",
          [scriptPath, "--days", String(days)],
          { env: process.env },
          (error, stdout, stderr) => {
            if (error) {
              request.log.error("Python 스크립트 실행 오류:", stderr || error);
              reply.status(500).send({ message: "AI 조언 생성 중 오류" });
              return reject(error);
            }
            reply.send({ advice: stdout.trim() });
            resolve(null);
          }
        );

        pythonProcess.stdin?.write(sleepSummary);
        pythonProcess.stdin?.end();
      });
    } catch (err) {
      request.log.error(err);
      reply.status(500).send({ message: "AI 조언 생성 실패" });
    }
  });
};
