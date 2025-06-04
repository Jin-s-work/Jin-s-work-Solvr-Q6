import { FastifyPluginAsync } from "fastify";
import { AppContext } from "../types/context";
import { userRoutes } from "./userRoutes";
import { sleepRoutes } from "./sleepRoutes";

// FastifyPluginAsync<...> 를 바로 변수에 타입으로 지정하면 Fastify가 인식하지 못할 수 있음
// 따라서 createRoutes를 함수로 먼저 선언한 뒤 타입을 할당하고 export하세요.

const createRoutesFn: FastifyPluginAsync<{ context: AppContext }> = async (fastify, opts) => {
  const { context } = opts;

  await fastify.register(userRoutes, {
    prefix: "/api/users",
    context,
  });

  await fastify.register(sleepRoutes, {
    prefix: "/api/sleeps",
    context,
  });
};

export const createRoutes = createRoutesFn;
