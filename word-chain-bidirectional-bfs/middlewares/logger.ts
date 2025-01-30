import { Middleware, RouterContext } from "oak/mod.ts";
import { wordChainRepository } from "../repositories/word-chain.repository.ts";

/**
 * Logger Middleware
 * Logs each incoming request with its method,  URL, and response time and inserts the outcome to the db.
 */
export const logger: Middleware = async (
  ctx: RouterContext,
  next: () => Promise<unknown>,
) => {
  const start = Date.now();
  await next();

  console.log(ctx.response);

  wordChainRepository.insertLog(
    {
      startWord: ctx.response.body.start,
      endWord: ctx.response.body.end,
      solution: ctx.response.body.solution,
      elapsedTimeMs: ctx.response.body.elapsed_time_ms,
      status: ctx.response.body.solution ? "success" : "failure",
      error: ctx.response.body.error || undefined,
    },
  );

  const ms = Date.now() - start;
  const responseTime = `${ms}ms`;
  ctx.response.headers.set("X-Response-Time", responseTime);
  console.log(`${ctx.request.method} ${ctx.request.url} - ${responseTime}`);
};
