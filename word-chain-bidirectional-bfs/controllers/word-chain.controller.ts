import { RouterContext } from "oak/mod.ts";
import { solveWordChain } from "../algorithm/word-chain-bfs-bidirectional.ts";

export interface WordChainRequestBody {
  start: string;
  end: string;
}
interface WordChainResponse {
  start: string;
  end: string;
  solution: string[];
  elapsed_time_ms: number;
}

export const wordChainController = {
  getWordChainSolution: async (
    ctx: RouterContext<
      "/word-chain",
      Record<string, never>,
      Record<string, any>
    >,
  ) => {
    const startTime = Date.now();

    const body = ctx.request.body({ type: "json" });

    const { start, end } = await body.value;

    // Solve the word chain problem
    const solution = solveWordChain(start.toLowerCase(), end.toLowerCase());

    if (solution.length === 0) {
      ctx.throw(400, "No solution found for the given words.");
    }

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    const response: WordChainResponse = {
      start,
      end,
      solution,
      elapsed_time_ms: elapsedTime,
    };

    ctx.response.status = 200;
    ctx.response.body = response;
  },
};
