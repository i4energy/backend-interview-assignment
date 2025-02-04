import { Router } from "oak/mod.ts";
import { wordChainController } from "../controllers/word-chain.controller.ts";
import { validateInput } from "../middlewares/validate-word-chain.ts";

const wordChainRouter = new Router();

wordChainRouter.post(
  "/word-chain",
  validateInput,
  wordChainController.getWordChainSolution,
);

export default wordChainRouter;
