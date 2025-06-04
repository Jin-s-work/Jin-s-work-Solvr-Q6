import { ReturnType } from "react";
import { UserService } from "../services/userService";
import { SleepService } from "../services/sleepService";

/**
 * AppContext: 서비스 레이어(비즈니스 로직)를 Fastify 라우트 핸들러에 주입하기 위한 컨텍스트 타입.
 */
export interface AppContext {
  userService: UserService;
  sleepService: SleepService;
}
